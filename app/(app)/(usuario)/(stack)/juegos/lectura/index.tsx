import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import {
  LecturaRendererProps,
  ReactivoLectura,
  ReactivoPseudopalabras,
  ReactivoLecturaGenerico} from './interface/lectura.reactivo';
// (opcional) si quieres primer inicio/registrar resultados:
// import { useKitRunsStore } from '@/infraestructure/store/useKitRunsStore';

const ORANGE = '#ee7200';

/** ============== RENDERERS ============== */
const PseudopalabrasRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoPseudopalabras | undefined;

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Pseudopalabras'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee las siguientes pseudopalabras.'}
      </Text>

      <View style={styles.panel}>
        {r?.payload?.pseudopalabras?.map((p, idx) => (
          <View key={idx} style={styles.lineItem}>
            <Text style={styles.lineText}>{p}</Text>
            {/* Si luego integras TTS o audio: aquí un botón "🔊" por línea */}
          </View>
        ))}
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: '[leído]',
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

const LecturaGenericoRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoLecturaGenerico | undefined;
  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Lectura'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee el siguiente contenido.'}
      </Text>

      <View style={styles.panel}>
        {r?.payload?.lineas?.map((p, idx) => (
          <View key={idx} style={styles.lineItem}>
            <Text style={styles.lineText}>{p}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: '[leído]',
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

/** Registry: slug -> renderer */
const RENDERERS: Record<string, React.FC<LecturaRendererProps>> = {
  'pseudopalabras': PseudopalabrasRenderer,
  __default: LecturaGenericoRenderer,
};

export default function LecturaSubScreen() {
  const params = useLocalSearchParams<{
    sub?: string;
    kitId?: string;
    kitName?: string;
    ejercicioId?: string;
    titulo?: string;
    totalReactivos?: string;
    // si mandas ordenJson/ordenDetalleJson, puedes leerlos aquí
  }>();

  const sub = String(params.sub ?? '').toLowerCase();
  const kitId = Number(params.kitId ?? 0);
  const ejercicioId = Number(params.ejercicioId ?? 0);
  const kitName = params.kitName ?? '';
  const titulo = params.titulo ?? '';
  const totalReactivos = Number(params.totalReactivos ?? '') || undefined;

  const { useReactivosDeEjercicioQuery } = useEjerciciosStore();
  const { data, isLoading, error } = useReactivosDeEjercicioQuery(ejercicioId);

  // (opcional) primer inicio / registrar resultados:
  // const { useEnsureFirstRunMutation, useRegistrarResultadoMutation } = useKitRunsStore();
  // const { mutateAsync: ensureFirstRun } = useEnsureFirstRunMutation();
  // const { mutate: registrarResultado } = useRegistrarResultadoMutation();
  // React.useEffect(() => {
  //   if (Number.isFinite(kitId)) ensureFirstRun({ kitId }).catch(() => {});
  // }, [kitId, ensureFirstRun]);

  /** ====== MAPEO A TIPOS: pseudopalabras / genérico ====== */
  const reactivos: ReactivoLectura[] = React.useMemo(() => {
    const raw = Array.isArray((data as any)?.reactivos) ? (data as any).reactivos : [];

    return raw.map((r: any) => {
      const base = {
        ejercicio_reactivo_id: Number(r.ejercicio_reactivo_id),
        ejercicio_id: Number(r.ejercicio_id),
        reactivo_id: Number(r.reactivo_id),
        orden: Number(r.orden ?? 0),
        activo: Boolean(r.activo),
        tipo_id: 1 as const,
        tipo_nombre: String(r.tipo_nombre ?? 'Lectura'),
        sub_tipo_id: Number(r.sub_tipo_id ?? 0),
        sub_tipo_nombre: String(r.sub_tipo_nombre ?? ''),
        tiempo_duracion: Number(r.tiempo_duracion ?? 0) || undefined,
        __raw: r,
      };

      // Si el slug es "pseudopalabras", mapeamos a ese tipo
      if (sub === 'pseudopalabras') {
        const lista = Array.isArray(r.frases)
          ? r.frases.map((x: any) => String(x))
          : (r.pseudopalabra ? [String(r.pseudopalabra)] : []);

        const node: ReactivoPseudopalabras = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Lee las siguientes pseudopalabras.'),
            pseudopalabras: lista,
            habilitarTTS: Boolean(r.habilitarTTS),
            vozTTS: String(r.vozTTS ?? ''),
            audios: Array.isArray(r.audios) ? r.audios.map((x: any) => String(x)) : undefined,
          },
        };
        return node;
      }

      // Fallback genérico de lectura
      const node: ReactivoLecturaGenerico = {
        ...base,
        payload: {
          instrucciones: String(r.instrucciones ?? 'Lee el siguiente contenido.'),
          lineas: Array.isArray(r.frases)
            ? r.frases.map((x: any) => String(x))
            : (r.pseudopalabra ? [String(r.pseudopalabra)] : []),
        },
      };
      return node;
    });
  }, [data, sub]);

  const Renderer = (RENDERERS[sub] ?? RENDERERS.__default);

  return (
    <AuthGuard>
      <ThemedBackground fullHeight backgroundColor="#f8e7c2" style={{ padding: 16 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {isLoading && <Text style={styles.muted}>Cargando…</Text>}
          {error && <Text style={styles.error}>Error al cargar reactivos.</Text>}
          {!isLoading && !error && (
            <Renderer
              kitId={kitId}
              kitName={kitName}
              ejercicioId={ejercicioId}
              titulo={titulo}
              totalReactivos={totalReactivos}
              reactivos={reactivos}
              onFinishReactivo={(res) => {
                // ejemplo de registro:
                // registrarResultado({
                //   kitId, ejercicioId, reactivoId: res.reactivoId,
                //   respuesta: res.respuesta, tiempo_ms: res.tiempo_ms,
                // });
              }}
            />
          )}
        </ScrollView>
      </ThemedBackground>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12 },
  headingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff1e3',
    color: ORANGE,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, fontWeight: '800', marginBottom: 4
  },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  subtitle: { color: '#444' },
  panel: {
    backgroundColor: '#fff7ee',
    borderWidth: 1, borderColor: '#f0b076',
    borderRadius: 12, padding: 12, gap: 10
  },
  lineItem: {
    paddingVertical: 8, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#f3c199', borderRadius: 10,
    backgroundColor: '#fff'
  },
  lineText: { fontSize: 16, color: '#222' },
  primary: {
    marginTop: 12, padding: 12, borderRadius: 999,
    backgroundColor: ORANGE, alignItems: 'center'
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  muted: { color: '#666', textAlign: 'center', marginTop: 8 },
  error: { color: 'red', textAlign: 'center', marginTop: 8 },
});
