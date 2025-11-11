// infraestructure/storage/progress.storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@lexyvoz/progress';

const kExercise = (userId: number | string, kitId: number | string, ejercicioId: number | string) =>
  `${PREFIX}:u${userId}:k${kitId}:e${ejercicioId}`;

const kKit = (userId: number | string, kitId: number | string) =>
  `${PREFIX}:u${userId}:k${kitId}:__kit__`;

export type ExerciseProgress = {
  done: number;         // reactivos completados
  total?: number;       // total reactivos (opcional)
  updatedAt: number;
};

export type KitFlag = {
  completed: boolean;
  completedAt?: number;
  updatedAt: number;
};

const parseOr = <T>(s: string | null | undefined, fallback: T): T => {
  try { return s ? JSON.parse(s) as T : fallback; } catch { return fallback; }
};

/** Lee progreso local de un ejercicio */
export async function getExerciseProgress(userId: number|string, kitId: number|string, ejercicioId: number|string): Promise<ExerciseProgress | null> {
  const raw = await AsyncStorage.getItem(kExercise(userId, kitId, ejercicioId));
  return raw ? parseOr<ExerciseProgress>(raw, null as any) : null;
}

/** Sube el contador (por defecto +1), guardando total si se pasa */
export async function incrementExerciseProgress(
  userId: number|string,
  kitId: number|string,
  ejercicioId: number|string,
  total?: number,
  inc = 1,
): Promise<ExerciseProgress> {
  const key = kExercise(userId, kitId, ejercicioId);
  const cur = parseOr<ExerciseProgress>(await AsyncStorage.getItem(key), { done: 0, total: undefined, updatedAt: 0 });
  const newTotal = Math.max(cur.total ?? 0, total ?? 0) || undefined;
  const capped = newTotal ? Math.min((cur.done || 0) + inc, newTotal) : (cur.done || 0) + inc;
  const next: ExerciseProgress = { done: capped, total: newTotal, updatedAt: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(next));
  return next;
}

/** Batch: carga progreso para una lista de ejercicios */
export async function loadExercisesProgressMap(
  userId: number|string,
  kitId: number|string,
  ejercicioIds: (number|string)[],
): Promise<Record<string, ExerciseProgress>> {
  const keys = ejercicioIds.map(eid => kExercise(userId, kitId, eid));
  const entries = await AsyncStorage.multiGet(keys);
  const map: Record<string, ExerciseProgress> = {};
  entries.forEach(([key, val]) => {
    if (!key) return;
    const id = key.split(':').pop()?.replace('e', '') || '';
    const parsed = parseOr<ExerciseProgress>(val, null as any);
    if (parsed) map[id] = parsed;
  });
  return map;
}

/** Marca el kit como completado (para ocultarlo del listado) */
export async function setKitCompleted(userId: number|string, kitId: number|string, completed = true) {
  const key = kKit(userId, kitId);
  const next: KitFlag = { completed, completedAt: completed ? Date.now() : undefined, updatedAt: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(next));
}

/** Lee flag de kit completado */
export async function getKitCompleted(userId: number|string, kitId: number|string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(kKit(userId, kitId));
  const flag = parseOr<KitFlag>(raw, { completed: false, updatedAt: 0 });
  return !!flag?.completed;
}

/** Batch: kits completados (para filtrar del listado) */
export async function loadKitsCompletedFlags(userId: number|string, kitIds: (number|string)[]): Promise<Record<string, boolean>> {
  const keys = kitIds.map(kid => kKit(userId, kid));
  const entries = await AsyncStorage.multiGet(keys);
  const map: Record<string, boolean> = {};
  entries.forEach(([key, val]) => {
    const kid = key?.split(':').find(x => x.startsWith('k'))?.slice(1);
    const v = parseOr<KitFlag>(val, null as any);
    if (kid) map[kid] = !!v?.completed;
  });
  return map;
}
