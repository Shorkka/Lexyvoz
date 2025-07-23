import { useRegisterStore } from '@/core/auth/context/RegisterContext';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedDatePicker from '@/presentation/theme/components/ThemedDatePicker';
import ThemedDropdown from '@/presentation/theme/components/ThemedDropdown';
import ThemedInput from '@/presentation/theme/components/ThemedInput';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
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
  console.log("Componente Step3Screen montado");
  const data = useRegisterStore((s) => s);    

  const register = useAuthStore((s) => s.register);
  const { height, width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const [fechaTocada, setFechaTocada] = useState(false);

  const [form, setForm] = useState({
    tipo: '',
    escolaridad: '',
    fecha_de_nacimiento: new Date(),
    especialidad: '',
    titulo: '',
  });
  
  const [errors, setErrors] = useState({
    escolaridad: '',
    fecha_de_nacimiento: '',
    especialidad: '',
    titulo: '',
    tipo: '',
  });
  const showAlert = (title: string, message: string, buttons?: { text: string; onPress?: () => void }[]) => {
    if (Platform.OS === 'web') {
      if (buttons && buttons.length > 0) {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        if (confirmed && buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else {
        window.alert(`${title}\n\n${message}`);
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };
  console.log(data.nombre, data.correo, data.contraseña, data.numero_telefono, data.sexo, data.domicilio, form.tipo, form.escolaridad, form.fecha_de_nacimiento, form.especialidad, form.titulo);
  const completarRegistro = async () => {
    const newErrors = {
      escolaridad: '',
      fecha_de_nacimiento: '',
      especialidad: '',
      titulo: '',
      tipo: '',
    };
    
    let hasError = false;
    if ((form.tipo === 'Paciente') && !form.escolaridad) {
      newErrors.escolaridad = 'Selecciona tu nivel de escolaridad';
      hasError = true;
    }
    
    if (!fechaTocada) {
      newErrors.fecha_de_nacimiento = 'Selecciona tu fecha de nacimiento';
      hasError = true;
    }
    
    if (!form.fecha_de_nacimiento) {
      newErrors.fecha_de_nacimiento = 'Selecciona tu fecha de nacimiento';
      hasError = true;
    }
    
    if (form.tipo === 'Doctor') {
      if (!form.especialidad) {
        newErrors.especialidad = 'Ingresa tu especialidad';
        hasError = true;
      }
      if (!form.titulo) {
        newErrors.titulo = 'Ingresa tu título profesional';
        hasError = true;
      }
    }
    
    if (!form.tipo) {
      newErrors.tipo = 'Selecciona el tipo de usuario';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    try{
      const payload = {
        nombre:              data.nombre!,
        correo:              data.correo!,
        contraseña:          data.contraseña!,
        fecha_de_nacimiento: form.fecha_de_nacimiento.toISOString().split('T')[0],
        numero_telefono:     data.numero_telefono!,
        sexo:                data.sexo!,
        tipo:                form.tipo!,
        domicilio:           `${data.domicilio}`,
        ...(form.tipo === 'Paciente' && { escolaridad: form.escolaridad }),
        ...(form.tipo === 'Doctor' && {
          especialidad: form.especialidad,
          titulo: form.titulo,
        }),
      };
    const success = await register(payload);
    
    if (success) {
    showAlert(
          'Registro exitoso',
          'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
        );
    } else {
      showAlert('Error', 'No se pudo completar el registro');
    }
  } catch (error: any) {
    showAlert(
      'Error en registro',
      error.message || 'Ocurrió un error al registrar. Por favor intente nuevamente.'
    );
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
          <ProgressHeader step={3} />
          <ThemedBackground backgroundColor="#fff" align="center">
            <ThemedText type="subtitle">Registro de usuario</ThemedText>
            <View style={{ width: '100%', marginTop: 12 }}>
              {/* Tipo de usuario */}
              <ThemedText style={{ fontSize: 14, top: 15 }}>Tipo de usuario</ThemedText>
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
                {['Paciente', 'Doctor', 'Usuario'].map((tipo) => (
                  <RadioButton
                    key={tipo}
                    label={tipo}
                    value={tipo}
                    selected={form.tipo === tipo}
                    onPress={(value) => setForm({ ...form, tipo: value })}
                  />
                ))}
              </View>
              {errors.tipo ? (
                <ThemedText type="error" style={{ marginTop: 4 }}>
                  {errors.tipo}
                </ThemedText>
              ) : null}
              <ThemedDatePicker
                label="Fecha de Nacimiento"
                value={form.fecha_de_nacimiento}
                onChange={(date) => {
                  setForm({ ...form, fecha_de_nacimiento: date });
                  setFechaTocada(true);
                }}
                style={{ width: '100%' }}
              />
              {errors.fecha_de_nacimiento ? (
                <ThemedText type="error" style={{ marginTop: 4, marginBottom: 8 }}>
                  {errors.fecha_de_nacimiento}
                </ThemedText>
              ) : null}
              {(form.tipo === 'Paciente') && (
                <>
                  <ThemedText style={{ fontSize: 14, marginBottom: 5 }}>
                    Escolaridad
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
              {form.tipo === 'Doctor' && (
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