import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, ScrollView, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import { useReactivosStore } from '@/infraestructure/store/useReactivosStore';

const Input = ({ label, value, onChangeText, keyboardType, placeholder }: any) => (
  <View style={{ marginBottom: 12 }}>
    <ThemedText type="defaultSemiBold" style={{ marginBottom: 6, color: '#000' }}>{label}</ThemedText>
    <TextInput
      value={value ?? ''}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType ?? 'default'}
      style={{
        backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'web' ? 10 : 12, borderWidth: 1, borderColor: '#0000001a',
      }}
    />
  </View>
);

export default function WizardReactivos() {
  const params = useLocalSearchParams<{ ejercicioId?: string; subTipoId?: string }>();
  const ejercicioId = useMemo(() => Number(params?.ejercicioId || 0), [params?.ejercicioId]);
  const subTipoId = useMemo(() => Number(params?.subTipoId || 0), [params?.subTipoId]);
  const { width } = useWindowDimensions();
  const isMobile = width < 720;

  const { useReactivosDeEjercicioQuery, agregarReactivosMutation } = useEjerciciosStore();
  const { crearReactivoMutation } = useReactivosStore();

  const { data: reactivosDeEj, isLoading: loadingReactivos, refetch } =
    useReactivosDeEjercicioQuery(ejercicioId);

  const [idsCsv, setIdsCsv] = useState('');
  const [nuevoReactivo, setNuevoReactivo] = useState<{ pseudopalabra?: string; tiempo_duracion?: number }>({
    pseudopalabra: '',
    tiempo_duracion: undefined,
  });

  const onAgregarExistentes = () => {
    if (!ejercicioId) return;
    const ids = idsCsv.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n > 0);
    if (!ids.length) {
      Alert.alert('Nada que agregar', 'Escribe al menos un ID válido.');
      return;
    }
    const payload = ids.map((id, idx) => ({ id_reactivo: id, orden: idx + 1 }));
    agregarReactivosMutation.mutate({ ejercicioId, reactivos: payload }, {
      onSuccess: () => { setIdsCsv(''); refetch?.(); },
      onError: () => Alert.alert('Error', 'No se pudieron agregar.'),
    });
  };

  const onCrearReactivo = () => {
    if (!ejercicioId) {
      Alert.alert('Falta ejercicio', 'Vuelve al paso de ejercicio.');
      return;
    }
    if (!subTipoId) {
      Alert.alert('Falta sub-tipo', 'Vuelve al paso de sub-tipo.');
      return;
    }
    const body = {
      id_sub_tipo: subTipoId,
      pseudopalabra: nuevoReactivo.pseudopalabra ?? '',
      tiempo_duracion: nuevoReactivo.tiempo_duracion ?? 0,
    };
    crearReactivoMutation.mutate(body as any, {
      onSuccess: (resp: any) => {
        const rid = resp?.reactivo_id ?? resp?.data?.reactivo_id ?? resp?.id ?? resp?.reactivo?.reactivo_id;
        const current = ((reactivosDeEj as any)?.reactivos ?? []) as any[];
        const nextOrden = (current?.length || 0) + 1;
        if (rid) {
          agregarReactivosMutation.mutate(
            { ejercicioId, reactivos: [{ id_reactivo: Number(rid), orden: nextOrden }] },
            { onSuccess: () => { setNuevoReactivo({ pseudopalabra: '', tiempo_duracion: undefined }); refetch?.(); } }
          );
        } else {
          refetch?.();
        }
      },
      onError: () => Alert.alert('Error', 'No se pudo crear el reactivo.'),
    });
  };

  const reactivos = (reactivosDeEj as any)?.reactivos ?? [];

  return (
    <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 16, gap: 12 }}>
      <ThemedText type="title">4) Reactivos</ThemedText>
      <ThemedText style={{ color: '#000' }}>Agrega IDs existentes o crea nuevos para este ejercicio.</ThemedText>

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Del ejercicio</ThemedText>
        {loadingReactivos ? <ActivityIndicator /> : (
          <>
            {reactivos.map((r: any) => (
              <View key={r.id_reactivo ?? r.reactivo_id} style={styles.row}>
                <ThemedText style={{ color: '#000', fontWeight: '600' }}>
                  #{r.id_reactivo ?? r.reactivo_id} · {r.pseudopalabra ?? r.texto ?? 'Reactivo'}
                </ThemedText>
                <ThemedText style={{ color: '#000', opacity: 0.7 }}>Orden: {r.orden ?? '-'}</ThemedText>
              </View>
            ))}
            {!reactivos.length && <ThemedText style={{ color: '#000' }}>Aún no hay reactivos.</ThemedText>}
          </>
        )}
      </View>

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Agregar EXISTENTES</ThemedText>
        <Input label="IDs (coma)" value={idsCsv} onChangeText={setIdsCsv} placeholder="10,12,15" />
        <ThemedButton onPress={onAgregarExistentes}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Agregar</ThemedText>
        </ThemedButton>
      </View>

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Crear NUEVO</ThemedText>
        <Input label="Pseudopalabra / texto" value={nuevoReactivo.pseudopalabra ?? ''} onChangeText={(t: string) => setNuevoReactivo((s) => ({ ...s, pseudopalabra: t }))} />
        <Input label="Tiempo (ms)" keyboardType="numeric" value={String(nuevoReactivo.tiempo_duracion ?? '')} onChangeText={(t: string) => setNuevoReactivo((s) => ({ ...s, tiempo_duracion: Number(t) || undefined }))} />
        <ThemedButton onPress={onCrearReactivo}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Crear y agregar</ThemedText>
        </ThemedButton>
      </View>

      <ThemedButton onPress={() => router.replace('/admin/kits')}>
        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Finalizar</ThemedText>
      </ThemedButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  cardMobile: { borderRadius: 14, padding: 12 },
  cardTitle: { marginBottom: 8, color: '#000' },
  row: { padding: 10, borderRadius: 10, backgroundColor: '#00000008', marginBottom: 6 },
});
