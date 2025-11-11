// infraestructure/mappers/resultados-mapper.ts
import type { IaRespuesta, ResponseLectura, Resultado } from '@/core/auth/interface/resultados';

export class ResultadosLecturaMapper {
  static toApiResponse(data: any): ResponseLectura {
    const raw: any = Array.isArray(data?.resultado)
      ? data.resultado[0]
      : data?.resultado ?? {};

    const resultado: Resultado = {
      resultado_id:     Number(raw?.resultado_id ?? raw?.id ?? 0),
      usuario_id:       Number(raw?.usuario_id ?? raw?.paciente_id ?? 0),
      reactivo_id:      Number(raw?.reactivo_id ?? raw?.id_reactivo ?? 0),
      tiempo_respuesta: Number(raw?.tiempo_respuesta ?? 0),
      es_correcto:      Boolean(raw?.es_correcto ?? raw?.correcto ?? false),
      voz_usuario_url:  String(raw?.voz_usuario_url ?? ''),
      ia_respuesta: {
        clase:         String(raw?.ia_respuesta?.clase ?? raw?.clase ?? ''),
        probabilidad:  Number(
          raw?.ia_respuesta?.probabilidad ??
          raw?.probabilidad ??
          data?.probabilidad ??
          0
        ),
        transcripcion: String(
          raw?.ia_respuesta?.transcripcion ??
          raw?.transcripcion ??
          ''
        ),
      },
    };

    return {
      message: String(data?.message ?? 'OK'),
      resultado,
    };
  }
}


export class ReultadoMapper {
  static toapifront(data: any): ResponseLectura {
    // Normaliza contenedor (puede venir { message, resultado }, o solo { ...resultado }, o arrays)
    const hasResultado = data && typeof data === 'object' && 'resultado' in data;
    let raw = hasResultado ? data.resultado : data;

    if (Array.isArray(raw)) raw = raw[0] ?? {};
    if (!raw || typeof raw !== 'object') raw = {};

    const pick = (...vals: any[]) => vals.find(v => v !== undefined && v !== null);

    // Normaliza bloque de IA (puede venir anidado o con claves planas)
    const iaRaw = raw.ia_respuesta ?? raw.ia ?? {};
    const ia: IaRespuesta = {
      clase:        String(pick(iaRaw.clase, raw.ia_clase, raw.clase, '')),
      probabilidad: Number(pick(iaRaw.probabilidad, raw.ia_probabilidad, raw.probabilidad, 0)),
      transcripcion:String(pick(iaRaw.transcripcion, raw.ia_transcripcion, raw.transcripcion, '')),
    };

    const resultado: Resultado = {
      resultado_id:     Number(pick(raw.resultado_id, raw.resultado_reactivo_usuario_id, raw.id, 0)),
      usuario_id:       Number(pick(raw.usuario_id, raw.paciente_id, raw.user_id, 0)),
      reactivo_id:      Number(pick(raw.reactivo_id, raw.id_reactivo, 0)),
      tiempo_respuesta: Number(pick(raw.tiempo_respuesta, raw.tiempo, 0)),
      es_correcto:      Boolean(pick(raw.es_correcto, raw.correcto, false)),
      voz_usuario_url:  String(pick(raw.voz_usuario_url, raw.audio_url, raw.voz, '')),
      ia_respuesta:     ia,
    };

    return {
      message: String(pick(data?.message, data?.msg, '')),
      resultado,
    };
  }
}