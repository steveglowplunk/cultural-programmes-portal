"use client";

import { useEffect } from "react";
import maplibregl from 'maplibre-gl';

const EventInfo = () => {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
      center: [114.222075, 22.285056],
      zoom: 6
    });
    const london = new maplibregl.Marker()
      .setLngLat([114.222075, 22.285056])
      .addTo(map);
    map.on('error', function(err) {
      throw new Error("To load the map, you must replace YOUR_MAPTILER_API_KEY_HERE first, see README");
    });
  }, []);

  return (
    <>
        <div id="map" className="absolute top-0 bottom-0 w-full h-full"></div>
    </>
  );
};

export default EventInfo;