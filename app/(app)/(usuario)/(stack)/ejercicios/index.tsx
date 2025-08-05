import {KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native'
import AuthGuard from '@/presentation/theme/components/AuthGuard'
import ThemedBackground from '@/presentation/theme/components/ThemedBackground'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor'
import RenderKits from '@/presentation/theme/components/RenderKits'


const EjerciciosKits = () => {

  const backgroundColor = useThemeColor({}, 'background');


  return (
    <AuthGuard>
    <SafeAreaView style={{ flex: 1 }}>
       <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
              style={{ flex: 1, backgroundColor: backgroundColor }}
            >
            <ThemedBackground 
              justifyContent='flex-start'
              fullHeight 
              backgroundColor="#fba557" style={{ 
            width: '100%', 
            borderRadius: 20, 
            padding: 30,
            alignItems: 'center'
          }}>
            <RenderKits/>
          </ThemedBackground>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AuthGuard>
  )
}

export default EjerciciosKits
