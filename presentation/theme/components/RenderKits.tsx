import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 16; // Reducido para mejor uso del espacio
const NUM_COLUMNS = 2; // Cambiado a 2 columnas para mejor visualización en móviles
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface RenderKitsProps {
  currentPage: number;
  visibleKits: any[];
  totalPages: number;
  onKitPress?: (kit: any) => void; // Añadido para manejar clics en los kits
}

const RenderKits = ({ currentPage, visibleKits, totalPages, onKitPress }: RenderKitsProps) => {
  if (visibleKits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay kits disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.kitsContainer}>
          {visibleKits.map((kit) => (
            <TouchableOpacity 
              key={kit.kit_id} 
              style={[styles.card, { width: CARD_WIDTH }]}
              onPress={() => onKitPress && onKitPress(kit)}
              activeOpacity={0.7}
            >
              <Text style={styles.title} numberOfLines={1}>{kit.name || 'Sin nombre'}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {kit.descripcion || 'Sin descripción'}
              </Text>
              <Text style={styles.creator} numberOfLines={1}>
                Creado por: {kit.creador_nombre || 'Desconocido'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {totalPages > 1 && (
        <Text style={styles.pageIndicator}>
          Página {currentPage + 1} de {totalPages}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    padding: CARD_MARGIN / 2,
    paddingBottom: CARD_MARGIN, // Espacio extra al final
  },
  kitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  creator: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 'auto', // Empuja este elemento hacia abajo
  },
  pageIndicator: {
    marginVertical: 10,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default RenderKits;