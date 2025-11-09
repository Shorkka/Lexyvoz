import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import {
  VisualRendererProps,
  ReactivoVisual,
  ReactivoVisualIgualDiferente,
  ReactivoVisualImagenCorrecta,
  ReactivoVisualPalabraMalEscrita,
  ReactivoVisualGenerico,
} from './interface/visual.reactivos';

const ORANGE = '#ee7200';

/* ======================= RENDERERS ======================= */

const IgualDiferenteRenderer: React.FC<VisualRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoVisualIgualDiferente | undefined;
  const [answers, setAnswers] = React.useState<Record<number, 'igual' | 'diferente'>>({});

  const setAns = (idx: number, v: 'igual' | 'diferente') =>
    setAnswers(prev => ({ ...prev, [idx]: v }));

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Visual</Text>
      <Text style={styles.title}>{titulo ?? 'Igual o Diferente'}</Text>
      <Text style={styles.subtitle}>{r?.payload?.instrucciones ?? 'Indica si cada par es igual o diferente.'}</Text>

      <View style={styles.panel}>
        {r?.payload?.items?.map((it, idx) => (
          <View key={idx} style={styles.row}>
            <View style={[styles.box, { flex: 1 }]}><Text style={styles.boxText}>{it.izquierda}</Text></View>
            <View style={{ width: 12 }} />
            <View style={[styles.box, { flex: 1 }]}><Text style={styles.boxText}>{it.derecha}</Text></View>
            <View style={{ width: 12 }} />
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Pressable
                style={[styles.pillBtn, answers[idx] === 'igual' && styles.pillBtnActive]}
                onPress={() => setAns(idx, 'igual')}
              ><Text style={answers[idx] === 'igual' ? styles.pillTextActive : styles.pillText}>Igual</Text></Pressable>
              <Pressable
                style={[styles.pillBtn, answers[idx] === 'diferente' && styles.pillBtnActive]}
                onPress={() => setAns(idx, 'diferente')}
              ><Text style={answers[idx] === 'diferente' ? styles.pillTextActive : styles.pillText}>Diferente</Text></Pressable>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: JSON.stringify(answers),
          meta: { items: r?.payload?.items?.length ?? 0 },
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

const ImagenCorrectaRenderer: React.FC<VisualRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoVisualImagenCorrecta | undefined;
  const [sel, setSel] = React.useState<number | null>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Visual</Text>
      <Text style={styles.title}>{titulo ?? 'Imagen correcta'}</Text>
      {!!r?.payload?.enunciado && <Text style={styles.subtitle}>{r.payload.enunciado}</Text>}
      {!!r?.payload?.instrucciones && <Text style={styles.subtitle}>{r.payload.instrucciones}</Text>}

      <View style={[styles.panel, { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }]}>
        {r?.payload?.opciones?.map((op, idx) => (
          <Pressable
            key={idx}
            onPress={() => setSel(idx)}
            style={[
              styles.imgCard,
              sel === idx && { borderColor: ORANGE, borderWidth: 2 },
            ]}
          >
            {/* si no hay imageUrl, mostramos solo label */}
            {op.imageUrl ? (
              <Image source={{ uri: op.imageUrl }} style={{ width: '100%', height: 100, borderRadius: 8 }} resizeMode="contain" />
            ) : (
              <View style={[styles.box, { height: 100, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={styles.boxText}>{op.label ?? 'Sin imagen'}</Text>
              </View>
            )}
            {!!op.label && <Text style={{ marginTop: 6, textAlign: 'center' }}>{op.label}</Text>}
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.primary, sel === null && { opacity: 0.6 }]}
        disabled={sel === null}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: String(sel),
          correcto: sel !== null ? Boolean(r?.payload?.opciones?.[sel]?.correcta) : undefined,
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

const PalabraMalEscritaRenderer: React.FC<VisualRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoVisualPalabraMalEscrita | undefined;
  const [seleccion, setSeleccion] = React.useState<Record<number, 0 | 1 | null>>({});

  const select = (idx: number, lado: 0 | 1) =>
    setSeleccion(prev => ({ ...prev, [idx]: lado }));

  const total = r?.payload?.pares?.length ?? 0;
  const correctas = React.useMemo(() => {
    let ok = 0;
    r?.payload?.pares?.forEach((p, idx) => {
      if (seleccion[idx] !== undefined && seleccion[idx] === p.incorrecta) ok += 1;
    });
    return ok;
  }, [seleccion, r]);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Visual</Text>
      <Text style={styles.title}>{titulo ?? 'Palabra mal escrita'}</Text>
      <Text style={styles.subtitle}>{r?.payload?.instrucciones ?? 'Selecciona la palabra incorrecta en cada par.'}</Text>

      <View style={styles.panel}>
        {r?.payload?.pares?.map((p, idx) => {
          const sel = seleccion[idx] ?? null;
          return (
            <View key={idx} style={[styles.row, { alignItems: 'stretch' }]}>
              <Pressable
                style={[
                  styles.box, { flex: 1 },
                  sel === 0 && { borderColor: ORANGE, borderWidth: 2 },
                ]}
                onPress={() => select(idx, 0)}
              >
                <Text style={styles.boxText}>{p.izquierda}</Text>
              </Pressable>
              <View style={{ width: 12 }} />
              <Pressable
                style={[
                  styles.box, { flex: 1 },
                  sel === 1 && { borderColor: ORANGE, borderWidth: 2 },
                ]}
                onPress={() => select(idx, 1)}
              >
                <Text style={styles.boxText}>{p.derecha}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <Text style={{ textAlign: 'center', color: '#555' }}>
        {Object.keys(seleccion).length}/{total} seleccionados · aciertos estimados: {correctas}
      </Text>

      <Pressable
        style={styles.primary}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: JSON.stringify(seleccion),
          correcto: total > 0 ? correctas === total : undefined,
          meta: { total, correctas },
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

const GenericoRenderer: React.FC<VisualRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoVisualGenerico | undefined;
  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Visual</Text>
      <Text style={styles.title}>{titulo ?? 'Ejercicio visual'}</Text>
      <Text style={styles.subtitle}>{r?.payload?.instrucciones ?? 'Resuelve el ejercicio.'}</Text>

      <View style={styles.box}>
        <Text numberOfLines={8}>{JSON.stringify(r?.payload ?? r, null, 2)}</Text>
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => onFinishReactivo?.({
          reactivoId: r?.reactivo_id ?? 0,
          respuesta: '[generic]',
        })}
      >
        <Text style={styles.primaryText}>Continuar</Text>
      </Pressable>
    </View>
  );
};

/* ======= Registry: slug -> renderer ======= */
const RENDERERS: Record<string, React.FC<VisualRendererProps>> = {
  'igual-diferente':     IgualDiferenteRenderer,
  'imagen-correcta':     ImagenCorrectaRenderer,
  'palabra-mal-escrita': PalabraMalEscritaRenderer,
  __default:             GenericoRenderer,
};

export default function VisualSubScreen() {
  const params = useLocalSearchParams<{
    sub?: string;
    kitId?: string;
    kitName?: string;
    ejercicioId?: string;
    titulo?: string;
    totalReactivos?: string;
  }>();

  const sub = String(params.sub ?? '').toLowerCase();
  const kitId = Number(params.kitId ?? 0);
  const ejercicioId = Number(params.ejercicioId ?? 0);
  const kitName = params.kitName ?? '';
  const titulo = params.titulo ?? '';
  const totalReactivos = Number(params.totalReactivos ?? '') || undefined;

  const { useReactivosDeEjercicioQuery } = useEjerciciosStore();
  const { data, isLoading, error } = useReactivosDeEjercicioQuery(ejercicioId);

  /* ====== MAPEO: crea ReactivoVisual según slug ====== */
  const reactivos: ReactivoVisual[] = React.useMemo(() => {
    const raw = Array.isArray((data as any)?.reactivos) ? (data as any).reactivos : [];

    return raw.map((r: any) => {
      const base = {
        ejercicio_reactivo_id: Number(r.ejercicio_reactivo_id),
        ejercicio_id: Number(r.ejercicio_id),
        reactivo_id: Number(r.reactivo_id),
        orden: Number(r.orden ?? 0),
        activo: Boolean(r.activo),
        tipo_id: 3 as const,
        tipo_nombre: String(r.tipo_nombre ?? 'Visual'),
        sub_tipo_id: Number(r.sub_tipo_id ?? 0),
        sub_tipo_nombre: String(r.sub_tipo_nombre ?? ''),
        tiempo_duracion: Number(r.tiempo_duracion ?? 0) || undefined,
        __raw: r,
      };

      if (sub === 'igual-diferente') {
        const items = Array.isArray(r.items)
          ? r.items.map((it: any) => ({
              izquierda: String(it.izquierda ?? it.left ?? ''),
              derecha: String(it.derecha ?? it.right ?? ''),
              sonIguales: typeof it.sonIguales === 'boolean' ? it.sonIguales : undefined,
            }))
          : Array.isArray(r.pares)
            ? r.pares.map((p: any) => ({
                izquierda: String(p.izquierda ?? ''),
                derecha: String(p.derecha ?? ''),
                sonIguales: undefined,
              }))
            : (r.izquierda && r.derecha)
              ? [{ izquierda: String(r.izquierda), derecha: String(r.derecha), sonIguales: undefined }]
              : [];
        const node: ReactivoVisualIgualDiferente = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Indica si cada par es igual o diferente.'),
            items,
          },
        };
        return node;
      }

      if (sub === 'imagen-correcta') {
        const opciones = Array.isArray(r.opciones)
          ? r.opciones.map((op: any) => ({
              imageUrl: String(op.imageUrl ?? op.imagen_url ?? op.url ?? ''),
              label: op.label ? String(op.label) : undefined,
              correcta: typeof op.correcta === 'boolean' ? op.correcta : undefined,
            }))
          : Array.isArray(r.imagenes)
            ? r.imagenes.map((u: any) => ({ imageUrl: String(u), label: undefined, correcta: undefined }))
            : [];
        const node: ReactivoVisualImagenCorrecta = {
          ...base,
          payload: {
            enunciado: String(r.enunciado ?? ''),
            instrucciones: String(r.instrucciones ?? 'Selecciona la imagen correcta.'),
            opciones,
          },
        };
        return node;
      }

      if (sub === 'palabra-mal-escrita') {
        const pares = Array.isArray(r.pares)
          ? r.pares.map((p: any) => ({
              izquierda: String(p.izquierda ?? ''),
              derecha: String(p.derecha ?? ''),
              incorrecta: Number(p.incorrecta ?? 0) === 1 ? 1 : 0,
            }))
          : (r.izquierda && r.derecha)
            ? [{ izquierda: String(r.izquierda), derecha: String(r.derecha), incorrecta: 0 }]
            : [];
        const node: ReactivoVisualPalabraMalEscrita = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Selecciona la palabra incorrecta.'),
            pares,
          },
        };
        return node;
      }

      // Fallback genérico
      const node: ReactivoVisualGenerico = {
        ...base,
        payload: {
          instrucciones: String(r.instrucciones ?? 'Resuelve el ejercicio.'),
          contenido: r,
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
              ejercicioId={Number(params.ejercicioId ?? 0)}
              titulo={titulo}
              totalReactivos={totalReactivos}
              reactivos={reactivos}
              onFinishReactivo={(res) => {
                // Aquí disparas tu registrarResultadoReactivo(...) si lo deseas
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
    borderRadius: 12, padding: 12, gap: 12
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  box: {
    borderWidth: 1, borderColor: '#f3c199',
    backgroundColor: '#fff', borderRadius: 10, padding: 10,
  },
  boxText: { fontSize: 16, color: '#222' },

  pillBtn: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#fff'
  },
  pillBtnActive: { backgroundColor: '#ffe5d1', borderColor: ORANGE },
  pillText: { color: '#444' },
  pillTextActive: { color: ORANGE, fontWeight: '700' },

  imgCard: {
    width: '48%', borderWidth: 1, borderColor: '#eee',
    borderRadius: 10, padding: 8, marginBottom: 10, backgroundColor: '#fff'
  },

  primary: {
    marginTop: 12, padding: 12, borderRadius: 999,
    backgroundColor: ORANGE, alignItems: 'center'
  },
  primaryText: { color: '#fff', fontWeight: '700' },

  muted: { color: '#666', textAlign: 'center', marginTop: 8 },
  error: { color: 'red', textAlign: 'center', marginTop: 8 },
});
