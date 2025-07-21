// src/presentation/theme/components/AddressAutocomplete.tsx
import React, { forwardRef } from 'react';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { useThemeColor } from '../hooks/useThemeColor';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_ANDROID || '';
console.log('Google Places API Key android:', apiKey);

interface Props {
  onAddressSelect: (data: {
    direccion: string;
    colonia: string;
    codigoPostal: string;
  }) => void;
}

const AddressAutocomplete = forwardRef<GooglePlacesAutocompleteRef, Props>(
  
  function AddressAutocomplete({ onAddressSelect }, ref) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    if (!apiKey) {
      return (
        <View style={styles.container}>
          <Text style={{ color: 'red' }}>
            Falta la clave de Google Places
          </Text>
        </View>
      );
}
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Escribe tu dirección"
          fetchDetails
          onFail={error => {
          console.log('Google Places Error:', error);
        }}
          onPress={(data, details = null) => {
            if (!details) return;

          const addressComponents = details.address_components || [];
          const getComp = (type: string) =>
            (Array.isArray(addressComponents) ? addressComponents : [])
          .find((c) => Array.isArray(c.types) && c.types.includes(type as any))?.long_name || '';  

            const direccion = `${getComp('route')} ${getComp('street_number')}`.trim();
            const colonia = getComp('neighborhood') || getComp('sublocality') || '';
            const codigoPostal = getComp('postal_code') || '';

            onAddressSelect({ direccion, colonia, codigoPostal });
          }}
          query={{
            key:apiKey ,
            language: 'es',
            components: 'country:mx',
          }}
          styles={{
            textInput: {
              backgroundColor,
              color: textColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 48,
              borderWidth: 1,
              borderColor: '#ccc',
            },
            listView: { backgroundColor },
            row: { padding: 13, height: 44, flexDirection: 'row' },
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 8 },
});

export default AddressAutocomplete;