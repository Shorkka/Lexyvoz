import { SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native'
import { useLocalSearchParams } from "expo-router";
import React from 'react'
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';

import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';



const KitList = () => {
  const { kitId } = useLocalSearchParams();
  const {user } = useAuthStore();
  const{ useKitsQuery } = useKitsStore();
  const backgroundColor = useThemeColor({}, 'background');
  const { data: kitsData, isLoading, isError, error } = useKitsQuery();
  if (isLoading){
    return (<ThemedText>Cargando...</ThemedText>
    )
  }
  if (isError){
    return (<ThemedText>Error: {String(error)}</ThemedText>
    )
  }
  const kits = kitsData?.data || [];
  console.log('Kits disponibles:', kits);
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
export default KitList