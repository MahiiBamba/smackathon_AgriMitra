import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Function to create an SVG marker with custom color
const getColoredMarker = (color) => {
  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35],
  });
};

// Disease → Color mapping
const diseaseColors = {
  "Leaf Blight": "#e63946",     // Red
  "Powdery Mildew": "#2a9d8f",  // Teal
  "Root Rot": "#457b9d",        // Blue
  "Rust Fungus": "#f4a261",     // Orange
  "Bacterial Wilt": "#8d5fd3",  // Purple
};

const Heatmap = () => {
  const dummyHistory = [
    {
      disease: "Leaf Blight",
      location: { lat: 28.7041, lng: 77.1025 }, // Delhi
      date: "2025-08-20T14:30:00Z",
    },
    {
      disease: "Powdery Mildew",
      location: { lat: 19.076, lng: 72.8777 }, // Mumbai
      date: "2025-08-19T09:45:00Z",
    },
    {
      disease: "Root Rot",
      location: { lat: 13.0827, lng: 80.2707 }, // Chennai
      date: "2025-08-18T18:15:00Z",
    },
    {
      disease: "Rust Fungus",
      location: { lat: 22.5726, lng: 88.3639 }, // Kolkata
      date: "2025-08-15T11:20:00Z",
    },
    {
      disease: "Bacterial Wilt",
      location: { lat: 12.9716, lng: 77.5946 }, // Bangalore
      date: "2025-08-10T16:50:00Z",
    },
  ];

  const calculateCenter = () => {
    let totalLat = 0,
      totalLng = 0;
    dummyHistory.forEach((item) => {
      totalLat += item.location.lat;
      totalLng += item.location.lng;
    });
    return [totalLat / dummyHistory.length, totalLng / dummyHistory.length];
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-100 p-8 rounded-xl shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Crop Disease Locations</h1>

      <div className="w-full max-w-4xl h-[500px] rounded-lg overflow-hidden shadow-2xl">
        <MapContainer
          center={calculateCenter()}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {dummyHistory.map((item, index) => (
            <Marker
              key={index}
              position={[item.location.lat, item.location.lng]}
              icon={getColoredMarker(diseaseColors[item.disease] || "#000000")}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold">{item.disease}</h3>
                  <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                  <p>Lat: {item.location.lat.toFixed(4)}</p>
                  <p>Lng: {item.location.lng.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Heatmap;
