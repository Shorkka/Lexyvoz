import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from './ThemedText';

interface Paciente {
  usuario_id: string;
  nombre: string;
  correo: string;
  imagen_url?: string;
  escolaridad?: string;
}

interface RenderizarPacienteProps {
  pacientes: Paciente[];
  searchText: string;
}

const RenderizarPaciente: React.FC<RenderizarPacienteProps> = ({ pacientes, searchText }) => {
  const normalizedSearch = searchText.toLowerCase();

  const filteredPacientes = pacientes.filter((p) =>
    (p.nombre ?? "").toLowerCase().includes(normalizedSearch) ||
    (p.correo ?? "").toLowerCase().includes(normalizedSearch)
  );

  if (filteredPacientes.length === 0) {
    return <ThemedText style={{ marginTop: 10 }}>No se encontraron pacientes</ThemedText>;
  }

  return (
    <View style={styles.container}>
      {filteredPacientes.map((paciente) => (
        <View key={paciente.usuario_id} style={styles.card}>
          {paciente.imagen_url ? (
            <Image source={{ uri: paciente.imagen_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.name}>{paciente.nombre}</ThemedText>
            <ThemedText>{paciente.correo}</ThemedText>
            {paciente.escolaridad && <ThemedText>Escolaridad: {paciente.escolaridad}</ThemedText>}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RenderizarPaciente;
