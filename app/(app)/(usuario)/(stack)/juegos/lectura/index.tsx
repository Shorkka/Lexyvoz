// app/(app)/(usuario)/(stack)/juegos/lectura/index.tsx
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import { useEjerciciosStore } from '@/infraestructure/store/useEjercicioStore';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { resultadoLecturaForm } from '@/infraestructure/interface/resultados-lectura-pseudopalabra-actions';
import {
  LecturaRendererProps,
  ReactivoLectura,
  ReactivoLecturaGenerico,
  ReactivoPseudopalabras,
  ReactivoLecturaDensas,
  ReactivoLecturaPalabras,
} from '@/presentation/interface/lectura.reactivo';
import { useQueryClient } from '@tanstack/react-query';
import { useKitsAsignacionesStore } from '@/infraestructure/store/useKitsAsignacionesStore';

/* ===== helpers de archivo de audio (igual que ya tenías) ===== */
const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "_");
const guessExtFromUri = (uri?: string): string => {
  if (!uri) return "m4a";
  const lower = uri.toLowerCase();
  if (lower.startsWith("blob:") || lower.startsWith("content:")) return "m4a";
  const m = lower.match(/\.([a-z0-9]{2,5})(?=[?#]|$)/);
  if (m?.[1] && ["m4a", "mp3", "wav", "aac"].includes(m[1])) return m[1];
  return "m4a";
};
const mimeFromExt = (ext: string): string => {
  switch (ext) {
    case "m4a": return "audio/m4a";
    case "mp3": return "audio/mpeg";
    case "wav": return "audio/wav";
    case "aac": return "audio/aac";
    default:    return "audio/m4a";
  }
};
type RNFile = { uri: string; name: string; type: string };
const buildRNFileFromUri = (uri: string, baseName: string) => {
  const ext = guessExtFromUri(uri);
  const safeBase = sanitizeFileName(baseName);
  const file = { uri, name: `${safeBase}.${ext}`, type: mimeFromExt(ext) } as RNFile;
  console.log('[buildRNFileFromUri] fileMeta ->', { uri: file.uri, name: file.name, type: file.type });
  return file;
};

const ORANGE = '#ee7200';
const BG_SOFT = '#fff7ee';
const BORDER_SOFT = '#f0b076';
const CHIP_BG = '#fff1e3';
const WARN_BG = '#ffd3bd';
const WARN_BORDER = '#ffb897';
const APP_BG = '#fba557';
const MIN_ANALYSIS_MS = 5000;

/** === PROGRESO COMPATIBLE CON LA LISTA === */
const PROG_KEY = 'lexyvoz_progress_v1';
const keyFor = (kitId: number, ejercicioId: number) => `${kitId}-${ejercicioId}`;
async function loadProgMap(): Promise<Record<string, number>> {
  try { const s = await AsyncStorage.getItem(PROG_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
async function writeProg(kitId: number, ejercicioId: number, completados: number) {
  try {
    const k = keyFor(kitId, ejercicioId);
    const map = await loadProgMap();
    const nextVal = Math.max(Number(map[k] ?? 0), Math.max(0, completados));
    const next = { ...map, [k]: nextVal };
    await AsyncStorage.setItem(PROG_KEY, JSON.stringify(next));
    console.log('[writeProg]', k, '->', nextVal);
  } catch (e) { console.log('[writeProg] error', e); }
}

/** === Progreso por-actividad (para reanudar índice exacto si quieres) === */
const perActivityKey = (kitId: number, ejercicioId: number) => `lexyvoz:progreso:${kitId}:${ejercicioId}`;

/* ====== hook de grabación (igual que ya tenías) ====== */
function useAudioRecorder() {
  const [recording, setRecording] = React.useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [uri, setUri] = React.useState<string | null>(null);
  const [durationMs, setDurationMs] = React.useState<number>(0);
  const startedAt = React.useRef<number | null>(null);

  const start = React.useCallback(async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      console.log('[recorder.start] mic permission granted =', perm.granted);
      if (!perm.granted) {
        Alert.alert('Permisos', 'Necesitamos acceso al micrófono para grabar audio.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
      setUri(null);
      setDurationMs(0);
      startedAt.current = Date.now();
      console.log('[recorder.start] startedAt =', startedAt.current);
    } catch (e) {
      console.log('[recorder.start] error', e);
      setIsRecording(false);
      setRecording(null);
      startedAt.current = null;
    }
  }, []);

  const stop = React.useCallback(async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const u = recording.getURI();
      const end = Date.now();
      const ms = startedAt.current ? end - startedAt.current : 0;

      setUri(u ?? null);
      setDurationMs(ms);

      console.log('[recorder.stop] uri =', u, ' durationMs =', ms);
    } catch (e) {
      console.log('[recorder.stop] error', e);
    } finally {
      setIsRecording(false);
      setRecording(null);
      startedAt.current = null;
    }
  }, [recording]);

  const reset = React.useCallback(() => {
    console.log('[recorder.reset] clearing previous audio (uri/duration). Before ->', { uri, durationMs });
    setUri(null);
    setDurationMs(0);
    startedAt.current = null;
  }, [uri, durationMs]);

  return { isRecording, uri, durationMs, start, stop, reset };
}

/* ====== reproductor simple ====== */
const AudioPlayer: React.FC<{ uri?: string; label?: string; }> = ({ uri, label = 'Escuchar' }) => {
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const [dur, setDur] = React.useState(0);

  const unload = React.useCallback(async () => {
    try { await soundRef.current?.unloadAsync(); } catch {}
    soundRef.current = null;
    setIsPlaying(false);
    setPos(0);
    setDur(0);
  }, []);

  React.useEffect(() => () => { unload(); }, [unload]);

  const togglePlay = React.useCallback(async () => {
    if (!uri) return;
    try {
      if (!soundRef.current) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;
            setPos(status.positionMillis ?? 0);
            setDur(status.durationMillis ?? 0);
            setIsPlaying(status.isPlaying ?? false);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPos(0);
            }
          }
        );
        soundRef.current = sound;
      } else {
        const st = await soundRef.current.getStatusAsync();
        if ("isPlaying" in st && st.isPlaying) await soundRef.current.pauseAsync();
        else await soundRef.current.playAsync();
      }
    } catch (e) {
      console.log('[AudioPlayer] error', e);
    }
  }, [uri]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  if (!uri) return null;

  return (
    <View style={styles.audioRow}>
      <Pressable onPress={togglePlay} style={styles.secondary}>
        <Text style={styles.secondaryText}>{isPlaying ? '⏸ Pausar' : '▶ ' + label}</Text>
      </Pressable>
      <Text style={styles.audioTime}>{fmt(pos)} / {dur ? fmt(dur) : '0:00'}</Text>
      {!!soundRef.current && (
        <Pressable onPress={unload} style={styles.tertiary}>
          <Text style={styles.tertiaryText}>⏹ Detener</Text>
        </Pressable>
      )}
    </View>
  );
};

/* ====== botón de grabar ====== */
const VoiceRecordButton: React.FC<{
  isRecording: boolean;
  hasAudio: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}> = ({ isRecording, hasAudio, onStart, onStop, onReset }) => {
  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <Pressable
        accessibilityRole="button"
        onPress={isRecording ? onStop : onStart}
        style={[
          styles.micButton,
          isRecording && { backgroundColor: WARN_BG, borderColor: WARN_BORDER },
        ]}
      >
        <Text style={styles.micEmoji}>{isRecording ? '■' : '🎙'}</Text>
        <Text style={styles.micLabel}>{isRecording ? 'Detener' : 'Grabar'}</Text>
      </Pressable>

      {hasAudio && !isRecording && (
        <Pressable onPress={onReset} style={styles.tertiary}>
          <Text style={styles.tertiaryText}>Rehacer</Text>
        </Pressable>
      )}
    </View>
  );
};

/* ====== distintos renderers (igual que ya tenías) ====== */
const PseudopalabrasRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo, submitted, onNext,
}) => {
  const r = reactivos[0] as ReactivoPseudopalabras | undefined;
  const rec = useAudioRecorder();

  const handlePrimary = React.useCallback(() => {
    if (submitted) {
      rec.reset();
      return onNext?.();
    }
    onFinishReactivo?.({
      reactivoId: r?.reactivo_id ?? 0,
      respuesta: '[leído]',
      tiempo_ms: rec.durationMs,
      audioUri: rec.uri || undefined,
    });
  }, [submitted, onNext, onFinishReactivo, r?.reactivo_id, rec]);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Pseudopalabras'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee las siguientes pseudopalabras.'}
      </Text>

      <View style={styles.panel}>
        {r?.payload?.pseudopalabras?.map((p: string, idx: number) => (
          <View key={idx} style={styles.lineItem}>
            <Text style={styles.lineText}>{p}</Text>
            {!!r?.payload?.audios?.[idx] && <AudioPlayer uri={r.payload.audios[idx]} label="Pista" />}
          </View>
        ))}
      </View>

      <VoiceRecordButton
        isRecording={rec.isRecording}
        hasAudio={!!rec.uri}
        onStart={rec.start}
        onStop={rec.stop}
        onReset={rec.reset}
      />

      {!!rec.uri && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ color: '#555', marginBottom: 6 }}>Mi grabación:</Text>
          <AudioPlayer uri={rec.uri} label="Reproducir" />
        </View>
      )}

      <Pressable
        style={[styles.primary, (!rec.uri && !submitted && { opacity: 0.7 })]}
        disabled={!submitted && !rec.uri}
        onPress={handlePrimary}
      >
        <Text style={styles.primaryText}>{submitted ? 'Siguiente' : 'Continuar'}</Text>
      </Pressable>
    </View>
  );
};

const DensasRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo, submitted, onNext,
}) => {
  const r = reactivos[0] as ReactivoLecturaDensas | undefined;
  const rec = useAudioRecorder();

  const handlePrimary = React.useCallback(() => {
    if (submitted) {
      rec.reset();
      return onNext?.();
    }
    onFinishReactivo?.({
      reactivoId: r?.reactivo_id ?? 0,
      respuesta: '[leído]',
      tiempo_ms: rec.durationMs,
      audioUri: rec.uri || undefined,
    });
  }, [submitted, onNext, onFinishReactivo, r?.reactivo_id, rec]);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Lectura densa'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee atentamente los siguientes párrafos.'}
      </Text>

      <View style={styles.panel}>
        {r?.payload?.parrafos?.map((p: string, idx: number) => (
          <View key={idx} style={[styles.lineItem, { alignItems: 'flex-start' }]}>
            <Text style={[styles.lineText, { textAlign: 'left', lineHeight: 22 }]}>{p}</Text>
            {!!r?.payload?.audios?.[idx] && <AudioPlayer uri={r.payload.audios[idx]} label="Pista" />}
          </View>
        ))}
      </View>

      <VoiceRecordButton
        isRecording={rec.isRecording}
        hasAudio={!!rec.uri}
        onStart={rec.start}
        onStop={rec.stop}
        onReset={rec.reset}
      />

      {!!rec.uri && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ color: '#555', marginBottom: 6 }}>Mi grabación:</Text>
          <AudioPlayer uri={rec.uri} label="Reproducir" />
        </View>
      )}

      <Pressable
        style={[styles.primary, (!rec.uri && !submitted && { opacity: 0.7 })]}
        disabled={!submitted && !rec.uri}
        onPress={handlePrimary}
      >
        <Text style={styles.primaryText}>{submitted ? 'Siguiente' : 'Continuar'}</Text>
      </Pressable>
    </View>
  );
};

const PalabrasRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo, submitted, onNext,
}) => {
  const r = reactivos[0] as ReactivoLecturaPalabras | undefined;
  const rec = useAudioRecorder();

  const handlePrimary = React.useCallback(() => {
    if (submitted) {
      rec.reset();
      return onNext?.();
    }
    onFinishReactivo?.({
      reactivoId: r?.reactivo_id ?? 0,
      respuesta: '[leído]',
      tiempo_ms: rec.durationMs,
      audioUri: rec.uri || undefined,
    });
  }, [submitted, onNext, onFinishReactivo, r?.reactivo_id, rec]);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Palabras'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee en voz alta las siguientes palabras.'}
      </Text>

      <View style={styles.panel}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {r?.payload?.palabras?.map((p: string, idx: number) => (
            <View key={idx} style={[styles.lineItem, { minWidth: 100 }]}>
              <Text style={styles.lineText}>{p}</Text>
              {!!r?.payload?.audios?.[idx] && <AudioPlayer uri={r.payload.audios[idx]} label="Pista" />}
            </View>
          ))}
        </View>
      </View>

      <VoiceRecordButton
        isRecording={rec.isRecording}
        hasAudio={!!rec.uri}
        onStart={rec.start}
        onStop={rec.stop}
        onReset={rec.reset}
      />

      {!!rec.uri && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ color: '#555', marginBottom: 6 }}>Mi grabación:</Text>
          <AudioPlayer uri={rec.uri} label="Reproducir" />
        </View>
      )}

      <Pressable
        style={[styles.primary, (!rec.uri && !submitted && { opacity: 0.7 })]}
        disabled={!submitted && !rec.uri}
        onPress={handlePrimary}
      >
        <Text style={styles.primaryText}>{submitted ? 'Siguiente' : 'Continuar'}</Text>
      </Pressable>
    </View>
  );
};

const LecturaGenericoRenderer: React.FC<LecturaRendererProps> = ({
  titulo, reactivos, onFinishReactivo, submitted, onNext,
}) => {
  const r = reactivos[0] as ReactivoLecturaGenerico | undefined;
  const rec = useAudioRecorder();

  const handlePrimary = React.useCallback(() => {
    if (submitted) {
      rec.reset();
      return onNext?.();
    }
    onFinishReactivo?.({
      reactivoId: r?.reactivo_id ?? 0,
      respuesta: '[leído]',
      tiempo_ms: rec.durationMs,
      audioUri: rec.uri || undefined,
    });
  }, [submitted, onNext, onFinishReactivo, r?.reactivo_id,rec]);

  return (
    <View style={styles.card}>
      <Text style={styles.headingBadge}>Lectura</Text>
      <Text style={styles.title}>{titulo ?? 'Lectura'}</Text>
      <Text style={styles.subtitle}>
        {r?.payload?.instrucciones ?? 'Lee el siguiente contenido.'}
      </Text>

      <View style={styles.panel}>
        {r?.payload?.lineas?.map((p: string, idx: number) => (
          <View key={idx} style={styles.lineItem}>
            <Text style={styles.lineText}>{p}</Text>
            {!!r?.payload?.audios?.[idx] && <AudioPlayer uri={r.payload.audios[idx]} label="Pista" />}
          </View>
        ))}
      </View>

      <VoiceRecordButton
        isRecording={rec.isRecording}
        hasAudio={!!rec.uri}
        onStart={rec.start}
        onStop={rec.stop}
        onReset={rec.reset}
      />

      {!!rec.uri && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ color: '#555', marginBottom: 6 }}>Mi grabación:</Text>
          <AudioPlayer uri={rec.uri} label="Reproducir" />
        </View>
      )}

      <Pressable
        style={[styles.primary, (!rec.uri && !submitted && { opacity: 0.7 })]}
        disabled={!submitted && !rec.uri}
        onPress={handlePrimary}
      >
        <Text style={styles.primaryText}>{submitted ? 'Siguiente' : 'Continuar'}</Text>
      </Pressable>
    </View>
  );
};

/** Registry: slug -> renderer */
const RENDERERS: Record<string, React.FC<LecturaRendererProps>> = {
  pseudopalabras: PseudopalabrasRenderer,
  densas: DensasRenderer,
  palabras: PalabrasRenderer,
  __default: LecturaGenericoRenderer,
};

export default function LecturaSubScreen() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { editarEstadoKitAsignadoMutation } = useKitsAsignacionesStore();

  const invalidateKitsProgress = React.useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).toLowerCase().includes('kits'),
    });
    console.log('[invalidateKitsProgress] kits -> invalidated');
  }, [queryClient]);

  const params = useLocalSearchParams<{
    sub?: string;
    kitId?: string;
    kitName?: string;
    ejercicioId?: string;
    titulo?: string;
    totalReactivos?: string;
    kitAsignadoId?: string; // 👈 nuevo
  }>();

  const sub = String(params.sub ?? '').toLowerCase();
  const kitId = Number(params.kitId ?? 0);
  const ejercicioId = Number(params.ejercicioId ?? 0);
  const kitName = params.kitName ?? '';
  const titulo = params.titulo ?? '';
  const totalReactivosParam = Number(params.totalReactivos ?? '') || undefined;
  const kitAsignadoId = params.kitAsignadoId ? String(params.kitAsignadoId) : undefined;

  const { useReactivosDeEjercicioQuery } = useEjerciciosStore();
  const { data, isLoading, error } = useReactivosDeEjercicioQuery(ejercicioId);

  const [idx, setIdx] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [showCongrats, setShowCongrats] = React.useState(false);

  const resumeKey = React.useMemo(() => perActivityKey(kitId, ejercicioId), [kitId, ejercicioId]);

  React.useEffect(() => {
    return () => {
      invalidateKitsProgress();
    };
  }, [invalidateKitsProgress]);

  const reactivosAll: ReactivoLectura[] = React.useMemo(() => {
    const raw = Array.isArray((data as any)?.reactivos) ? (data as any).reactivos : [];

    const mapped = raw.map((r: any) => {
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

      const pistas = Array.isArray(r.audios) ? r.audios.map((x: any) => String(x)) : undefined;

      if (sub === 'pseudopalabras') {
        const lista = Array.isArray(r.frases)
          ? r.frases.map((x: any) => String(x))
          : (r.pseudopalabra ? [String(r.pseudopalabra)] : []);
        const node: ReactivoPseudopalabras = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Lee las siguientes pseudopalabras.'),
            pseudopalabras: lista,
            audios: pistas,
          },
        };
        return node;
      }

      if (sub === 'densas') {
        const parrafos =
          Array.isArray(r.parrafos) ? r.parrafos.map((x: any) => String(x))
          : Array.isArray(r.frases) ? r.frases.map((x: any) => String(x))
          : [String(r.texto ?? r.pseudopalabra ?? '')].filter(Boolean);
        const node: ReactivoLecturaDensas = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Lee atentamente los siguientes párrafos.'),
            parrafos,
            audios: pistas,
          },
        };
        return node;
      }

      if (sub === 'palabras') {
        const palabras =
          Array.isArray(r.palabras) ? r.palabras.map((x: any) => String(x))
          : Array.isArray(r.frases) ? r.frases.map((x: any) => String(x))
          : [String(r.pseudopalabra ?? '')].filter(Boolean);
        const node: ReactivoLecturaPalabras = {
          ...base,
          payload: {
            instrucciones: String(r.instrucciones ?? 'Lee en voz alta las siguientes palabras.'),
            palabras,
            audios: pistas,
          },
        };
        return node;
      }

      const node: ReactivoLecturaGenerico = {
        ...base,
        payload: {
          instrucciones: String(r.instrucciones ?? 'Lee el siguiente contenido.'),
          lineas: Array.isArray(r.frases)
            ? r.frases.map((x: any) => String(x))
            : (r.pseudopalabra ? [String(r.pseudopalabra)] : []),
          audios: pistas,
        },
      };
      return node;
    });

    return mapped.sort((a: any, b: any) => (a.orden ?? 0) - (b.orden ?? 0));
  }, [data, sub]);

  const totalReactivos = totalReactivosParam ?? (reactivosAll.length || undefined);
  const reactivoActual = React.useMemo(
    () => reactivosAll[idx] ? [reactivosAll[idx]] : [],
    [reactivosAll, idx]
  );

  React.useEffect(() => {
    (async () => {
      try {
        if (!reactivosAll.length) return;
        const raw = await AsyncStorage.getItem(resumeKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.idx === 'number' && idx === 0 && parsed.idx < reactivosAll.length) {
          setIdx(parsed.idx);
          console.log('[resumeProgress] resuming to idx', parsed.idx);
        }
      } catch (e) {
        console.log('[resumeProgress] error', e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactivosAll.length, resumeKey]);

  const saveResume = React.useCallback(
    async (completed = false) => {
      try {
        const value = {
          idx,
          total: reactivosAll.length,
          completed,
          kitId,
          ejercicioId,
          updatedAt: Date.now(),
        };
        await AsyncStorage.setItem(resumeKey, JSON.stringify(value));
        console.log('[saveResume] stored ->', value);
      } catch (e) {
        console.log('[saveResume] error', e);
      }
    },
    [idx, reactivosAll.length, kitId, ejercicioId, resumeKey]
  );

  const goNext = React.useCallback(async () => {
    const total = totalReactivos ?? reactivosAll.length;
    await writeProg(kitId, ejercicioId, Math.min(idx + 1, total));
    await saveResume(false);

    if (idx + 1 < reactivosAll.length) {
      setIdx((i) => i + 1);
      setSubmitted(false);
      console.log('[goNext] avanzando al índice', idx + 1);
    } else {
      console.log('[goNext] fin de reactivos -> 100%');
      await writeProg(kitId, ejercicioId, total);
      await saveResume(true);
      setShowCongrats(true);

      // ✅ marca kit como completado a nivel asignación
      if (kitAsignadoId) {
        editarEstadoKitAsignadoMutation.mutate({ id: kitAsignadoId, estado: 'completado' });
      }
    }
  }, [idx, reactivosAll.length, totalReactivos, kitId, ejercicioId, saveResume, kitAsignadoId, editarEstadoKitAsignadoMutation]);

  const handleFinishReactivo = React.useCallback(async (res: {
    reactivoId: number;
    correcto?: boolean;
    respuesta?: string;
    tiempo_ms?: number;
    audioUri?: string;
  }) => {
    try {
      const pacienteId = user?.paciente_id ?? user?.usuario_id ?? 0;
      if (!pacienteId || !res?.reactivoId) {
        Alert.alert('Faltan datos', 'No tenemos usuario/paciente o reactivo.');
        return;
      }
      if (!kitId || !ejercicioId) {
        Alert.alert('Faltan datos', 'No tenemos kit o ejercicio.');
        return;
      }
      if (!res.audioUri && Platform.OS !== 'web') {
        Alert.alert('Audio requerido', 'Graba tu lectura antes de continuar.');
        return;
      }

      setSending(true);
      const started = Date.now();

      const file = res.audioUri
        ? buildRNFileFromUri(res.audioUri, `voz_${pacienteId}_${res.reactivoId}_${Date.now()}`)
        : undefined;

      const outPromise = resultadoLecturaForm({
        usuario_id:       Number(pacienteId),
        ejercicio_id:     Number(ejercicioId),
        id_reactivo:      Number(res.reactivoId),
        kit_id:           Number(kitId),
        tiempo_respuesta: Math.round(res.tiempo_ms ?? 0),
        voz_usuario:      file,
      });

      const minWaitPromise = new Promise((resolve) => {
        const elapsed = Date.now() - started;
        const remaining = Math.max(0, MIN_ANALYSIS_MS - elapsed);
        setTimeout(resolve, remaining);
      });

      await Promise.all([outPromise, minWaitPromise]);

      console.log('[handleFinishReactivo] envío OK');
      setSubmitted(true);

      const total = totalReactivos ?? reactivosAll.length;
      await writeProg(kitId, ejercicioId, Math.min(idx + 1, total));

      const isLast = (idx + 1) >= reactivosAll.length;
      if (isLast) {
        // Si es el último, invalida y marca completado
        invalidateKitsProgress();
        if (kitAsignadoId) {
          editarEstadoKitAsignadoMutation.mutate({ id: kitAsignadoId, estado: 'completado' });
        }
      }

      Alert.alert('Enviado', 'Tu lectura fue enviada correctamente.');
    } catch (e: any) {
      console.log('[resultadoLecturaForm] error', e?.response?.data ?? e?.message ?? e);
      Alert.alert('Error', e?.message ?? 'No pudimos enviar tu audio. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  }, [user?.paciente_id, user?.usuario_id, kitId, ejercicioId, idx, reactivosAll.length, totalReactivos, invalidateKitsProgress, kitAsignadoId, editarEstadoKitAsignadoMutation]);

  const Renderer = (RENDERERS[sub] ?? RENDERERS.__default);

  const totalLocal = totalReactivos ?? reactivosAll.length;
  const doneLocal  = Math.min(submitted ? idx + 1 : idx, totalLocal || 0);
  const pct        = totalLocal > 0 ? Math.round((doneLocal / totalLocal) * 100) : 0;

  const navigateToJuegos = React.useCallback(() => {
    router.replace({
      pathname: '/(app)/(usuario)/(stack)/juegos',
      params: { kitId: String(kitId), kitName },
    });
  }, [kitId, kitName]);

  const goHome = React.useCallback(() => {
    navigateToJuegos();
  }, [navigateToJuegos]);

  const goMenuEjercicios = React.useCallback(() => {
    navigateToJuegos();
  }, [navigateToJuegos]);

  return (
    <AuthGuard>
      <ThemedBackground fullHeight backgroundColor={APP_BG} style={{ padding: 16 }}>
        <ScrollView
          style={{ backgroundColor: APP_BG }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '800' }} numberOfLines={1}>
                {titulo || 'Lectura'}{totalLocal ? ` • ${doneLocal}/${totalLocal}` : ''}
              </Text>
              {!!kitName && <Text style={{ color: '#fff' }} numberOfLines={1}>{kitName}</Text>}

              {!!totalLocal && totalLocal > 0 && (
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>{pct}%</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                </View>
              )}
            </View>

            <Pressable
              style={styles.exitBtn}
              onPress={async () => {
                const total = totalLocal || reactivosAll.length || 0;
                const done = Math.min(submitted ? idx + 1 : idx, total);

                await AsyncStorage.setItem(resumeKey, JSON.stringify({
                  idx,
                  total: reactivosAll.length,
                  completed: false,
                  kitId,
                  ejercicioId,
                  updatedAt: Date.now(),
                }));
                await writeProg(kitId, ejercicioId, done);
                invalidateKitsProgress();
                navigateToJuegos();
              }}
            >
              <Text style={styles.exitBtnText}>💾 Guardar y salir</Text>
            </Pressable>
          </View>

          {isLoading && <Text style={styles.muted}>Cargando…</Text>}
          {error && <Text style={styles.error}>Error al cargar reactivos.</Text>}

          {!isLoading && !error && !!reactivoActual.length && (
            <Renderer
              kitId={kitId}
              kitName={kitName}
              ejercicioId={ejercicioId}
              titulo={titulo}
              totalReactivos={totalLocal}
              reactivos={reactivoActual}
              submitted={submitted}
              onNext={goNext}
              onFinishReactivo={handleFinishReactivo}
            />
          )}

          {!isLoading && !error && !reactivoActual.length && (
            <Text style={styles.muted}>No hay reactivos disponibles.</Text>
          )}
        </ScrollView>

        {/* Modal de análisis */}
        <Modal visible={sending} transparent animationType="fade" statusBarTranslucent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>⚙ IA</Text>
              </View>
              <Text style={styles.modalTitle}>Analizando tu bonita voz…</Text>
              <Text style={styles.modalSub}>Esto puede tardar unos segundos. ¡No cierres la app!</Text>
              <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 12 }} />
            </View>
          </View>
        </Modal>

        {/* Modal de felicitación */}
        <Modal visible={showCongrats} transparent animationType="fade" statusBarTranslucent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { alignItems: 'stretch' }]}>
              <View style={[styles.modalBadge, { alignSelf: 'center' }]}>
                <Text style={styles.modalBadgeText}>🎉 Excelente</Text>
              </View>
              <Text style={[styles.modalTitle, { textAlign: 'center' }]}>
                ¡Has terminado todos los reactivos!
              </Text>
              <Text style={[styles.modalSub, { textAlign: 'center', marginBottom: 12 }]}>
                Tu progreso fue guardado. El siguiente ejercicio quedó desbloqueado.
              </Text>

              <Pressable style={styles.primary} onPress={goHome}>
                <Text style={styles.primaryText}>Ir al índice del kit</Text>
              </Pressable>
              <Pressable style={[styles.secondary, { marginTop: 8 }]} onPress={goMenuEjercicios}>
                <Text style={styles.secondaryText}>Menú de ejercicios</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ThemedBackground>
    </AuthGuard>
  );
}

/* ===== estilos (igual que ya tenías) ===== */
const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  exitBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 2, borderColor: BORDER_SOFT,
  },
  exitBtnText: { color: ORANGE, fontWeight: '800' },

  progressRow: { marginTop: 6 },
  progressLabel: { color: '#fff', fontSize: 12, marginBottom: 6, fontWeight: '700' },
  progressBar: { height: 8, backgroundColor: '#ffffff55', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12 },
  headingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: CHIP_BG,
    color: ORANGE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '800',
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  subtitle: { color: '#444' },
  panel: {
    backgroundColor: BG_SOFT,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  lineItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f3c199',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  lineText: {
    fontSize: 18, fontWeight: '700', color: '#222',
    textAlign: 'center', lineHeight: 24, letterSpacing: 0.4,
  },
  primary: {
    marginTop: 12, padding: 12, borderRadius: 999,
    backgroundColor: ORANGE, alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
  },
  secondaryText: { color: '#222', fontWeight: '700' },
  warn: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: WARN_BG, borderWidth: 1, borderColor: WARN_BORDER,
  },
  warnText: { color: '#7a2f00', fontWeight: '700' },
  tertiary: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: '#eef1f4',
  },
  tertiaryText: { color: '#333', fontWeight: '700' },
  muted: { color: '#fff', textAlign: 'center', marginTop: 8 },
  error: { color: '#ffebee', textAlign: 'center', marginTop: 8, fontWeight: '700' },
  micButton: {
    width: 120, height: 120, borderRadius: 999,
    backgroundColor: ORANGE, borderWidth: 3, borderColor: '#ffa55c',
    alignItems: 'center', justifyContent: 'center', gap: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  micEmoji: { fontSize: 32, color: '#fff' },
  micLabel: { fontSize: 16, fontWeight: '800', color: '#fff' },
  modalBackdrop: {
    flex: 1, backgroundColor: '#0008', alignItems: 'center',
    justifyContent: 'center', padding: 24,
  },
  modalCard: {
    width: '100%', maxWidth: 420, backgroundColor: '#fff',
    borderRadius: 20, padding: 20, borderWidth: 2, borderColor: BORDER_SOFT,
  },
  modalBadge: {
    backgroundColor: CHIP_BG, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, marginBottom: 8, alignSelf: 'center',
  },
  modalBadgeText: { color: ORANGE, fontWeight: '800' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#222' },
  modalSub: { color: '#444', marginTop: 6 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  audioTime: { color: '#555', fontVariant: ['tabular-nums'] },
});
