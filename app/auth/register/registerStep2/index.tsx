
import GenderSelector from '@/presentation/theme/components/GenderSelector';
import ProgressHeader from '@/presentation/theme/components/ProgressHeader';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import AddressAutocomplete from '@/presentation/theme/components/AddressAutocomplete';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { useRegisterStore } from '@/core/auth/context/RegisterContext';
const Step2Screen = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const { height } = useWindowDimensions();
  const addressRef = useRef<GooglePlacesAutocompleteRef>(null);
  const set = useRegisterStore((s) => s.set);
  const [form, setForm] = useState({
    telefono: '3310227778',
    sexo: 'Masculino',
    direccion: 'Jose Jeronimo Hernandez 3939',
    codigoPostal: '44760',
  });
  const [errors, setErrors] = useState({
    telefono: '',
    sexo: '',
    direccion: '',
    codigoPostal: '',
  });
  const onChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validateFields = () => {
    return {
      direccion: !form.direccion.trim() ? 'La dirección es obligatoria' : '',
      telefono: !/^\d{10}$/.test(form.telefono) ? 'Ingresa un número de 10 dígitos' : '',
      sexo: !form.sexo.trim() ? 'Selecciona un sexo' : '',
      codigoPostal: !/^\d{5}$/.test(form.codigoPostal) ? 'Código postal inválido' : '',
    };
  };
   const handleAddressSelect = ({
    direccion,
    colonia,
    codigoPostal,
  }: {
    direccion: string;
    colonia: string;
    codigoPostal: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      direccion,
      colonia,
      codigoPostal,
    }));
    setErrors((prev) => ({
      ...prev,
      direccion: '',
      colonia: '',
      codigoPostal: '',
    }));
  };
  const nextRegisterScreen = () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((v) => v);
    if (hasErrors) {
      return;
    }
    set({
      telefono: form.telefono,
      sexo: form.sexo,
      direccion: form.direccion,
      codigoPostal: form.codigoPostal,
  });
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
          <View style={{ width: '100%', marginTop: 12 }}>
          <ThemedText>Dirección</ThemedText>    
            <AddressAutocomplete
              ref={addressRef}
              onAddressSelect={handleAddressSelect}
            />
            {errors.direccion ? (
              <ThemedText type="error" style={{ marginTop: 4 }}>
                {errors.direccion}
              </ThemedText>
            ) : null}
          </View>

          <View style={{ width: '100%', marginTop: 12 }}>
            <ThemedText>Código Postal</ThemedText>
            <ThemedTextInput
              value={form.codigoPostal}
              onChangeText={(value) => onChange('codigoPostal', value)}
              error={!!errors.codigoPostal}
              errorMessage={errors.codigoPostal}
              keyboardType="numeric"
              placeholder=""
              maxLength={5}
            />
          </View>
            <View style={{ width: '100%', marginTop: 12 }}>
              <ThemedText>Telefono</ThemedText>
              <ThemedTextInput
                value={form.telefono}
                onChangeText={(value) => onChange('telefono', value)}
                error={!!errors.telefono}
                errorMessage={errors.telefono}
                keyboardType="phone-pad"
                placeholder=""
              />
            </View>

            <GenderSelector selected={form.sexo}
            onSelect={(value) => onChange('sexo', value)} 
            showError={!!errors.sexo} />
            {errors.sexo ? (
          <ThemedText type="error" style={{ marginTop: 4, marginBottom: 8 }}>
            Seleccione su género
          </ThemedText>
        ) : null}
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
