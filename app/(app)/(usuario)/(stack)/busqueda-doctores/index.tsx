import { 
  View, SafeAreaView, StyleSheet, KeyboardAvoidingView, 
  ScrollView, Pressable, Modal 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AuthGuard from '@/presentation/theme/components/AuthGuard'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { RenderizarDoctores } from '@/presentation/theme/components/RenderizarDoctores';
import { useDoctorStore } from '@/infraestructure/store/useAuthStore ';

const Search = () => {
  const [form, setForm] = useState({ busqueda: '' });
  const [page, setPage] = useState(1);
  const limit = 1;
  const backgroundColor = useThemeColor({}, 'background');
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const { useDoctorQuery } = useDoctorStore();
  const { data: doctorsData, isLoading, isError } = useDoctorQuery(page, limit, form.busqueda);

  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const handleSearch = (text: string) => {
    setForm({ ...form, busqueda: text });
    setPage(1);
  };

  useEffect(() => {
    setCanGoBack(page > 1);
    setCanGoNext(!!doctorsData && (page * limit) < doctorsData.total);
  }, [page, doctorsData]);

  const vincularPaciente = (doctorId: string) => {
    console.log("Vinculando paciente con doctor:", doctorId);
    // Aquí harás la petición al backend
    setSelectedDoctor(null); // cerrar modal después
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={{ flex: 1, backgroundColor: backgroundColor }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <ThemedBackground fullHeight backgroundColor="#fba557">
              <View>
                <ThemedText type='title' style={{ color: 'black' }}>
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

              {isLoading ? (
                <ThemedText style={{ color: 'white' }}>Cargando doctores...</ThemedText>
              ) : isError ? (
                <ThemedText style={{ color: 'white' }}>Error al cargar doctores</ThemedText>
              ) : (
                <View>
                  <ScrollView>
                    {doctorsData?.doctors?.map((doctor: any, index: number) => (
                      <Pressable 
                        key={doctor.usuario_id || index} 
                        style={{ opacity: 1 }} 
                        onPress={() => setSelectedDoctor(doctor)} //  abrir modal con doctor
                      >
                        <RenderizarDoctores
                          doctors={[doctor]}
                          searchText={form.busqueda}
                        />
                      </Pressable>
                    ))}
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
            </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/*  Modal para mostrar info del doctor */}
      <Modal
        visible={!!selectedDoctor}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title">{selectedDoctor?.nombre}</ThemedText>
            <ThemedText>Especialidad: {selectedDoctor?.especialidad}</ThemedText>
            <ThemedText>Email: {selectedDoctor?.correo}</ThemedText>
            <ThemedText>Teléfono: {selectedDoctor?.numero_telefono}</ThemedText>

            <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
              <ThemedButton 
                backgroundColor="grey"
                onPress={() => setSelectedDoctor(null)}
              >Cerrar</ThemedButton>
              <ThemedButton 
                backgroundColor="#ee7200"
                onPress={() => vincularPaciente(selectedDoctor?.usuario_id)}
              >Vincular</ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </AuthGuard>
  );
}
export default Search;

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    fontSize: 16,
  },
  paginationContainer: {
    flex: 1,
    alignSelf: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
  },
});
