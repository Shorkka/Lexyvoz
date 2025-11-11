// AddressAutocompleteWeb.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import ReactDOM from 'react-dom';

type Address = {
  direccion: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
};

type Props = {
  onAddressSelect: (address: Address) => void;
  limit?: number;
  value?: string;
  minChars?: number;  // nuevo
  country?: string;   // nuevo
};

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_WEB || '';
const PROXY = 'https://corsproxy.io/?';

export default function AddressAutocompleteWeb({
  onAddressSelect,
  limit = 5,
  value = '',
  minChars = 3,
  country = 'mx',
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<any>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDropdownPos = () => {
    if (Platform.OS === 'web' && inputRef.current?.getBoundingClientRect) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const openDropdown = () => setShowDropdown(true);
  const closeDropdown = () => setShowDropdown(false);

  const saveTypedAddress = () => {
    const text = (query || '').trim();
    if (!text) return;
    onAddressSelect({ direccion: text });
    setResults([]);
    closeDropdown();
  };

  const searchPlaces = (text: string) => {
    setQuery(text);
    openDropdown();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = text.trim();
    if (trimmed.length < minChars || !GOOGLE_KEY) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
          `?input=${encodeURIComponent(trimmed)}` +
          `&components=country:${country}&language=es&key=${GOOGLE_KEY}`;
        const res = await fetch(PROXY + url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.status === 'OK') {
          setResults((data.predictions || []).slice(0, limit));
        } else {
          setResults([]);
        }
      } catch {
        setResults([]); // silencioso
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    if (!GOOGLE_KEY) return saveTypedAddress();
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${placeId}&key=${GOOGLE_KEY}&language=es`;
      const res = await fetch(PROXY + url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data.result;
      if (!result) return saveTypedAddress();

      const getComp = (type: string) =>
        (result.address_components || []).find((c: any) => c.types.includes(type))?.long_name || '';

      const address: Address = {
        direccion: description || result.formatted_address || '',
        colonia: getComp('sublocality') || getComp('neighborhood'),
        codigoPostal: getComp('postal_code'),
        ciudad: getComp('locality'),
        estado: getComp('administrative_area_level_1'),
        pais: getComp('country'),
      };

      onAddressSelect(address);
      setQuery(address.direccion);
      setResults([]);
      closeDropdown();
    } catch {
      saveTypedAddress(); // fallback silencioso
    }
  };

  const Dropdown = (
    <View
      style={[
        styles.results,
        {
          position: 'absolute',
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
        },
      ]}
    >
      {/* Opción manual siempre visible si hay texto */}
      {query.trim().length >= 1 ? (
        <TouchableOpacity
          style={[styles.item, styles.manualItem, styles.clickable]}
          onPress={saveTypedAddress}
          onPressIn={Platform.OS === 'web' ? saveTypedAddress : undefined}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.itemText}>
            Usar esta dirección: <Text style={styles.bold}>{query.trim()}</Text>
          </Text>
        </TouchableOpacity>
      ) : null}

      {results.map((r) => (
        <TouchableOpacity
          key={r.place_id}
          style={[styles.item, styles.clickable]}
          onPress={() => fetchPlaceDetails(r.place_id, r.description)}
          onPressIn={
            Platform.OS === 'web'
              ? () => fetchPlaceDetails(r.place_id, r.description)
              : undefined
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.itemText}>{r.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Escribe tu dirección..."
        placeholderTextColor="#aaa"
        value={query}
        onFocus={() => {
          updateDropdownPos();
          openDropdown();
        }}
        onChangeText={(text) => {
          searchPlaces(text);
          updateDropdownPos();
        }}
        onSubmitEditing={saveTypedAddress} // Enter acepta lo escrito
        onBlur={() => setTimeout(() => closeDropdown(), 120)}
        autoCorrect={false}
        autoCapitalize="none"
        autoComplete="off"
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#ff9900" />
        </View>
      ) : null}

      {showDropdown &&
        (Platform.OS === 'web'
          ? ReactDOM.createPortal(
              (results.length > 0 || (query.trim().length >= 1 && !loading)) ? Dropdown : null,
              document.body
            )
          : (results.length > 0 || (query.trim().length >= 1 && !loading)) && Dropdown)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, width: '100%', position: 'relative' },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: '#fff3e7',
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: { position: 'absolute', right: 12, top: 12 },
  results: {
    zIndex: 999999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 260,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  manualItem: { backgroundColor: '#fff9f1' },
  itemText: { fontSize: 15, color: '#333' },
  bold: { fontWeight: '600' },
  clickable: Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
});
