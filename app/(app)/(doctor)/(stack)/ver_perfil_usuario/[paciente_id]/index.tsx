import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useLocalSearchParams } from 'expo-router';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import CardViewEditkits from '@/presentation/theme/components/CardViewEditkits';
import { useDoctorPacienteStore } from '@/infraestructure/store/useDoctorPacienteStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import RenderizarHistorialKitsAsignados from '@/presentation/theme/components/RenderizarHistorialKitsAsignados';
import RenderizarKitsAsignadosVistaDoctor from '@/presentation/theme/components/RenderizarKitsAsignadosVistaDoctor';
import Hashids from 'hashids';

const AsignarKitsScreen = () => {
  const { paciente_id } = useLocalSearchParams();
  const hashids = new Hashids('mi-secreto', 10);
  const decoded = hashids.decode(paciente_id as string);
  const realPacienteId = decoded[0];

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const backgroundColor = useThemeColor({}, 'background');
  const { usePacientesDeDoctorQuery } = useDoctorPacienteStore();
  const { user } = useAuthStore();

  const { data: pacientesData, isLoading, isError, error } =
    usePacientesDeDoctorQuery(user?.doctor_id);

  const pacientes = pacientesData?.data || [];
  const pacienteFiltrado = pacientes.filter(
    (p) => String(p.usuario_id) === String(realPacienteId)
  );

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            <ThemedBackground
              fullHeight
              backgroundColor="#fba557"
              style={[GlobalStyles.orangeBackground, { padding: 16, flex: 1 }]}
            >
              {/* --- TÍTULO --- */}
              <ThemedText type="welcome" style={styles.title}>
                Perfil del Paciente
              </ThemedText>

              {/* --- CONTENEDOR PRINCIPAL (2 columnas o 1 en móvil) --- */}
              <View style={styles.contentContainer}>
                <View
                  style={[
                    styles.mainContainer,
                    isMobile && { flexDirection: 'column' },
                  ]}
                >
                  {/* --- COLUMNA IZQUIERDA: Datos del paciente --- */}
                  <View
                    style={[styles.leftColumn, isMobile && { width: '100%' }]}
                  >
                    <View style={styles.sectionTitle}>
                      <ThemedText style={styles.sectionTitleText}>
                        Datos del paciente
                      </ThemedText>
                    </View>

                    {isLoading ? (
                      <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <ThemedText style={styles.loadingText}>
                          Cargando pacientes...
                        </ThemedText>
                      </View>
                    ) : isError ? (
                      <View style={styles.centerContainer}>
                        <ThemedText style={styles.errorText}>
                          Error al cargar pacientes
                        </ThemedText>
                        <ThemedText style={styles.errorSubText}>
                          {error?.message || 'Intenta nuevamente'}
                        </ThemedText>
                      </View>
                    ) : (
                      <FlatList
                        data={pacienteFiltrado}
                        keyExtractor={(item) =>
                          item.usuario_id?.toString() ?? '0'
                        }
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                          <View style={styles.pacienteCard}>
                            <View style={styles.pacienteInfo}>
                              <ThemedText style={styles.pacienteNombre}>
                                Nombre: {item.nombre || 'No disponible'}
                              </ThemedText>
                              <ThemedText style={styles.pacienteEmail}>
                                📧 Email: {item.correo || 'No disponible'}
                              </ThemedText>
                              <ThemedText style={styles.pacienteDomicilio}>
                                🏠 Domicilio:{' '}
                                {item.domicilio || 'No disponible'}
                              </ThemedText>
                              <ThemedText style={styles.pacienteTelefono}>
                                📞 Teléfono:{' '}
                                {item.numero_telefono || 'No disponible'}
                              </ThemedText>

                              {/* Renderizar kits actuales e historial */}
                              <RenderizarKitsAsignadosVistaDoctor
                                pacienteId={item?.paciente_id || 0}
                              />
                              <RenderizarHistorialKitsAsignados />
                            </View>
                          </View>
                        )}
                      />
                    )}
                  </View>

                  {/* --- COLUMNA DERECHA: Asignar kits --- */}
                  <View
                    style={[
                      styles.rightColumn,
                      isMobile && { width: '100%', marginTop: 20 },
                    ]}
                  >
                    <View style={styles.sectionTitle}>
                      <ThemedText style={styles.sectionTitleText}>
                        Asignar Kits
                      </ThemedText>
                    </View>
                    <CardViewEditkits />
                  </View>
                </View>
              </View>
            </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#000000',
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  leftColumn: {
    width: '58%',
    flexDirection: 'column',
  },
  rightColumn: {
    width: '40%',
    flexDirection: 'column',
  },
  sectionTitle: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    paddingBottom: 5,
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  pacienteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pacienteInfo: {
    marginBottom: 12,
  },
  pacienteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pacienteEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pacienteDomicilio: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  pacienteTelefono: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150,
  },
  loadingText: { color: 'white', marginTop: 10, fontSize: 16 },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AsignarKitsScreen;
