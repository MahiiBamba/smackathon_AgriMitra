const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable SVG transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Tell Metro to allow require.context (needed by expo-router)
config.transformer.unstable_allowRequireContext = true;

// Fix asset/file extensions for SVG
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;
