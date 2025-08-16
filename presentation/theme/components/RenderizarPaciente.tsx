import React from 'react';
import { FlatList, View } from 'react-native';

import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useDoctorStore } from '@/infraestructure/store/useDoctorStore ';

interface Props {
  searchText?: string;
}

const RenderizarPaciente: React.FC<Props> = ({ searchText = '' }) => {
  const { user } = useAuthStore(); 
  const { usePacientesQuery } = useDoctorStore();

  const { data: pacientes, isLoading, isError } = usePacientesQuery(user?.usuario_id || 0);

  if (isLoading) return <ThemedText>Cargando pacientes...</ThemedText>;
  if (isError) return <ThemedText>Error al cargar pacientes</ThemedText>;
  if (!pacientes || pacientes.length === 0) return <ThemedText>No hay pacientes asignados</ThemedText>;

  const pacientesFiltrados = pacientes.filter((paciente: any) =>
    paciente.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <FlatList
      data={pacientesFiltrados}
      keyExtractor={(item) => item.usuario_id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <ThemedText>{item.nombre}</ThemedText>
          <ThemedText>{item.correo}</ThemedText>
        </View>
      )}
    />
  );
};

export default RenderizarPaciente;
