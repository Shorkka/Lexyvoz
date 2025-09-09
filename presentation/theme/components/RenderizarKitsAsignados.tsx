import {Text, ActivityIndicator, Platform,StyleSheet } from 'react-native'
import React from 'react'
import { useKitsAsignacionesStore } from '@/infraestructure/store/useKitsAsignacionesStore';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

interface RenderizarKitsAsignadosProps {
  onKitPress?: (kit: any) => void;
  onKitLongPress?: (kit: any) => void;
}

const RenderizarKitsAsignados: React.FC<RenderizarKitsAsignadosProps> = ({ onKitPress, onKitLongPress }) => {
    const {user} = useAuthStore();
    const { useKitsAsignadosAPacientesQuery } = useKitsAsignacionesStore();
    const { data, isLoading, error } = useKitsAsignadosAPacientesQuery(user?.paciente_id || 0);
  if (isLoading) {
    return <ActivityIndicator size="large" color="#ee7200" style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error al cargar los kits</Text>;
  }

  console.log(data);
  return (
  <FlatList
      data={data?.data || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable 
          style={styles.kitCard} 
          onPress={() => onKitPress && onKitPress(item)}
          onLongPress={() => onKitLongPress && onKitLongPress(item)}
        >
          <Text style={styles.kitTitle}>{item.kit_nombre}</Text>
          <Text style={styles.kitDescription}>{item.kit_descripcion}</Text>
        </Pressable>
      )}
    />
  )
}

export default RenderizarKitsAsignados

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