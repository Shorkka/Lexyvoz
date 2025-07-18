import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { router } from 'expo-router';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const { login } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '', tipo: '' });
  const [isPosting, setIsPosting] = useState(false);

  const onLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      return alert('Por favor ingrese su email y contraseña');
    }
    setIsPosting(true);
    const wasSuccessful = await login(email, password);
    setIsPosting(false);
    if (wasSuccessful) {
      router.replace('/(lexyvoz-app)/(home)');
    } else {
      alert('Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor}} >
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
          <View style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
          <ThemedText type="title" style={{ alignSelf: 'center', marginBottom: 10 }}>
            Lexyvoz
          </ThemedText>
          <ThemedBackground backgroundColor='#fff' align='center'>
            
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
            <ThemedButton onPress={onLogin} disabled={isPosting}>
              ingresar
            </ThemedButton>

            <View style={{ marginTop: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <ThemedText style={{ color: secondaryColor }}>¿No tienes una cuenta?</ThemedText>
                <ThemedLink href="/auth/register" style={{ marginLeft: 5 }}>
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
