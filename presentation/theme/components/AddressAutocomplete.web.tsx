// AddressAutocomplete.web.tsx
import React, { useEffect, useRef, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_WEB || '';
console.log('Google Places API Key web:', apiKey);

interface Props {
  onAddressSelect: (data: {
    direccion: string;
    colonia: string;
    codigoPostal: string;
  }) => void;
}

const AddressAutocompleteWeb = forwardRef<any, Props>(function AddressAutocompleteWeb(props, ref) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const win = window as any;

    // Cargar la librería de Google si no está
    if (!win.google?.maps?.places) {
      const script = document.createElement('script');
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`;
      script.async = true;
      document.head.appendChild(script);
    }

    const iniciar = () => {
      const autocomplete = new win.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'mx' },
          fields: ['address_component'],
        }
      );

      autocomplete.addListener('place_changed', () => {
        const lugar = autocomplete.getPlace();
        if (!lugar.address_components) return;

        const obtener = (tipo: string) =>
            (Array.isArray(lugar.address_components) ? lugar.address_components : [])
            .find((c: any) => Array.isArray(c.types) && c.types.includes(tipo))
            ?.long_name || '';

        props.onAddressSelect({
          direccion: `${obtener('route')} ${obtener('street_number')}`.trim(),
          colonia: obtener('neighborhood') || obtener('sublocality'),
          codigoPostal: obtener('postal_code'),
        });
      });
    };

    const esperar = () => {
      if (win.google?.maps?.places) iniciar();
      else setTimeout(esperar, 200);
    };
    esperar();
  }, [props, props.onAddressSelect]);

  return (
    <View style={styles.contenedor}>
      <input
        ref={inputRef}
        placeholder="Escribe tu dirección"
        style={styles.input}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  contenedor: { marginTop: 8, color: '#ff9900',  borderColor: '#ff9900', },
  input: {
    width: '100%',
    minHeight: 48,
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff3e7',
    fontSize: 16,
    color: '#ff9900',
    textAlign: 'left',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
});

export default AddressAutocompleteWeb;