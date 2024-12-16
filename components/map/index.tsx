"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    posix2: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 19,
}

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix, posix2 } = Map

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={posix} draggable={false}>
                <Popup>Hey ! I study here</Popup>
            </Marker>
            <Marker position={posix2} draggable={false}>
                <Popup>2nd loc here</Popup>
            </Marker>

        </MapContainer>
    )
}

export default Map