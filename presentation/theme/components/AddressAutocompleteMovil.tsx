// presentation/theme/components/AddressAutocomplete.tsx  (Android/iOS - Native)
import React, { useState, useCallback, useEffect, useRef } from 'react';
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

type GooglePrediction = {
  place_id: string;
  description: string;
  _isManual?: boolean;
};

type Props = {
  onAddressSelect: (address: Address) => void;
  value?: string;
  minChars?: number;        // 3 por defecto
  country?: string;         // 'mx' por defecto
  codigoPostalValue?: string; // <- CP externo del formulario
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_ANDROID || '';
const ORANGE = '#ff9900';

export default function AddressAutocomplete({
  onAddressSelect,
  value = '',
  minChars = 3,
  country = 'mx',
  codigoPostalValue = '',
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GooglePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<Address | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressBlurCommitRef = useRef(false); // evita confirmar manual si se toca una sugerencia

  useEffect(() => {
    if (value !== query) setQuery(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const resetResults = () => {
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const isCpValid = /^\d{5}$/.test((codigoPostalValue || '').trim());

  const saveTypedAddress = useCallback(() => {
    const text = (query || '').trim();
    if (!text) return;
    onAddressSelect({
      direccion: text,
      codigoPostal: (codigoPostalValue || '').trim() || undefined,
    });
    setPending(null);
    resetResults();
  }, [onAddressSelect, query, codigoPostalValue]);

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      setQuery(text);
      setPending(null); // si cambia el texto, cancelamos confirmación
      const trimmed = text.trim();

      if (!trimmed || trimmed.length < minChars || !API_KEY) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const url =
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
            `input=${encodeURIComponent(trimmed)}&key=${API_KEY}&language=es&components=country:${country}`;
          const res = await fetch(url);
          const json = await res.json();
          const preds: GooglePrediction[] = Array.isArray(json.predictions) ? json.predictions : [];
          setResults(preds);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [country, minChars]
  );

  const fetchDetails = useCallback(
    async (placeId: string, description: string) => {
      if (!API_KEY) return saveTypedAddress();
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&language=es`;
        const res = await fetch(url);
        const json = await res.json();
        const details = json.result;
        if (!details) return saveTypedAddress();

        const components = details.address_components || [];
        const getComp = (type: string) =>
          components.find((c: any) => c.types?.includes(type))?.long_name || '';

        const address: Address = {
          direccion: details.formatted_address || description,
          colonia: getComp('sublocality') || getComp('neighborhood'),
          ciudad: getComp('locality') || getComp('administrative_area_level_2'),
          estado: getComp('administrative_area_level_1'),
          pais: getComp('country'),
          lat: details.geometry?.location?.lat ?? undefined,
          lng: details.geometry?.location?.lng ?? undefined,
        };

        setPending(address);      // requiere confirmación con CP externo
        setQuery(address.direccion);
        setResults([]);
      } catch {
        saveTypedAddress();
      }
    },
    [saveTypedAddress]
  );

  const confirmPending = useCallback(() => {
    if (!pending || !isCpValid) return;
    onAddressSelect({ ...pending, codigoPostal: (codigoPostalValue || '').trim() });
    setPending(null);
    resetResults();
  }, [pending, isCpValid, codigoPostalValue, onAddressSelect]);

  // Auto-confirmar dirección manual al perder foco si no hay selección de sugerencia
  const handleBlur = () => {
    setTimeout(() => {
      if (!pending && (query || '').trim() && !suppressBlurCommitRef.current) {
        saveTypedAddress();
      }
      suppressBlurCommitRef.current = false;
    }, 80);
  };

  const composedResults: GooglePrediction[] = [
    ...(query.trim()
      ? [{ place_id: '__manual__', description: `Usar esta dirección: ${query.trim()}`, _isManual: true }]
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
        onSubmitEditing={saveTypedAddress}
        onBlur={handleBlur}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {loading && <ActivityIndicator size="small" style={styles.loader} />}

      <FlatList
        data={composedResults}
        keyExtractor={(item) => item.place_id}
        scrollEnabled = {false}
        keyboardShouldPersistTaps="handled"
        style={styles.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPressIn={() => { suppressBlurCommitRef.current = true; }}
            onPress={() =>
              item._isManual ? saveTypedAddress() : fetchDetails(item.place_id, item.description)
            }
          >
            <Text style={styles.itemText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={null}
      />

      {pending && (
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Confirma esta dirección</Text>
          <Text style={styles.confirmLine}>{pending.direccion}</Text>
          {!!pending.colonia && <Text style={styles.confirmLine}>Colonia: {pending.colonia}</Text>}
          {!!pending.ciudad && <Text style={styles.confirmLine}>Ciudad: {pending.ciudad}</Text>}
          {!!pending.estado && <Text style={styles.confirmLine}>Estado: {pending.estado}</Text>}
          {!!pending.pais && <Text style={styles.confirmLine}>País: {pending.pais}</Text>}
          <Text style={styles.confirmHint}>
            Se usará el código postal del formulario: {isCpValid ? codigoPostalValue : '— faltante/ inválido —'}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setPending(null)}>
              <Text style={styles.btnTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnConfirm, !isCpValid && styles.btnDisabled]}
              onPress={confirmPending}
              disabled={!isCpValid}
            >
              <Text style={styles.btnTextConfirm}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, width: '100%' },
  input: {
    height: 48,
    borderColor: ORANGE,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff3e7',
    fontSize: 16,
    color: '#333',
  },
  loader: { marginTop: 6 },
  results: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 240,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 15, fontWeight: '500', color: '#333' },

  confirmCard: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: ORANGE,
    backgroundColor: '#fffaf3',
    borderRadius: 10,
  },
  confirmTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  confirmLine: { fontSize: 14, color: '#333' },
  confirmHint: { fontSize: 12, color: '#666', marginTop: 8 },

  actions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnCancel: { backgroundColor: '#f2f2f2' },
  btnConfirm: { backgroundColor: ORANGE },
  btnDisabled: { opacity: 0.6 },
  btnTextCancel: { color: '#333', fontWeight: '600' },
  btnTextConfirm: { color: '#fff', fontWeight: '700' },
});
