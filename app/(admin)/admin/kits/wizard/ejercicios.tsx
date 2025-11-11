import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useWindowDimensions } from 'react-native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useKitsStore } from '@/infraestructure/store/useKitsStore';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';

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

export default function WizardEjercicios() {
  const params = useLocalSearchParams<{ kitId?: string; tipoId?: string }>();
  const kitId = useMemo(() => Number(params?.kitId || 0), [params?.kitId]);
  const tipoId = useMemo(() => Number(params?.tipoId || 0), [params?.tipoId]);
  const { width } = useWindowDimensions();
  const isMobile = width < 720;

  const { user } = useAuthStore();
  const {
    useEjerciciosDisponiblesParaKitQuery,
    crearEjercicioMutation,
  } = useEjerciciosStore();
  const { agregarEjerciciosMutation } = useKitsStore();

  // Disponibles (si hay kitId)
  const [page, setPage] = useState(1);
  const limit = isMobile ? 8 : 16;
  const { data: disponibles, isLoading } = useEjerciciosDisponiblesParaKitQuery(
    kitId || 0, page, limit, !!kitId
  );

  // Crear nuevo
  const [nuevo, setNuevo] = useState({ titulo: '', descripcion: '' });
  const [selectedEjercicioId, setSelectedEjercicioId] = useState<number | null>(null);

  const onSelect = (id: number) => setSelectedEjercicioId(id);

  const onNext = () => {
    const ejercicioId = selectedEjercicioId;
    if (!ejercicioId) {
      Alert.alert('Selecciona/crea un ejercicio', 'Elige un ejercicio de la lista o crea uno nuevo.');
      return;
    }
    router.push({
      pathname: '/admin/kits/wizard/subtipos',
      params: { kitId, tipoId, ejercicioId }
    });
  };

  const onCrear = () => {
    if (!tipoId) {
      Alert.alert('Falta tipo', 'Regresa al paso anterior y selecciona un tipo.');
      return;
    }
    if (!nuevo.titulo.trim()) {
      Alert.alert('Falta título', 'Escribe un título.');
      return;
    }
    const payload = {
      titulo: nuevo.titulo,
      descripcion: nuevo.descripcion,
      tipo_ejercicio: String(tipoId),
      creado_por: String(user?.usuario_id ?? 0),
    };
    crearEjercicioMutation.mutate(payload as any, {
      onSuccess: (resp: any) => {
        const newId = resp?.ejercicio_id ?? resp?.data?.ejercicio_id ?? resp?.id ?? resp?.ejercicio?.ejercicio_id;
        if (newId && kitId) {
          agregarEjerciciosMutation.mutate(
            { id: kitId, ejercicios: [{ ejercicio_id: Number(newId), orden: 999 }] },
            { onSuccess: () => setSelectedEjercicioId(Number(newId)) }
          );
        } else if (newId) {
          setSelectedEjercicioId(Number(newId));
        }
        Alert.alert('Listo', 'Ejercicio creado.');
      },
      onError: () => Alert.alert('Error', 'No se pudo crear el ejercicio.'),
    });
  };

  const items = (disponibles as any)?.data ?? [];
  const total =
    (disponibles as any)?.total ??
    (disponibles as any)?.pagination?.total ??
    items.length;

  return (
    <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 16, gap: 12 }}>
      <ThemedText type="title">2) Ejercicio</ThemedText>
      <ThemedText style={{ color: '#000' }}>Selecciona un ejercicio (si hay kit) o crea uno nuevo.</ThemedText>

      {!!kitId && (
        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Disponibles</ThemedText>
          {isLoading ? <ActivityIndicator /> : (
            <>
              {items.map((e: any) => (
                <ThemedButton
                  key={e.ejercicio_id}
                  onPress={() => onSelect(e.ejercicio_id)}
                  style={[
                    styles.rowBtn,
                    selectedEjercicioId === e.ejercicio_id && { backgroundColor: '#c4f0ff55', borderWidth: 1, borderColor: '#00aaff55' }
                  ]}
                >
                  <ThemedText style={{ color: '#000', fontWeight: '600' }}>
                    #{e.ejercicio_id} · {e.titulo}
                  </ThemedText>
                </ThemedButton>
              ))}
              {!items.length && <ThemedText style={{ color: '#000' }}>Sin elementos.</ThemedText>}
              <ThemedText style={{ color: '#000', opacity: 0.7, marginTop: 6 }}>Total: {total}</ThemedText>
            </>
          )}
        </View>
      )}

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Crear ejercicio</ThemedText>
        <Input label="Título" value={nuevo.titulo} onChangeText={(t: string) => setNuevo((s) => ({ ...s, titulo: t }))} />
        <Input label="Descripción" value={nuevo.descripcion} onChangeText={(t: string) => setNuevo((s) => ({ ...s, descripcion: t }))} />
        <ThemedButton onPress={onCrear}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Crear</ThemedText>
        </ThemedButton>
      </View>

      <ThemedButton onPress={onNext}>
        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Siguiente: Sub-tipo</ThemedText>
      </ThemedButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  cardMobile: { borderRadius: 14, padding: 12 },
  cardTitle: { marginBottom: 8, color: '#000' },
  rowBtn: { marginBottom: 8, borderRadius: 10, alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#00000008' },
});
