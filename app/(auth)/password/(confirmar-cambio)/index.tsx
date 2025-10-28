import { useAlert } from '@/presentation/hooks/useAlert';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfirmarAccion = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const { showAlert } = useAlert(); 
  const handleActualizar = () => {
    router.replace('/(auth)/password/(new-password)');
  };

  const handleCancelar = () => {
    showAlert('Ingresar sin actualizar contraseña', 'Serás redirigido a la página principal.', [
      { text: 'OK', onPress: () => router.replace('/(app)') }
    ]);
  };

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: backgroundColor }}
          contentContainerStyle={{
            minHeight: height,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,  
          }}
        >
          <ThemedText type="title" style={{ marginBottom: 10 }}>
            Lexyvoz
          </ThemedText>
          <ThemedBackground backgroundColor="#fff" align="center">
    
            <View style={{ width: '100%', marginTop: 12 }}>
          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>¿Deseas actualizar tu contraseña?</ThemedText>
          <ThemedText style={{ color: secondaryColor, alignSelf: 'center', marginBottom: 20, marginTop: 10 }}>
            Si continúas, podrás establecer una nueva contraseña para tu cuenta.
          </ThemedText>
          <View style={{  marginTop: 20 }}>
            <View style={{ marginBottom: 10 }}>
              <ThemedButton
                onPress={handleActualizar}
              >Sí, actualizar
              </ThemedButton>
            </View>
            <View style={{ marginBottom: 10 }}>
              <ThemedButton
                onPress={handleCancelar}
      
              >Ingresar sin actualizar contraseña
              </ThemedButton>
            </View>
          </View>
        </View>
          </ThemedBackground>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ConfirmarAccion;