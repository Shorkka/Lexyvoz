import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import CardViewEditkits from '@/presentation/theme/components/CardViewEditkits';
import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import RenderizarPaciente from '@/presentation/theme/components/RenderizarPaciente';
import { router } from 'expo-router';
import { useDoctorPacienteStore } from '@/infraestructure/store/useDoctorPacienteStore';

const DoctorScreen = () => {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const [searchText, setSearchText] = React.useState('');
  
  const { usePacientesDeDoctorQuery } = useDoctorPacienteStore();
  console.log('Paciente ID en DoctorScreen:', user);
  const { 
    data: pacientesData, 
    isLoading, 
    isError,
    error
  } = usePacientesDeDoctorQuery(user?.doctor_id || 0);

  React.useEffect(() => {
    console.log('Datos de pacientes:', pacientesData);
    console.log('Error:', error);
  }, [pacientesData, error]);
  
  const pacientes = pacientesData?.data || [];

  // Función para navegar al perfil de un paciente específico
  const navigateToProfile = (pacienteId: number) => {
    router.push({
      pathname: '/(app)/(doctor)/(stack)/ver_perfil_usuario/[paciente_id]',
      params: { paciente_id: pacienteId.toString() }
    });
  };

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
            {/* Título de bienvenida */}
            <ThemedText type="welcome" style={styles.welcomeText}>
              Bienvenido {user?.sexo === 'Masculino' ? 'Doctor' : 'Doctora'} {user?.nombre}
            </ThemedText>

            {/* Contenedor principal de dos columnas */}
            <View style={styles.mainContainer}>
              
              {/* Columna izquierda: Búsqueda y pacientes */}
              <View style={styles.leftColumn}>
                <View style={styles.searchContainer}>
                  <ThemedTextInput
                    placeholder="Buscar paciente"
                    autoCapitalize="words"
                    icon="search"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                </View>

                <View style={styles.sectionTitle}>
                  <ThemedText style={styles.sectionTitleText}>Pacientes</ThemedText>
                </View>

                <View style={styles.pacientesContainer}>
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
                  ) : pacientes.length === 0 ? (
                    <View style={styles.centerContainer}>
                      <ThemedText style={styles.noPatientsText}>
                        No hay pacientes registrados
                      </ThemedText>
                    </View>
                  ) : (
                    <RenderizarPaciente
                      pacientes={pacientes}
                      searchText={searchText}
                      onPacientePress={navigateToProfile} 
                    />
                  )}
                </View>
              </View>

              {/* Columna derecha: Kits */}
              <View style={styles.rightColumn}>
                <View style={styles.sectionTitle}>
                  <ThemedText style={styles.sectionTitleText}>Kits</ThemedText>
                </View>
                <CardViewEditkits />
              </View>
            </View>

            {/* Botón fijo en la parte inferior */}
            <View style={styles.buttonContainer}>
              <ThemedButton
                onPress={() => router.push('/(app)/(doctor)/(stack)/add_paciente')}
              >
                <ThemedText style={styles.buttonText}>Añadir paciente</ThemedText>
              </ThemedButton>
            </View>
          </ThemedBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
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
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  pacientesContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: '60%',
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButton: {
    width: '100%',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
  noPatientsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DoctorScreen;