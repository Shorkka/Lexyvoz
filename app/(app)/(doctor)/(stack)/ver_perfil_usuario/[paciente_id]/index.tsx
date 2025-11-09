import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useDoctorPacienteStore } from '@/infraestructure/store/useDoctorPacienteStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import AsignarKitsScreenUser from '@/presentation/theme/components/AsignarKitsScreen';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import RenderizarHistorialKitsAsignados from '@/presentation/theme/components/RenderizarHistorialKitsAsignados';
import RenderizarKitsAsignadosVistaDoctor from '@/presentation/theme/components/RenderizarKitsAsignadosVistaDoctor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { useLocalSearchParams } from 'expo-router';
import Hashids from 'hashids';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

const AsignarKitsScreen = () => {
  const { paciente_id } = useLocalSearchParams();
  const hashids = new Hashids('mi-secreto', 10);
  const decoded = hashids.decode(paciente_id as string);
  const realPacienteId = decoded[0];

  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;

  const backgroundColor = useThemeColor({}, 'background');
  const { usePacientesDeDoctorQuery } = useDoctorPacienteStore();
  const { user } = useAuthStore();

  const {
    data: pacientesData,
    isLoading,
    isError,
    error,
  } = usePacientesDeDoctorQuery(user?.doctor_id || 0);

  const pacientes = pacientesData?.data || [];
  const pacienteFiltrado = pacientes.filter(
    (p: any) => String(p.usuario_id) === String(realPacienteId)
  );

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView
        
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedBackground
            fullHeight
            backgroundColor="#fba557"
            style={[GlobalStyles.orangeBackground, { padding: 16, flex: 1, justifyContent: "space-between" }]}
            
            >
              {/* --- TÍTULO --- */}
              <ThemedText type="welcome" style={styles.title}>
                Perfil del Paciente
              </ThemedText>

              {/* --- CONTENEDOR PRINCIPAL (2 columnas o 1 en móvil) --- */}
              <View style={[styles.mainContainer, isMobile && { flexDirection: 'column' }]}>
                {/* --- COLUMNA IZQUIERDA: Datos del paciente --- */}
                <View style={[styles.leftColumn, isMobile && { width: '100%' }]}>
                  <View style={styles.sectionTitle}>
                    <ThemedText style={styles.sectionTitleText}>Datos del paciente</ThemedText>
                  </View>

                  {/* Limitar altura en móvil/desktop como en DoctorScreen */}
                  <View style={{ maxHeight: isMobile ? height * 0.25 : height * 0.4, overflow: 'hidden' }}>
                    {isLoading ? (
                      <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <ThemedText style={styles.loadingText}>Cargando pacientes...</ThemedText>
                      </View>
                    ) : isError ? (
                      <View style={styles.centerContainer}>
                        <ThemedText style={styles.errorText}>Error al cargar pacientes</ThemedText>
                        <ThemedText style={styles.errorSubText}>{error?.message || 'Intenta nuevamente'}</ThemedText>
                      </View>
                    ) : (
                      <FlatList
                        data={pacienteFiltrado}
                        keyExtractor={(item: any) => item.usuario_id?.toString() ?? '0'}
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
                                🏠 Domicilio: {item.domicilio || 'No disponible'}
                              </ThemedText>
                              <ThemedText style={styles.pacienteTelefono}>
                                📞 Teléfono: {item.numero_telefono || 'No disponible'}
                              </ThemedText>

                              {/* Kits activos e historial (ellos internamente pueden scrollear si hace falta) */}
                              <RenderizarKitsAsignadosVistaDoctor pacienteId={item?.paciente_id || 0} />
                              <RenderizarHistorialKitsAsignados />
                            </View>
                          </View>
                        )}
                      />
                    )}
                  </View>
                </View>

                {/* --- COLUMNA DERECHA: Asignar kits --- */}
                <View style={[styles.rightColumn, isMobile && { width: '100%', marginTop: 20 }]}>
                  <View style={styles.sectionTitle}>
                    <ThemedText style={styles.sectionTitleText}>Asignar Kits</ThemedText>
                  </View>

                  {/* Igual que en DoctorScreen: contenedor con altura controlada */}
                  <View style={{ maxHeight: isMobile ? Math.floor(height * 0.2) : Math.floor(height * 0.4), overflow: 'hidden' }}>
                    <AsignarKitsScreenUser isAsigning paciente_id={Number(realPacienteId)} />
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
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  listContainer: {
    paddingBottom: 16,
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
