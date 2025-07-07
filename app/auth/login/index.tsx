import React, { useState } from 'react'

import { Alert, KeyboardAvoidingView,Platform,ScrollView, useWindowDimensions, View } from 'react-native'

import { ThemedText } from '@/presentation/theme/components/ThemedText'
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { router } from 'expo-router';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';




const LoginScreen = () => {
  
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
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
  
const getResponsivePadding = (value: number, base: number ) => {
  if (Platform.OS === 'web') { 
      return Math.min(width * 0.3, value);
    } else {

      const basePadding = width * 0.1; 
      return Math.max(16, Math.min(basePadding, base)); 
    }
  }
  return (
    <KeyboardAvoidingView behavior = "padding"  style = {{flex: 1}}>
      <ScrollView
      style = {{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal:getResponsivePadding (700, 30),
        alignContent: 'center'
      }}>
      <View style = {{
        paddingTop:height * 0.30,
      }}>
        <ThemedBackground/>
        <ThemedText type = "title" style = {{alignSelf: 'center', top: height* 0.06, position: 'absolute', }}>Lexyvoz</ThemedText>
        <ThemedText type = "subtitle" style = {{alignSelf: 'center'}}>Inicia sesión</ThemedText>
        <ThemedText style = {{color:secondaryColor, alignSelf: 'center'}}>Por favor ingrese para continuar</ThemedText>
        { /* Email y Password */ }
        <View style = {{marginTop: 20}}>
        <ThemedText>Correo</ThemedText>
          <ThemedTextInput
            placeholder = "correo@ejemplo.com"
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
          <ThemedText style = {{marginTop: 5}}>Contraseña</ThemedText>
          <ThemedTextInput
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            placeholder='***********'
            autoCapitalize = "none"
            secureTextEntry
            icon = "lock-closed-outline"
            value= {form.password}
            onChangeText = {(value) => setForm({...form, password: value})}
          />
        </View>
            <View style = {{marginTop: 10,}}/>
          <ThemedButton 
          onPress = {onLogin}
          disabled = {isPosting}
          
          >ingresar</ThemedButton>
            <View style = {{marginTop: 50}}/>

            <View style = {{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              }}>
                <ThemedText style = {{color:secondaryColor}}>¿No tienes una cuenta?</ThemedText>
                <ThemedLink href = "/auth/register" style = {{marginHorizontal: 5}}>
                    Crear cuenta
                </ThemedLink>
            </View>
            <View style = {{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              }}>
                <ThemedLink href = "/auth/recover">¿Olvidaste tu contraseña?</ThemedLink>
                
            </View>
      </View>
</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen