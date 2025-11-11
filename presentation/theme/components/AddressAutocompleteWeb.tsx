// presentation/theme/components/AddressAutocomplete.web.tsx  (Web)
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  lat?: number;
  lng?: number;
};

type Props = {
  onAddressSelect: (address: Address) => void;
  limit?: number;
  value?: string;
  minChars?: number;
  country?: string;
  codigoPostalValue?: string; // CP externo del formulario
};

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY_WEB || '';
const PROXY = 'https://corsproxy.io/?';
const ORANGE = '#ff9900';

export default function AddressAutocompleteWeb({
  onAddressSelect,
  limit = 5,
  value = '',
  minChars = 3,
  country = 'mx',
  codigoPostalValue = '',
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pending, setPending] = useState<Address | null>(null);

  const inputRef = useRef<any>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressBlurCommitRef = useRef(false);

  const isCpValid = /^\d{5}$/.test((codigoPostalValue || '').trim());

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

  const saveTypedAddress = () => {
    const text = (query || '').trim();
    if (!text) return;
    onAddressSelect({
      direccion: text,
      codigoPostal: (codigoPostalValue || '').trim() || undefined,
    });
    setPending(null);
    resetResults();
    closeDropdown();
  };

  const searchPlaces = (text: string) => {
    setQuery(text);
    setPending(null); // cancela confirmación si editan
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
          `?input=${encodeURIComponent(trimmed)}&components=country:${country}&language=es&key=${GOOGLE_KEY}`;
        const res = await fetch(PROXY + url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.status === 'OK') setResults((data.predictions || []).slice(0, limit));
        else setResults([]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    if (!GOOGLE_KEY) return saveTypedAddress();
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_KEY}&language=es`;
      const res = await fetch(PROXY + url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data.result;
      if (!result) return saveTypedAddress();

      const getComp = (type: string) =>
        (result.address_components || []).find((c: any) => c.types.includes(type))?.long_name || '';

      const pendingAddr: Address = {
        direccion: description || result.formatted_address || '',
        colonia: getComp('sublocality') || getComp('neighborhood'),
        ciudad: getComp('locality') || getComp('administrative_area_level_2'),
        estado: getComp('administrative_area_level_1'),
        pais: getComp('country'),
        lat: result.geometry?.location?.lat ?? undefined,
        lng: result.geometry?.location?.lng ?? undefined,
      };

      setPending(pendingAddr); // requiere confirmación
      setQuery(pendingAddr.direccion);
      setResults([]);
      closeDropdown();
    } catch {
      saveTypedAddress();
    }
  };

  const confirmPending = useCallback(() => {
    if (!pending || !isCpValid) return;
    onAddressSelect({ ...pending, codigoPostal: (codigoPostalValue || '').trim() });
    setPending(null);
    resetResults();
  }, [pending, isCpValid, codigoPostalValue, onAddressSelect]);

  const Dropdown = (
    <View
      style={[
        styles.results,
        { position: 'absolute', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width },
      ]}
    >
      {/* Opción manual (opcional, ya no es necesaria para confirmar) */}
      {query.trim().length >= 1 ? (
        <TouchableOpacity
          style={[styles.item, styles.manualItem, styles.clickable]}
          onPressIn={() => { suppressBlurCommitRef.current = true; }}
          onPress={saveTypedAddress}
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
          onPressIn={() => { suppressBlurCommitRef.current = true; }}
          onPress={() => fetchPlaceDetails(r.place_id, r.description)}
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
        onSubmitEditing={saveTypedAddress} // Enter confirma manual
        onBlur={() => {
          // Auto-confirmar manual al perder foco si no se tocó una sugerencia
          setTimeout(() => {
            if (!pending && (query || '').trim() && !suppressBlurCommitRef.current) {
              saveTypedAddress();
            }
            suppressBlurCommitRef.current = false;
            closeDropdown();
          }, 120);
        }}
        autoCorrect={false}
        autoCapitalize="none"
        autoComplete="off"
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={ORANGE} />
        </View>
      ) : null}

      {showDropdown &&
        (Platform.OS === 'web'
          ? ReactDOM.createPortal(
              (results.length > 0 || (query.trim().length >= 1 && !loading)) ? Dropdown : null,
              document.body
            )
          : (results.length > 0 || (query.trim().length >= 1 && !loading)) && Dropdown)}

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
  container: { marginTop: 8, width: '100%', position: 'relative' },
  input: {
    width: '100%',
    height: 48,
    borderColor: ORANGE,
    borderWidth: 1,
    borderRadius: 8,
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
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  manualItem: { backgroundColor: '#fff9f1' },
  itemText: { fontSize: 15, color: '#333' },
  bold: { fontWeight: '600' },
  clickable: Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),

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
