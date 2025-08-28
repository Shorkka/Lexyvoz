import React, { useEffect, useState } from 'react';
import { 
  View, SafeAreaView, StyleSheet, KeyboardAvoidingView, 
  ScrollView, Pressable, Modal, Alert 
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
interface Doctor {
  usuario_id: string;
  nombre: string;
  especialidad?: string;
  correo: string;
  numero_telefono: string;
}

const Search = () => {
  const [form, setForm] = useState({ busqueda: '' });
  const [page, setPage] = useState(1);
  const limit = 5; 
  const backgroundColor = useThemeColor({}, 'background');
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mensajeSolicitud, setMensajeSolicitud] = useState('');
  // Obtener la mutación
  const {enviarSolicitudMutation} = useSolicitudesVinculacionStore();

  const { useObtenerDoctoresQuery } = useAuthKitsStore();
  const { data: doctorsData, isLoading, isError } = useObtenerDoctoresQuery(page, limit, form.busqueda);

  const handleSearch = (text: string) => {
    setForm({ busqueda: text });
    setPage(1);
  };

  useEffect(() => {
    setCanGoBack(page > 1);
    setCanGoNext(!!doctorsData && (page * limit) < doctorsData.total);
  }, [page, doctorsData]);

  const vincularPaciente = (doctorId: string) => {
    if (!mensajeSolicitud.trim()) {
      Alert.alert('Error', 'Por favor, escribe un mensaje para el doctor');
      return;
    }

    enviarSolicitudMutation.mutate(
      { 
        doctor_id: parseInt(doctorId), 
        mensaje: mensajeSolicitud,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            Alert.alert('Éxito', 'Solicitud enviada correctamente');
            setSelectedDoctor(null);
            setMensajeSolicitud('');
          } else {
            Alert.alert('Error al enviar la solicitud');
          }
        },
        onError: (error) => {
          Alert.alert('Error', 'Error de conexión');
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

                <ThemedTextInput
                  placeholder="Buscar doctor"
                  autoCapitalize="words"
                  icon="search"
                  style={styles.searchInput}
                  value={form.busqueda}
                  onChangeText={handleSearch}
                />
              </View>

              {/* Contenido principal con scroll */}
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
                    <ScrollView style={styles.doctorsScroll}>
                      {doctorsData?.doctors?.length ? (
                        doctorsData.doctors.map((doctor: any) => (
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
                    <View style={styles.paginationContainer}>
                      <ThemedButton 
                        icon='caret-back-outline'
                        backgroundColor={canGoBack ? '#ee7200' : 'grey'}
                        onPress={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!canGoBack}
                      />
                      <ThemedText style={{ color: 'white' }}>Página {page}</ThemedText>
                      <ThemedButton 
                        icon='caret-forward-outline'
                        onPress={() => setPage(p => p + 1)} 
                        disabled={!canGoNext}
                        backgroundColor={canGoNext ? '#ee7200' : 'grey'}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ThemedBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>

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
                onPress={() => vincularPaciente(selectedDoctor!.usuario_id)}
                disabled={enviarSolicitudMutation.isPending}
              >
                {enviarSolicitudMutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
};

export default Search;

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
  searchInput: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
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