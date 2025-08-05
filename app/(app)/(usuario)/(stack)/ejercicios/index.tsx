import {KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AuthGuard from '@/presentation/theme/components/AuthGuard'
import ThemedBackground from '@/presentation/theme/components/ThemedBackground'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor'
import ThemedButton from '@/presentation/theme/components/ThemedButton'

type Modality = 'lectura' | 'escrito' | 'visual' | null;

const EjerciciosKits = () => {
   const press = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
    const [selectedModality, setSelectedModality] = useState<Modality>(null);

    const renderLectura = () => {
      setSelectedModality('lectura');
   
    }
    const renderEscrito = () => {
      setSelectedModality('escrito');
   
    }
    const renderVisual = () => {
      setSelectedModality('visual');
   
    }

  return (
    <AuthGuard>
    <SafeAreaView style={{ flex: 1 }}>
       <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
              style={{ flex: 1, backgroundColor: backgroundColor }}
            >
            <ThemedBackground 
              justifyContent='flex-start'
              fullHeight 
              backgroundColor="#fba557" style={{ 
            width: '100%', 
            borderRadius: 20, 
            padding: 30,
            alignItems: 'center'
          }}>
            <ThemedButton onPress={renderLectura} style = {{backgroundColor:selectedModality === 'lectura' ? press: '#b1b1b1', ...styles.button }}>
              <ThemedText style = {{color: '#fff'}}>Lectura</ThemedText>
            </ThemedButton>
                <ThemedButton onPress={renderEscrito} style = {{backgroundColor:selectedModality === 'escrito' ? press: '#b1b1b1',...styles.button }}>
              <ThemedText style = {{color: '#fff'}}>Escrito</ThemedText>
            </ThemedButton>
                <ThemedButton onPress={renderVisual} style = {{backgroundColor:selectedModality === 'visual' ? press: '#b1b1b1', ...styles.button }}>
              <ThemedText style = {{color: '#fff'}}>Visual</ThemedText>
            </ThemedButton>
          </ThemedBackground>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AuthGuard>
  )
}

export default EjerciciosKits

const styles = StyleSheet.create({
  button: {
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 10,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'auto',
    
  },

});