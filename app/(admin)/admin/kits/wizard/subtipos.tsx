import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useWindowDimensions } from 'react-native';
import { productsApi } from '@/core/auth/api/productsApi';

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

export default function WizardSubtipos() {
  const params = useLocalSearchParams<{ kitId?: string; tipoId?: string; ejercicioId?: string }>();
  const kitId = useMemo(() => Number(params?.kitId || 0), [params?.kitId]);
  const tipoId = useMemo(() => Number(params?.tipoId || 0), [params?.tipoId]);
  const ejercicioId = useMemo(() => Number(params?.ejercicioId || 0), [params?.ejercicioId]);
  const { width } = useWindowDimensions();
  const isMobile = width < 720;

  const [subTipoId, setSubTipoId] = useState<number | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const onCrearSubtipo = async () => {
    if (!nuevoNombre.trim()) {
      Alert.alert('Falta nombre', 'Escribe un nombre para el sub-tipo.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await productsApi.post<any>('subtipos/crear', { nombre: nuevoNombre, tipo_id: tipoId });
      const newId = data?.sub_tipo_id ?? data?.id;
      if (newId) {
        setSubTipoId(Number(newId));
        Alert.alert('Listo', 'Sub-tipo creado.');
      } else {
        Alert.alert('Creado, pero sin ID', 'Se creó el sub-tipo, pero no llegó el ID.');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el sub-tipo.');
    } finally {
      setLoading(false);
    }
  };

  const onNext = () => {
    if (!subTipoId) {
      Alert.alert('Selecciona/crea sub-tipo', 'Indica un sub-tipo.');
      return;
    }
    router.push({
      pathname: '/admin/kits/wizard/reactivos',
      params: { kitId, tipoId, ejercicioId, subTipoId }
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 16, gap: 12 }}>
      <ThemedText type="title">3) Sub-tipo</ThemedText>
      <ThemedText style={{ color: '#000' }}>
        Escribe el <ThemedText type="defaultSemiBold">ID de sub-tipo</ThemedText> si ya existe, o crea uno.
      </ThemedText>

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Usar uno existente</ThemedText>
        <Input
          label="sub_tipo_id (numérico)"
          keyboardType="numeric"
          value={String(subTipoId ?? '')}
          onChangeText={(t: string) => setSubTipoId(Number(t) || null)}
          placeholder="Ej. 101"
        />
      </View>

      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Crear sub-tipo</ThemedText>
        <Input label="Nombre" value={nuevoNombre} onChangeText={setNuevoNombre} placeholder="Ej. Pseudopalabras nivel 1" />
        <ThemedButton onPress={onCrearSubtipo} disabled={loading}>
          {loading ? <ActivityIndicator /> : <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Crear</ThemedText>}
        </ThemedButton>
      </View>

      <ThemedButton onPress={onNext}>
        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Siguiente: Reactivos</ThemedText>
      </ThemedButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  cardMobile: { borderRadius: 14, padding: 12 },
  cardTitle: { marginBottom: 8, color: '#000' },
});
