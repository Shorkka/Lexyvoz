import { 
  View, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator, Alert 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useCitasStore } from '@/infraestructure/store/useCitaStore';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Cita {
  id: number;
  paciente_id: number;
  doctor_id: number;
  fecha_hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  motivo: string;
  paciente_nombre: string;
  doctor_nombre: string;
  especialidad?: string;
}

type CitaFilter = 'todas' | 'pendientes' | 'confirmadas' | 'completadas' | 'canceladas' | 'proximas' | 'pasadas';

const Agenda = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [filter, setFilter] = useState<CitaFilter>('todas');
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const backgroundColor = useThemeColor({}, 'background');
  
  const { user } = useAuthStore();
  const { 
    todasCitasQuery, 
    editarCitaMutation,
    eliminarCitaMutation 
  } = useCitasStore();

  const { data: todasCitas, isLoading, refetch } = todasCitasQuery;

  // Filtrar y procesar citas
  useEffect(() => {
    if (todasCitas && Array.isArray(todasCitas)) {
      // Filtrar solo las citas del doctor actual
      const citasDoctor = todasCitas.filter((cita: any) => 
        cita.doctor_id === user?.usuario_id
      );

      // Ordenar por fecha (más próximas primero)
      const citasOrdenadas = citasDoctor.sort((a: Cita, b: Cita) => 
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
      );

      setCitas(citasOrdenadas);
    }
  }, [todasCitas, user]);

  // Función para eliminar citas pasadas automáticamente
  const eliminarCitasPasadas = () => {
    const ahora = new Date();
    const citasPasadas = citas.filter(cita => new Date(cita.fecha_hora) < ahora);
    
    if (citasPasadas.length > 0) {
      Alert.alert(
        'Eliminar citas pasadas',
        `¿Deseas eliminar ${citasPasadas.length} citas pasadas?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Eliminar',
            onPress: () => {
              citasPasadas.forEach(cita => {
                eliminarCitaMutation.mutate(cita.id);
              });
              setTimeout(() => refetch(), 500);
            }
          }
        ]
      );
    }
  };

  // Filtrar citas según el filtro seleccionado
  const filteredCitas = citas.filter(cita => {
    const ahora = new Date();
    const fechaCita = new Date(cita.fecha_hora);
    
    switch (filter) {
      case 'todas':
        return true;
      case 'pendientes':
        return cita.estado === 'pendiente';
      case 'confirmadas':
        return cita.estado === 'confirmada';
      case 'completadas':
        return cita.estado === 'completada';
      case 'canceladas':
        return cita.estado === 'cancelada';
      case 'proximas':
        return fechaCita >= ahora && cita.estado !== 'cancelada';
      case 'pasadas':
        return fechaCita < ahora;
      default:
        return true;
    }
  });

  const cambiarEstadoCita = (citaId: number, nuevoEstado: Cita['estado']) => {
    const cita = citas.find(c => c.id === citaId);
    if (cita) {
      editarCitaMutation.mutate({
        citaID: citaId,
        citaData: {
          pacienteId: cita.paciente_id.toString(),
          doctorId: cita.doctor_id.toString(),
          fecha: new Date(cita.fecha_hora),
        }
      });
      setSelectedCita(null);
      setTimeout(() => refetch(), 500);
    }
  };

  const handleEliminarCita = (citaId: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta cita?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: () => {
            eliminarCitaMutation.mutate(citaId);
            setSelectedCita(null);
            setTimeout(() => refetch(), 500);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Cargando agenda...
              </ThemedText>
            </View>
          </ThemedBackground>
        </SafeAreaView>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
          <View style={styles.container}>
            {/* Cabecera con título y filtros */}
            <View style={styles.header}>
              <ThemedText type='title' style={{ color: 'black', marginBottom: 15 }}>
                Mi Agenda
              </ThemedText>
              
              {/* Botón para eliminar citas pasadas */}
              <ThemedButton 
                backgroundColor="#ff4444"
                onPress={eliminarCitasPasadas}
                style={styles.cleanButton}
              >
                Limpiar Citas Pasadas
              </ThemedButton>

              {/* Filtros de citas */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <View style={styles.filterContainer}>
                  <ThemedButton 
                    backgroundColor={filter === 'todas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('todas')}
                    style={styles.filterButton}
                  >Todas</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'proximas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('proximas')}
                    style={styles.filterButton}
                  >Próximas</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'pendientes' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('pendientes')}
                    style={styles.filterButton}
                  >Pendientes</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'confirmadas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('confirmadas')}
                    style={styles.filterButton}
                  >Confirmadas</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'completadas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('completadas')}
                    style={styles.filterButton}
                  >Completadas</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'canceladas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('canceladas')}
                    style={styles.filterButton}
                  >Canceladas</ThemedButton>
                  <ThemedButton 
                    backgroundColor={filter === 'pasadas' ? '#ee7200' : 'grey'}
                    onPress={() => setFilter('pasadas')}
                    style={styles.filterButton}
                  >Pasadas</ThemedButton>
                </View>
              </ScrollView>
            </View>

            {/* Lista de citas */}
            <View style={styles.content}>
              <ScrollView style={styles.citasScroll}>
                {filteredCitas.length > 0 ? (
                  filteredCitas.map((cita) => {
                    const fechaCita = new Date(cita.fecha_hora);
                    const ahora = new Date();
                    const esPasada = fechaCita < ahora;
                    
                    return (
                      <Pressable 
                        key={`cita-${cita.id}`} 
                        style={[
                          styles.citaItem,
                          esPasada && styles.pastCita,
                          cita.estado === 'cancelada' && styles.canceledCita
                        ]} 
                        onPress={() => setSelectedCita(cita)}
                      >
                        <View style={styles.citaContent}>
                          <ThemedText type="subtitle" style={styles.citaTitle}>
                            Cita con {cita.paciente_nombre}
                          </ThemedText>
                          <ThemedText style={styles.citaDescription}>
                            {cita.motivo}
                          </ThemedText>
                          <ThemedText style={styles.citaDate}>
                            {fechaCita.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </ThemedText>
                          <ThemedText style={[
                            styles.citaStatus,
                            { 
                              color: cita.estado === 'confirmada' ? 'green' : 
                                    cita.estado === 'cancelada' ? 'red' :
                                    cita.estado === 'completada' ? 'blue' : 'orange'
                            }
                          ]}>
                            {cita.estado.toUpperCase()}
                            {esPasada && cita.estado !== 'completada' && cita.estado !== 'cancelada' && ' - PASADA'}
                          </ThemedText>
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                    No hay citas en esta categoría
                  </ThemedText>
                )}
              </ScrollView>
            </View>
          </View>
        </ThemedBackground>
      </SafeAreaView>

      {/* Modal para mostrar detalles de la cita */}
      <Modal
        visible={!!selectedCita}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCita(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title">Detalles de la Cita</ThemedText>
            
            {selectedCita && (
              <>
                <ThemedText style={styles.modalDescription}>
                  <ThemedText style={styles.modalLabel}>Paciente: </ThemedText>
                  {selectedCita.paciente_nombre}
                </ThemedText>
                
                <ThemedText style={styles.modalDescription}>
                  <ThemedText style={styles.modalLabel}>Motivo: </ThemedText>
                  {selectedCita.motivo}
                </ThemedText>
                
                <ThemedText style={styles.modalDescription}>
                  <ThemedText style={styles.modalLabel}>Fecha y Hora: </ThemedText>
                  {new Date(selectedCita.fecha_hora).toLocaleString('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </ThemedText>
                
                <ThemedText style={styles.modalDescription}>
                  <ThemedText style={styles.modalLabel}>Estado: </ThemedText>
                  {selectedCita.estado.toUpperCase()}
                </ThemedText>

                <View style={styles.modalActions}>
                  {selectedCita.estado === 'pendiente' && (
                    <>
                      <ThemedButton 
                        backgroundColor="green"
                        onPress={() => cambiarEstadoCita(selectedCita.id, 'confirmada')}
                        style={styles.modalActionButton}
                      >
                        Confirmar
                      </ThemedButton>
                      <ThemedButton 
                        backgroundColor="red"
                        onPress={() => cambiarEstadoCita(selectedCita.id, 'cancelada')}
                        style={styles.modalActionButton}
                      >
                        Cancelar
                      </ThemedButton>
                    </>
                  )}
                  
                  {selectedCita.estado === 'confirmada' && (
                    <>
                      <ThemedButton 
                        backgroundColor="blue"
                        onPress={() => cambiarEstadoCita(selectedCita.id, 'completada')}
                        style={styles.modalActionButton}
                      >
                        Marcar como Completada
                      </ThemedButton>
                      <ThemedButton 
                        backgroundColor="red"
                        onPress={() => cambiarEstadoCita(selectedCita.id, 'cancelada')}
                        style={styles.modalActionButton}
                      >
                        Cancelar
                      </ThemedButton>
                    </>
                  )}

                  <ThemedButton 
                    backgroundColor="#ff4444"
                    onPress={() => handleEliminarCita(selectedCita.id)}
                    style={styles.modalActionButton}
                  >
                    Eliminar Cita
                  </ThemedButton>
                </View>
              </>
            )}

            <View style={styles.modalClose}>
              <ThemedButton 
                backgroundColor="#ee7200"
                onPress={() => setSelectedCita(null)}
              >
                Cerrar
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

export default Agenda;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 20,
  },
  cleanButton: {
    marginBottom: 15,
    paddingVertical: 10,
  },
  filterScroll: {
    maxHeight: 60,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  filterButton: {
    minWidth: 110,
    marginHorizontal: 5,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  citasScroll: {
    flex: 1,
  },
  citaItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  pastCita: {
    backgroundColor: '#f8f8f8',
    opacity: 0.7,
  },
  canceledCita: {
    backgroundColor: '#ffeeee',
  },
  citaContent: {
    flex: 1,
  },
  citaTitle: {
    color: 'black',
    marginBottom: 5,
  },
  citaDescription: {
    color: 'gray',
    marginBottom: 5,
  },
  citaDate: {
    color: 'darkgray',
    marginBottom: 5,
    fontWeight: '500',
  },
  citaStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  modalDescription: {
    marginVertical: 8,
    color: 'gray',
  },
  modalActions: {
    marginVertical: 15,
  },
  modalActionButton: {
    marginVertical: 5,
  },
  modalClose: {
    alignItems: 'center',
  },
});