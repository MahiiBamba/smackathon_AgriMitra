import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function App() {
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      // Wait for TF.js to be ready
      await tf.ready();

      // Load model from local assets (you should put model.json and .bin files in 'assets/model/')
      const modelJson = require('./assets/model/model.json');
      const modelWeights = [
        require('./assets/model/group1-shard1of8.bin'),
        require('./assets/model/group1-shard2of8.bin'),
        require('./assets/model/group1-shard3of8.bin'),
        require('./assets/model/group1-shard4of8.bin'),
        require('./assets/model/group1-shard5of8.bin'),
        require('./assets/model/group1-shard6of8.bin'),
        require('./assets/model/group1-shard7of8.bin'),
        require('./assets/model/group1-shard8of8.bin'),
        // ...add all 8 .bin files here
      ];

      const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
      console.log('Model loaded successfully!');
    }

    loadModel();
  }, []);

  return (
    <View>
      {model ? <Text>Model Loaded!</Text> : <Text>Loading Model...</Text>}
    </View>
  );
}
