import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Heatmap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [diseaseColors, setDiseaseColors] = useState(new Map());
  const colorPalette = ["#ef4444", "#f97316", "#16a34a", "#9333ea", "#0ea5e9", "#eab308"];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://192.168.137.250:5000/heatmap");
      const text = await response.text();

      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (err) {
        console.error("Response was not JSON, got HTML instead:", text);
        setError("Failed to parse data from server. Check the backend response.");
        return;
      }

      const validData = jsonData
        .filter(
          (item) =>
            item.latitude &&
            item.longitude &&
            !isNaN(item.latitude) &&
            !isNaN(item.longitude)
        )
        .map((item) => ({
          id: item.id,
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          disease: item.predicted_class,
          severity: item.severity,
          confidence: item.confidence,
          timestamp: item.timestamp,
        }));

      setData(validData);

      if (validData.length === 0) {
        setError("No valid data points found to display.");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Error fetching data. Please check your network and backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newDiseaseColors = new Map(diseaseColors);
    let colorIndex = newDiseaseColors.size;

    data.forEach((item) => {
      if (!newDiseaseColors.has(item.disease)) {
        newDiseaseColors.set(
          item.disease,
          colorPalette[colorIndex % colorPalette.length]
        );
        colorIndex++;
      }
    });

    setDiseaseColors(newDiseaseColors);
  }, [data]);

  const calculateCenter = () => {
    if (data.length === 0) {
      return [20, 78]; // Default center if no data
    }
    const totalLat = data.reduce((sum, item) => sum + item.lat, 0);
    const totalLng = data.reduce((sum, item) => sum + item.lng, 0);
    return [totalLat / data.length, totalLng / data.length];
  };

  const mapCenter = calculateCenter();

  const createColoredIcon = (color) => {
    return new L.Icon({
      iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(
        color
      )}' d='M16 0C7.163 0 0 7.163 0 16s16 16 16 16 16-7.163 16-16S24.837 0 16 0z'/%3E%3Cpath fill='%23fff' d='M16 4a12 12 0 1 0 0 24A12 12 0 0 0 16 4z'/%3E%3C/svg%3E`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className="flex flex-col items-center p-4 bg-green-50 min-h-screen rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 my-4">Disease Heatmap</h1>

      <button
        onClick={fetchData}
        className="m-2 p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-colors duration-200"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Map Data"}
      </button>

      {error && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg my-4 w-full max-w-4xl text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Map */}
      <div className="w-full max-w-4xl h-[500px] rounded-lg overflow-hidden shadow-2xl">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          key={JSON.stringify(mapCenter)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {data.map((item) => {
            const color = diseaseColors.get(item.disease) || "#888888";
            const customIcon = createColoredIcon(color);

            return (
              <Marker
                key={item.id}
                position={[
                  item.lat + Math.floor(Math.random() * 4) + 1.3,
                  item.lng + Math.floor(Math.random() * 4) + 1.7,
                ]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold" style={{ color }}>
                      {item.disease}
                    </h3>
                    <p>Severity: {item.severity || "N/A"}</p>
                    <p>Lat: {item.lat.toFixed(4)}</p>
                    <p>Lng: {item.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

{/* History Section */}
<div className="w-full max-w-4xl mt-10">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Disease Name</h2>
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data.length > 0 ? (
      data.map((item) => {
        const color = diseaseColors.get(item.disease) || "#555";
        return (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 break-words"
          >
            <h3
              className="font-bold text-lg text-gray-800 break-words"
              style={{ color }}
            >
              {item.disease}
            </h3>
            
          </li>
        );
      })
    ) : (
      <p className="text-gray-500 text-center col-span-2">
        No data to display. Try fetching data or check your backend server.
      </p>
    )}
  </ul>
</div>


    </div>
  );
};

export default Heatmap;
