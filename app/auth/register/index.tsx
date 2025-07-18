import React, { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';

import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import { router } from 'expo-router';
import FieldLabel from '@/presentation/theme/components/FieldLabel';

const Step1Screen = () => {
  const { height } = useWindowDimensions();
  
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');

  const [form, setForm] = useState({
    nombre: 'Yared Isaac Araujo Barron',
    email: 'yaredaraujo20@gmail.com',
    password: 'yared909',
  });
  const [errors, setErrors] = useState({
    nombre: false,
    email: false,
    password: false,
  });
  const onRegister = () => {
    const { email, nombre, password } = form;
    const newErrors = {
      nombre: !nombre.trim(),
      email: !email.trim(),
      password: password.length <= 6,
    };
  setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) {
      return alert('Por favor, completa correctamente los campos obligatorios.');
    }
    

    return router.push('/auth/register/registerStep2');
      
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            minHeight: height,
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
                <FieldLabel label="Nombre completo" required showError={errors.nombre} />
                <ThemedTextInput
                  placeholder="Nombre completo"
                  autoCapitalize="words"
                  icon="person-circle-outline"
                  value={form.nombre}
                  onChangeText={(value) => setForm({ ...form, nombre: value })}
                />
              </View>

              <View>
                <FieldLabel label="Correo electrónico" required showError={errors.email} />
                <ThemedTextInput
                  placeholder="correo@ejemplo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  icon="mail-outline"
                  value={form.email}
                  onChangeText={(value) => setForm({ ...form, email: value })}
                />
              </View>

              <View>
                <FieldLabel label="Contraseña" required showError={errors.password} />
                <ThemedTextInput
                  placeholder="***********"
                  autoCapitalize="none"
                  secureTextEntry
                  icon="lock-closed-outline"
                  value={form.password}
                  onChangeText={(value) => setForm({ ...form, password: value })}
                />
              </View>
            </View>

            <View style={{ marginVertical: 32, width: '100%' }}>
              <ThemedButton icon="arrow-forward" onPress={onRegister}>
                Siguiente
              </ThemedButton>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText style={{ color: secondaryColor }}>¿Ya tienes una cuenta?</ThemedText>
              <ThemedLink href="/auth/login" style={{ marginLeft: 6 }}>
                Iniciar sesión
              </ThemedLink>
            </View>
          </ThemedBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Step1Screen;
