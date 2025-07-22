import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import ThemedLoading from '@/presentation/theme/components/ThemedLoading';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  console.log('LoginScreen rendered');
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const { login } = useAuthStore();

  const [form, setForm] = useState({ email: 'yaredaraujo20@gamil.com', password: 'IsaacSk206_' });
  const [isPosting, setIsPosting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onLogin = async () => {
   
    const { email, password } = form;
    setLoginError('');
    if (!email || !password) {
      return alert('Por favor ingrese su email y contraseña');
    }
    setIsPosting(true);
    const wasSuccessful = await login(email, password);
    setIsPosting(false);
    console.log('Login fue exitoso?', wasSuccessful);
    if (wasSuccessful) {
      router.replace('/(lexyvoz-app)');
    } else {
      setLoginError('Lo siento, tu contraseña es incorrecta.');
    }
  };

  const isLoginDisabled =
    isPosting ||
    !form.email ||
    !form.password ||
    form.password.length < 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          style={{ flex: 1, backgroundColor: backgroundColor }}
          contentContainerStyle={{
            minHeight: height,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >

          {/* Prubea de login sin backend */}
        <ThemedButton
        onPress={() => {
          // Cambia aquí el rol que quieres probar: 'doctor' | 'paciente' | 'usuario'
          useAuthStore.getState().simulateLogin('Doctor');
          router.push('/(lexyvoz-app)');
        }}
        style={{ marginTop: 20 }}
      >
        Simular login como doctor
      </ThemedButton>
            <ThemedButton
        onPress={() => {
          // Cambia aquí el rol que quieres probar: 'doctor' | 'paciente' | 'usuario'
          useAuthStore.getState().simulateLogin('Paciente');
          router.push('/(lexyvoz-app)');
        }}
        style={{ marginTop: 20 }}
      >
        Simular login como Paciente
      </ThemedButton>
            <ThemedButton
        onPress={() => {
          // Cambia aquí el rol que quieres probar: 'doctor' | 'paciente' | 'usuario'
          useAuthStore.getState().simulateLogin('Usuario');
          router.push('/(lexyvoz-app)');
        }}
        style={{ marginTop: 20 }}
      >
        Simular login como Usuario
      </ThemedButton>
          <View style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
            <ThemedBackground backgroundColor="#fff" align="center">
              <View style={{ paddingHorizontal: 30, paddingVertical: 40 }}>
                <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>
                  Inicia sesión
                </ThemedText>
                <ThemedText style={{ color: secondaryColor, alignSelf: 'center', marginBottom: 30 }}>
                  Por favor ingrese para continuar
                </ThemedText>

                <ThemedText>Correo</ThemedText>
                <ThemedTextInput
                  placeholder="correo@ejemplo.com"
                  icon="mail-outline"
                  style={{
                    borderBottomWidth: 1,
                    borderColor: 'grey',
                    paddingVertical: 10,
                    fontSize: 16,
                  }}
                  value={form.email}
                  onChangeText={(value) => setForm({ ...form, email: value })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <ThemedText style={{ marginTop: 20 }}>Contraseña</ThemedText>
                <ThemedTextInput
                  placeholder="***********"
                  icon="lock-closed-outline"
                  style={{
                    borderBottomWidth: 1,
                    borderColor: 'grey',
                    paddingVertical: 10,
                    fontSize: 16,
                  }}
                  secureTextEntry
                  value={form.password}
                  onChangeText={(value) => setForm({ ...form, password: value })}
                  autoCapitalize="none"
                />

                <View style={{ marginTop: 30 }} />
                <ThemedButton
                  onPress={onLogin}
                  disabled={isLoginDisabled}
                  backgroundColor={
                    form.password.length < 6 || form.email.length < 1
                      ? '#974525ff'
                      : undefined
                  }
                >
                  {isPosting ? <ThemedLoading size={24} color="#fff" /> : 'ingresar'}
                </ThemedButton>
                {loginError ? (
                  <ThemedText style={{ color: '#c2410c', marginTop: 5, textAlign: 'center' }}>
                    {loginError}
                  </ThemedText>
                ) : null}

                <View style={{ marginTop: 30 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemedText style={{ color: secondaryColor }}>¿No tienes una cuenta?</ThemedText>
                    <ThemedLink href="/auth/register/registerStep1" style={{ marginLeft: 5 }}>
                      Crear cuenta
                    </ThemedLink>
                  </View>
                  <View style={{ marginTop: 5, alignItems: 'center' }}>
                    <ThemedLink href="/auth/recover">¿Olvidaste tu contraseña?</ThemedLink>
                  </View>
                </View>
              </View>
            </ThemedBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
