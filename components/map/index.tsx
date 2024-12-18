"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState, useRef, useEffect } from "react";
import { Location } from "@/app/definitions/types";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    markerList: (LatLngExpression | LatLngTuple)[],
    zoom?: number,
    locations?: Location[],
}

const defaults = {
    zoom: 11,
}

const Map = ({ zoom = defaults.zoom, posix, markerList, locations }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(posix, zoom);
        }
    }, [posix]);

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {markerList.map((marker, index) => (
                <Marker position={marker} key={index}>
                    <Popup>
                        {locations && locations[index].venueName}
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )
}

export default Map