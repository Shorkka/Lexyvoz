// infraestructure/mappers/resultados-mapper.ts
import type { ResponseLectura, Resultado } from '@/core/auth/interface/resultados';

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
