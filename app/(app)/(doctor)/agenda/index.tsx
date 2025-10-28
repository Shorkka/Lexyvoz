import { View, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import ThemedBackground from '@/presentation/theme/components/ThemedBackground'
import AuthGuard from '@/presentation/theme/components/AuthGuard'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  const backgroundColor = '#fff';
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
        <View style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
          <ThemedText type = "title" style={{ alignSelf: 'center', marginTop: 20 }}>Lexyvoz</ThemedText>
            <ThemedBackground backgroundColor="#fff" align="center">
              <ThemedText type="subtitle">Agenda</ThemedText>
            </ThemedBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AuthGuard>
  )
}

export default index