import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useKitsAsignacionesStore } from '@/infraestructure/store/useKitsAsignacionesStore';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';

// Si en tu flujo usas Hashids, descomenta y usa la misma salt/len que en tu app
// import Hashids from 'hashids';
// const hashids = new Hashids('mi-secreto', 10);

type KitSnap = { id: number; name: string; descripcion?: string };

/** Utils de parsing seguros */
const parseNumber = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const parseJSON = <T,>(v: unknown, fallback: T): T => {
  try {
    if (typeof v !== 'string') return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};

const normalizeKitId = (k: any): number | null => {
  const raw =
    k?.id ??
    k?.kit_id ??
    k?.KitId ??
    k?.ID ??
    k?.Id;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const ConfirmarAsignacionKits = () => {
  const { pacienteId, kitIds, kitsSnapshot } = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');

  /** 1) Paciente: soporta Hashids o numérico plano */
  const paciente_id_num = useMemo(() => {
    // 🔸 Si viene en Hashids (no es solo dígitos), decodifica:
    // if (typeof pacienteId === 'string' && pacienteId && !/^\d+$/.test(pacienteId)) {
    //   const decoded = hashids.decode(pacienteId) as (number | string)[];
    //   const n = Number(decoded?.[0]);
    //   return Number.isFinite(n) ? n : null;
    // }

    // 🔸 Si viene como dígitos, úsalo directo:
    const n = parseNumber(pacienteId);
    return n;
  }, [pacienteId]);

  /** 2) Kits seleccionados (ids) */
  const selectedIds: number[] = useMemo(() => {
    const arr = parseJSON<number[] | string[]>(kitIds, []);
    return arr
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
  }, [kitIds]);

  /** 3) Snapshot de kits solo para mostrar (normaliza id por si viene como kit_id) */
  const selectedKits: KitSnap[] = useMemo(() => {
    const arr = parseJSON<any[]>(kitsSnapshot, []);
    return arr
      .map((k) => {
        const id = normalizeKitId(k);
        return id
          ? { id, name: String(k?.name ?? k?.nombre ?? 'Kit'), descripcion: k?.descripcion }
          : null;
      })
      .filter(Boolean) as KitSnap[];
  }, [kitsSnapshot]);

  const { asignarKitMutation } = useKitsAsignacionesStore();
  const [isAssigning, setIsAssigning] = useState(false);

  const handleConfirm = async () => {
    if (!paciente_id_num) {
      alert('Paciente inválido (id ausente o no numérico).');
      return;
    }
    if (selectedIds.length === 0) {
      alert('Selecciona al menos un kit.');
      return;
    }

    try {
      setIsAssigning(true);

      // Si tu backend soporta asignación masiva, reemplaza este loop por una sola llamada.
      for (const kitId of selectedIds) {
        await asignarKitMutation.mutateAsync({ kitId, pacienteId: paciente_id_num });
      }

      alert('Kits asignados correctamente');
      router.replace('/(app)/(doctor)/(stack)/main');
    } catch (e: any) {
      console.error('Error asignando kits:', e);
      alert(e?.response?.data?.message ?? 'No se pudieron asignar los kits');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ThemedBackground style={styles.background} fullHeight backgroundColor="#fba557">
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={{ color: 'black' }}>
              Confirmar asignación
            </ThemedText>
          </View>

          {/* Lista de kits seleccionados */}
          <View style={styles.list}>
            {selectedKits.length === 0 ? (
              <View style={styles.center}>
                <ThemedText style={{ color: 'white' }}>
                  No hay kits para mostrar
                </ThemedText>
              </View>
            ) : (
              <ScrollView>
                <View style={{ gap: 10 }}>
                  {selectedKits.map((kit) => (
                    <View key={`kit-${kit.id}`} style={styles.kitCard}>
                      <ThemedText style={styles.kitName}>{kit.name}</ThemedText>
                      {kit.descripcion ? (
                        <ThemedText style={styles.kitDesc}>{kit.descripcion}</ThemedText>
                      ) : null}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Acciones */}
          <View style={styles.footer}>
            <ThemedButton backgroundColor="grey" onPress={() => router.back()} disabled={isAssigning}>
              Volver
            </ThemedButton>
            <ThemedButton
              onPress={handleConfirm}
              disabled={isAssigning || selectedIds.length === 0 || !paciente_id_num}
            >
              {isAssigning ? <ActivityIndicator /> : `Asignar (${selectedIds.length})`}
            </ThemedButton>
          </View>
        </ThemedBackground>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  background: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 12 },
  list: { flex: 1, marginBottom: 12 },
  kitCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    ...Platform.select({
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
    }),
  },
  kitName: { color: '#333', fontWeight: '700', marginBottom: 2 },
  kitDesc: { color: '#555', fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
});

export default ConfirmarAsignacionKits;
