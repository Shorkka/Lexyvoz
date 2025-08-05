import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import CardViewEditkits from '@/core/kits/CardViewEditkits';
import RenderizarPaciente from '@/core/kits/RenderizarPaciente';
import { GlobalStyles } from '@/assets/styles/GlobalStyles';


const DoctorScreen = () => {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const [form, setForm] = React.useState({ busqueda: '' });

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            contentContainerStyle={GlobalStyles.scrollContent} 
          >
            <ThemedBackground
              justifyContent="space-between"
              fullHeight
              backgroundColor="#fba557"
              style={GlobalStyles.orangeBackground}
            >
              {/* Contenido superior (título + búsqueda) */}
              <View>
                <ThemedText type="welcome" style={styles.welcomeText}>
                  Bienvenido {user?.sexo === 'Masculino' ? 'Doctor' : 'Doctora'} {user?.nombre}
                </ThemedText>

                <ScrollView style={{ flexDirection: 'row', width: '100%', height: '10%' }} horizontal >
                  <View style={{ width: '90%'}}>
                    <ThemedTextInput
                      placeholder="Buscar paciente"
                      autoCapitalize="words"
                      icon="search"
                      style={styles.searchInput}
                      value={form.busqueda}
                      onChangeText={(value) => setForm({ ...form, busqueda: value })}
                    />

                    <RenderizarPaciente
                      searchText={form.busqueda}
                    />
                      
                  </View>
                <CardViewEditkits />
                </ScrollView>
              </View>

              {/* Botón fijo en la parte inferior DEL BACKGROUND NARANJA */}
              <View style={styles.buttonContainer}>
                <ThemedButton
                  onPress={() => console.log('Añadir paciente')}
                  style={styles.addButton}
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
    fontSize: 32,
    marginBottom: 20,
  },
  searchInput: {
    alignContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
    width: '50%',
    backgroundColor: '#ee7200', 
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '100%',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default DoctorScreen;