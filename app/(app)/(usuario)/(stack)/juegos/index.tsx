import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import FiltroTipos, { TipoFiltro } from '@/presentation/theme/components/FiltroTipos';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import { normalizeEjercicioItem } from '@/utils/ejercicios';

const ORANGE = '#ee7200';

type Seg = 'lectura' | 'escrito' | 'visual';
const TIPO_CONF: Record<1 | 2 | 3, { label: string; seg: Seg; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  1: { label: 'Lectura', seg: 'lectura', icon: 'book-outline' },
  2: { label: 'Escrito', seg: 'escrito', icon: 'create-outline' },
  3: { label: 'Visual',  seg: 'visual',  icon: 'eye-outline' },
};

const PROG_KEY = 'lexyvoz_progress_v1';
async function loadProgress(): Promise<Record<string, number>> {
  try { const s = await AsyncStorage.getItem(PROG_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
async function saveProgress(map: Record<string, number>) {
  try { await AsyncStorage.setItem(PROG_KEY, JSON.stringify(map)); } catch {}
}
function keyFor(kitId: number, ejercicioId: number) { return `${kitId}-${ejercicioId}`; }

// ---------- Card ----------
function EjercicioCard({
  e,
  kitId,
  kitName,
  onResolvedMeta,
  getProgreso,
  setProgreso,
  visible = true,
}: {
  e: any;
  kitId: number;
  kitName: string;
  onResolvedMeta: (ejercicioId: number, meta: {
    tipoId?: 1|2|3;
    tipoNombre?: string;
    subtipoId?: number;
    subtipoNombre?: string;
    totalReactivos?: number;
    ordenIds?: number[];
  }) => void;
  getProgreso: (ejercicioId: number, total?: number) => { done: number; total?: number; pct: number };
  setProgreso: (ejercicioId: number, completados: number) => void;
  visible?: boolean;
}) {
  const ne = React.useMemo(() => normalizeEjercicioItem(e), [e]);
  const { useReactivosDeEjercicioQuery } = useEjerciciosStore();

  const ejercicioId = ne.ejercicio_id ?? 0;

  const { data, isLoading, error } = useReactivosDeEjercicioQuery(ejercicioId);

  const reactivos = React.useMemo(() => {
    const r = (data as any)?.reactivos;
    return Array.isArray(r) ? r : [];
  }, [data]);

  const totalFromPayload = React.useMemo(() => {
    const t = Number((data as any)?.total_reactivos);
    if (Number.isFinite(t) && t >= 0) return t;
    return reactivos.length || undefined;
  }, [data, reactivos.length]);

  const sorted = React.useMemo(
    () => [...reactivos].sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0)),
    [reactivos]
  );

  // Meta
  const meta = React.useMemo(() => {
    if (!sorted.length) {
      const tipoId = (ne.tipo_id === 1 || ne.tipo_id === 2 || ne.tipo_id === 3) ? (ne.tipo_id as 1|2|3) : undefined;
      const tipoNombre = tipoId ? TIPO_CONF[tipoId].label : (ne.tipo_nombre || '');
      return { tipoId, tipoNombre, subtipoId: undefined, subtipoNombre: undefined, ordenIds: [] };
    }

    // mayoritario por tipo
    const tipoCounts = new Map<number, number>();
    const tipoNameMap = new Map<number, string>();
    for (const r of sorted) {
      const id = Number(r.tipo_id);
      if (Number.isFinite(id)) {
        tipoCounts.set(id, (tipoCounts.get(id) ?? 0) + 1);
        if (r.tipo_nombre) tipoNameMap.set(id, String(r.tipo_nombre));
      }
    }
    let tipoId: 1|2|3|undefined; let max = -1;
    for (const [id, cnt] of tipoCounts.entries()) {
      if (cnt > max) { max = cnt; tipoId = (id === 1 || id === 2 || id === 3) ? (id as 1|2|3) : undefined; }
    }
    const tipoNombre = tipoId ? (tipoNameMap.get(tipoId) ?? TIPO_CONF[tipoId].label) : undefined;

    // subtipo
    const subCounts = new Map<number, number>();
    const subNameMap = new Map<number, string>();
    for (const r of sorted) {
      const sid = Number(r.sub_tipo_id);
      if (Number.isFinite(sid)) {
        subCounts.set(sid, (subCounts.get(sid) ?? 0) + 1);
        if (r.sub_tipo_nombre) subNameMap.set(sid, String(r.sub_tipo_nombre));
      }
    }
    let subtipoId: number | undefined; let smax = -1;
    for (const [sid, cnt] of subCounts.entries()) {
      if (cnt > smax) { smax = cnt; subtipoId = sid; }
    }
    const subtipoNombre = subtipoId ? subNameMap.get(subtipoId) : undefined;

    const ordenIds = sorted
      .map((r: any) => Number(r.reactivo_id))
      .filter((n: any) => Number.isFinite(n));

    return { tipoId, tipoNombre, subtipoId, subtipoNombre, ordenIds };
  }, [sorted, ne]);

  React.useEffect(() => {
    onResolvedMeta(ejercicioId, { ...meta, totalReactivos: totalFromPayload });
  }, [ejercicioId, meta.tipoId, meta.subtipoId, meta.tipoNombre, meta.subtipoNombre, totalFromPayload, sorted.length, meta, onResolvedMeta]);

  // Progreso (y clamp si guardaste más del total)
  const { done, total } = getProgreso(ejercicioId, totalFromPayload);
  React.useEffect(() => {
    if (typeof totalFromPayload === 'number') {
      if (done > totalFromPayload) {
        setProgreso(ejercicioId, totalFromPayload);
      }
    }
  }, [ejercicioId, totalFromPayload, done, setProgreso]);

  const tipoId = (meta.tipoId ?? ne.tipo_id ?? 1) as 1|2|3;
  const tipo = TIPO_CONF[tipoId];

  const ordenIdsArr = meta.ordenIds ?? [];
  const ordenDetalleArr = sorted.map((r: any) => ({
    id: Number(r.reactivo_id),
    subtipoId: Number.isFinite(Number(r.sub_tipo_id)) ? Number(r.sub_tipo_id) : undefined,
    subtipoNombre: r.sub_tipo_nombre ? String(r.sub_tipo_nombre) : undefined,
  })).filter(x => Number.isFinite(x.id));

  const onPress = () => {
    const navParams = {
      kitId: String(kitId),
      kitName,
      ejercicioId: String(ejercicioId),
      titulo: ne.titulo ?? '',
      tipoId: meta.tipoId ? String(meta.tipoId) : '',
      tipoNombre: meta.tipoNombre ?? '',
      subtipoId: meta.subtipoId ? String(meta.subtipoId) : '',
      subtipoNombre: meta.subtipoNombre ?? '',
      totalReactivos: typeof totalFromPayload === 'number' ? String(totalFromPayload) : '',
      ordenIds: ordenIdsArr.length ? ordenIdsArr.join(',') : '',
      ordenJson: JSON.stringify(ordenIdsArr),
      ordenDetalleJson: JSON.stringify(ordenDetalleArr),
    };

    router.push({
      pathname: `/(app)/(usuario)/(stack)/juegos/${tipo.seg}`,
      params: navParams,
    });
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#eee' }}
      style={[
        styles.card,
        !visible && { display: 'none' },
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={tipo.icon} size={18} color={ORANGE} />
        <Text style={styles.cardType}>{tipo.label}</Text>
        {isLoading && <Text style={styles.loadingBadge}> • cargando…</Text>}
        {error && <Text style={styles.errorBadge}> • error</Text>}
      </View>

      <Text style={styles.cardTitle} numberOfLines={1}>
        {ne.titulo ?? 'Sin título'}
      </Text>
      {!!ne.descripcion && (
        <Text style={styles.cardDesc} numberOfLines={3}>
          {ne.descripcion}
        </Text>
      )}

      <View style={styles.metaRow}>
        {typeof totalFromPayload === 'number'
          ? <Meta icon="list-outline" text={`${totalFromPayload} reactivos`} />
          : <Meta icon="alert-circle-outline" text={`total N/D`} /> }
        {!!ne.creador_nombre && <Meta icon="person-outline" text={ne.creador_nombre} />}
      </View>

      {!!meta.subtipoNombre && (
        <View style={styles.metaRow}>
          <Meta icon="pricetags-outline" text={`Subtipo: ${meta.subtipoNombre}`} />
        </View>
      )}

      {typeof total === 'number' ? (
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{done}/{total}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.round((total > 0 ? done / total : 0) * 100)}%` }]} />
          </View>
        </View>
      ) : (
        <Text style={styles.progressLabelMuted}>
          Progreso: {done} (total N/D)
        </Text>
      )}
    </Pressable>
  );
}

export default function KitEjerciciosScreen() {
    const params = useLocalSearchParams<{ kitId?: string; kitName?: string; KitName?: string }>();
    const kitId = params.kitId ? Number(params.kitId) : NaN;
    const rawName = (params.kitName ?? params.KitName ?? '').trim();
    const kitName = rawName ? rawName : `Kit #${params.kitId ?? ''}`;

  const { useEjerciciosDisponiblesParaKitQuery } = useEjerciciosStore();
  const { data, isLoading, error } = useEjerciciosDisponiblesParaKitQuery(
    Number.isFinite(kitId) ? Number(kitId) : 0,
    1, 500, true
  );

  const pickArray = React.useCallback((d: any) => {
    if (!d) return [];
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.data?.data)) return d.data.data;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.rows)) return d.rows;
    if (Array.isArray(d)) return d;
    return [];
  }, []);

  // Normalizamos SIEMPRE
  const ejercicios = React.useMemo<any[]>(() => {
    const arr = pickArray(data);
    return arr.map(normalizeEjercicioItem);
  }, [data, pickArray]);

  const [tipoFiltro, setTipoFiltro] = React.useState<TipoFiltro>('todos');

  // Estado de progreso global del kit (persistido)
  const [progressMap, setProgressMap] = React.useState<Record<string, number>>({});
  React.useEffect(() => {
    loadProgress().then(pm => { setProgressMap(pm); });
  }, []);

  const setProgreso = async (ejercicioId: number, completados: number) => {
    const k = keyFor(Number(kitId), ejercicioId);
    const next = { ...progressMap, [k]: Math.max(0, completados) };
    setProgressMap(next);
    saveProgress(next);
  };

  const getProgreso = (ejercicioId: number, totalReactivos?: number) => {
    const k = keyFor(Number(kitId), ejercicioId);
    const done = Math.max(0, Number(progressMap[k] ?? 0));
    const total = typeof totalReactivos === 'number' ? totalReactivos : undefined;
    const pct = typeof total === 'number' && total > 0 ? done / total : 0;
    return { done, total, pct };
  };

  const [metaMap, setMetaMap] = React.useState<Record<number, {
    tipoId?: 1|2|3; tipoNombre?: string; subtipoId?: number; subtipoNombre?: string;
    totalReactivos?: number; ordenIds?: number[];
  }>>({});

  const onResolvedMeta = React.useCallback((ejercicioId: number, meta: any) => {
    setMetaMap(prev => {
      const prevMeta = prev[ejercicioId];
      const same =
        prevMeta &&
        prevMeta.tipoId === meta.tipoId &&
        prevMeta.subtipoId === meta.subtipoId &&
        prevMeta.tipoNombre === meta.tipoNombre &&
        prevMeta.subtipoNombre === meta.subtipoNombre &&
        prevMeta.totalReactivos === meta.totalReactivos &&
        JSON.stringify(prevMeta.ordenIds ?? []) === JSON.stringify(meta.ordenIds ?? []);
      return same ? prev : { ...prev, [ejercicioId]: meta };
    });
  }, []);

  // ✅ Conteos por tipo usando la meta resuelta (arregla el badge de "Lectura")
  const counts = React.useMemo(() => {
    const c: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
    for (const e of ejercicios) {
      const id = e.ejercicio_id ?? e.id;
      const tipoId = metaMap[id]?.tipoId ?? e?.tipo_id;
      if (tipoId === 1 || tipoId === 2 || tipoId === 3) c[tipoId as 1| 2| 3] += 1;
    }
    return c;
  }, [ejercicios, metaMap]);

  const target: Record<'lectura'|'escrito'|'visual', 1|2|3> = { lectura: 1, escrito: 2, visual: 3 };

  const counters = React.useMemo(() => ({
    todos: ejercicios.length,
    lectura: counts[1],
    visual:  counts[3],
    escrito: counts[2],
  }), [ejercicios.length, counts]);

  if (!Number.isFinite(kitId)) {
    return <Text style={styles.errorText}>Falta un kitId válido.</Text>;
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fffcc3' }}>
          <ThemedBackground justifyContent="center" align="center" fullHeight backgroundColor="#e1944e">
            <ActivityIndicator size="large" color={ORANGE} />
            <Text style={{ marginTop: 12, color: '#222' }}>Cargando ejercicios…</Text>
          </ThemedBackground>
        </SafeAreaView>
      </AuthGuard>
    );
  }
  if (error) return <Text style={styles.errorText}>Error al cargar ejercicios del kit.</Text>;

  return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fffcc3' }}>
        <ThemedBackground
          justifyContent="flex-start"
          fullHeight
          backgroundColor="#e1944e"
          style={{ paddingVertical: 24, paddingHorizontal: 16 }}
        >
          {/* Encabezado */}
          <View style={styles.headerRow}>
            <Text style={styles.kitTitle} numberOfLines={1}>{kitName}</Text>
            <FiltroTipos
              value={tipoFiltro}
              onChange={setTipoFiltro}
              counters={counters}
              visible={{ todos: true, lectura: true, visual: true, escrito: true }}
              label="Filtros"
            />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.gridWrap}>
              {ejercicios.map((e, idx) => {
                const id = e.ejercicio_id || idx;
                const meta = metaMap[id];
                const visible =
                  tipoFiltro === 'todos'
                    ? true
                    : (meta?.tipoId === target[tipoFiltro]);

                return (
                  <EjercicioCard
                    key={id}
                    e={e}
                    kitId={Number(kitId)}
                    kitName={kitName}
                    onResolvedMeta={onResolvedMeta}
                    getProgreso={getProgreso}
                    setProgreso={setProgreso}
                    visible={visible}
                  />
                );
              })}

              {ejercicios.length === 0 && (
                <View style={[styles.centerBox, { paddingVertical: 40 }]}>
                  <Text style={{ color: '#333' }}>
                    No hay ejercicios en el kit.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ThemedBackground>
      </SafeAreaView>
    </AuthGuard>
  );
}

function Meta({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color="#666" />
      <Text style={styles.metaText} numberOfLines={1}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kitTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b1b1b',
    maxWidth: '60%',
  },

  scrollContainer: { paddingBottom: 24 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    width: '48%',
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardType: { marginLeft: 6, color: ORANGE, fontWeight: '700' },
  loadingBadge: { marginLeft: 6, color: '#666', fontSize: 12 },
  errorBadge: { marginLeft: 6, color: 'red', fontSize: 12 },
  cardTitle: { color: '#111', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  cardDesc: { color: '#444', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10, maxWidth: '50%' },
  metaText: { marginLeft: 6, color: '#666' },

  progressRow: { marginTop: 2 },
  progressLabel: { color: '#333', fontSize: 12, marginBottom: 6 },
  progressLabelMuted: { color: '#666', fontSize: 12, marginTop: 4 },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: ORANGE },

  centerBox: { alignItems: 'center', justifyContent: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});
