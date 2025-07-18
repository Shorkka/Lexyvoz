import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';

const RecoveryScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const [form, setForm] = useState({
    email: ''
  });
  const [isPosting, setIsPosting] = useState(false);

  const onSendRecovery = async () => {
    const { email } = form;
    if (email.length === 0) {
      return Alert.alert('Por favor ingresa tu email');
    }
    setIsPosting(true);
    // Aquí deberías llamar a lu API para enviar el correo de recuperación
    // await sendRecoveryEmail(email);
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert('Si el correo existe, se ha enviado un código de recuperación');
      router.replace('/auth/login');
    }, 1500);
  };



  return (
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
      <View style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
       <ThemedText type="title" style={{ alignSelf: 'center', marginBottom: 10 }}>
                  Lexyvoz
                </ThemedText>
        <ThemedBackground backgroundColor='#fff' align='center'>

          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>Recuperar contraseña</ThemedText>
          <ThemedText style={{ color: secondaryColor, alignSelf: 'center' }}>Mandame un código de restauración</ThemedText>
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
            />
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
            <ThemedLink href='/auth/recover/confirmar_accion' style={{ marginHorizontal: 5 }}>
              Iniciar sesión
            </ThemedLink>
          </View>
            </ThemedBackground>

          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RecoveryScreen