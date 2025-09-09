import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface Doctor {
  usuario_id: string;
  nombre: string;
  especialidad?: string;
  correo: string;
  numero_telefono: string;
}

interface RenderizarDoctoresProps {
  doctor: Doctor;
}

export const RenderizarDoctores: React.FC<RenderizarDoctoresProps> = ({ doctor }) => {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.name}>{doctor.nombre}</ThemedText>
      {doctor.especialidad && (
        <ThemedText>Especialidad: {doctor.especialidad}</ThemedText>
      )}
      <ThemedText>Email: {doctor.correo}</ThemedText>
      <ThemedText>Teléfono: {doctor.numero_telefono}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    top: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});
