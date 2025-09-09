// En RenderizarPaciente.tsx
import React from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { Paciente } from '@/core/auth/interface/doctor-paciente';



interface RenderizarPacienteProps {
  pacientes: Paciente[];
  searchText: string;
  onPacientePress?: (pacienteId: number) => void; // Nueva prop
}

const RenderizarPaciente: React.FC<RenderizarPacienteProps> = ({ 
  pacientes, 
  searchText, 
  onPacientePress 
}) => {
  // Filtrar pacientes según el texto de búsqueda
  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    paciente.correo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <FlatList
      data={filteredPacientes}
      keyExtractor={(item) => item.usuario_id.toString()}
      renderItem={({ item }) => (
        <Pressable 
          style={styles.pacienteItem}
          onPress={() => onPacientePress && onPacientePress(Number(item.usuario_id))}
        >
          <View style={styles.pacienteInfo}>
            <ThemedText style={styles.pacienteNombre}>
              {item.nombre}
            </ThemedText>
            <ThemedText style={styles.pacienteEmail}>
              {item.correo}
            </ThemedText>
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  pacienteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pacienteEmail: {
    fontSize: 14,
    color: '#666',
  },
});

export default RenderizarPaciente;