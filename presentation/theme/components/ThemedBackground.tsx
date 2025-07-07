import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import React from 'react';

const ThemedBackground = () => {
  const {width} = useWindowDimensions()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      top: -50, 
      padding: 20, 
      position: 'absolute',
      minWidth: Platform.select({
        web: width *0.6,
        default: 420,
       }) ,
      backgroundColor: 'white',
      paddingVertical: 260,
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
