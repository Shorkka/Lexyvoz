// src/presentation/theme/components/AddressAutocomplete.tsx
import React, { forwardRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { useThemeColor } from '../hooks/useThemeColor';

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
    const [apiKey, setApiKey] = useState<string>('');

    useEffect(() => {
      // Solo cargar API key para Android
      if (Platform.OS === 'android') {
        const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_ANDROID;
        console.log('Google Places API Key loaded for Android:', !!key);
        setApiKey(key || '');
      }
    }, []);

    // Si no es Android, mostrar mensaje
    if (Platform.OS !== 'android') {
      return (
        <View style={styles.container}>
          <Text style={{ color: 'orange', textAlign: 'center', padding: 16 }}>
            📱 Función de búsqueda de direcciones solo disponible en Android
          </Text>
        </View>
      );
    }

    // Si es Android pero no hay API key
    if (!apiKey) {
      return (
        <View style={styles.container}>
          <Text style={{ color: 'red', textAlign: 'center', padding: 16 }}>
            ⚠️ Google Places API key no configurada para Android
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Buscar dirección..."
          minLength={2}
          listViewDisplayed="auto"
          fetchDetails={true}
          renderDescription={(row) => row.description}
          onPress={(data, details = null) => {
            console.log('Dirección seleccionada:', data.description);
            console.log('Detalles:', details);

            // Si no hay detalles, usar solo la descripción
            if (!details) {
              onAddressSelect({
                direccion: data.description || '',
                colonia: '',
                codigoPostal: '',
              });
              return;
            }

            // Extraer componentes de la dirección de forma segura
            const components = details.address_components || [];

            const getComponent = (types: string[]): string => {
              const component = components.find((comp: any) =>
                comp.types && comp.types.some((type: string) => types.includes(type))
              );
              return component?.long_name || '';
            };

            // Construir la dirección
            const streetNumber = getComponent(['street_number']);
            const route = getComponent(['route']);
            const direccionCompleta = [route, streetNumber].filter(Boolean).join(' ').trim();

            const addressData = {
              direccion: direccionCompleta || data.description || '',
              colonia: getComponent(['neighborhood', 'sublocality', 'sublocality_level_1']) || '',
              codigoPostal: getComponent(['postal_code']) || '',
            };

            console.log('Datos extraídos:', addressData);
            onAddressSelect(addressData);
          }}
          onFail={(error) => {
            console.error('Error en Google Places:', error);
          }}
          query={{
            key: apiKey, // Solo la API key de Android
            language: 'es',
            components: 'country:mx', // Restringir a México
            types: 'address', // Solo direcciones
          }}
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              flexDirection: 'row',
            },
            textInput: {
              backgroundColor: backgroundColor,
              color: textColor,
              height: 48,
              borderRadius: 8,
              paddingVertical: 5,
              paddingHorizontal: 12,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#ccc',
            },
            poweredContainer: {
              display: 'none', // Ocultar "powered by Google"
            },
            powered: {
              display: 'none',
            },
            listView: {
              backgroundColor: backgroundColor,
              borderRadius: 8,
              marginTop: 2,
              elevation: 5, // Sombra en Android
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            row: {
              backgroundColor: backgroundColor,
              padding: 13,
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
            },
            separator: {
              height: StyleSheet.hairlineWidth,
              backgroundColor: '#c8c7cc',
            },
            description: {
              color: textColor,
              fontSize: 14,
            },
          }}
          enablePoweredByContainer={false}
          debounce={300} // Esperar 300ms antes de buscar
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]}
          predefinedPlaces={[]}
          currentLocation={false}
          textInputProps={{
            placeholderTextColor: '#999',
            returnKeyType: 'search',
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    zIndex: 1000, // Para que aparezca sobre otros elementos
  },
});

export default AddressAutocomplete;