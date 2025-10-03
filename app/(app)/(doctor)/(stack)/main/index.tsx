import { 
  View, 
  useWindowDimensions, 
  KeyboardAvoidingView, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
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
import Hashids from "hashids";
const DoctorScreen = () => {
  const hashids = new Hashids("mi-secreto", 10);
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768; // breakpoint simple
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const [searchText, setSearchText] = React.useState('');
  
  const { usePacientesDeDoctorQuery } = useDoctorPacienteStore();
  const { 
    data: pacientesData, 
    isLoading, 
    isError,
    error
  } = usePacientesDeDoctorQuery(user?.doctor_id || 0);

  const pacientes = pacientesData?.data || [];

  const navigateToProfile = (pacienteId: number) => {
    const encodedId = hashids.encode(pacienteId);
    router.push({
      pathname: '/(app)/(doctor)/(stack)/ver_perfil_usuario/[paciente_id]',
      params: { paciente_id: encodedId  }
    });
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground
            fullHeight
            backgroundColor="#fba557"
            style={[GlobalStyles.orangeBackground, { padding: 16, flex: 1, justifyContent: "space-between" }]}
          >
            {/* Título */}
            <ThemedText type="welcome" style={styles.welcomeText}>
              Bienvenido {user?.sexo === 'Masculino' ? 'Doctor' : 'Doctora'} {user?.nombre}
            </ThemedText>

            {/* Contenedor principal */}
            <View style={[styles.mainContainer, isMobile && { flexDirection: 'column' }]}>
              
              {/* Columna izquierda: Pacientes */}
              <View style={[styles.leftColumn, isMobile && { width: '100%' }]}>
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

                {/* Scroll interno para pacientes */}
                <ScrollView 
                  style={{ maxHeight: isMobile ? height * 0.25 : height * 0.4 }}
                  nestedScrollEnabled
                >
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
                  ) : pacientes.length === 0 ? (
                    <View style={styles.centerContainer}>
                      <ThemedText style={styles.noPatientsText}>No hay pacientes registrados</ThemedText>
                    </View>
                  ) : (
                    <RenderizarPaciente
                      pacientes={pacientes}
                      searchText={searchText}
                      onPacientePress={navigateToProfile} 
                    />
                  )}
                </ScrollView>
              </View>

              {/* Columna derecha: Kits */}
              <View style={[styles.rightColumn, isMobile && { width: '100%', marginTop: 20 }]}>
                <View style={styles.sectionTitle}>
                  <ThemedText style={styles.sectionTitleText}>Kits</ThemedText>
                </View>

                {/* Scroll interno para Kits */}
                <View style={[styles.kitsContainer, { maxHeight: isMobile ? height * 0.3 : height * 0.45 }]}>
                  <CardViewEditkits/>
                </View>
              </View>
            </View>

            {/* Botón global fijo */}
            <View style={styles.buttonContainer}>
              <ThemedButton
                onPress={() => router.push('/(app)/(doctor)/(stack)/add_paciente')}
              >
                <ThemedText style={styles.buttonText}>Añadir paciente</ThemedText>
              </ThemedButton>
            </View>
          </ThemedBackground>
        </KeyboardAvoidingView>
        </ScrollView>
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
    marginBottom: 10,
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
  kitsContainer: {
    flex: 1,
  },
});

export default DoctorScreen;
