import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import Kit from './Kit';
import { ThemedText } from './ThemedText';

/**
 * KitScrollView Component
 * 
 * Este componente muestra una lista horizontal de kits creados por el doctor.
 * Los kits son dinámicos y se pueden asignar/desasignar según las necesidades del paciente.
 * 
 * Características:
 * - Scroll horizontal para navegación fluida
 * - Estados de carga y mensajes vacíos
 * - Información adicional del kit (dificultad, fecha de asignación, etc.)
 * - Preparado para recibir datos desde API
 */

interface KitData {
  kitNumber: number;
  isCompleted?: boolean;
  showPlayButton?: boolean;
  isAssigned?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdByDoctor?: string;
  assignedDate?: string;
  completedDate?: string;
  title?: string;
  description?: string;
}

interface KitScrollViewProps {
  title: string;
  kits: KitData[];
  onKitPress: (kitNumber: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const KitScrollView = ({ title, kits, onKitPress, isLoading = false, emptyMessage = "No hay kits disponibles" }: KitScrollViewProps) => {

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2D3748',
      marginBottom: 12,
      paddingHorizontal: 5,
    },
    scrollContainer: {
      height: 100, // Altura fija para el contenedor
    },
    scrollContent: {
      paddingHorizontal: 5,
      alignItems: 'center',
      flexDirection: 'row',
    },
    kitWrapper: {
      marginRight: Platform.select({
        web: 15,
        default: 12,
      }),
      alignItems: 'center',
    },
    emptyContainer: {
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyText: {
      fontSize: 14,
      color: '#6B7280',
      fontStyle: 'italic',
      textAlign: 'center',
    },
    loadingContainer: {
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    loadingText: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            Cargando kits...
          </ThemedText>
        </View>
      );
    }

    if (kits.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {emptyMessage}
          </ThemedText>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={Platform.select({ web: 95, default: 82 })} // Ajustar según el ancho del kit
        snapToAlignment="start"
      >
        {kits.map((kit, index) => (
          <View key={`${kit.kitNumber}-${index}`} style={styles.kitWrapper}>
            <Kit
              kitNumber={kit.kitNumber}
              isCompleted={kit.isCompleted}
              showPlayButton={kit.showPlayButton}
              onPress={() => onKitPress(kit.kitNumber)}
            />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {renderContent()}
    </View>
  );
};

export default KitScrollView;
