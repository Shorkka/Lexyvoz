import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '../../../../../presentation/theme/components/ThemedText';
import { ThemedView } from '../../../../../presentation/theme/components/ThemedView';
import { useThemeColor } from '../../../../../presentation/theme/hooks/useThemeColor';

const KitGameScreen = () => {
  const { width } = useWindowDimensions();
  const primaryColor = useThemeColor({}, 'primary');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Platform.select({ ios: 50, android: 40, web: 20 }),
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    menuButton: {
      padding: 8,
      borderRadius: 8,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      marginRight: 40, // Para centrar considerando el botón del menú
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    placeholderContainer: {
      backgroundColor: 'white',
      padding: 40,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      minWidth: Platform.select({
        web: width * 0.4,
        default: width * 0.8,
      }),
      alignItems: 'center',
    },
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header con botón del drawer */}
      <View style={styles.header}>
        <ThemedText 
          type="title" 
          style={styles.headerTitle}
        >
          Kit de Dislexia
        </ThemedText>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.placeholderContainer}>
          <Ionicons 
            name="game-controller-outline" 
            size={64} 
            color={primaryColor} 
            style={{ marginBottom: 20 }}
          />
          <ThemedText type="title" style={{ marginBottom: 10, textAlign: 'center' }}>
            Juego en Desarrollo
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
            Aquí se implementará el kit de ejercicios para dislexia
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default KitGameScreen;
