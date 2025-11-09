export function pickNumber(...vals: any[]) {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

function guessTipoIdFromText(text?: string): 1 | 2 | 3 | undefined {
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

/**
 * Normaliza un item de ejercicio para asegurar claves consistentes.
 * Acepta variaciones de backend: id/ejercicio_id, tipo_ejercicio/tipo_id, etc.
 * Intenta inferir tipo_id a partir de tipo_nombre o del título.
 */
export function normalizeEjercicioItem(raw: any) {
  const ejercicio_id = pickNumber(
    raw?.ejercicio_id, raw?.id, raw?.ejercicioId, raw?.__raw?.ejercicio_id, raw?.__raw?.id
  );

  const rawTipoNombre = String(
    raw?.tipo_nombre ?? raw?.tipoNombre ?? raw?.__raw?.tipo_nombre ?? ''
  );

  let tipo_id = pickNumber(
    raw?.tipo_id, raw?.tipo, raw?.tipo_ejercicio, raw?.__raw?.tipo_id, raw?.__raw?.tipo_ejercicio
  ) as 1 | 2 | 3 | undefined;

  // Fallbacks: si no llegó tipo_id, infiere por tipo_nombre o por el título
  if (!tipo_id) tipo_id = guessTipoIdFromText(rawTipoNombre);
  if (!tipo_id) tipo_id = guessTipoIdFromText(raw?.titulo ?? raw?.__raw?.titulo);

  const tipo_nombre = inferTipoNombre(tipo_id, rawTipoNombre);

  // Nombre del creador con fallback a vacío (nunca 'undefined')
  let creador_nombre = String(
    raw?.creador_nombre ?? raw?.creadorNombre ?? raw?.__raw?.creador_nombre ?? ''
  ).trim();

  // Si no hay nombre pero hay correo, pon el user del correo como último recurso
  if (!creador_nombre) {
    const email = String(raw?.creador_correo ?? raw?.__raw?.creador_correo ?? '').trim();
    if (email && email.includes('@')) {
      creador_nombre = email.split('@')[0];
    }
  }

  return {
    ejercicio_id,
    titulo: String(raw?.titulo ?? raw?.__raw?.titulo ?? 'Sin título'),
    descripcion: String(raw?.descripcion ?? raw?.__raw?.descripcion ?? ''),
    tipo_id,        // ahora casi siempre se rellena (1|2|3) por inferencia
    tipo_nombre,    // y nombre del tipo alineado al id
    creador_nombre, // string seguro ('' si no hay nada)
    __raw: raw,
  };
}
