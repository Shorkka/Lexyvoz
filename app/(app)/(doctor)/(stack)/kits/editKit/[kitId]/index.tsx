import { SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native'
import { useLocalSearchParams } from "expo-router";
import React from 'react'
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';

import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';

const KitEditScreen = () => {
  const { kitId } = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  return (
  <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView>
          <ThemedBackground
            justifyContent="space-between"
            fullHeight
            backgroundColor="#fba557"
            style={[ { padding: 16 }]}
          >
            <ThemedText>Editar Kit</ThemedText>
            <ThemedText>ID del Kit: {kitId}</ThemedText>
          </ThemedBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </AuthGuard>
  )
}

export default KitEditScreen