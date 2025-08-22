// import React, { useState, useEffect } from "react";

// const Heatmap = () => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [disease, setDisease] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState({
//     latitude: null,
//     longitude: null,
//     error: null,
//   });

//   // Effect hook to get user's location on component mount
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocation(prev => ({
//         ...prev,
//         error: "Geolocation is not supported by your browser.",
//       }));
//       return;
//     }

//     const success = (position) => {
//       setLocation({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//         error: null,
//       });
//     };

//     const error = (err) => {
//       setLocation(prev => ({
//         ...prev,
//         error: err.message,
//       }));
//     };

//     navigator.geolocation.getCurrentPosition(success, error);
//   }, []);

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//       setDisease(""); // reset previous prediction
//     }
//   };

//   // Predict function -> send image and location to backend
//   const handlePredict = async () => {
//     if (!image) return;

//     setLoading(true);
//     setDisease("");

//     try {
//       const formData = new FormData();
//       formData.append("file", image);
      
//       // Append latitude and longitude to the formData
//       if (location.latitude && location.longitude) {
//         formData.append("latitude", location.latitude);
//         formData.append("longitude", location.longitude);
//       }

//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch prediction");
//       }

//       const data = await response.json();
//       setDisease(data.disease);
//     } catch (error) {
//       console.error(error);
//       setDisease("Error predicting disease.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-6 ">
//       <h1 className="text-3xl font-bold text-gray-800 mb-12">Crop Disease Prediction</h1>
      
      
      

//       {/* Upload input */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="border-b p-2 rounded bg-gray-200 shadow-sm"
//       />

//       {/* Preview and Predict Button */}
//       {preview ? (
//         <div className="flex flex-col items-center space-y-2">
//           <img
//             src={preview}
//             alt="Preview"
//             className="max-h-64 max-w-64 rounded-lg shadow-md "
//           />
//           <button
//             onClick={handlePredict}
//             disabled={loading || location.error || !location.latitude} // Disable if no location or loading
//             className={`px-4 py-2 text-white font-semibold rounded-lg shadow ${
//               loading || location.error || !location.latitude
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Predicting..." : "Predict"}
//           </button>
//         </div>
//       ) : (
//         <div className="w-64 h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
//           <span className="text-gray-500">No Preview</span>
//         </div>
//       )}

//       {/* Disease result */}
//       <div className="mt-6 p-4 border rounded-lg w-full max-w-md text-center">
//         <h2 className="text-xl font-semibold text-gray-700">Disease:</h2>
//         <p className="mt-2 text-gray-900 font-bold">
//           {disease ? disease : "No prediction yet"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Heatmap;








// import React, { useState, useEffect } from "react";

// const Heatmap = () => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [disease, setDisease] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState({
//     latitude: null,
//     longitude: null,
//     error: null,
//   });

//   // Get user's location
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocation(prev => ({
//         ...prev,
//         error: "Geolocation is not supported by your browser.",
//       }));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           error: null,
//         });
//       },
//       (err) => {
//         setLocation(prev => ({
//           ...prev,
//           error: err.message,
//         }));
//       }
//     );
//   }, []);

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//       setDisease(""); // reset previous prediction
//     }
//   };

//   // Predict function -> send image + location
//   const handlePredict = async () => {
//     if (!image) {
//       setDisease("Please upload an image first.");
//       return;
//     }

//     setLoading(true);
//     setDisease("");

//     try {
//       const formData = new FormData();
//       formData.append("file", image);

//       if (location.latitude && location.longitude) {
//         formData.append("latitude", location.latitude);
//         formData.append("longitude", location.longitude);
//       }

//       const response = await fetch("http://192.168.137.250:5000/predict", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch prediction");
//       }

//       setDisease(data.disease || "No disease detected.");
//     } catch (error) {
//       console.error(error);
//       setDisease(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-12">
//         Crop Disease Prediction
//       </h1>

//       {/* Upload input */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="border p-2 rounded bg-gray-200 shadow-sm"
//       />

//       {/* Preview + Predict Button */}
//       {preview ? (
//         <div className="flex flex-col items-center space-y-3">
//           <img
//             src={preview}
//             alt="Preview"
//             className="max-h-64 max-w-64 rounded-lg shadow-md"
//           />
//           <button
//             onClick={handlePredict}
//             disabled={loading || !location.latitude || location.error}
//             className={`px-4 py-2 text-white font-semibold rounded-lg shadow ${
//               loading || !location.latitude || location.error
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Predicting..." : "Predict"}
//           </button>
//         </div>
//       ) : (
//         <div className="w-64 h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
//           <span className="text-gray-500">No Preview</span>
//         </div>
//       )}

//       {/* Prediction result */}
//       <div className="mt-6 p-4 border rounded-lg w-full max-w-md text-center">
//         <h2 className="text-xl font-semibold text-gray-700">Disease:</h2>
//         <p className="mt-2 text-gray-900 font-bold">
//           {disease ? disease : "No prediction yet"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Heatmap;


import React, { useState, useEffect } from "react";

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

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
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
        setLocation(prev => ({
          ...prev,
          error: err.message,
        }));
      }
    );
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null); // reset previous prediction
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch prediction");
      }

      // store full prediction
      setPrediction(data);
    } catch (error) {
      console.error(error);
      setPrediction({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
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
        <h2 className="text-xl font-semibold text-gray-700">Prediction Result:</h2>

        {!prediction && <p className="mt-2 text-gray-500">No prediction yet</p>}

        {prediction?.error && (
          <p className="mt-2 text-red-600 font-bold">{prediction.error}</p>
        )}

        {prediction && !prediction.error && (
          <div className="mt-3 space-y-2">
            <p className="text-gray-900">
              <span className="font-bold">Class:</span> {prediction.predicted_class}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Confidence:</span>{" "}
              {(prediction.confidence * 100).toFixed(2)}%
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Severity:</span> {prediction.severity}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heatmap;
