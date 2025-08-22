import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import HomeIcon from '@/assets/icons/home.svg'; // App logo

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // Capture image from camera
  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      
      {/* Header: Logo + App Name */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>AgriMitra</Text>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={[styles.imagePlaceholder, { borderColor: isDark ? '#fff' : '#000' }]}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>No image selected</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Predict Button */}
      <TouchableOpacity
        style={[styles.predictButton, { opacity: imageUri ? 1 : 0.5 }]}
        disabled={!imageUri}
        onPress={() => console.log('Predict button pressed')}
      >
        <Text style={styles.predictButtonText}>Predict</Text>
      </TouchableOpacity>

      {/* Prediction Result Placeholder */}
      <View style={styles.resultSection}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          Prediction Result Will Appear Here
        </Text>
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

  resultSection: { marginTop: 24, alignItems: 'center' },
});
