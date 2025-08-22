import React, { useEffect, useState } from "react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


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


  useEffect(() => {
    // Fetch data from backend
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/history"); // your API endpoint
        const data = await res.json();

        // Sort by date (newest first)
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setHistory(sortedData);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

/*
useEffect(() => {
  // Simulate backend fetch
  const sortedData = dummyHistory.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  setHistory(sortedData);
  setLoading(false);
}, []);

*/

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Prediction History</h1>

      {loading ? (
        <p className="text-gray-600">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">No history available.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-lg border"
            >
              <h2 className="text-lg font-semibold text-blue-700">
                {entry.disease}
              </h2>
              <p className="text-gray-700">
                📍 Location: {entry.location.lat}, {entry.location.lng}
              </p>
              <p className="text-gray-500 text-sm">
                📅 {new Date(entry.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
