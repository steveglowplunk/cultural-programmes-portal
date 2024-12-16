"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import axios from "axios";
import { Location } from "@/app/definitions/types";
import LocationItem from "@/components/event/LocationItem";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { set } from "mongoose";

const EventInfo = () => {
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [marker, setMarker] = useState<LatLngExpression | LatLngTuple>([22.285056, 114.222075]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/locations").then((res) => {
          const locationsWithSelection = res.data.map((location: Location) => ({
            ...location,
            isSelected: false
          }));
          setLocations(locationsWithSelection);
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    if (location && location.latitude && location.longitude) {
      setMarker([parseFloat(location.latitude), parseFloat(location.longitude)]);
    }
    setLocations(locations.map((loc) => ({
      ...loc,
      isSelected: loc._id === location._id
    })));
  }
  return (
    <>
      <div className="flex">
        <div className="w-96 h-[600px] overflow-y-auto">
          <ListBox filter value={selectedLocation} onChange={(e: ListBoxChangeEvent) => handleSelectLocation(e.value)}
            options={locations} optionLabel="venueName" itemTemplate={LocationItem} />
        </div>
        <div className="relative w-full">
          <Map posix={marker} />
        </div>
      </div>
    </>
  )
}

export default EventInfo