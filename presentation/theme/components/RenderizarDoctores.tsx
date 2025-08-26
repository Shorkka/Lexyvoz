import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface Doctor {
  [key: string]: null | string;
}

interface RenderizarDoctoresProps {
  doctors: Doctor[];
  searchText: string;
}

export const RenderizarDoctores: React.FC<RenderizarDoctoresProps> = ({ 
  doctors, 
  searchText 
}) => {
  // Filter doctors based on search text
  const filteredDoctors = doctors.filter(doctor => 
    doctor.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
    doctor.especialidad?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (filteredDoctors.length === 0) {
    return <ThemedText style={{ color: 'white' }}>No se encontraron doctores</ThemedText>;
  }

  return (
    <View style={styles.container}>
      {filteredDoctors.map((doctor, index) => (
        <View key={doctor.usuario_id || index} style={styles.card}>
          <ThemedText style={styles.name}>{doctor.nombre}</ThemedText>
          <ThemedText>Especialidad: {doctor.especialidad}</ThemedText>
          <ThemedText>Email: {doctor.correo}</ThemedText>
          <ThemedText>Teléfono: {doctor.numero_telefono}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});