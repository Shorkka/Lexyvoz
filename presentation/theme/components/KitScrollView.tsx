// KitScrollView.tsx
import React from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';

import { router } from 'expo-router';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';

const KitScrollView = () => {
  const {useKitsQuery } = useKitsStore();
  const { data, isLoading, error } = useKitsQuery();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#ee7200" style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error al cargar los kits</Text>;
  }

  const handleEditKit = (kitId: number) => {
    router.push(`/(app)/(doctor)/(stack)/kits/kits-list`);
  };

  return (
    <FlatList
      data={data?.data || []} 
      keyExtractor={(item) => item.kit_id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.kitCard} onPress={() => handleEditKit(item.kit_id)}>
          <Text style={styles.kitTitle}>{item.name}</Text>
          <Text style={styles.kitDescription}>{item.descripcion}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  kitCard: {
    width: '100%',
    backgroundColor: '#fff3e7', 
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      web: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 5,
      },
    }),
  },
  kitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kitDescription: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default KitScrollView;
