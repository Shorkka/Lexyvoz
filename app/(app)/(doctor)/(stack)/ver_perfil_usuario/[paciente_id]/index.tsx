import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useLocalSearchParams } from 'expo-router';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import CardViewEditkits from '@/presentation/theme/components/CardViewEditkits';

import React from 'react';
import { useDoctorPacienteStore } from '@/infraestructure/store/useDoctorPacienteStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import RenderizarHistorialKitsAsignados from '@/presentation/theme/components/RenderizarHistorialKitsAsignados';
import RenderizarKitsAsignadosVistaDoctor from '@/presentation/theme/components/RenderizarKitsAsignadosVistaDoctor';

const AsignarKitsScreen = () => {
  const { paciente_id } = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  const { usePacientesDeDoctorQuery } = useDoctorPacienteStore();
  const {user} = useAuthStore();


  // Obtener pacientes
  const {
    data: pacientesData,
    isLoading,
    isError,
    error
  } = usePacientesDeDoctorQuery(user?.doctor_id);
  
  console.log('User en AsignarKitsScreen:', paciente_id);
  console.log('Domicilio del paciente:', pacientesData?.data?.map(p => p.domicilio));
  // Ajusta esto según la estructura real de tu respuesta API
  const pacientes = pacientesData?.data || [];
  const pacienteFiltrado = pacientes.filter(
    (p) => String(p.usuario_id) === String(paciente_id)
  );
  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView>
          <ThemedBackground
            justifyContent="space-between"
            fullHeight
            backgroundColor="#fba557"
            style={[GlobalStyles.orangeBackground, { padding: 16 }]}
          >
            {/* Título */}
            <ThemedText type="title" style={styles.title}>
              Perfil del Paciente
            </ThemedText>
            
            {/* Contenedor Principla de las dos columnas */}
            <View style={styles.mainContainer}>

            {/* Lista de pacientes */}
            <View style={styles.leftColumn}>
                <View style={styles.sectionTitle}>
                  <ThemedText style={styles.sectionTitleText}>Datos del paciente</ThemedText>
                </View>
              <View style = {styles.pacientesContainer}>
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
                  keyExtractor={(item) => item.usuario_id?.toString() ?? 0}
                  contentContainerStyle={styles.listContainer}
                  renderItem={({ item }) => (
                    <View style={styles.pacienteCard}>
                      <View style={styles.pacienteInfo}>
                        <ThemedText style={styles.pacienteNombre}>
                          {item.imagen_url || 'No disponible'} Nombre: {item.nombre || 'No disponible'}
                        </ThemedText>
                        <ThemedText style={styles.pacienteEmail}>
                          📧 Email: {item.correo || item.correo || 'No disponible'}
                        </ThemedText>
                        <ThemedText style={styles.pacienteDomicilio}>
                          🏠 Domicilio: {item.domicilio || 'No disponible'}
                        </ThemedText>
                        <ThemedText style={styles.pacienteTelefono}>
                          📞 Teléfono: {item.numero_telefono || item.numero_telefono || 'No disponible'}
                        </ThemedText>
                        <ThemedText style={styles.pacienteId}>
                        </ThemedText>
                        <RenderizarKitsAsignadosVistaDoctor 
                          pacienteId={Number(item?.usuario_id) || 0}
                        />
                        <RenderizarHistorialKitsAsignados/>
           
                      </View>  
                      
                    </View>
                  )}
                />
              )}
            </View>
            </View>
                <View style={styles.rightColumn}>
                  <View style={styles.sectionTitle}>
                  <ThemedText style={styles.sectionTitleText}>Asignar Kits</ThemedText>
                </View>
                <CardViewEditkits />
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
  debugText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  pacienteId: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  pacientesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
    leftColumn: {
    width: '58%',
    flexDirection: 'column',
  },
  rightColumn: {
    width: '40%',
    flexDirection: 'column',
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
    sectionTitle: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    paddingBottom: 5,
  },
  pacienteInfo: {
    marginBottom: 12,
  },
    sectionTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 14,
  },
  noPacientesText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
    mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default AsignarKitsScreen;