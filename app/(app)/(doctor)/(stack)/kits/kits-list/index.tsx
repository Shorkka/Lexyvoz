import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';



const KitList = () => {
  const { kitId } = useLocalSearchParams();
  const{ useKitsQuery } = useKitsStore();
  const backgroundColor = useThemeColor({}, 'background');
  const { data: isLoading, isError, error } = useKitsQuery();
  if (isLoading){
    return (<ThemedText>Cargando...</ThemedText>
    )
  }
  if (isError){
    return (<ThemedText>Error: {String(error)}</ThemedText>
    )
  }
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