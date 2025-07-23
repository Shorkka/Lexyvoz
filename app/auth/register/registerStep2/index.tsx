import { useRegisterStore } from '@/core/auth/context/RegisterContext';
import AddressAutocomplete from '@/presentation/theme/components/AddressAutocomplete';
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
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
const Step2Screen = () => {
  console.log('registerScreen2 rendered');
  const backgroundColor = useThemeColor({}, 'background');
  const { height } = useWindowDimensions();
  const addressRef = useRef<GooglePlacesAutocompleteRef>(null);
  const set = useRegisterStore((s) => s.set);
  const [form, setForm] = useState({
    numero_telefono: '',
    sexo: '',
    domicilio: '',
    codigoPostal: '',
  });
  const [errors, setErrors] = useState({
    numero_telefono: '',
    sexo: '',
    domicilio: '',
    codigoPostal: '',
  });
  const onChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validateFields = () => {
    return {
      domicilio: !form.domicilio.trim() ? 'La dirección es obligatoria' : '',
      numero_telefono: !/^\d{10}$/.test(form.numero_telefono) ? 'Ingresa un número de 10 dígitos' : '',
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
        domicilio: direccion, // <-- así sí actualiza el campo correcto
        colonia,
        codigoPostal,
      }));
      setErrors((prev) => ({
        ...prev,
        domicilio: '',
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
      numero_telefono: form.numero_telefono,
      sexo: form.sexo,
      domicilio: form.domicilio,
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
            {errors.domicilio ? (
              <ThemedText type="error" style={{ marginTop: 4 }}>
                {errors.domicilio}
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
              style={{ borderBottomWidth: 0, }}
            />
          </View>
            <View style={{ width: '100%', marginTop: 12 }}>
              <ThemedText>Telefono</ThemedText>
              <ThemedTextInput
                value={form.numero_telefono}
                onChangeText={(value) => onChange('numero_telefono', value)}
                error={!!errors.numero_telefono}
                errorMessage={errors.numero_telefono}
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
