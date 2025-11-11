import { isAxiosError } from "axios";
import { Platform } from "react-native";
import { productsApi } from "@/core/auth/api/productsApi";

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
