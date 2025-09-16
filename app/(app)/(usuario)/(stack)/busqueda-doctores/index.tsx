import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, SafeAreaView, StyleSheet, KeyboardAvoidingView, 
  ScrollView, Pressable, Modal 
} from 'react-native';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { RenderizarDoctores } from '@/presentation/theme/components/RenderizarDoctores';
import { useSolicitudesVinculacionStore } from '@/infraestructure/store/useSolicitudesVinculacionStore';
import { useAuthKitsStore } from '@/infraestructure/store/useAuthKitsStore ';
import { useAlert } from '@/presentation/hooks/useAlert';
import Filtro from '@/presentation/theme/components/Filtro';

interface Doctor {
  doctor_id: string;
  nombre: string;
  especialidad?: string;
  correo: string;
  numero_telefono: string;
  ubicacion?: string;
}

const Search = () => {
  const [form, setForm] = useState({ busqueda: '' });
  const [page, setPage] = useState(1);
  const [filtro, setFiltro] = useState('ninguno'); // 'nombre', 'especialidad', 'ubicacion', 'ninguno'
  const [orden, setOrden] = useState<'asc' | 'desc'>('asc');
  const limit = 5; 
  const backgroundColor = useThemeColor({}, 'background');
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mensajeSolicitud, setMensajeSolicitud] = useState('');
  const { showAlert } = useAlert();
  
  const { enviarSolicitudMutation } = useSolicitudesVinculacionStore();
  const { useObtenerDoctoresQuery } = useAuthKitsStore();
  
  // Obtenemos todos los doctores sin paginación para poder filtrar
  const { data: doctorsData, isLoading, isError } = useObtenerDoctoresQuery(
    1, // Siempre página 1
    100, 
    form.busqueda // Término de búsqueda
  );

  // Función para ordenar los doctores
  const doctoresOrdenados = useMemo(() => {
    if (!doctorsData?.doctors) return [];
    
    let doctores = [...doctorsData.doctors];
    
    // Aplicar filtro según la selección
    if (filtro !== 'ninguno') {
      doctores.sort((a, b) => {
        let valueA = '';
        let valueB = '';
        
        switch (filtro) {
          case 'nombre':
            valueA = a.nombre || '';
            valueB = b.nombre || '';
            break;
          case 'especialidad':
            valueA = a.especialidad || '';
            valueB = b.especialidad || '';
            break;
          case 'ubicacion':
            valueA = a.ubicacion || '';
            valueB = b.ubicacion || '';
            break;
          default:
            return 0;
        }
        
        // Ordenar ascendente o descendente
        if (orden === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });
    }
    console.log('Doctores después de ordenar:', doctores);
    return doctores;
  }, [doctorsData, filtro, orden]);

  // Paginación manual
  const doctoresPaginados = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return doctoresOrdenados.slice(startIndex, startIndex + limit);
  }, [doctoresOrdenados, page, limit]);

  const handleSearch = (text: string) => {
    setForm({ busqueda: text });
    setPage(1); // Reiniciar a primera página al buscar
  };

  const handleFilterChange = (nuevoFiltro: string, nuevoOrden: 'asc' | 'desc') => {
    setFiltro(nuevoFiltro);
    setOrden(nuevoOrden);
    setPage(1); // Reiniciar a primera página al cambiar filtro
  };

  useEffect(() => {
    console.log('Doctores ordenados:', doctoresOrdenados);
    const totalDoctores = doctoresOrdenados.length;
    setCanGoBack(page > 1);
    setCanGoNext(page * limit < totalDoctores);
  }, [page, doctoresOrdenados, limit]);

  const vincularPaciente = (doctorId: string | number) => {
    
    enviarSolicitudMutation.mutate(
      { 
        doctor_id: Number(doctorId), 
        mensaje: mensajeSolicitud.trim()
        
      },
      {
        
        onSuccess: (result) => {
          if (result.success) {
            showAlert('Éxito', 'Solicitud enviada correctamente');
            setSelectedDoctor(null);
            setMensajeSolicitud('');
          } else {
            showAlert('Error', 'Error al enviar la solicitud');
          }
        },
        onError: (error) => {
          showAlert('Error', 'Error de conexión');
          console.error('Error en mutación:', error);
        }
      }
      
    );
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground align="center" fullHeight backgroundColor="#fba557">
            <View style={styles.container}>
              {/* Cabecera con título y búsqueda */}
              <View style={styles.header}>
                <ThemedText type='title' style={{ color: 'black', marginBottom: 15 }}>
                  Encuentra a un doctor
                </ThemedText>
                
                {/* Contenedor flexible para búsqueda y filtro */}
                <View style={styles.busquedaContainer}>
                  <View style={styles.busquedaInput}>
                    <ThemedTextInput
                      placeholder="Buscar doctor"
                      color="#fff"
                      autoCapitalize="words"
                      icon="search"
                      value={form.busqueda}
                      onChangeText={handleSearch}
                    />
                  </View>
                  
                  <View style={styles.filtroContainer}>
                    <Filtro 
                      onFilterChange={handleFilterChange}
                      filtroActual={filtro}
                      ordenActual={orden}
                    />
                  </View>
                </View>
              </View>

              {/* Contenido principal */}
              <View style={styles.content}>
                {isLoading ? (
                  <ThemedText style={{ color: 'white', textAlign: 'center', marginVertical: 20 }}>
                    Cargando doctores...
                  </ThemedText>
                ) : isError ? (
                  <ThemedText style={{ color: 'white', textAlign: 'center', marginVertical: 20 }}>
                    Error al cargar doctores
                  </ThemedText>
                ) : (
                  <View style={styles.doctorsContainer}>
                    <ThemedText style={{ color: 'white', marginBottom: 10 }}>
                      {doctoresOrdenados.length} doctores encontrados
                    </ThemedText>
                    
                    <ScrollView style={styles.doctorsScroll}>
                      {doctoresPaginados.length ? (
                        doctoresPaginados.map((doctor: any) => (
                          <Pressable 
                            key={doctor.usuario_id} 
                            style={{ opacity: 1}} 
                            onPress={() => setSelectedDoctor(doctor)}
                          >
                            <RenderizarDoctores doctor={doctor} />
                          </Pressable>
                        ))
                      ) : (
                        <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                          No se encontraron doctores
                        </ThemedText>
                      )}
                    </ScrollView>

                    {/* Pagination controls */}
                    {doctoresOrdenados.length > 0 && (
                      <View style={styles.paginationContainer}>
                        <ThemedButton 
                          icon='caret-back-outline'
                          backgroundColor={canGoBack ? '#ee7200' : 'grey'}
                          onPress={() => setPage(p => Math.max(1, p - 1))}
                          disabled={!canGoBack}
                        />
                        <ThemedText style={{ color: 'white' }}>
                          Página {page} de {Math.ceil(doctoresOrdenados.length / limit)}
                        </ThemedText>
                        <ThemedButton 
                          icon='caret-forward-outline'
                          onPress={() => setPage(p => p + 1)} 
                          disabled={!canGoNext}
                          backgroundColor={canGoNext ? '#ee7200' : 'grey'}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ThemedBackground>

          {/* Modal para mostrar info del doctor */}
          <Modal
            visible={!!selectedDoctor}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setSelectedDoctor(null);
              setMensajeSolicitud('');
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ThemedText type="title">{selectedDoctor?.nombre}</ThemedText>
                <ThemedText>Especialidad: {selectedDoctor?.especialidad || "N/A"}</ThemedText>
                <ThemedText>Email: {selectedDoctor?.correo}</ThemedText>
                <ThemedText>Teléfono: {selectedDoctor?.numero_telefono}</ThemedText>

                {/* Campo para el mensaje */}
                <ThemedTextInput
                  placeholder="Escribe un mensaje para el doctor"
                  multiline
                  numberOfLines={3}
                  style={styles.mensajeInput}
                  value={mensajeSolicitud}
                  onChangeText={setMensajeSolicitud}
                />

                <View style={styles.modalButtons}>
                  <ThemedButton 
                    backgroundColor="grey"
                    onPress={() => {
                      setSelectedDoctor(null);
                      setMensajeSolicitud('');
                    }}
                    disabled={enviarSolicitudMutation.isPending}
                  >
                    Cancelar
                  </ThemedButton>
                  <ThemedButton 
                    backgroundColor="#ee7200"
                    onPress={() => vincularPaciente(selectedDoctor!.doctor_id)}
                    disabled={enviarSolicitudMutation.isPending}
                  >
                    {enviarSolicitudMutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
                  </ThemedButton>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

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
  busquedaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  busquedaInput: {
    flex: 6, // 60% del espacio
    marginRight: 10,
  },
  filtroContainer: {
    flex: 4, // 40% del espacio
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    color: 'white',
  },
  doctorsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  doctorsScroll: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
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
    width: '85%',
    maxHeight: '80%',
  },
  mensajeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default Search;