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
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedDatePicker from '@/presentation/theme/components/ThemedDatePicker';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import ThemedInput from '@/presentation/theme/components/ThemedInput';
import { useRegisterStore } from '@/core/auth/context/RegisterContext';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
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
  const data = useRegisterStore((s) => s);    
  const reset = useRegisterStore((s) => s.reset);
  const register = useAuthStore((s) => s.register);
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const [fechaTocada, setFechaTocada] = useState(false);

  const [form, setForm] = useState({
    rol: '',
    escolaridad: '',
    fechaNacimiento: new Date(),
    especialidad: '',
    titulo: '',
  });
  const [errors, setErrors] = useState({
    escolaridad: '',
    fechaNacimiento: '',
    especialidad: '',
    titulo: '',
  });

  const completarRegistro = async () => {
    const newErrors = {
      escolaridad: '',
      fechaNacimiento: '',
      especialidad: '',
      titulo: '',
    };
    let hasError = false;
    if ((form.rol === 'Paciente' || form.rol === 'Estudiante') && !form.escolaridad) {
      newErrors.escolaridad = 'Selecciona tu nivel de escolaridad';
      hasError = true;
    }
    if (!fechaTocada) {
      newErrors.fechaNacimiento = 'Selecciona tu fecha de nacimiento';
      hasError = true;
    }
    if (!form.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Selecciona tu fecha de nacimiento';
      hasError = true;
    }
    if (form.rol === 'Doctor') {
      if (!form.especialidad) {
        newErrors.especialidad = 'Ingresa tu especialidad';
        hasError = true;
      }
      if (!form.titulo) {
        newErrors.titulo = 'Ingresa tu título profesional';
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

    const payload = {
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      telefono: data.telefono,
      sexo: data.sexo,
      direccion: data.direccion,
      codigoPostal: data.codigoPostal,
      rol: form.rol, // Usar el rol del formulario actual
      fechaNacimiento: form.fechaNacimiento?.toISOString?.(),
      ...(form.rol === 'Paciente' && { escolaridad: form.escolaridad }),
      ...(form.rol === 'Doctor' && {
        especialidad: form.especialidad,
        titulo: form.titulo,
      }),
    };

    try {
      const ok = await register(payload);  
      if (ok) {
        reset();
        router.replace('/auth/login');     
      } else {
        Alert.alert('Error', 'No se pudo crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrar');
      console.log('Error al registrar:', error);
    }
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
       
          <ProgressHeader step={2} />
          <ThemedBackground backgroundColor="#fff" align="center">
          <ThemedText type="subtitle">Registro de usuario</ThemedText>
          <View style={{ width: '100%', marginTop: 12 }}>
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
              {['Paciente', 'Doctor', 'Usuario'].map((rol) => (
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
                  error={!!errors.escolaridad}
                />
                {errors.escolaridad ? (
                  <ThemedText type="error" style={{ marginTop: 4 }}>
                    {errors.escolaridad}
                  </ThemedText>
                ) : null}
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
                  error={!!errors.especialidad}
                  errorMessage={errors.especialidad}
                />
                <ThemedInput
                  label="Título profesional *"
                  placeholder="Ingresa tu título"
                  value={form.titulo}
                  onChangeText={(text) => setForm({ ...form, titulo: text })}
                  icon="certificate"
                  error={!!errors.titulo}
                  errorMessage={errors.titulo}
                />
              </>
            )}
          <ThemedDatePicker
              label="Fecha de Nacimiento *"
              value={form.fechaNacimiento}
              onChange={(date) => {
                setForm({ ...form, fechaNacimiento: date });
                setFechaTocada(true);
              }}
              error={!!errors.fechaNacimiento}
              style={{ width: '100%' }}
            />
            {errors.fechaNacimiento ? (
              <ThemedText type="error" style={{ marginTop: 4, marginBottom: 8 }}>
                {errors.fechaNacimiento}
              </ThemedText>
            ) : null}
            {errors.fechaNacimiento ? (
              <ThemedText type="error" style={{ marginTop: 4, marginBottom: 8 }}>
                {errors.fechaNacimiento}
              </ThemedText>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                marginTop: 20,
              }}
            >
              <ThemedButton widthAndroid={0.2} widthWeb={0.1} onPress={() => router.back()}>
                Regresar
              </ThemedButton>
              <ThemedButton widthAndroid={0.25} widthWeb={0.15} onPress={completarRegistro}>
                Completar Registro
              </ThemedButton>
            </View>
            </View>
          </ThemedBackground>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Step3Screen;
