import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from 'react-native';

const ConfirmarAccion = () => {
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');

  const getResponsivePadding = (value: number, base: number ) => {
    if (Platform.OS === 'web') { 
      return Math.min(width * 0.3, value);
    } else {
      const basePadding = width * 0.1; 
      return Math.max(16, Math.min(basePadding, base)); 
    }
  };

  const handleActualizar = () => {
    router.replace('/auth/recover/nuevo_password');
  };

  const handleCancelar = () => {
    Alert.alert('Operación cancelada', 'Serás redirigido a la página principal.', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: backgroundColor,
          flex: 1,
          paddingHorizontal: getResponsivePadding(700, 30),
          alignContent: 'center',
        }}>
        <View style={{ paddingTop: height * 0.30 }}>
          <ThemedBackground />
          <ThemedText type="title" style={{ alignSelf: 'center', top: height * 0.06, position: 'absolute' }}>Lexyvoz</ThemedText>
          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>¿Deseas actualizar tu contraseña?</ThemedText>
          <ThemedText style={{ color: secondaryColor, alignSelf: 'center', marginBottom: 20, marginTop: 10 }}>
            Si continúas, podrás establecer una nueva contraseña para tu cuenta.
          </ThemedText>
          <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <ThemedButton
              onPress={handleActualizar}
              style={{ marginHorizontal: 10 }}
            >
              Sí, actualizar
            </ThemedButton>
            <ThemedButton
              onPress={handleCancelar}
              style={{ marginHorizontal: 10 }}
          
            >
              No, regresar
            </ThemedButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ConfirmarAccion;