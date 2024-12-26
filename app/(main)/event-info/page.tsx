"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ListBox, ListBoxChangeEvent } from "primereact/listbox";
import axios from "axios";
import { Location } from "@/app/definitions/types";
import LocationItem from "@/components/event/LocationItem";
import { LatLngExpression, LatLngTuple, CRS, latLng } from "leaflet";
import LocationDetailsPanel from "@/components/event/LocationDetailsPanel";
import withAuth from "@/app/withAuth";
import CommentList from "@/components/comment/CommentList";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { set } from "mongoose";

const EventInfo = () => {
  const op = useRef<OverlayPanel>(null);

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
  const [markerList, setMarkerList] = useState<(LatLngExpression | LatLngTuple)[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Alphabet);
  const [page, setPage] = useState<SideBarPage>(SideBarPage.VenueList);
  const [userData, setUserData] = useState<{ role: string; username: string } | null>(null);
  const [favList, setFavList] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [zoom, setZoom] = useState<number>(11);
  const [isShowComments, setIsShowComments] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [filterDistance, setFilterDistance] = useState<number>(50);
  const [filterDistanceCenter, setFilterDistanceCenter] = useState<Location>();

  const categoryList = [
    { name: "Concert Hall" },
    { name: "Cinema" },
    { name: "Theatre" },
    { name: "Auditorium" },
    { name: "Cultural Activities Hall" }
  ];

  const handleChangeCategory = (e: DropdownChangeEvent) => {
    setSelectedCategory(e.value);
    console.log("selectedCategory", selectedCategory);
  }

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
        onShowComments: handleShowComments,
        onDistanceFilterClicked: handleDistanceFilterClicked
      }));

      setLocations(locationsWithSelection);
      setMarkerList(locationsWithSelection.map((loc: Location) => [parseFloat(loc.latitude), parseFloat(loc.longitude)]));
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

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${location.userName}/favourite-venues`,
        { venueId: location.venueId }
      );

      // Get updated favorites
      const favResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${location.userName}/favourite-venues`
      );

      // Batch update states
      setFavList(favResponse.data);
      setLocations(prev => prev.map(loc => ({
        ...loc,
        isFavourite: favResponse.data.includes(loc.venueId)
      })));

    } catch (err) {
      console.error(err);
      setError('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedLocations = useMemo(() => {
    let filteredLocations = locations;

    // First filter by category if selected
    if (selectedCategory) {
      filteredLocations = filteredLocations.filter((loc) =>
        loc.venueName.includes(selectedCategory.name)
      );
    }
    console.log("filteredLocations", filteredLocations);

    // Then filter by favorites if needed
    if (filterBy === FilterBy.Favourite) {
      filteredLocations = filteredLocations.filter((loc) =>
        favList.includes(loc.venueId)
      );
    }

    // Sort the filtered results
    const sorted = [...filteredLocations].sort((a, b) => {
      if (sortBy === SortBy.Alphabet) {
        return a.venueName.localeCompare(b.venueName);
      }
      return b.eventsCount - a.eventsCount;
    });

    // Update marker list based on filtered and sorted locations
    setMarkerList(sorted.map((loc) => [
      parseFloat(loc.latitude),
      parseFloat(loc.longitude)
    ]));

    return sorted;
  }, [locations, filterBy, favList, sortBy, selectedCategory]);

  const handleSelectLocation = (e: ListBoxChangeEvent) => {
    const location = e.value as Location;
    if (location && location.latitude && location.longitude) {
      setSelectedLocation(location);
      setMarker([
        parseFloat(location.latitude),
        parseFloat(location.longitude),
        parseFloat(location.venueId),
      ]);
      setZoom(17); // Set zoom level to 17 when location selected
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
    setSelectedLocation(null); // 清除選中的位置，隱藏評論區域
  };

  const handleShowComments = (location: Location) => {
    setSelectedLocation(location);
    setIsShowComments(true);
  }

  const handleDistanceFilterClicked = (location: Location, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Distance filter clicked for:", location);
    setFilterDistanceCenter(location);
    setZoom(11);
    if (op.current) {
      op.current.toggle(e);
    }
  }

  const handleOverlayHide = () => {
    setFilterDistance(50);
  }

  const handleSliderChange = (e: SliderChangeEvent) => {
    setFilterDistance(e.value as number);
  }

  // useEffect(() => {
  //   if (filterDistanceCenter && filterDistance) {
  //     const filteredMarkers = locations.filter((loc) => {
  //       const locLatLng: LatLngTuple = [parseFloat(loc.latitude), parseFloat(loc.longitude)];
  //       const centerLatLng: LatLngTuple = [parseFloat(filterDistanceCenter.latitude), parseFloat(filterDistanceCenter.longitude)];
  //       return CRS.Earth.distance(locLatLng, centerLatLng) <= filterDistance * 1000; // Convert km to meters
  //     }).map((loc) => [parseFloat(loc.latitude), parseFloat(loc.longitude)]);

  //     setMarkerList(filteredMarkers);
  //   }
  // }, [filterDistance, filterDistanceCenter, locations]);

  useEffect(() => {
    if (filterDistanceCenter && filterDistance) {
      try {
        const centerPoint = latLng(
          parseFloat(filterDistanceCenter.latitude),
          parseFloat(filterDistanceCenter.longitude)
        );
  
        const filteredMarkers: LatLngTuple[] = locations
          .filter((loc) => {
            if (!loc.latitude || !loc.longitude) {
              console.warn("Invalid location:", loc);
              return false;
            }
  
            const locPoint = latLng(
              parseFloat(loc.latitude),
              parseFloat(loc.longitude)
            );
  
            const distance = centerPoint.distanceTo(locPoint);
            console.log(`Distance for ${loc.venueName}:`, distance / 1000, "km");
  
            return distance <= filterDistance * 1000;
          })
          .map((loc): LatLngTuple => [
            parseFloat(loc.latitude),
            parseFloat(loc.longitude)
          ]);
  
        setMarkerList(filteredMarkers);
        setMarker([centerPoint.lat, centerPoint.lng]);
      } catch (error) {
        console.error("Error in distance filtering:", error);
      }
    }
  }, [filterDistance, filterDistanceCenter, locations]);

  return (
    <>
      <div className="flex mx-4">
        {page === SideBarPage.VenueList ? (
          <div>
            <OverlayPanel ref={op} onHide={handleOverlayHide}>
              <p>Filter by distance</p>
              <InputText
                value={filterDistance.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterDistance(Number(e.target.value))}
                className="w-full"
              />
              <Slider
                value={filterDistance}
                onChange={handleSliderChange}
                className="w-full"
                min={1}
                max={50}
                step={5}
              />
            </OverlayPanel>
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
            <Dropdown value={selectedCategory} onChange={handleChangeCategory} options={categoryList} optionLabel="name"
              showClear placeholder="Select a Category" className="w-full md:w-14rem mb-2" />
            <div className="w-96 h-[500px] overflow-y-auto">
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
        <div className="relative w-full max-h-[600px]">
          <Map posix={marker} markerList={markerList} zoom={zoom} locations={sortedLocations} />
        </div>
        <div>
          {selectedLocation && isShowComments && (
            <div className="ml-4 h-[600px] overflow-y-auto overflow-x-visible">
              <Button
                icon="pi pi-times"
                severity="secondary"
                rounded
                text
                aria-label="Close"
                onClick={() => setIsShowComments(false)}
              />
              <CommentList locationId={selectedLocation.venueId} username={userData?.username as string} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(EventInfo, ["normal"]);
