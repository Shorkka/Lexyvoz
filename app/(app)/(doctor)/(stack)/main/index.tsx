import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useDoctorPacienteStore } from '@/infraestructure/store/useDoctorPacienteStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import CardViewEditkits from '@/presentation/theme/components/CardViewEditkits';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import RenderizarPaciente from '@/presentation/theme/components/RenderizarPaciente';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { router } from 'expo-router';
import Hashids from "hashids";
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
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
          contentContainerStyle={{ flexGrow: 1}} 
        >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ThemedBackground
         
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
                <View 
                  style={{ maxHeight: isMobile ? height * 0.25 : height * 0.4 }}
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
                </View>
              </View>

              {/* Columna derecha: Kits */}
              <View style={[styles.rightColumn, isMobile && { width: '100%', marginTop: 20 }]}>
               <View>
                  <ThemedText style={styles.sectionTitleText}>Kits</ThemedText>
                </View>

                {/* Scroll interno para Kits */}
                <View>
                  <CardViewEditkits  maxHeight={isMobile ? Math.floor(height * 0.2) : Math.floor(height * 0.4)}/>
                </View>

              </View>
            </View>

     {/* Botón global al final (sin flotar) */}
              <View style={[styles.buttonContainer, { position: 'relative'}]}>
                <ThemedButton
                  style={{
                    // ↓ No lo “flotes” sobre otros (elevation bajo)
                    ...Platform.select({
                      android: { elevation: 1 },
                      ios:     { shadowOpacity: 0.12 },
                      web:     { boxShadow: '0 1px 4px rgba(0,0,0,.12)' },
                    }),
                  }}
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
    width: '100%',
    backgroundColor: '#ee7200',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    position: 'relative'
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
