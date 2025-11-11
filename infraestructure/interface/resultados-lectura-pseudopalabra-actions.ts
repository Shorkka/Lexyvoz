import { isAxiosError } from "axios";
import { Platform } from "react-native";
import { productsApi } from "@/core/auth/api/productsApi";
import { ReultadoMapper } from "../mappers/resultados-mapper";

export type RNFile = { uri: string; name?: string; type?: string };

export interface ResultadoLecturaFormPayload {
  usuario_id: number;
  ejercicio_id: number;
  id_reactivo: number;
  kit_id: number;
  tiempo_respuesta: number;
  // Opción A: URL ya alojada (preferida si existe)
  voz_usuario_url?: string;
  // Opción B: archivo local (se envía como multipart solo si NO se pasó voz_usuario_url)
  voz_usuario?: RNFile;
}

const ENDPOINT = "reactivos/resultados-lectura-pseudopalabras";

/** Convierte blob: URI (web) a File para adjuntar en FormData */
async function fileFromWebBlob(
  uri: string,
  fallbackName = "audio.m4a",
  fallbackType = "audio/m4a"
) {
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`No se pudo leer el blob (${res.status})`);
  const blob = await res.blob();
  // @ts-ignore: File existe en entorno web
  return new File([blob], fallbackName, { type: (blob as any).type || fallbackType });
}

export const resultadoLecturaForm = async (payload: ResultadoLecturaFormPayload) => {
  const {
    usuario_id,
    ejercicio_id,
    id_reactivo,
    kit_id,
    tiempo_respuesta,
    voz_usuario_url,
    voz_usuario,
  } = payload;

  if (!usuario_id || !Number.isFinite(usuario_id)) {
    throw new Error("ID de usuario inválido (usuario_id).");
  }

  try {
    // ======== A) Preferir JSON simple si ya tienes una URL pública ========
    if (voz_usuario_url && voz_usuario_url.trim()) {
      const body = {
        usuario_id,
        ejercicio_id,
        id_reactivo,
        kit_id,
        tiempo_respuesta,
        voz_usuario_url: voz_usuario_url.trim(),
      };
      console.log(voz_usuario_url)
      const { data } = await productsApi.post(ENDPOINT, body);
      return data;
    }

    // ======== B) Fallback: enviar archivo (multipart/form-data) ========
    const fd = new FormData();
    fd.append("usuario_id", String(usuario_id));
    fd.append("ejercicio_id", String(ejercicio_id));
    fd.append("id_reactivo", String(id_reactivo));
    fd.append("kit_id", String(kit_id));
    fd.append("tiempo_respuesta", String(tiempo_respuesta));

    if (voz_usuario?.uri) {
      if (Platform.OS === "web") {
        const file = await fileFromWebBlob(
          voz_usuario.uri,
          voz_usuario.name ?? "audio.m4a",
          voz_usuario.type ?? "audio/m4a"
        );
        fd.append("voz_usuario", file as any);
      } else {
        fd.append(
          "voz_usuario",
          {
            uri: voz_usuario.uri,
            name: voz_usuario.name ?? "audio.m4a",
            type: voz_usuario.type ?? "audio/m4a",
          } as any
        );
      }
    }

    const { data } = await productsApi.post(ENDPOINT, fd);
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.log("[resultadoLecturaForm][AxiosError]", {
        status: err.response?.status,
        data: err.response?.data,
      });
    }
    const msg =
      isAxiosError(err)
        ? ((err.response?.data as any)?.message ??
           (err.response?.data as any)?.error ??
           (err.response?.status === 500
             ? "Error interno del servidor"
             : "No se pudo guardar el resultado"))
        : (err as Error).message;

    throw new Error(msg);
  }
};

export const respuestaResultadosBackend = async (kitId: number, paciente_id: number) =>{
  try{
  const data = await productsApi.get(`/reactivos/reportes/kit/${kitId}/paciente/${paciente_id}`)
  return ReultadoMapper.toapifront(data);
  }catch(error){
    console.log(error);
  }
} 


/** Estructuras que regresa tu backend */
export type UltimoResultado = {
  es_correcto: boolean;
  tiempo_respuesta: number;      // ms (según tu app)
  voz_usuario_url: string | null;
  fecha_realizacion: string;     // ISO
};

export type EjercicioResumen = {
  ejercicio_id: number;
  aciertos: number;
  total: number;
  porcentaje: number;            // 0..100
  tiempo_promedio: number;       // ms o seg (normalizamos abajo)
  ultimo_resultado?: UltimoResultado;
};

export type CompletarResp = {
  kit_id: number;
  paciente_id: number;
  ejercicios: EjercicioResumen[];
};

/** Util: normaliza ms -> seg si aplica */
export function msOrSecToSec(value: number): number {
  if (!Number.isFinite(value)) return 0;
  // Si viene muy grande, asumimos ms
  return value > 50 ? value / 1000 : value;
}

/** Calcula índice LS = (aciertos / tiempo_en_seg) * 100 */
export function calcularIndiceLS(aciertos: number, tiempoPromedio: number): number {
  const tSeg = Math.max( msOrSecToSec(tiempoPromedio), 0.001 );
  const ls = (Number(aciertos) / tSeg) * 100;
  return Math.round(ls * 10) / 10; // 1 decimal
}
