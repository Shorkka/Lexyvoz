import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import ThemedLoading from '@/presentation/theme/components/ThemedLoading';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';    
const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const { login, user } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '', tipo: '' });
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
    if (!wasSuccessful) {
      setLoginError('Lo siento, tu contraseña es incorrecta.');
    }

      const routeMap: Record<string, string> = {
        Paciente: '/(lexyvoz-app)/(paciente)/home',
        Doctor: '/(lexyvoz-app)/(doctor)/home',
        Usuario: '/(lexyvoz-app)/(usuario)/home',
      };
      const target = user?.tipo ? routeMap[user.tipo] : '/auth/login';
      router.replace(target as any);
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
