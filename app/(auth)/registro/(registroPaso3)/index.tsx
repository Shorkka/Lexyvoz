import { useRegisterStore } from '@/core/auth/context/RegisterContext';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlert } from '@/presentation/hooks/useAlert';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import TermsAndConditions from '@/presentation/theme/components/TermsAndConditions';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedDatePicker from '@/presentation/theme/components/ThemedDatePicker';
import ThemedInput from '@/presentation/theme/components/ThemedInput';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';

import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Step3Screen = () => {
  const data = useRegisterStore((s) => s);
  const register = useAuthStore((s) => s.register);
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const linkColor = useThemeColor({}, 'primary');
  const { showAlert } = useAlert();

  const [fechaTocada, setFechaTocada] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [consentVoiceTraining, setConsentVoiceTraining] = useState(false);

  const [form, setForm] = useState({
    tipo: '',
    escolaridad: 'N/A',
    fecha_de_nacimiento: new Date(),
    especialidad: '',
    acepta_terminos: false,
  });

  const isFormValid = useMemo(() => {
    const tipoOk = form.tipo !== '';
    const fechaOk = fechaTocada && !!form.fecha_de_nacimiento;
    const terminosOk = form.acepta_terminos === true;

    if (form.tipo === 'Doctor') {
      return tipoOk && fechaOk && form.especialidad.trim() !== '' && terminosOk;
    }

    if (form.tipo === 'Usuario') {
      return tipoOk && fechaOk && terminosOk;
    }

    return false;
  }, [form, fechaTocada]);

  const completarRegistro = async () => {
    if (!isFormValid) return;

    try {
      const payload: any = {
        nombre: data.nombre!,
        correo: data.correo!.toLowerCase(),
        contrasenia: data.contrasenia!,
        fecha_de_nacimiento: form.fecha_de_nacimiento.toISOString().split('T')[0],
        numero_telefono: data.numero_telefono!,
        sexo: data.sexo!,
        tipo: form.tipo!,
        domicilio: data.domicilio ?? null, 
        codigo_postal: data.codigo_postal!,
      };

      if (form.tipo === 'Usuario') {
        payload.escolaridad = 'N/A';
      } else if (form.tipo === 'Doctor') {
        payload.especialidad = form.especialidad?.trim() ?? '';
      }

      const success = await register(payload, true);

      if (success) {
        showAlert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
      } else {
        showAlert('Error', 'No se pudo completar el registro.');
      }
    } catch (error: any) {
      showAlert('Error en registro', error.message || 'Ocurrió un error al registrar. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <ProgressHeader step={3} />
          <ThemedBackground backgroundColor="#fff" align="center">
            <ThemedText type="subtitle">Registro de usuario</ThemedText>

            {/* --- Tipo de usuario --- */}
            <View style={{ width: '100%', marginTop: 12 }}>
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
                {['Doctor', 'Usuario'].map((tipo) => (
                  <RadioButton
                    key={tipo}
                    label={tipo}
                    value={tipo}
                    selected={form.tipo === tipo}
                    onPress={(value) => setForm({ ...form, tipo: value })}
                  />
                ))}
              </View>

              {/* Fecha */}
              <ThemedDatePicker
                label="Fecha de Nacimiento"
                value={form.fecha_de_nacimiento}
                onChange={(date) => {
                  setForm({ ...form, fecha_de_nacimiento: date });
                  setFechaTocada(true);
                }}
                style={{ width: '100%' }}
              />

              {/* Especialidad (solo Doctor) */}
              {form.tipo === 'Doctor' && (
                <ThemedInput
                  label="Especialidad *"
                  placeholder="Ingresa tu especialidad"
                  value={form.especialidad}
                  onChangeText={(text) => setForm({ ...form, especialidad: text })}
                  icon="stethoscope"
                />
              )}

              {/* Aceptar términos */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                <Pressable
                  onPress={() => setForm({ ...form, acepta_terminos: !form.acepta_terminos })}
                  style={[styles.checkbox, form.acepta_terminos && styles.checkboxOn]}
                  hitSlop={8}
                >
                  {form.acepta_terminos ? <Text style={styles.checkMark}>✓</Text> : null}
                </Pressable>

                <Text style={{ fontSize: 13, color: '#333' }}>Acepto los </Text>

                <Pressable
                  onPress={() => setShowTerms(true)}
                  accessibilityRole="link"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={Platform.select({ web: { cursor: 'pointer' } as any, default: undefined })}
                >
                  <Text style={{ fontSize: 13, color: linkColor, textDecorationLine: 'underline' }}>
                    Términos y Condiciones
                  </Text>
                </Pressable>
              </View>

              {/* --- Botones --- */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  marginTop: 25,
                }}
              >
                <ThemedButton widthAndroid={0.2} widthWeb={0.1} onPress={() => router.back()}>
                  Regresar
                </ThemedButton>

                <ThemedButton
                  widthAndroid={0.25}
                  widthWeb={0.15}
                  onPress={isFormValid ? completarRegistro : undefined}
                  style={{
                    opacity: isFormValid ? 1 : 0.5,
                    backgroundColor: isFormValid ? '#ff9900' : '#bdbdbd',
                    padding: 15,
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                >
                  Completar Registro
                </ThemedButton>
              </View>
            </View>
          </ThemedBackground>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL de T&C con consentimientos (solo estado local, no backend) */}
      <TermsAndConditions
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        onConfirm={({ accepted, consentVoiceProcessing, consentVoiceTraining }) => {
          if (accepted && consentVoiceProcessing) {
            setForm({ ...form, acepta_terminos: true });
            setConsentVoiceTraining(!!consentVoiceTraining);
            setShowTerms(false);
          }
        }}
        appName="LexyVoz"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxOn: { backgroundColor: '#ff9900' },
  checkMark: { color: '#fff', fontWeight: '700' },
  sectionTitle: { fontWeight: '700', marginTop: 8, marginBottom: 6, color: '#333' },
  p: { marginBottom: 10, color: '#444' },
});

export default Step3Screen;
