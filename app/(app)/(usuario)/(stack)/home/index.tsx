import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View } from 'react-native';


const HomePacienteScreen = () => {
  const { userType, userName} = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const next = () => {
    router.push('/ejercicios');
  }
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
          <View style={{ width: '100%' }}>
            <ThemedBackground backgroundColor="#fba557" align="center" fullHeight>
              
            <ThemedText type="welcome" style={{ 
              alignSelf: 'center', 
              color: '#000000',
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 30
            }}>
              Bienvenido {userName}
            </ThemedText>

            {userType === 'Paciente' ? (
              <View style={{ width: '100%' }}>
                {/* Kits Asignados */}
                <ThemedText style={{ 
                  color: '#000000', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginBottom: 10 
                }}>
                  Kits Asignados
                </ThemedText>
                
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 30 
                }}>
                  <ThemedBackground backgroundColor="white" style={{ 
                    borderRadius: 15, 
                    padding: 15,
                    flex: 1,
                    marginRight: 15
                  }}>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        gap: 10,
                        paddingHorizontal: 5
                      }}
                    >
                    </ScrollView>
                  </ThemedBackground>

                  <ThemedButton style={{ 
                    backgroundColor: '#ff8c00', 
                    paddingHorizontal: 25,
                    paddingVertical: 12,
                    borderRadius: 15
                  }}>
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
                      JUGAR
                    </ThemedText>
                  </ThemedButton>
                </View>

                {/* Historial */}
                <ThemedText style={{ 
                  color: '#000000', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginBottom: 10 
                }}>
                  Historial
                </ThemedText>
                
                <ThemedBackground backgroundColor="white" style={{ 
                  borderRadius: 15, 
                  padding: 15
                }}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: 10,
                      paddingHorizontal: 5
                    }}
                  >

                  </ScrollView>
                </ThemedBackground>
              </View>
            ) : (
            <View style={{ flex: 1, alignItems: 'center',  justifyContent: 'space-between' }}>
              <View >
                  <ThemedButton onPress={next}>
                    <ThemedText type="subtitle" style={{ padding: 20, alignSelf: 'center', color: 'white' }}>
                      Jugar
                    </ThemedText>
                  </ThemedButton>
                  </View>
                  <View style ={{marginTop: '30%'}}>
                  <ThemedButton 
                  style= {GlobalStyles.primaryButton}
                  onPress={() => router.push('/busqueda-doctores')}>

                    <ThemedText type="subtitle" style={{ color: 'white', padding: 20 }}>
                      Conectar con el Doctor
                    </ThemedText>
                  </ThemedButton>
                  </View>
                </View>
            )}
              </ThemedBackground>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
    </AuthGuard>
  )
};

export default HomePacienteScreen;