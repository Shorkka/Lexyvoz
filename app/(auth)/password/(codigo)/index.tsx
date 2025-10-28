import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CodigoRecuperacionScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const [code, setCode] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const onSubmitCode = async () => {
    if (!code) {
      return Alert.alert('Ingresa el código de recuperación');
    }
    setIsPosting(true);
    // validar el código con  backend
    setTimeout(() => {
      setIsPosting(false);
      // Si el código es válido, navega a la pantalla de confirmación
      router.replace('/(auth)/password/(confirmar-cambio)');
    }, 1200);
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
          <ThemedText type="title" style={{ alignSelf: 'center', marginTop: 20 }}>Lexyvoz</ThemedText>
          <ThemedBackground backgroundColor="#fff" align="center">
            <View style={{ width: '100%', marginTop: 12 }}>
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
        </View>
      </ThemedBackground>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default CodigoRecuperacionScreen;
