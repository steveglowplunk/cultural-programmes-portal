"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ListBox, ListBoxChangeEvent } from "primereact/listbox";
import axios from "axios";
import { Location } from "@/app/definitions/types";
import LocationItem from "@/components/event/LocationItem";
import { LatLngExpression, LatLngTuple } from "leaflet";
import LocationDetailsPanel from "@/components/event/LocationDetailsPanel";
import withAuth from "@/app/withAuth";
import CommentForm from "@/components/comment/CommentForm";
import CommentList from "@/components/comment/CommentList";

const EventInfo = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  enum SortBy {
    Alphabet = "alphabet",
    EventsCount = "eventsCount",
  }

  enum SideBarPage {
    VenueList = "venueList",
    VenueInfo = "venueInfo",
  }

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [marker, setMarker] = useState<LatLngExpression | LatLngTuple>([
    22.285056, 114.222075,
  ]);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Alphabet);
  const [page, setPage] = useState<SideBarPage>(SideBarPage.VenueList);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        await axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_URL +
              "/api/locations/more-than-3-events"
          )
          .then((res) => {
            const locationsWithSelection = res.data.map(
              (location: Location) => ({
                ...location,
                isSelected: false,
                onShowDetails: handleShowDetails,
              })
            );
            setLocations(locationsWithSelection);
          });
      } catch (err) {
        console.log(err);
      }
    };

    fetchVenues();
  }, []);

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      if (sortBy === SortBy.Alphabet) {
        return a.venueName.localeCompare(b.venueName);
      } else if (sortBy === SortBy.EventsCount) {
        return b.eventsCount - a.eventsCount;
      }
      return 0;
    });
  }, [sortBy, locations]);

  const handleSelectLocation = (e: ListBoxChangeEvent) => {
    const location = e.value as Location;
    if (location && location.latitude && location.longitude) {
      setSelectedLocation(location);
      setMarker([
        parseFloat(location.latitude),
        parseFloat(location.longitude),
      ]);
      setLocations(
        locations.map((loc) => ({
          ...loc,
          isSelected: loc._id === location._id,
        }))
      );
    }
  };

  const handleShowDetails = (location: Location) => {
    console.log("Show details for:", location);
    setPage(SideBarPage.VenueInfo);
  };

  const handleOnBack = () => {
    setPage(SideBarPage.VenueList);
  };

  return (
    <>
      <div className="flex mx-4">
        {page === SideBarPage.VenueList ? (
          <div>
            <div className="flex [&>*]:text-lg my-2">
              <span className="mr-4">Sort by: </span>
              <div className="space-x-2">
                <button
                  className={`hover:underline ${
                    sortBy === SortBy.Alphabet ? "font-bold text-cyan-700" : ""
                  }`}
                  onClick={() => setSortBy(SortBy.Alphabet)}
                >
                  Alphabet
                </button>
                <button
                  className={`hover:underline ${
                    sortBy === SortBy.EventsCount
                      ? "font-bold text-cyan-700"
                      : ""
                  }`}
                  onClick={() => setSortBy(SortBy.EventsCount)}
                >
                  Event count
                </button>
              </div>
            </div>
            <div className="w-96 h-[600px] overflow-y-auto">
              <ListBox
                filter
                value={selectedLocation}
                onChange={(e: ListBoxChangeEvent) => handleSelectLocation(e)}
                options={sortedLocations}
                itemTemplate={LocationItem}
                optionLabel="venueName"
              />
            </div>
          </div>
        ) : (
          <LocationDetailsPanel
            onBack={handleOnBack}
            location={selectedLocation}
          />
        )}
        <div className="relative w-full">
          <Map posix={marker} />
          <div>
            <CommentForm locationId={selectedLocation?._id || ""} />
            <CommentList locationId={selectedLocation?._id || ""} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(EventInfo, ["normal"]);
