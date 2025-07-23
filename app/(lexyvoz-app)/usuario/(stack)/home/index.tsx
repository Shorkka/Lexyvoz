import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView,  View } from 'react-native';
import { useThemeColor } from '../../../../../presentation/theme/hooks/useThemeColor';


const HomePacienteScreen = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const {user} = useAuthStore();
 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View
              style={{ flex: 1, backgroundColor: backgroundColor }}
            >
              <ThemedBackground backgroundColor="#fba557" style={{ 
            width: '100%', 
            borderRadius: 20, 
            padding: 30,
            alignItems: 'center'
          }}>
            <ThemedText type="welcome" style={{ 
              alignSelf: 'center', 
              color: '#000000',
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 30
            }}>
              Bienvenido
            </ThemedText>

            {user?.tipo === 'Paciente' ? (
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
                      <ThemedButton style={{ 
                        backgroundColor: '#e5e5e5', 
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        borderRadius: 10,
                        minWidth: 60
                      }}>
                        <ThemedText style={{ color: '#000000', fontSize: 14 }}>
                          Kit 2
                        </ThemedText>
                      </ThemedButton>
                      
                      <ThemedButton style={{ 
                        backgroundColor: '#fba557', 
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        borderRadius: 10,
                        minWidth: 60
                      }}>
                        <ThemedText style={{ color: '#000000', fontSize: 14 }}>
                          Kit 3
                        </ThemedText>
                      </ThemedButton>
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
                    <ThemedButton style={{ 
                      backgroundColor: '#e5e5e5', 
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      borderRadius: 10,
                      minWidth: 60
                    }}>
                      <ThemedText style={{ color: '#000000', fontSize: 14 }}>
                        Kit 1
                      </ThemedText>
                    </ThemedButton>
                    
                    <ThemedButton style={{ 
                      backgroundColor: '#e5e5e5', 
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      borderRadius: 10,
                      minWidth: 60
                    }}>
                      <ThemedText style={{ color: '#000000', fontSize: 14 }}>
                        Kit 4
                      </ThemedText>
                    </ThemedButton>
                    
                    <ThemedButton style={{ 
                      backgroundColor: '#e5e5e5', 
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      borderRadius: 10,
                      minWidth: 60
                    }}>
                      <ThemedText style={{ color: '#000000', fontSize: 14 }}>
                        Kit 5
                      </ThemedText>
                    </ThemedButton>
                  </ScrollView>
                </ThemedBackground>
              </View>
            ) : (
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 20 }}>
                <View>
                <ThemedButton>
                  <ThemedText type="subtitle" style={{ alignSelf: 'center', marginBottom: 20, color: 'white' }}>
                    Jugar
                  </ThemedText>
                </ThemedButton>
                </View>
                <View style={{ marginTop: '80%' }}>
                <ThemedButton>
                  <ThemedText type="subtitle" style={{ alignSelf: 'center', marginBottom: 20, color: 'white' }}>
                    Conectar con el Doctor
                  </ThemedText>
                </ThemedButton>
                </View>
              </View>
            )}
          </ThemedBackground>
            </View>
          </KeyboardAvoidingView>
    </SafeAreaView>
  )
};

export default HomePacienteScreen;