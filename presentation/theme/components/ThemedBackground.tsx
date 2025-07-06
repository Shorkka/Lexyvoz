import { View, StyleSheet, Platform } from 'react-native';
import React from 'react';

const ThemedBackground = () => {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      top: -50, // Valor fijo
      padding: 20, 
      position: 'absolute',
      minWidth: 300,
      maxWidth: 400,
      backgroundColor: 'white',
      paddingVertical: 100,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 11 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card} />
    </View>
  );
};

export default ThemedBackground;
