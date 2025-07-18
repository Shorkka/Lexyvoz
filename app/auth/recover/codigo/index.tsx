import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from 'react-native';

const CodigoRecuperacionScreen = () => {
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const [code, setCode] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const onSubmitCode = async () => {
    if (!code) {
      return Alert.alert('Ingresa el código de recuperación');
    }
    setIsPosting(true);
    // Aquí deberías validar el código con tu backend
    setTimeout(() => {
      setIsPosting(false);
      // Si el código es válido, navega a la pantalla de confirmación
      router.replace('/auth/recover/confirmar_accion');
    }, 1200);
  };

  const getResponsivePadding = (value: number, base: number ) => {
    if (Platform.OS === 'web') { 
      return Math.min(width * 0.3, value);
    } else {
      const basePadding = width * 0.1; 
      return Math.max(16, Math.min(basePadding, base)); 
    }
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
          <ThemedBackground backgroundColor='#fff' align='center'>
          <ThemedText type="title" style={{ alignSelf: 'center', top: height * 0.06, position: 'absolute' }}>Lexyvoz</ThemedText>
          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>Ingresa tu código</ThemedText>
          <ThemedText style={{ color: secondaryColor, alignSelf: 'center' }}>Introduce el código que recibiste por correo</ThemedText>
          <View style={{ marginTop: 20 }}>
            <ThemedText>Código</ThemedText>
            <ThemedTextInput
              placeholder="Código de recuperación"
              style={{
                borderBottomWidth: 1,
                borderColor: 'grey',
                paddingVertical: 10,
                fontSize: 16,
              }}
              autoCapitalize="none"
              keyboardType="default"
              value={code}
              onChangeText={setCode}
            />
          </View>
          <View style={{ marginTop: 10 }} />
          <ThemedButton
            onPress={onSubmitCode}
            disabled={isPosting}
          >
            Validar código
          </ThemedButton>
          </ThemedBackground>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default CodigoRecuperacionScreen;
