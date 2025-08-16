// AddressAutocompleteMovilMapbox.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import debounce from 'lodash.debounce';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

type Address = {
  direccion: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  pais: string;
  lat: number;
  lng: number;
};

type Prediction = {
  id: string;
  place_name: string;
  place_type: string[];
  text: string;
  context?: any[];
  center: [number, number];
};

type Props = {
  onAddressSelect: (address: Address) => void;
  limit?: number;
};

export default function AddressAutocompleteMovilMapbox({ onAddressSelect, limit = 5 }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    setError(null);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        text
      )}.json?autocomplete=true&country=mx&language=es&limit=${limit}&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const features: Prediction[] = data.features || [];
      setResults(features);
    } catch (err) {
      console.error('Mapbox search error', err);
      setError('Error buscando direcciones.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchPlaces, 400);

  const buildAddressFromFeature = (f: any): Address => {
    // Mapbox returns center [lng, lat] and place_name; context has city/state/country sometimes.
    const getFromContext = (ctx: any[], key: string) => {
      if (!ctx) return '';
      const found = ctx.find((c: any) => c.id && c.id.startsWith(key));
      return found ? found.text : '';
    };

    const postal = (f.context || []).find((c: any) => c.id && c.id.startsWith('postcode'));
    return {
      direccion: f.place_name || f.text || '',
      colonia: getFromContext(f.context, 'neighborhood') || '',
      codigoPostal: postal ? postal.text : '',
      ciudad: getFromContext(f.context, 'place') || getFromContext(f.context, 'locality') || '',
      estado: getFromContext(f.context, 'region') || '',
      pais: getFromContext(f.context, 'country') || 'México',
      lat: (f.center && f.center[1]) || 0,
      lng: (f.center && f.center[0]) || 0,
    };
  };

  const handleSelect = (item: Prediction) => {
    const address = buildAddressFromFeature(item);
    onAddressSelect(address);
    setQuery(address.direccion);
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu dirección..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          debouncedSearch(text);
        }}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#ff9900" />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {results.length > 0 && (
        <ScrollView
          nestedScrollEnabled
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="always"
        >
          {results.map((r) => (
            <TouchableOpacity key={r.id} style={styles.itemContainer} onPress={() => handleSelect(r)}>
              <Text style={styles.itemMainText} numberOfLines={1}>{r.place_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: '100%',
    zIndex: 10,
  },
  input: {
    height: 48,
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: '#fff3e7',
    fontSize: 16,
    color: '#333',
    width: '100%',
    paddingRight: 40,
  },
  loaderContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 4,
    fontSize: 14,
  },
  resultsContainer: {
    maxHeight: 220,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemMainText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
