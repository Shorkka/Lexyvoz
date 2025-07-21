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
  const errorColor = useThemeColor({}, 'error');
  const { login, user } = useAuthStore();

  const [form, setForm] = useState({ email: 'yaredaraujo20@gmail.com', password: 'IsaacSk206_' });
  const [isPosting, setIsPosting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!form.email) {
      errors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    if (!form.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const onLogin = async () => {
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }

    setIsPosting(true);
    try {
      const wasSuccessful = await login(form.email, form.password);
      
      if (!wasSuccessful) {
        setLoginError('Credenciales incorrectas. Por favor verifique su email y contraseña.');
        return;
      }

      const routeMap: Record<string, string> = {
        Paciente: '/(lexyvoz-app)/(paciente)/home',
        Doctor: '/(lexyvoz-app)/(doctor)/home',
        Usuario: '/(lexyvoz-app)/(usuario)/home',
      };
      
      if (!user?.tipo) {
        setLoginError('No se pudo determinar el tipo de usuario. Contacte al administrador.');
        return;
      }

      const target = routeMap[user.tipo];
      if (!target) {
        setLoginError('Tipo de usuario no válido. Contacte al administrador.');
        return;
      }

      router.replace(target as any);
    } catch (error) {
      console.error('Error en el login:', error);
      setLoginError('Ocurrió un error inesperado. Por favor intente nuevamente.');
    } finally {
      setIsPosting(false);
    }
  };

  const isLoginDisabled = isPosting;

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
                    borderColor: inputErrors.email ? errorColor : 'grey',
                    paddingVertical: 10,
                    fontSize: 16,
                  }}
                  value={form.email}
                  onChangeText={(value) => {
                    setForm({ ...form, email: value });
                    setInputErrors({ ...inputErrors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {inputErrors.email ? (
                  <ThemedText style={{ color: errorColor, fontSize: 12, marginTop: 4 }}>
                    {inputErrors.email}
                  </ThemedText>
                ) : null}

                <ThemedText style={{ marginTop: 20 }}>Contraseña</ThemedText>
                <ThemedTextInput
                  placeholder="***********"
                  icon="lock-closed-outline"
                  style={{
                    borderBottomWidth: 1,
                    borderColor: inputErrors.password ? errorColor : 'grey',
                    paddingVertical: 10,
                    fontSize: 16,
                  }}
                  secureTextEntry
                  value={form.password}
                  onChangeText={(value) => {
                    setForm({ ...form, password: value });
                    setInputErrors({ ...inputErrors, password: '' });
                  }}
                  autoCapitalize="none"
                />
                {inputErrors.password ? (
                  <ThemedText style={{ color: errorColor, fontSize: 12, marginTop: 4 }}>
                    {inputErrors.password}
                  </ThemedText>
                ) : null}

                <View style={{ marginTop: 30 }} />
                <ThemedButton
                  onPress={onLogin}
                  disabled={isLoginDisabled}
                  backgroundColor={
                    isLoginDisabled ? '#974525ff' : undefined
                  }
                >
                  {isPosting ? <ThemedLoading size={24} color="#fff" /> : 'Ingresar'}
                </ThemedButton>
                
                {loginError ? (
                  <ThemedText 
                    style={{ 
                      color: errorColor, 
                      marginTop: 15, 
                      textAlign: 'center',
                      padding: 10,
                      backgroundColor: '#fff0f0',
                      borderRadius: 5
                    }}
                  >
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