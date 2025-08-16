// AddressAutocompleteWithProvider.tsx
import React, { useEffect, useRef, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  APIProvider,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_WEB || '';
console.log('Google Places API Key:', apiKey);
interface Props {
  onAddressSelect: (data: {
    direccion: string;
    colonia: string;
    codigoPostal: string;
  }) => void;
}

const AddressAutocompleteInner = forwardRef<any, Props>(function AddressAutocompleteInner(props, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary('places'); // carga la librería de Places :contentReference[oaicite:0]{index=0}

  useEffect(() => {
    if (!placesLib || !(window as any).google?.maps?.places) return;

    const win = window as any;
    const autocomplete = new win.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'mx' },
        fields: ['address_component'],
        language: 'es',
      }
    );

    autocomplete.addListener('place_changed', () => {
      const lugar = autocomplete.getPlace();
      if (!lugar.address_components) return;

      const obtener = (tipo: string) =>
        (lugar.address_components || []).find((c: any) =>
          Array.isArray(c.types) && c.types.includes(tipo)
        )?.long_name || '';

      props.onAddressSelect({
        direccion: `${obtener('route')} ${obtener('street_number')}`.trim(),
        colonia: obtener('neighborhood') || obtener('sublocality'),
        codigoPostal: obtener('postal_code'),
      });
    });
  }, [placesLib, props.onAddressSelect, inputRef, props]);

  return (
    <View style={styles.contenedor}>
      <input
        ref={inputRef}
        placeholder="Escribe tu dirección"
        style={styles.input as React.CSSProperties}
      />
    </View>
  );
});

const AddressAutocompleteWithProvider = forwardRef<any, Props>(function AddressAutocompleteWithProvider(props, ref) {
  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places']}
      language="es"
      region="MX"
      onError={(error) => console.error('Maps API failed to load', error)}
    >
      <AddressAutocompleteInner ref={ref} onAddressSelect={props.onAddressSelect} />
    </APIProvider>
  );
});

const styles = StyleSheet.create({
  contenedor: { marginTop: 8, color: '#ff9900', borderColor: '#ff9900' },
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

export default AddressAutocompleteWithProvider;
