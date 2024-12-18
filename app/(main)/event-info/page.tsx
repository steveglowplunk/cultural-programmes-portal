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

  enum FilterBy {
    All = "all",
    Favourite = "favourite",
  }

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [marker, setMarker] = useState<LatLngExpression | LatLngTuple>([22.285056, 114.222075]);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Alphabet);
  const [page, setPage] = useState<SideBarPage>(SideBarPage.VenueList);
  const [userData, setUserData] = useState<{ role: string; username: string } | null>(null);
  const [favList, setFavList] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  // Load user data once on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Combined fetch function for venues and favorites
  const fetchData = async (username?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [venuesResponse, favoritesResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations/more-than-3-events`),
        username ?
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${username}/favourite-venues`) :
          Promise.resolve({ data: [] })
      ]);

      const favorites = favoritesResponse.data;
      setFavList(favorites);

      const locationsWithSelection = venuesResponse.data.map((location: Location) => ({
        ...location,
        isSelected: false,
        onShowDetails: handleShowDetails,
        onFavClick: handleFavClick,
        userName: username || "",
        isFavourite: favorites.includes(location.venueId),
      }));

      setLocations(locationsWithSelection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Single useEffect to trigger data fetching
  useEffect(() => {
    if (userData?.username) {
      fetchData(userData.username);
    }
  }, [userData?.username]); // Only re-fetch when username changes

  const handleFavClick = async (location: Location) => {
    if (!location.userName) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${location.userName}/favourite-venues`,
        { venueId: location.venueId }
      );
      // Refresh data after successful favorite update
      fetchData(location.userName);
    } catch (err) {
      console.error(err);
      setError('Failed to update favorites');
    }
  };

  const sortedLocations = useMemo(() => {
    let filteredLocations = locations;

    if (filterBy === FilterBy.Favourite) {
      filteredLocations = locations.filter((loc) => favList.includes(loc.venueId));
    }

    return [...filteredLocations].sort((a, b) => {
      if (sortBy === SortBy.Alphabet) {
        return a.venueName.localeCompare(b.venueName);
      }
      return b.eventsCount - a.eventsCount;
    });
  }, [locations, filterBy, favList, sortBy]);

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
            <div className="flex [&>*]:text-xl my-2 space-x-4">
              <button
                className={`${filterBy === FilterBy.All ? "border-b-2 border-cyan-700" : ""}`}
                onClick={() => setFilterBy(FilterBy.All)}
              >
                All Venues
              </button>
              <button
                className={`${filterBy === FilterBy.Favourite ? "border-b-2 border-cyan-700" : ""}`}
                onClick={() => setFilterBy(FilterBy.Favourite)}
              >
                Favourite Venues
              </button>
            </div>
            <div className="flex [&>*]:text-lg my-2">
              <span className="mr-4">Sort by: </span>
              <div className="space-x-2">
                <button
                  className={`hover:underline ${sortBy === SortBy.Alphabet ? "font-bold text-cyan-700" : ""
                    }`}
                  onClick={() => setSortBy(SortBy.Alphabet)}
                >
                  Alphabet
                </button>
                <button
                  className={`hover:underline ${sortBy === SortBy.EventsCount
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
            {/* <CommentForm locationId={selectedLocation?._id || ""} />
            <CommentList locationId={selectedLocation?._id || ""} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(EventInfo, ["normal"]);
