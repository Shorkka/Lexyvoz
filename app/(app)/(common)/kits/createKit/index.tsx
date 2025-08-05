import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlert } from '@/presentation/hooks/useAlert';
import { useKitsStore } from '@/presentation/kits/store/useKitsStore';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, KeyboardAvoidingView, SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
type Modality = 'lectura' | 'escrito' | 'visual' | null;
const CreateKits = () => {
  const press = useThemeColor({}, 'primary');
  const [visible, setVisible] = useState(false);
  const { user } = useAuthStore();
  const { createQueryKit } = useKitsStore();
  const { showAlert } = useAlert();
  const backgroundColor = useThemeColor({}, 'background');
  const [nombre, setNombre] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [creadoPor, setCreadoPor] = React.useState(0);
  const [modality, setModality] = useState<Modality>(null);
  const kitCreate = async () => {
    try {
      const result = await createQueryKit.mutateAsync({
        nombre,
        descripcion,
        creado_por: creadoPor
      });

      if (result.success) {
        showAlert(
          'Kit creado correctamente',
          'El kit fue creado de manera exitosa, pulsa OK para continuar!.',
          [{ text: 'OK', onPress: () => router.replace('/main') }]
        );
      } else {
        console.error("Error al crear el kit:", result.error);
      }
    } catch (error) {
      console.error("Error en la mutación:", error);
    }
  };
  const renderLectura = () => {
    setModality('lectura');
  }
  const renderEscrito = () => {
    setModality('escrito');
  }
  const renderVisual = () => {
    setModality('visual');
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={[GlobalStyles.scrollContent, { flex: 1 }]}>
          <ScrollView horizontal style={styles.mainContainer}>
            {/* Primer ThemedBackground (30%) */}
            <ThemedBackground
              justifyContent="center"
              backgroundColor="#fba557"
              style={styles.leftContainer}
              width={'50%'}
              fullHeight
            >
              <View style={styles.buttonContainer}>
                <ThemedButton style={{backgroundColor:modality === 'lectura' ? press : '#b1b1b1', ...styles.button}} onPress={renderLectura}>
                  <ThemedText style = {{color: '#fff'} }>Lectura</ThemedText>
                </ThemedButton>
                <ThemedButton style={{backgroundColor:modality === 'escrito' ? press : '#b1b1b1', ...styles.button}} onPress={renderEscrito}>
                  <ThemedText style = {{color: '#fff'}}>Escrito</ThemedText>
                </ThemedButton>
                <ThemedButton style={{backgroundColor:modality === 'visual' ? press : '#b1b1b1', ...styles.button}} onPress={renderVisual}>
                  <ThemedText style = {{color: '#fff'}}>Visual</ThemedText>
                </ThemedButton>
              </View>
            </ThemedBackground>

            {/* Segundo ThemedBackground (70%) */}
            <ThemedBackground
              justifyContent="flex-end"
              backgroundColor="#fba557"
              style={styles.rightContainer}
              width={'80%'}
              fullHeight
            >
              <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <ThemedButton onPress={kitCreate} >
                <Ionicons
                name="play-back-outline"
                size={24}
                
                /> 
              </ThemedButton>
              <ThemedButton onPress={kitCreate}>
                <Ionicons
                  name = "play-forward-outline"
                  size={24}
                />
              </ThemedButton>
            </View>
            </ThemedBackground>
          </ScrollView>
            <ThemedButton style = {{flex: 1, margin: 20, alignSelf: 'flex-end', backgroundColor: press, ...styles.button}} onPress={kitCreate}>
              <ThemedText style = {{color: '#fff',}}>Crear Kit</ThemedText>
            </ThemedButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftContainer: {
    width: '30%',
    height: '100%',
  },
  rightContainer: {
    width: '70%',
    height: '100%',
  },
  buttonContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    margin: 20,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 10,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});

export default CreateKits;