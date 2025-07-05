import { KeyboardAvoidingView,ScrollView, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <KeyboardAvoidingView behavior = "padding"  style = {{flex: 1}}>
      <ScrollView
      style = {{
        backgroundColor: backgroundColor, 
        paddingHorizontal: 40,
      }}>
      <View style = {{
        paddingTop: height * 0.35,
      }}>
        <ThemedText type = "title">Crear cuenta</ThemedText>
        <ThemedText style = {{color:'grey'}}>Por favor crea una cuenta para continuar</ThemedText>
        { /* Email y Password */ }
        <View style = {{marginTop: 15}}>
          <ThemedTextInput
            placeholder = "Nombre completo"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            autoCapitalize = "words"
            icon = "person-outline"
          />
          <ThemedTextInput
            placeholder = "Correo electrónico"
            style = {{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 10,
              fontSize: 16,
            }}
            autoCapitalize = "none"
            keyboardType = "email-address"
            icon = "mail-outline"
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
          />
        </View>
          <View style = {{marginTop: 10}}/>
          <ThemedButton icon = "arrow-forward">ingresar</ThemedButton>
            <View style = {{marginTop: 50}}/>

            <View style = {{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              }}>
                <ThemedText>¿Ya tienes una cuenta?</ThemedText>
                <ThemedLink href = "/auth/login" style = {{marginHorizontal: 5}}>
                    Ingresar
                </ThemedLink>
            </View>
      </View>
</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen