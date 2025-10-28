import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Text} from 'react-native';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import { useRegisterStore } from '@/core/auth/context/RegisterContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lista única de dominios permitidos
const validDomains = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'alumnos.udg.mx',
  'udg.mx',
  'protonmail.com'
];

const Step1Screen = () => {
  const set = useRegisterStore((s) => s.set);
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
  });

  const isLoginDisabled =
    !form.nombre ||
    !form.email ||
    !form.password ||
    form.password.length < 6;

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Ingresa una dirección de correo electrónico válida';
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) return 'Ingresa una dirección de correo electrónico válida';

    const domain = email.split('@')[1]?.toLowerCase();
    if (!validDomains.includes(domain)) {
      return `El dominio del correo (${domain}) no es válido`;
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password || password.length < 6) {
      return 'Crea una contraseña de al menos 6 caracteres de largo';
    }
    return '';
  };

  const onRegister = () => {
    const newErrors = {
      nombre: !form.nombre.trim() ? 'El nombre es obligatorio' : '',
      correo: validateEmail(form.email),
      contraseña: validatePassword(form.password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) return;

    set({ nombre: form.nombre, correo: form.email, contrasenia: form.password });
    router.push('/(auth)/registro/(registroPaso2)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            justifyContent: 'center',
          }}
        >
          <ProgressHeader step={1} />
          <ThemedBackground backgroundColor="#fff" align="center">
            <ThemedText type="subtitle" style={{ marginBottom: 8, textAlign: 'center' }}>
              Registro de usuario
            </ThemedText>

            <View style={{ width: '100%', gap: 12 }}>
              <View>
                <ThemedText>Nombre completo</ThemedText>
                <ThemedTextInput
                  placeholder="Nombre completo"
                  autoCapitalize="words"
                  icon="person-circle-outline"
                  value={form.nombre}
                  onChangeText={(value) => setForm({ ...form, nombre: value })}
                />
              </View>

              <View>
                <ThemedText>Correo electrónico</ThemedText>
                <ThemedTextInput
                  placeholder="correo@ejemplo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  icon="mail-outline"
                  value={form.email}
                  onChangeText={(value) => {
                    setForm({ ...form, email: value });
                    setErrors((prev) => ({ ...prev, correo: '' }));
                  }}
                  error={!!errors.correo}
                  errorMessage={errors.correo}
                />
              </View>

              <View>
                <ThemedText>Contraseña</ThemedText>
                <ThemedTextInput
                  placeholder="***********"
                  autoCapitalize="none"
                  secureTextEntry
                  icon="lock-closed-outline"
                  value={form.password}
                  onChangeText={(value) => {
                    setForm({ ...form, password: value });
                    setErrors((prev) => ({ ...prev, contraseña: '' }));
                  }}
                  error={!!errors.contraseña}
                  errorMessage={errors.contraseña}
                />
              </View>
            </View>

            <View style={{ marginVertical: 32, width: '100%' }}>
              <ThemedButton
                icon="arrow-forward"
                onPress={onRegister}
                disabled={isLoginDisabled}
                backgroundColor={
                  form.password.length < 6 || form.email.length < 1 || form.nombre.length < 3
                    ? '#974525ff'
                    : undefined
                }
              >
                Siguiente
              </ThemedButton>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText style={{ color: secondaryColor }}>¿Ya tienes una cuenta?</ThemedText>
              <ThemedLink href="/login" style={{ marginLeft: 6 }}>
                <Text>Iniciar sesión</Text>
              </ThemedLink>
            </View>
          </ThemedBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Step1Screen;
