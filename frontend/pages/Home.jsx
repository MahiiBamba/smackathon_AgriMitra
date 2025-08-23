import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Heatmap = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [fullExplanation, setFullExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const navigate = useNavigate();

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
        }));
      }
    );
  }, []);

  // Poll backend for full explanation after getting prediction
  useEffect(() => {
    if (prediction && !prediction.error && prediction.id) {
      setLoadingExplanation(true);

      const fetchExplanation = async () => {
        try {
          const res = await fetch(
            `http://192.168.137.250:5000/predict?id=${prediction.id}`
          );
          const data = await res.json();
          if (data.explanation && data.explanation !== "Generating explanation...") {
            setFullExplanation(data.explanation);
            setLoadingExplanation(false);
            return true; // stop polling
          }
          return false; // continue polling
        } catch (err) {
          console.error(err);
          setFullExplanation("Failed to fetch explanation");
          setLoadingExplanation(false);
          return true; // stop polling on error
        }
      };

      const interval = setInterval(async () => {
        const done = await fetchExplanation();
        if (done) clearInterval(interval);
      }, 2000);

      return () => clearInterval(interval); // cleanup
    }
  }, [prediction]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setFullExplanation(null);
    }
  };

  // Predict function -> send image + location
  const handlePredict = async () => {
    if (!image) {
      setPrediction({ error: "Please upload an image first." });
      return;
    }

    setLoading(true);
    setPrediction(null);
    setFullExplanation(null);

    try {
      const formData = new FormData();
      formData.append("file", image);
      if (location.latitude && location.longitude) {
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);
      }





      const response = await fetch("http://192.168.137.250:5000/predict", {
        method: "POST",
        body: formData,
      });





      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch prediction");

      setPrediction(data);
    } catch (error) {
      console.error(error);
      setPrediction({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-12">
        Crop Disease Prediction
      </h1>

      {/* Upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 rounded bg-gray-200 shadow-sm"
      />

      {/* Preview + Predict Button */}
      {preview ? (
        <div className="flex flex-col items-center space-y-3">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 max-w-64 rounded-lg shadow-md"
          />
          <button
            onClick={handlePredict}
            disabled={loading || !location.latitude || location.error}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow ${
              loading || !location.latitude || location.error
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      ) : (
        <div className="w-64 h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
          <span className="text-gray-500">No Preview</span>
        </div>
      )}

      {/* Prediction result */}
      <div className="mt-6 p-4 border rounded-lg w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Prediction Result:
        </h2>

        {!prediction && <p className="mt-2 text-gray-500">No prediction yet</p>}

        {prediction?.error && (
          <p className="mt-2 text-red-600 font-bold">{prediction.error}</p>
        )}

        {prediction && !prediction.error && (
          <div className="mt-3 space-y-2">
            <p className="text-gray-900">
              <span className="font-bold">Class:</span>{" "}
              {prediction.predicted_class}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Confidence:</span>{" "}
              {(prediction.confidence * 100).toFixed(2)}%
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Severity:</span>{" "}
              {prediction.severity}
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Heatmap;
