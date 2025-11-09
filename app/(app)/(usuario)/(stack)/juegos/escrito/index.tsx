import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import AuthGuard from '@/presentation/theme/components/AuthGuard';

import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import { EscritoRendererProps, ReactivoEscribirBien, ReactivoEscrito, ReactivoReordenamiento } from './interface/escrito.reactivo';

// ---- Renderers de cada subtipo ----
const EscribirBienRenderer: React.FC<EscritoRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoEscribirBien | undefined;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo ?? 'Escribir bien'}</Text>
      <Text style={styles.subtitle}>{r?.payload?.instrucciones ?? 'Selecciona la opción correcta.'}</Text>

      {r?.payload?.opciones?.map((op, idx) => (
        <Pressable key={idx} style={styles.option} onPress={() => onFinishReactivo?.({
          reactivoId: r.reactivo_id, respuesta: op,
        })}>
          <Text>{op}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const ReordenamientoRenderer: React.FC<EscritoRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0] as ReactivoReordenamiento | undefined;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo ?? 'Reordenamiento'}</Text>
      <Text style={styles.subtitle}>{r?.payload?.instrucciones ?? 'Ordena las letras para formar la palabra.'}</Text>
      <View style={styles.wordBox}>
        <Text style={styles.big}>{r?.payload?.desordenado ?? ''}</Text>
      </View>

      <Pressable style={styles.primary} onPress={() => onFinishReactivo?.({
        reactivoId: r?.reactivo_id ?? 0, respuesta: '[reordenado]',
      })}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Enviar respuesta</Text>
      </Pressable>
    </View>
  );
};

// Fallback genérico
const GenericoRenderer: React.FC<EscritoRendererProps> = ({
  titulo, reactivos, onFinishReactivo,
}) => {
  const r = reactivos[0];
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo ?? 'Ejercicio (genérico)'}</Text>
      <Text style={styles.subtitle}>Este subtipo aún no tiene UI específica.</Text>

      <View style={styles.box}>
        <Text numberOfLines={6}>
          {JSON.stringify(r?.payload ?? r, null, 2)}
        </Text>
      </View>

      <Pressable style={styles.primary} onPress={() => onFinishReactivo?.({
        reactivoId: r?.reactivo_id ?? 0, respuesta: '[generic]',
      })}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Marcar como respondido</Text>
      </Pressable>
    </View>
  );
};

// ---- Registry: slug -> renderer ----
const RENDERERS: Record<string, React.FC<EscritoRendererProps>> = {
  'escribir-bien': EscribirBienRenderer,
  'reordenamiento': ReordenamientoRenderer,

  // cualquier otro slug cae al genérico
  __default: GenericoRenderer,
};

export default function EscritoSubScreen() {
  const params = useLocalSearchParams<{
    sub?: string;
    kitId?: string;
    kitName?: string;
    ejercicioId?: string;
    titulo?: string;
    totalReactivos?: string;
    // si mandas ordenDetalleJson/ordenJson, puedes parsearlo aquí
  }>();

  const sub = String(params.sub ?? '').toLowerCase();
  const kitId = Number(params.kitId ?? 0);
  const ejercicioId = Number(params.ejercicioId ?? 0);
  const kitName = params.kitName ?? '';
  const titulo = params.titulo ?? '';
  const totalReactivos = Number(params.totalReactivos ?? '') || undefined;

  // Trae los reactivos reales del ejercicio (si prefieres usar lo que ya pasaste por params, cámbialo).
  const { useReactivosDeEjercicioQuery } = useEjerciciosStore();
  const { data, isLoading, error } = useReactivosDeEjercicioQuery(ejercicioId);

  // Mapea el payload crudo del back a tus tipos de "ReactivoEscrito"
  const reactivos: ReactivoEscrito[] = React.useMemo(() => {
    const raw = Array.isArray((data as any)?.reactivos) ? (data as any).reactivos : [];
    // Aquí puedes transformar a ReactivoEscribirBien/ReactivoReordenamiento/Genérico según sub o sub_tipo_id
    return raw.map((r: any) => {
      const base = {
        ejercicio_reactivo_id: Number(r.ejercicio_reactivo_id),
        ejercicio_id: Number(r.ejercicio_id),
        reactivo_id: Number(r.reactivo_id),
        orden: Number(r.orden ?? 0),
        activo: Boolean(r.activo),
        tipo_id: 2 as const,
        tipo_nombre: String(r.tipo_nombre ?? 'Escrito'),
        sub_tipo_id: Number(r.sub_tipo_id ?? 0),
        sub_tipo_nombre: String(r.sub_tipo_nombre ?? ''),
        tiempo_duracion: Number(r.tiempo_duracion ?? 0) || undefined,
        __raw: r,
      };

      if (sub === 'escribir-bien') {
        return {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Selecciona la opción correcta.'),
            enunciado: String(r.enunciado ?? ''),
            opciones: Array.isArray(r.opciones) ? r.opciones.map((x: any) => String(x)) : [],
            correctaIndex: Number(r.correctaIndex ?? -1),
          },
        } as ReactivoEscribirBien;
      }

      if (sub === 'reordenamiento') {
        return {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Ordena las letras para formar la palabra.'),
            objetivo: String(r.objetivo ?? r.solucion ?? ''),
            desordenado: String(r.desordenado ?? r.pseudopalabra ?? ''),
            longitud: Number(r.longitud ?? 0) || undefined,
          },
        } as ReactivoReordenamiento;
      }

      // genérico
      return {
        ...base,
        payload: {
          instrucciones: String(r.instrucciones ?? ''),
          texto: String(r.texto ?? r.enunciado ?? r.pseudopalabra ?? ''),
          opciones: Array.isArray(r.opciones) ? r.opciones.map((x: any) => String(x)) : undefined,
          meta: r.meta ?? undefined,
        },
      } as ReactivoEscrito;
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
                // Aquí puedes llamar a tu mutation registrarResultadoReactivo(...)
                // y actualizar progreso si quieres.
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
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  subtitle: { color: '#444' },
  option: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginVertical: 6 },
  wordBox: { padding: 16, borderWidth: 1, borderColor: '#f0b076', backgroundColor: '#fff7ee', borderRadius: 12 },
  big: { fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  box: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 10, backgroundColor: '#fafafa' },
  primary: { marginTop: 12, padding: 12, borderRadius: 999, backgroundColor: '#ee7200', alignItems: 'center' },
  muted: { color: '#666', textAlign: 'center', marginTop: 8 },
  error: { color: 'red', textAlign: 'center', marginTop: 8 },
});
