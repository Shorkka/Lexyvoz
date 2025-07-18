import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedDropdown from '@/presentation/theme/components/ThemedDropdown';
import ThemedProgressBar from '@/presentation/theme/components/ThemedProgressBar';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedDatePicker from '@/presentation/theme/components/ThemedDatePicker';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import ThemedInput from '@/presentation/theme/components/ThemedInput';
const escolaridadData = [
  { label: 'Primaria', value: 'primaria' },
  { label: 'Secundaria', value: 'secundaria' },
  { label: 'Preparatoria', value: 'preparatoria' },
  { label: 'Técnico', value: 'tecnico' },
  { label: 'Licenciatura', value: 'licenciatura' },
  { label: 'Maestría', value: 'maestria' },
  { label: 'Doctorado', value: 'doctorado' },
  { label: 'Sin estudios', value: 'sin_estudios' },
];
const Step3Screen = () => {
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const [form, setForm] = useState({
    rol: 'Paciente',
    escolaridad: '',
    fechaNacimiento: new Date(),
    especialidad: '',
    titulo: '',
  });
  const [errors, setErrors] = useState({
    escolaridad: false,
    fechaNacimiento: false,
    especialidad: false,
    titulo: false,
  });
  const completarRegistro = () => {
    const newErrors = {
      escolaridad: false,
      fechaNacimiento: false,
      especialidad: false,
      titulo: false,
    };
    let hasError = false;
    if ((form.rol === 'Paciente' || form.rol === 'Estudiante') && !form.escolaridad) {
      newErrors.escolaridad = true;
      hasError = true;
    }
    if (form.rol === 'Paciente' && !form.fechaNacimiento) {
      newErrors.fechaNacimiento = true;
      hasError = true;
    }
    if (form.rol === 'Doctor') {
      if (!form.especialidad) {
        newErrors.especialidad = true;
        hasError = true;
      }
      if (!form.titulo) {
        newErrors.titulo = true;
        hasError = true;
      }
    }
    if (hasError) {
      setErrors(newErrors);
      Alert.alert('Error', 'Por favor completa los campos obligatorios.');
      return;
    }
    console.log('Datos del formulario:', {
      ...form,
      fechaNacimiento: form.fechaNacimiento?.toISOString?.(),
    });
    Alert.alert('Éxito', 'Registro completado exitosamente', [
      {
        text: 'OK',
        onPress: () => router.replace('/auth/login'),
      },
    ]);
  };
  const volverAtras = () => {
    router.back();
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
        <ThemedText type="title" style={{ alignSelf: 'center', bottom: 10 }}>
          Lexyvoz
        </ThemedText>
        <ThemedText>Paso 3 de 3</ThemedText>
        <ThemedProgressBar progress={1} width={400} align="center" color="#FF6600" />
        <View style={{ width: '100%', maxWidth: 480 }}>
          <ThemedBackground backgroundColor="#fff" align="center">
            <ThemedText
              type="subtitle"
              style={{ alignSelf: 'center', marginBottom: 20 }}
            >
              Información adicional
            </ThemedText>
            {/* Tipo de usuario */}
            <ThemedText style={{ fontSize: 14, top: 15 }}>Tipo de usuario *</ThemedText>
            <View
              style={{
                marginVertical: 15,
                flexDirection: Platform.select({
                  web: width < 600 ? 'column' : 'row',
                  default: width < 300 ? 'column' : 'row',
                }),
                justifyContent: width < 500 ? 'flex-start' : 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
                alignSelf: 'center',
                gap: 12,
              }}
            >
              {['Paciente', 'Doctor'].map((rol) => (
                <RadioButton
                  key={rol}
                  label={rol}
                  value={rol}
                  selected={form.rol === rol}
                  onPress={(value) => setForm({ ...form, rol: value })}
                />
              ))}
            </View>
            {(form.rol === 'Paciente') && (
              <>
                <ThemedText style={{ fontSize: 14, marginBottom: 5 }}>
                  Escolaridad *
                </ThemedText>
                <ThemedDropdown
                  data={escolaridadData}
                  value={form.escolaridad}
                  onChangeValue={(value) => setForm({ ...form, escolaridad: value })}
                  placeholder="Selecciona tu nivel de escolaridad"
                  search={true}
                  searchPlaceholder="Buscar nivel..."
                  icon="book"
                  error={errors.escolaridad}
                />
              <ThemedDatePicker
                label="Fecha de Nacimiento *"
                value={form.fechaNacimiento}
                onChange={(date) => setForm({ ...form, fechaNacimiento: date })}
                error={errors.fechaNacimiento}
              />
              </>
            )}
            {form.rol === 'Doctor' && (
              <>
                <ThemedInput
                  label="Especialidad *"
                  placeholder="Ingresa tu especialidad"
                  value={form.especialidad}
                  onChangeText={(text) => setForm({ ...form, especialidad: text })}
                  icon="stethoscope"
                  error={errors.especialidad}
                />
                <ThemedInput
                  label="Título profesional *"
                  placeholder="Ingresa tu título"
                  value={form.titulo}
                  onChangeText={(text) => setForm({ ...form, titulo: text })}
                  icon="certificate"
                  error={errors.titulo}
                />
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                marginTop: 20,
              }}
            >
              <ThemedButton widthAndroid={0.2} widthWeb={0.1} onPress={volverAtras}>
                Regresar
              </ThemedButton>
              <ThemedButton widthAndroid={0.25} widthWeb={0.15} onPress={completarRegistro}>
                Completar Registro
              </ThemedButton>
            </View>
          </ThemedBackground>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Step3Screen;
