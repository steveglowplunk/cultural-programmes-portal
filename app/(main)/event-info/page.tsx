"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import axios from "axios";
import { Location } from "@/app/definitions/types";
import LocationItem from "@/components/event/LocationItem";
import { LatLngExpression, LatLngTuple } from "leaflet";
import LocationDetailsPanel from "@/components/event/LocationDetailsPanel";

const EventInfo = () => {
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  enum SortBy {
    Alphabet = 'alphabet',
    EventCount = 'eventCount'
  }

  enum SideBarPage {
    VenueList = 'venueList',
    VenueInfo = 'venueInfo'
  }

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [marker, setMarker] = useState<LatLngExpression | LatLngTuple>([22.285056, 114.222075]);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Alphabet);
  const [page, setPage] = useState<SideBarPage>(SideBarPage.VenueList);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/locations/top10").then((res) => {
          const locationsWithSelection = res.data.map((location: Location) => ({
            ...location,
            isSelected: false,
            onShowDetails: handleShowDetails
          }));
          setLocations(locationsWithSelection);
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, []);

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      if (sortBy === SortBy.Alphabet) {
        return a.venueName.localeCompare(b.venueName);
      } else if (sortBy === SortBy.EventCount) {
        return b.eventCount - a.eventCount;
      }
      return 0;
    });
  }, [sortBy, locations]);

  const handleSelectLocation = (e: ListBoxChangeEvent) => {
    const location = e.value as Location;
    if (location && location.latitude && location.longitude) {
      setSelectedLocation(location);
      setMarker([parseFloat(location.latitude), parseFloat(location.longitude)]);
      setLocations(locations.map((loc) => ({
        ...loc,
        isSelected: loc._id === location._id
      })));
    }
  }

  const handleShowDetails = (location: Location) => {
    console.log("Show details for:", location);
    setPage(SideBarPage.VenueInfo);
  };

  const handleOnBack = () => {
    setPage(SideBarPage.VenueList);
  }

  return (
    <>
      <div className="flex mx-4">
        {page === SideBarPage.VenueList ? (
          <div>
            <div className="flex [&>*]:text-lg my-2">
              <span className="mr-4">Sort by: </span>
              <div className="space-x-2">
                <button
                  className={`hover:underline ${sortBy === SortBy.Alphabet ? 'font-bold text-cyan-700' : ''}`}
                  onClick={() => setSortBy(SortBy.Alphabet)}
                >
                  Alphabet
                </button>
                <button
                  className={`hover:underline ${sortBy === SortBy.EventCount ? 'font-bold text-cyan-700' : ''}`}
                  onClick={() => setSortBy(SortBy.EventCount)}
                >
                  Event count
                </button>
              </div>
            </div>
            <div className="w-96 h-[600px] overflow-y-auto">
              <ListBox filter value={selectedLocation} onChange={(e: ListBoxChangeEvent) => handleSelectLocation(e)}
                options={sortedLocations} itemTemplate={LocationItem} />
            </div>
          </div>
        ) : (<LocationDetailsPanel onBack={handleOnBack} location={selectedLocation} />)}
        <div className="relative w-full">
          <Map posix={marker} />
        </div>
      </div>
    </>
  )
}

export default EventInfo