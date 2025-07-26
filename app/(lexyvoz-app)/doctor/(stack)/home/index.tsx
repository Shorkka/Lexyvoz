import { View, KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor'
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import AuthGuard from '@/presentation/theme/components/AuthGuard';

const DoctorScreen = () => {
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <AuthGuard>
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          style={{ flex: 1, backgroundColor: backgroundColor }}
        >
          <ThemedBackground backgroundColor="#fba557" style={{ 
            borderRadius: 20, 
            alignItems: 'center',
          }}> 
          <View>
            <ThemedText type="welcome" style={{ 
              alignSelf: 'center', 
              color: '#000000',
              fontSize: 32,
            }}>
              Bienvenido Doctor
            </ThemedText>
            <View style={{alignItems: 'flex-start'}}>
              <ThemedText style={{ color: '#fff', fontSize: 24,}}>Pacientes</ThemedText>

            </View>
          </View>
          </ThemedBackground> 
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AuthGuard>
  )
}

export default DoctorScreen