import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, useWindowDimensions, View } from 'react-native';

const NuevoPasswordScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
    code: '',
  });
  const [isPosting, setIsPosting] = useState(false);

  const onChangePassword = async () => {
    const { password, confirmPassword, code } = form;
    if (!code || !password || !confirmPassword) {
      return Alert.alert('Completa todos los campos');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Las contraseñas no coinciden');
    }
    if (password.length < 6) {
      return Alert.alert('La contraseña debe tener al menos 6 caracteres');
    }
    setIsPosting(true);
    // Aquí deberías llamar a tu API para cambiar la contraseña
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert('Contraseña cambiada exitosamente');
      router.replace('/auth/login');
    }, 1500);
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
          <ThemedText type="title">Lexyvoz</ThemedText>
          <ThemedBackground backgroundColor="#fff" align="center">
            <View style={{ width: '100%', marginTop: 12 }}>
          <ThemedText type="subtitle" style={{ alignSelf: 'center' }}>Nueva contraseña</ThemedText>
          <View style={{ marginTop: 20 }}>
          <ThemedText>Ingresa tu nueva contraseña</ThemedText>
            <ThemedTextInput
              placeholder="***********"
              style={{
                borderBottomWidth: 1,
                borderColor: 'grey',
                paddingVertical: 10,
                fontSize: 16,
              }}
              autoCapitalize="none"
              secureTextEntry
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            <ThemedText style={{ marginTop: 10 }}>Confirmar contraseña</ThemedText>
            <ThemedTextInput
              placeholder="***********"
              style={{
                borderBottomWidth: 1,
                borderColor: 'grey',
                paddingVertical: 10,
                fontSize: 16,
              }}
              autoCapitalize="none"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
            />
          </View>
          <View style={{ marginTop: 10 }} />
          <ThemedButton
            onPress={onChangePassword}
            disabled={isPosting}
          >
            Cambiar contraseña
          </ThemedButton>
          <View style={{ marginTop: 30 }} />
        </View>
        </ThemedBackground> 
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default NuevoPasswordScreen;
