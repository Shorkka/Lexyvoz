import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';

import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';

import { useTiposStore } from '@/infraestructure/store/useTiposStore';

const Input = ({ label, value, onChangeText, keyboardType, placeholder }: any) => (
  <View style={{ marginBottom: 12 }}>
    <ThemedText type="defaultSemiBold" style={{ marginBottom: 6, color: '#000' }}>{label}</ThemedText>
    <TextInput
      value={value ?? ''}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType ?? 'default'}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'web' ? 10 : 12,
        borderWidth: 1,
        borderColor: '#0000001a',
      }}
    />
  </View>
);

export default function WizardTipos() {
  const params = useLocalSearchParams<{ kitId?: string }>();
  const kitId = useMemo(() => Number(params?.kitId || 0), [params?.kitId]);
  const { width } = useWindowDimensions();
  const isMobile = width < 720;

  const { useListarTiposKitsQuery } = useTiposStore();
  const { data: tiposData, isLoading, isError, error } = useListarTiposKitsQuery();

  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null);
  const [nuevoNombreTipo, setNuevoNombreTipo] = useState('');

  // Normaliza posibles shapes de la respuesta: array directo, {tipos:[]}, {data:[]}, {results:[]}
  const tipos: any[] = useMemo(() => {
    const d: any = tiposData;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.tipos)) return d.tipos;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.results)) return d.results;
    return [];
  }, [tiposData]);

  const onNext = () => {
    if (!selectedTipoId) {
      Alert.alert('Selecciona un tipo', 'Elige un tipo o crea uno.');
      return;
    }
    if (!kitId) {
      Alert.alert('Kit inválido', 'Falta el kitId en la URL.');
      return;
    }
    router.push({
      pathname: '/admin/kits/wizard/ejercicios',
      params: { kitId: String(kitId), tipoId: String(selectedTipoId) },
    });
  };

  const onCrearTipo = async () => {
    // Aquí puedes implementar tu flujo real de creación (con tu mutation actual).
    // Lo dejo explícito para que no bloquee tu UI:
    if (!nuevoNombreTipo.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre, p. ej. "Lectura".');
      return;
    }
    Alert.alert('Crear tipo', `Pendiente de integrar con tu endpoint. Nombre: ${nuevoNombreTipo.trim()}`);
  };

  return (
    <ThemedBackground fullHeight backgroundColor={'#f5f5f7'} style={{ padding: isMobile ? 12 : 16 }}>
      <ScrollView contentContainerStyle={{ gap: 12 }} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={{ color: '#000' }}>1) Tipo de ejercicio</ThemedText>
        <ThemedText style={{ color: '#000' }}>Selecciona un tipo existente o crea uno nuevo.</ThemedText>

        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Tipos existentes</ThemedText>

          {isLoading && <ActivityIndicator />}

          {isError && (
            <ThemedText style={{ color: 'red' }}>
              {String((error as any)?.message ?? 'Error al cargar tipos')}
            </ThemedText>
          )}

          {!isLoading && !isError && (
            <>
              {Array.isArray(tipos) && tipos.length > 0 ? (
                tipos.map((t: any, idx: number) => {
                  const tid = Number(t?.tipo_id ?? t?.id ?? t?.tipoId);
                  const isSelected = selectedTipoId === tid;
                  return (
                    <ThemedButton
                      key={Number.isFinite(tid) ? `tipo-${tid}` : `tipo-idx-${idx}`}
                      onPress={() => Number.isFinite(tid) && setSelectedTipoId(tid)}
                      style={[
                        styles.rowBtn,
                        isSelected && { backgroundColor: '#c4f0ff55', borderWidth: 1, borderColor: '#00aaff55' },
                      ]}
                    >
                      <ThemedText style={{ color: '#000', fontWeight: '600' }}>
                        #{Number.isFinite(tid) ? tid : '—'} · {t?.nombre ?? t?.tipo_nombre ?? t?.label ?? 'Tipo'}
                      </ThemedText>
                    </ThemedButton>
                  );
                })
              ) : (
                <ThemedText style={{ color: '#000' }}>No hay tipos aún.</ThemedText>
              )}
            </>
          )}
        </View>

        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Crear tipo</ThemedText>
          <Input
            label="Nombre"
            value={nuevoNombreTipo}
            onChangeText={setNuevoNombreTipo}
            placeholder="Ej. Lectura"
          />
          <ThemedButton onPress={onCrearTipo}>
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Crear tipo</ThemedText>
          </ThemedButton>
        </View>

        <ThemedButton onPress={onNext} style={{ marginTop: 4 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Siguiente: Ejercicio</ThemedText>
        </ThemedButton>
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  cardMobile: { borderRadius: 14, padding: 12 },
  cardTitle: { marginBottom: 8, color: '#000' },
  rowBtn: {
    marginBottom: 8,
    borderRadius: 10,
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#00000008',
  },
});
