import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 30;
const NUM_COLUMNS = 3;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface RenderKitsProps {
  currentPage: number;
  visibleKits: any[];
  totalPages: number;
}

const RenderKits = ({ currentPage, visibleKits, totalPages }: RenderKitsProps) => {
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.kitsContainer}>
          {visibleKits.map((kit) => (
            <View key={kit.id} style={[styles.card, { width: CARD_WIDTH }]}>
              <Text style={styles.title} numberOfLines={1}>{kit.nombre}</Text>
              <Text style={styles.description} numberOfLines={2}>{kit.descripcion}</Text>
              <Text style={styles.creator} numberOfLines={1}>Creado por: {kit.creado_por}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.pageIndicator}>
        {currentPage + 1}/{totalPages}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    padding: CARD_MARGIN,
  },
  kitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 130,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  creator: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  pageIndicator: {
    marginVertical: 10,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RenderKits;
