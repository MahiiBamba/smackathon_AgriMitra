import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function HistoryScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>History</Text>
      <Text style={{ color: isDark ? '#ddd' : '#333' }}>
        Your past activity will appear here 📜
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 }
});
