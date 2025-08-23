import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));;


      console.log(validData);
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

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-white/20 min-h-screen shadow-xl rounded-lg backdrop-blur-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">History </h1>

      {loading && <p className="text-gray-600">Loading data...</p>}
      {error && (
        <p className="text-red-600 font-semibold mb-4">{error}</p>
      )}

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Data Points</h2>
        <ul className="flex flex-col gap-4">
          {data.length > 0 ? (
            data.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h3 className="font-bold text-lg text-blue-600">
                  {item.disease}
                </h3>
                <p className="text-gray-600 flex">
                  <span className="font-bold">Location:&nbsp; </span> {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Severity:</span>{" "}
                  {item.severity || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No data to display. Try fetching data or check your backend server.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default History;
