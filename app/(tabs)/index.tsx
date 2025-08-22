// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import HomeIcon from '@/assets/icons/home.svg'; // App logo

// export default function HomeScreen() {
//   const scheme = useColorScheme();
//   const isDark = scheme === 'dark';
//   const [imageUri, setImageUri] = useState<string | null>(null);

//   // Pick image from gallery
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!result.canceled) setImageUri(result.assets[0].uri);
//   };

//   // Capture image from camera
//   const captureImage = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!result.canceled) setImageUri(result.assets[0].uri);
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      
//       {/* Header: Logo + App Name */}
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>AgriMitra</Text>
//       </View>

//       {/* Image Section */}
//       <View style={styles.imageSection}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         ) : (
//           <View style={[styles.imagePlaceholder, { borderColor: isDark ? '#fff' : '#000' }]}>
//             <Text style={{ color: isDark ? '#fff' : '#000' }}>No image selected</Text>
//           </View>
//         )}

//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.button} onPress={pickImage}>
//             <Text style={styles.buttonText}>Select Image</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={captureImage}>
//             <Text style={styles.buttonText}>Capture Image</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Predict Button */}
//       <TouchableOpacity
//         style={[styles.predictButton, { opacity: imageUri ? 1 : 0.5 }]}
//         disabled={!imageUri}
//         onPress={() => console.log('Predict button pressed')}
//       >
//         <Text style={styles.predictButtonText}>Predict</Text>
//       </TouchableOpacity>

//       {/* Prediction Result Placeholder */}
//       <View style={styles.resultSection}>
//         <Text style={{ color: isDark ? '#fff' : '#000' }}>
//           Prediction Result Will Appear Here
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
  
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
//   title: { fontSize: 28, fontWeight: '700', paddingTop: 80 },

//   imageSection: { alignItems: 'center', marginBottom: 24 },
//   imagePreview: { width: 250, height: 250, borderRadius: 12, marginBottom: 12 },
//   imagePlaceholder: { width: 250, height: 250, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },

//   buttonRow: { flexDirection: 'row', gap: 12 },
//   button: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#4CAF50', borderRadius: 8 },
//   buttonText: { color: '#fff', fontWeight: '600' },

//   predictButton: { paddingVertical: 14, alignItems: 'center', backgroundColor: '#2196F3', borderRadius: 12 },
//   predictButtonText: { color: '#fff', fontWeight: '700', fontSize: 18 },

//   resultSection: { marginTop: 24, alignItems: 'center' },
// });








import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  useColorScheme, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Tflite, TfliteModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';

// This is the JavaScript version of your Python CLASS_NAMES list
const CLASS_NAMES = [
  'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
  'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
  'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
  'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
  'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
  'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
  'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // State for your UI and the prediction logic
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [model, setModel] = useState<TfliteModel | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load the TFLite model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelPath = require('../assets/model.tflite'); // Make sure path is correct
        Tflite.loadModel({ path: modelPath, numThreads: 1 }, (loadedModel, error) => {
          if (error) {
            console.error('Failed to load model:', error);
            Alert.alert('Error', 'Failed to load the prediction model.');
          } else {
            setModel(loadedModel);
            console.log('Model loaded successfully!');
          }
        });
      } catch (e) {
        console.error('Exception while loading model:', e);
      }
    };
    loadModel();

    return () => { // Cleanup function to close the model
      if (model) {
        model.close();
      }
    };
  }, []);

  // Your existing functions for picking and capturing images
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1,1]
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPredictionResult(null); // Clear previous result
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1,1]
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPredictionResult(null); // Clear previous result
    }
  };
  
  // The prediction logic, now called by the "Predict" button
  const predictDisease = async (uri: string) => {
    if (!model) {
      Alert.alert('Model not loaded', 'The prediction model is still loading.');
      return;
    }
    setIsLoading(true);

    try {
      // Preprocess image to 128x128 as required by the model
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 128, height: 128 } }],
        { base64: true, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Run inference
      model.run({ image: manipResult.base64! }, (output, error) => {
        setIsLoading(false);
        if (error) {
          Alert.alert('Prediction Error', 'Failed to get a prediction.');
          return;
        }

        // Post-process the output
        const prediction = output as number[];
        const resultIndex = prediction.indexOf(Math.max(...prediction));
        const confidence = prediction[resultIndex];
        const predictedClass = CLASS_NAMES[resultIndex];

        if (predictedClass.toLowerCase().includes('healthy')) {
          setPredictionResult(
            `Result: ${predictedClass}\nConfidence: ${(confidence * 100).toFixed(2)}%\n\nThe plant is healthy. ✅`
          );
        } else {
          let severity = 'Low';
          if (confidence >= 0.85) severity = 'Severe';
          else if (confidence >= 0.60) severity = 'Moderate';
          
          setPredictionResult(
            `Result: ${predictedClass}\nConfidence: ${(confidence * 100).toFixed(2)}%\n\nDisease Severity: ${severity}`
          );
        }
      });
    } catch (e) {
      setIsLoading(false);
      Alert.alert('Error', 'An unexpected error occurred during prediction.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>AgriMitra</Text>
      </View>

      <View style={styles.imageSection}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={[styles.imagePlaceholder, { borderColor: isDark ? '#fff' : '#000' }]}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>No image selected</Text>
          </View>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage} disabled={!model}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureImage} disabled={!model}>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Predict Button now calls the prediction function */}
      <TouchableOpacity
        style={[styles.predictButton, { opacity: imageUri && !isLoading ? 1 : 0.5 }]}
        disabled={!imageUri || isLoading}
        onPress={() => predictDisease(imageUri!)}
      >
        <Text style={styles.predictButtonText}>Predict</Text>
      </TouchableOpacity>

      {/* Prediction Result Section is now dynamic */}
      <View style={styles.resultSection}>
        {isLoading ? (
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        ) : predictionResult ? (
          <Text style={[styles.resultText, { color: isDark ? '#fff' : '#000' }]}>
            {predictionResult}
          </Text>
        ) : (
          <Text style={{ color: isDark ? '#fff' : '#000' }}>
            {model ? 'Select an image to begin' : 'Loading prediction model...'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', paddingTop: 80 },
  imageSection: { alignItems: 'center', marginBottom: 24 },
  imagePreview: { width: 250, height: 250, borderRadius: 12, marginBottom: 12 },
  imagePlaceholder: { width: 250, height: 250, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#4CAF50', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  predictButton: { paddingVertical: 14, alignItems: 'center', backgroundColor: '#2196F3', borderRadius: 12 },
  predictButtonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  resultSection: { marginTop: 24, alignItems: 'center', padding: 10, minHeight: 100, justifyContent: 'center' },
  resultText: { fontSize: 16, textAlign: 'center' },
});