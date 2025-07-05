import React, { useState } from 'react'

import { Alert, KeyboardAvoidingView,ScrollView, useWindowDimensions, View } from 'react-native'

import { ThemedText } from '@/presentation/theme/components/ThemedText'
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { router } from 'expo-router';

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const { login } =  useAuthStore();
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isPosting, setIsPosting] = useState(false);


  const onLogin = async () => {
    const { email, password } = form;
    console.log({email, password})
    if (email.length === 0 || password.length === 0 ) {
      return alert('Por favor ingrese su email y contraseña')
    }
    setIsPosting(true);
    const wasSuccessful = await login(email, password);
    setIsPosting(false);

    if(wasSuccessful) {
      router.replace('/');
      return
    }
    Alert.alert(
      'Error al iniciar sesión'  )
  }
  return (
    <KeyboardAvoidingView behavior = "padding"  style = {{flex: 1}}>
      <ScrollView
      style = {{
        backgroundColor: backgroundColor,
        flex: 1,
        paddingHorizontal: 40,
      }}>
      <View style = {{
        paddingTop: height * 0.35,
      }}>
        <ThemedText type = "title">Ingresar</ThemedText>
        <ThemedText style = {{color:'grey'}}>Por favor ingrese para continuar</ThemedText>
        { /* Email y Password */ }
        <View style = {{marginTop: 15}}>
          <ThemedTextInput
            placeholder = "Email"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            autoCapitalize = "none"
            keyboardType = "email-address"
            icon = "mail-outline"
            value= {form.email}
            onChangeText = {(value) => setForm({...form, email: value})}
            
          />
          <ThemedTextInput
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            placeholder='Contraseña'
            autoCapitalize = "none"
            secureTextEntry
            icon = "lock-closed-outline"
            value= {form.password}
            onChangeText = {(value) => setForm({...form, password: value})}
          />
        </View>
            <View style = {{marginTop: 10}}/>
          <ThemedButton 
          icon = "arrow-forward"
          onPress = {onLogin}
          disabled = {isPosting}
          
          >ingresar</ThemedButton>
            <View style = {{marginTop: 50}}/>

            <View style = {{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              }}>
                <ThemedText>¿No tienes una cuenta?</ThemedText>
                <ThemedLink href = "/auth/register" style = {{marginHorizontal: 5}}>
                    Crear cuenta
                </ThemedLink>
            </View>
      </View>
</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen