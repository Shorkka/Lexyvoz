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


import * as Progress from 'react-native-progress';
import ThemedProgressBar from '@/presentation/theme/components/ThemedProgressBar';

const LoginScreen = () => {
  
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const barColor = useThemeColor({}, 'bar');
  //const { login } =  useAuthStore();
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  {/*
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
  */}
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
        backgroundColor: backgroundColor,
        flex: 1,
        paddingHorizontal:getResponsivePadding (700, 40),
      }}>
      <View style = {{
        paddingTop:height * 0.30,
      }}>
       <ThemedBackground/>
        <View style = {{marginLeft: 30, position: 'absolute', top: height* 0.15,  alignItems: 'center'}}>
          <ThemedText>Paso 1 de 2</ThemedText>
          <ThemedProgressBar progress  = { 0.5}  color = {barColor}  widthAndroid={width *0.67} widthWeb= {width *0.36}/>
        </View>
        <ThemedText type = "title" style = {{alignSelf: 'center', top: height* 0.06, position: 'absolute', }}>Lexyvoz</ThemedText>
        <ThemedText type = "subtitle" style = {{alignSelf: 'center', bottom: 15}}>Registro de usuario</ThemedText>
  
        <ThemedText style = {{color:secondaryColor, alignSelf: 'center'}}></ThemedText>
        { /* Email y Password */ }
        <View style = {{marginTop: 10}}>
        <ThemedText style = {{fontSize: 14, top: 3}}>Nombre completo</ThemedText>
          <ThemedTextInput
            placeholder = "Nombre"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              fontSize: 16,
            }}
            autoCapitalize = 'words'
            keyboardType = 'default'
            icon = 'person-circle-outline'
            value= {form.email}
            onChangeText = {(value) => setForm({...form, email: value})}
            
          />
           <ThemedText style = {{fontSize: 14, top: 3}}>Correo</ThemedText>
          <ThemedTextInput
            placeholder = "correo@ejemplo.com"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              fontSize: 16,
            }}
            autoCapitalize = "none"
            keyboardType = "email-address"
            icon = "mail-outline"
            value= {form.email}
            onChangeText = {(value) => setForm({...form, email: value})}
            
          />
          <ThemedText style = {{fontSize: 14, top: 3}}>Contraseña</ThemedText>
          <ThemedTextInput
            placeholder = "***********"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            autoCapitalize = "none"
            keyboardType = "default"
            icon = "lock-closed-outline"
            value= {form.email}
            onChangeText = {(value) => setForm({...form, email: value})}
            />
          <ThemedButton style = {{flexDirection: 'row', paddingRight: 10,}} icon = "lock-closed-outline"/>
        </View>
            
          <ThemedButton 
          icon = "arrow-forward"
         // onPress = {}
          //disabled = {isPosting}
          
          >ingresar</ThemedButton>
            <View style = {{marginTop: 20}}/>

            <View style = {{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              }}>
                <ThemedText style = {{color:secondaryColor}}>¿Ya tienes una cuenta?</ThemedText>
                <ThemedLink href = "/auth/login" style = {{marginHorizontal: 5}}>
                    Iniciar sesión
                </ThemedLink>
            </View>
      </View>
</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen