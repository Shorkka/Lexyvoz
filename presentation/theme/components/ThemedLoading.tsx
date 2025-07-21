import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * Componente de loading reutilizable con fondo semitransparente y spinner centrado.
 * Puedes usarlo como overlay o como loader de página.
 */
type ThemedLoadingProps = {
  size?: 'small' | 'large' | number;
  color?: string;
  overlay?: boolean;
};

const ThemedLoading = ({ size = 'large', color = '#4F6DF5', overlay = false }: ThemedLoadingProps) => {
  if (overlay) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return (
    <View style={styles.centered}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemedLoading;
