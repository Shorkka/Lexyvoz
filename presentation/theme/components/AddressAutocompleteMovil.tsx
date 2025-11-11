// AddressAutocompleteUniversal.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

type Address = {
  direccion: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  onAddressSelect: (address: Address) => void;
  value?: string;
  minChars?: number;  // umbral para empezar a sugerir (por defecto 3)
  country?: string;   // ISO2 (ej. 'mx'), por defecto 'mx'
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_ANDROID || '';

export default function AddressAutocompleteUniversal({
  onAddressSelect,
  value = '',
  minChars = 3,
  country = 'mx',
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveTypedAddress = useCallback(() => {
    const text = (query || '').trim();
    if (!text) return;
    onAddressSelect({ direccion: text });
    setResults([]);
  }, [onAddressSelect, query]);

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      setQuery(text);
      const trimmed = text.trim();

      if (!trimmed || trimmed.length < minChars || !API_KEY) {
        // Limpia sugerencias en textos cortos o sin API key; aceptamos manual si el usuario quiere.
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const url =
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
            `input=${encodeURIComponent(trimmed)}` +
            `&key=${API_KEY}` +
            `&language=es` +
            `&components=country:${country}`;
          const res = await fetch(url);
          const json = await res.json();
          setResults(Array.isArray(json.predictions) ? json.predictions : []);
        } catch {
          // Silencioso: no mostramos errores; el usuario puede guardar manualmente
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [ country, minChars]
  );

  const fetchDetails = useCallback(
    async (placeId: string, description: string) => {
      if (!API_KEY) {
        saveTypedAddress();
        return;
      }
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/details/json?` +
          `place_id=${placeId}&key=${API_KEY}&language=es`;
        const res = await fetch(url);
        const json = await res.json();
        const details = json.result;
        if (!details) {
          saveTypedAddress();
          return;
        }

        const components = details.address_components || [];
        const getComp = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name || '';

        const address: Address = {
          direccion: details.formatted_address || description,
          colonia: getComp('sublocality') || getComp('neighborhood'),
          codigoPostal: getComp('postal_code'),
          ciudad: getComp('locality'),
          estado: getComp('administrative_area_level_1'),
          pais: getComp('country'),
          lat: details.geometry?.location?.lat ?? undefined,
          lng: details.geometry?.location?.lng ?? undefined,
        };

        onAddressSelect(address);
        setQuery(address.direccion);
        setResults([]);
      } catch {
        // Fallback silencioso a manual
        saveTypedAddress();
      }
    },
    [, onAddressSelect, saveTypedAddress]
  );

  // Componemos una lista que pone primero la opción manual (si hay texto).
  const composedResults = [
    ...(query.trim()
      ? [
          {
            place_id: '__manual__',
            description: `Usar esta dirección: ${query.trim()}`,
            _isManual: true,
          },
        ]
      : []),
    ...results,
  ];

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={fetchPredictions}
        placeholder="Escribe tu dirección..."
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={saveTypedAddress} // enter acepta lo escrito
        autoCorrect={false}
        autoCapitalize="none"
      />

      {loading && <ActivityIndicator size="small" color="#ff9900" style={{ marginTop: 6 }} />}

      <FlatList
        data={composedResults}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={styles.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              item._isManual
                ? saveTypedAddress()
                : fetchDetails(item.place_id, item.description)
            }
          >
            <Text style={styles.itemText}>
              {item._isManual ? item.description : item.description}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, width: '100%' },
  input: {
    height: 48,
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: '#fff3e7',
    fontSize: 16,
    color: '#333',
  },
  results: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 220,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 15, fontWeight: '500', color: '#333' },
});
