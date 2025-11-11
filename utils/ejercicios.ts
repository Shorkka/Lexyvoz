// utils/ejercicios.ts
export type TipoId = 1 | 2 | 3;

export function pickNumber(...vals: any[]) {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

function guessTipoIdFromText(text?: string): TipoId | undefined {
  const t = String(text ?? '').toLowerCase();
  if (!t) return undefined;
  if (t.includes('lectura')) return 1;
  if (t.includes('escrit')) return 2;
  if (t.includes('visual')) return 3;
  return undefined;
}

export function inferTipoNombre(tipoId?: number, tipoNombre?: string) {
  const tn = String(tipoNombre ?? '').trim();
  if (tn) return tn;
  if (tipoId === 1) return 'Lectura';
  if (tipoId === 2) return 'Escrito';
  if (tipoId === 3) return 'Visual';
  return '';
}

function clampTipoId(n?: number): TipoId | undefined {
  return n === 1 || n === 2 || n === 3 ? (n as TipoId) : undefined;
}

export interface NormalizedEjercicio {
  ejercicio_id: number;
  kit_id?: number;
  orden_en_kit: number;        // ← clave para ordenar y bloquear
  activo_en_kit?: boolean;

  titulo: string;
  descripcion: string;

  tipo_id?: TipoId;            // 1 Lectura · 2 Escrito · 3 Visual
  tipo_nombre: string;         // siempre consistente con tipo_id

  creador_nombre: string;
  created_at?: Date;

  __raw: any;
}

/**
 * Normaliza un item de ejercicio para asegurar claves consistentes.
 * Acepta variaciones de backend: id/ejercicio_id, tipo_ejercicio/tipo_id, etc.
 * Intenta inferir tipo_id a partir de tipo_nombre o del título.
 * Incluye orden_en_kit para poder ordenar/bloquear.
 */
export function normalizeEjercicioItem(raw: any): NormalizedEjercicio {
  const ejercicio_id = pickNumber(
    raw?.ejercicio_id, raw?.id, raw?.ejercicioId, raw?.__raw?.ejercicio_id, raw?.__raw?.id
  ) ?? 0;

  const kit_id = pickNumber(raw?.kit_id, raw?.__raw?.kit_id);

  // El back puede mandar tipo_ejercicio (número) o tipo_id
  let tipo_id = clampTipoId(
    pickNumber(raw?.tipo_id, raw?.tipo, raw?.tipo_ejercicio, raw?.__raw?.tipo_id, raw?.__raw?.tipo_ejercicio)
  );

  const rawTipoNombre = String(
    raw?.tipo_nombre ?? raw?.tipoNombre ?? raw?.__raw?.tipo_nombre ?? ''
  );

  if (!tipo_id) tipo_id = guessTipoIdFromText(rawTipoNombre);
  if (!tipo_id) tipo_id = guessTipoIdFromText(raw?.titulo ?? raw?.__raw?.titulo);

  const tipo_nombre = inferTipoNombre(tipo_id, rawTipoNombre);

  // Orden del ejercicio dentro del kit (por defecto lo mandamos al final si falta)
  const orden_en_kit =
    Number.isFinite(Number(raw?.orden_en_kit)) ? Number(raw?.orden_en_kit) :
    Number.isFinite(Number(raw?.orden))        ? Number(raw?.orden)        :
    9999;

  const activo_en_kit = Boolean(
    raw?.activo_en_kit ?? raw?.__raw?.activo_en_kit ?? true
  );

  let creador_nombre = String(
    raw?.creador_nombre ?? raw?.creadorNombre ?? raw?.__raw?.creador_nombre ?? ''
  ).trim();

  if (!creador_nombre) {
    const email = String(raw?.creador_correo ?? raw?.__raw?.creador_correo ?? '').trim();
    if (email && email.includes('@')) {
      creador_nombre = email.split('@')[0];
    }
  }

  const created_at_str = String(raw?.created_at ?? raw?.__raw?.created_at ?? '');
  const created_at = created_at_str ? new Date(created_at_str) : undefined;

  return {
    ejercicio_id,
    kit_id,
    orden_en_kit,
    activo_en_kit,

    titulo: String(raw?.titulo ?? raw?.__raw?.titulo ?? 'Sin título'),
    descripcion: String(raw?.descripcion ?? raw?.__raw?.descripcion ?? ''),

    tipo_id,
    tipo_nombre,

    creador_nombre,
    created_at,

    __raw: raw,
  };
}