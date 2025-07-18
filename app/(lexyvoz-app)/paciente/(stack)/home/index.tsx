import React from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Kit from '../../../../../presentation/theme/components/Kit';
import { ThemedText } from '../../../../../presentation/theme/components/ThemedText';
import { ThemedView } from '../../../../../presentation/theme/components/ThemedView';
import { useThemeColor } from '../../../../../presentation/theme/hooks/useThemeColor';
import { useResponsivePadding } from '@/presentation/theme/hooks/useResponsivePadding';


const HomePacienteScreen = () => {
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const { getResponsivePadding } = useResponsivePadding();
  const padding = getResponsivePadding(20, 10);
  const handleKitPress = (kitNumber: number) => {
    // Navegar a la pantalla del kit
  };
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
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#374151',
      marginLeft: 8,
    },
    content: {
      flex: 1,
      padding: 20,
      backgroundColor: backgroundColor,
      paddingHorizontal:padding,
      alignContent: 'center'

    },
    welcomeCard: {
      backgroundColor: '#FB923C', // Color naranja como en la imagen
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      minHeight: Platform.select({
        web: width * 0.3,
        default: 250,
      }),
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4A5568',
      marginBottom: 10,
    },
    kitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header con botón del drawer */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta de Bienvenida */}
        <View style={styles.welcomeCard}>
          <ThemedText style={styles.welcomeText}>
            Bienvenido
          </ThemedText>
          
          {/* Kits Asignados */}
          <ThemedText style={styles.sectionTitle}>
            Kits Asignados
          </ThemedText>
          <View style={styles.kitsContainer}>
            <Kit 
              kitNumber={2} 
              onPress={() => handleKitPress(2)}
            />
            <Kit 
              kitNumber={3} 
              showPlayButton={true}
              onPress={() => handleKitPress(3)}
            />
          </View>

          {/* Historial */}
          <ThemedText style={styles.sectionTitle}>
            Historial
          </ThemedText>
          <View style={styles.kitsContainer}>
            <Kit 
              kitNumber={1} 
              isCompleted={true}
              onPress={() => handleKitPress(1)}
            />
            <Kit 
              kitNumber={4} 
              isCompleted={true}
              onPress={() => handleKitPress(4)}
            />
            <Kit 
              kitNumber={5} 
              isCompleted={true}
              onPress={() => handleKitPress(5)}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default HomePacienteScreen;