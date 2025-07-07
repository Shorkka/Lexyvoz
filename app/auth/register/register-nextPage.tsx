import React, { useState } from 'react'

import { Alert, KeyboardAvoidingView,Platform,ScrollView, useWindowDimensions, View } from 'react-native'

import { ThemedText } from '@/presentation/theme/components/ThemedText'
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
//import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { router, useLocalSearchParams } from 'expo-router';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';


import ThemedProgressBar from '@/presentation/theme/components/ThemedProgressBar';
import RadioButton from '@/presentation/theme/components/radioButtonView';

const LoginScreen = () => {
  
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondaryText');
  const barColor = useThemeColor({}, 'bar');
const params = useLocalSearchParams();
console.log(params.email, params.password, params.nombre)

  const [form, setForm] = useState({
    telefono: '',
    sexo: '',
    edad: '',
    rol: '',
    direccion: '',
  })
    const onRegisterComplete = () =>{ 
    const {direccion, telefono, edad, sexo} = form;
       
    if( direccion.length === 0 || 
        telefono.length === 0 || 
        edad.length ===0 ||
        sexo.length === 0)
        {
      return Alert.alert('Llena todos los datos por favor');
    }
    // Valorar que edad sea un numero y mayor que 0
    if(isNaN(Number(edad)) || Number(edad)  <= 0 ){
        return Alert.alert('La edad debe ser un número válido');
    }

    if(!/^\d{10}$/.test(telefono)){
        return Alert.alert('El número de telefono tiene que tener 10 digitos')
    }

    }

    const volverAtras = () =>{
        return router.push('/auth/recover/nuevo_password')
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
        backgroundColor: backgroundColor,
        flex: 1,
        paddingHorizontal:getResponsivePadding (700, 40),
    }}>
    <View style = {{
        paddingTop:height * 0.30,
    }}>
        <ThemedBackground/>
        <View style = {{marginLeft: 30, position: 'absolute', top: height* 0.15,  alignItems: 'center'}}>
            <ThemedText>Paso 2 de 2</ThemedText>
            <ThemedProgressBar progress  = { 1}  color = {barColor}  widthAndroid={width *0.67} widthWeb= {width *0.36}/>
        </View>
        <ThemedText type = "title" style = {{alignSelf: 'center', top: height* 0.06, position: 'absolute', }}>Lexyvoz</ThemedText>
        <ThemedText type = "subtitle" style = {{alignSelf: 'center', bottom: 15}}>Registro de usuario</ThemedText>

        <ThemedText style = {{color:secondaryColor, alignSelf: 'center'}}></ThemedText>
        { /* Email y Password */ }
        <View style = {{bottom: 20}}>

        <ThemedText style = {{fontSize: 14,}}>Dirección</ThemedText>
        <ThemedTextInput
            placeholder='Casa # 1234'
            style = {{
                borderBottomWidth: 1,
                borderColor: 'grey',
                fontSize: 16,
            }}
            autoCapitalize = 'words'
            keyboardType = 'email-address'
            value= {form.direccion}
            onChangeText = {(value) => setForm({...form, direccion: value})}
            
        />
            <ThemedText style = {{fontSize: 14, top: 3}}>Teléfono</ThemedText>
        <ThemedTextInput
            style = {{
                borderBottomWidth: 1,
                borderColor: 'grey',
                fontSize: 16,
            }}
            autoCapitalize = 'none'
            keyboardType = 'number-pad'
            value= {form.telefono}
            onChangeText = {(value) => setForm({...form, telefono: value})}
            
        />
            <ThemedText style = {{fontSize: 14, top: 3}}>Edad</ThemedText>
        <ThemedTextInput
            style = {{
                borderBottomWidth: 1,
                borderColor: 'grey',
                fontSize: 16,
            }}
            autoCapitalize = 'none'
            keyboardType = 'number-pad'
            value= {form.edad}
            onChangeText = {(value) => setForm({...form, edad: value})}
            
        />
        <ThemedText style = {{fontSize: 14, top: 3}}>Genero</ThemedText>
       <View style={{ marginVertical: 10, flexDirection: 'row'}}>
        <View style = {{marginLeft: 5}}>
            <RadioButton
                label="Masculino"
                value="masculino"
                selected={form.sexo === "masculino"}
                onPress={(value) => setForm({ ...form, sexo: value })}
            />
        </View>
        <View style = {{marginLeft: 5}}>
            <RadioButton
                label="Femenino"
                value="femenino"
                selected={form.sexo === "femenino"}
                onPress={(value) => setForm({ ...form, sexo: value })}
            />
            </View>
            <View style = {{marginLeft: 5}}>
                <RadioButton
                label="Otro"
                value="Indefinido"
                selected={form.sexo === "Indefinido"}
                onPress={(value) => setForm({ ...form, sexo: value })}
            />
            </View>
        </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <ThemedButton
            widthAndroid={0.2}
            widthWeb={0.1}
            onPress={volverAtras}
        >
            Regresar
        </ThemedButton>
        
        <ThemedButton 
            widthAndroid={0.2}
            widthWeb={0.1}
            onPress = {onRegisterComplete}
            // disabled = {isPosting}
        >
            Completar
        </ThemedButton>
        </View>
            <View style ={{ flexDirection: 'row',}}></View>
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