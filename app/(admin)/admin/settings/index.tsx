import React from 'react';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { View, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedBackground style={styles.bg}>
      <View style={styles.center}>
        <ThemedText type="title" style={{ color: '#000' }}>Ajustes</ThemedText>
        <ThemedText style={{ color: '#000' }}>Preferencias y seguridad…</ThemedText>
      </View>
    </ThemedBackground>
  );
}
const styles = StyleSheet.create({ bg: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }});
