import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, View, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import AddressForm from '@/presentation/theme/components/AddressForm';
import GenderSelector from '@/presentation/theme/components/GenderSelector';
import FieldLabel from '@/presentation/theme/components/FieldLabel';
const Step2Screen = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const { height } = useWindowDimensions();
  const [form, setForm] = useState({
    telefono: '',
    sexo: '',
    direccion: '',
    numInterior: '',
    numExterior: '',
    codigoPostal: '',
    colonia: ''
  });
  const [errors, setErrors] = useState({
    telefono: false,
    sexo: false,
    direccion: false,
    numExterior: false,
    numInterior: false,
    codigoPostal: false,
    colonia: false
  });
  const onChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: false });
  };
  const nextRegisterScreen = () => {
    const newErrors = {
      direccion: !form.direccion.trim(),
      telefono: !/^\d{10}$/.test(form.telefono),
      sexo: !form.sexo.trim(),
      colonia: !form.colonia.trim(),
      numExterior: isNaN(Number(form.numExterior)),
      numInterior: !!form.numInterior && isNaN(Number(form.numInterior)),
      codigoPostal: !/^\d{5}$/.test(form.codigoPostal),
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      return Alert.alert('Por favor, completa correctamente los campos obligatorios.');
    }
    router.push('/auth/register/registerStep3');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          style={{ flex: 1, backgroundColor }}
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

            <AddressForm
              direccion={form.direccion}
              numExterior={form.numExterior}
              numInterior={form.numInterior}
              codigoPostal={form.codigoPostal}
              colonia={form.colonia}
              onChange={onChange}
            />

            <View style={{ width: '100%', marginTop: 12 }}>
              <FieldLabel label="Teléfono" required showError={errors.telefono} />
              <ThemedTextInput
                keyboardType="number-pad"
                value={form.telefono}
                onChangeText={(value) => onChange('telefono', value)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: errors.telefono ? 'red' : 'grey',
                  fontSize: 16
                }}
              />
            </View>

            <GenderSelector selected={form.sexo} onSelect={(value) => onChange('sexo', value)} showError={errors.sexo} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <ThemedButton onPress={() => router.back()}>Regresar</ThemedButton>
              <ThemedButton onPress={nextRegisterScreen}>Continuar</ThemedButton>
            </View>
          </ThemedBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Step2Screen;
