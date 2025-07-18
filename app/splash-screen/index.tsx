import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import React from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';


export default function SplashScreen() {
  const pulseAnim = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <View style={GlobalStyles.splashContainer}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
        />
      </Animated.View>
      <Text style={GlobalStyles.splashTitle}>LexyVox</Text>
      <Text style={GlobalStyles.splashSubtitle}>Apoyo para Dislexia Auditiva</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 150,
  },
});