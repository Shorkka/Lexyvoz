
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlert } from '@/presentation/hooks/useAlert';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const RecoveryScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const { resetPassword } = useAuthStore();
  const [form, setForm] = useState({
    email: ''
  });
  const [error, setError] = useState({
    email: ''
  })

  
  const [isPosting, setIsPosting] = useState(false);
  const showAlert = useAlert();
  const onSendRecovery = async () => {
    const newError = {
      email: '',
    };
    const { email } = form;
    let hasError = false;
    if (email.length === 0) {
      newError.email = 'Por favor ingresa tu email';
      setError(newError);
      hasError = true;
    }
    if (hasError) {
      setError(newError);
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    setIsPosting(true);
      try {
      const success = await resetPassword(email);
      if (success) {
        showAlert.showAlert(
          'Código',
          'Si el correo existe, se ha enviado un código de recuperación',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      } else {
        showAlert.showAlert(
          'Error',
          'No se pudo enviar el correo de recuperación. Intenta más tarde.',
          [{ text: 'OK' }]
        );
      }
  } catch (error) {
    console.error(error);
    showAlert.showAlert(
      'Error',
      'Hubo un problema con el servidor.',
      [{ text: 'OK' }]
    );
  } finally {
    setIsPosting(false);
  }
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
          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>Recuperar contraseña</ThemedText>
          <ThemedText style={{ color: secondaryColor, alignSelf: 'center' }}>Mandar un código de restauración</ThemedText>
          {/* Email */}
          <View style={{ marginTop: 20 }}>
            <ThemedText>Email</ThemedText>
            <ThemedTextInput
              placeholder="correo@ejemplo.com"
              style={{
                borderBottomWidth: 1,
                borderColor: 'grey',
                paddingVertical: 10,
                fontSize: 16,
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              icon="mail-outline"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />   {error.email ? (
                            <ThemedText type="error" style={{ marginTop: 4 }}>
                              {error.email}
                            </ThemedText>
                          ) : null}
          </View>
          <View style={{ marginTop: 10 }} />
          <ThemedButton
            onPress={onSendRecovery}
            disabled={isPosting}
          >
           Enviar código
          </ThemedButton>
          <View style = {{flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText style={{ color: secondaryColor }}>¿Recordaste la contraseña?</ThemedText>
            <ThemedLink href='/login' style={{ marginHorizontal: 5 }}>
              Iniciar sesión
            </ThemedLink>
          </View>
          </View>
        </ThemedBackground>

      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default RecoveryScreen
