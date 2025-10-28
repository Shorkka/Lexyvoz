import React, { useState, useCallback } from 'react';
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
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_ANDROID || '';

export default function AddressAutocompleteUniversal({ onAddressSelect, value }: Props) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = useCallback(async (text: string) => {
    if (!text) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&key=${API_KEY}&language=es&components=country:mx`;
      const res = await fetch(url);
      const json = await res.json();
      setResults(json.predictions || []);
    } catch (err) {
      console.error('Error fetching predictions', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetails = async (placeId: string, description: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&language=es`;
      const res = await fetch(url);
      const json = await res.json();
      const details = json.result;

      if (!details) return;

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
        lat: details.geometry?.location?.lat || 0,
        lng: details.geometry?.location?.lng || 0,
      };

      onAddressSelect(address);
      setQuery(address.direccion);
      setResults([]);
    } catch (err) {
      console.error('Error fetching details', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPredictions(text);
        }}
        placeholder="Escribe tu dirección..."
        style={styles.input}
      />

      {loading && <ActivityIndicator size="small" color="#ff9900" />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        style={styles.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => fetchDetails(item.place_id, item.description)}
          >
            <Text style={styles.itemText}>{item.description}</Text>
          </TouchableOpacity>
        )}
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
    maxHeight: 200,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 15, fontWeight: '500', color: '#333' },
});
