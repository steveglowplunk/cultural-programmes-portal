"use client";

import { useEffect } from "react";
import maplibregl from 'maplibre-gl';

const EventInfo = () => {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
      center: [0.11, 51.49],
      zoom: 6
    });
    const london = new maplibregl.Marker()
      .setLngLat([0.11, 51.49])
      .addTo(map);
    map.on('error', function(err) {
      throw new Error("To load the map, you must replace YOUR_MAPTILER_API_KEY_HERE first, see README");
    });
  }, []);

  return (
    <>
      <div className="relative w-3/4 h-3/4 mx-auto my-4 border-4 border-gray-300">
        <div id="map" className="absolute top-0 bottom-0 w-full h-full"></div>
      </div>
    </>
  );
};

export default EventInfo;