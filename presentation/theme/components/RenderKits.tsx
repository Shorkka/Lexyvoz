import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useMemo } from 'react';

interface RenderKitsProps {
  currentPage?: number;
  visibleKits: any[];
  totalPages: number;
  onKitPress?: (kit: any) => void;
  userIdSeed?: number | string;
  contentPadding?: number;
}

function hashSeed(seed: string | number = 0) {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Intenta obtener porcentaje 0..100 desde distintas formas que puede traer el backend */
function getKitProgressPercent(kit: any): number | null {
  if (!kit) return null;

  const isFiniteNum = (n: any) => typeof n === 'number' && isFinite(n);

  // 1) Campos explícitos 0..100
  const p100Candidates = [
    kit.progress_percent,
    kit.progreso_percent,
    kit.porcentaje_avance,
    kit.porcentaje,
  ].filter(isFiniteNum);
  if (p100Candidates.length) {
    const v = Math.max(0, Math.min(100, Number(p100Candidates[0])));
    return v;
  }

  // 2) Campos 0..1
  const p01Candidates = [kit.progreso, kit.progress, kit.avance].filter(isFiniteNum);
  if (p01Candidates.length) {
    let v = Number(p01Candidates[0]);
    if (v > 1) {
      // por si ya viene 0..100
      v = v / 100;
    }
    return Math.max(0, Math.min(100, v * 100));
  }

  // 3) Contadores completados/total (reactivos o ejercicios)
  const pairs: [any, any][] = [
    [kit.completados_count, kit.total_reactivos],
    [kit.reactivos_completados, kit.reactivos_total],
    [kit.ejercicios_completados, kit.ejercicios_count],
  ];
  for (const [done, total] of pairs) {
    if (isFiniteNum(done) && isFiniteNum(total) && total > 0) {
      const v = (Number(done) / Number(total)) * 100;
      return Math.max(0, Math.min(100, v));
    }
  }

  return null;
}

function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.progressOuter} accessible accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(p), min: 0, max: 100 }}>
      <View style={[styles.progressInner, { width: `${p}%` }]} />
    </View>
  );
}

export default function RenderKits({
  visibleKits,
  onKitPress,
  userIdSeed = 0,
  contentPadding = 16,
}: RenderKitsProps) {
  const kitOfTheDay = useMemo(() => {
    const kits = Array.isArray(visibleKits) ? visibleKits : [];
    if (kits.length === 0) return null;
    const epochDays = Math.floor(Date.now() / 86_400_000);
    const seed = (epochDays + hashSeed(userIdSeed)) % kits.length;
    return kits[seed];
  }, [visibleKits, userIdSeed]);

  if (!kitOfTheDay) {
    return (
      <View style={[styles.emptyContainer, { paddingHorizontal: contentPadding }]}>
        <Text style={styles.emptyText}>No hay kits disponibles</Text>
      </View>
    );
  }

  const kit = kitOfTheDay;
  const progress = getKitProgressPercent(kit); // 0..100 o null

  return (
    <View style={[styles.mainContainer, { paddingHorizontal: contentPadding }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          key={kit.kit_id ?? kit.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => onKitPress?.(kit)}
        >
          <Text style={styles.title} numberOfLines={1}>
            {kit.name || kit.kit_nombre || 'Sin nombre'}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {kit.descripcion || kit.kit_descripcion || 'Sin descripción'}
          </Text>

          {progress !== null && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.progressLabel}>
                Progreso: {Math.round(progress)}%
              </Text>
              <ProgressBar percent={progress} />
            </View>
          )}

          <Text style={styles.creator} numberOfLines={1}>
            Creado por: {kit.creador_nombre || 'Desconocido'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Este kit rota automáticamente cada 24 horas.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  card: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  description: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 18 },
  creator: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 10 },
  hint: { marginTop: 10, textAlign: 'center', color: '#666' },
  emptyContainer: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },

  progressLabel: { fontSize: 12, color: '#555', marginBottom: 6 },
  progressOuter: {
    width: '100%',
    height: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  progressInner: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ee7200',
  },
});
