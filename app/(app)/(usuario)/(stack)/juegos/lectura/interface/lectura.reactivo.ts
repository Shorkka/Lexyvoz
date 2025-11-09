export interface ReactivoLecturaBase {
  ejercicio_reactivo_id: number;
  ejercicio_id: number;
  reactivo_id: number;
  orden: number;
  activo: boolean;
  tipo_id: 1;                 // Lectura
  tipo_nombre: string;
  sub_tipo_id: number;
  sub_tipo_nombre: string;
  tiempo_duracion?: number;
  __raw?: any;
}

/** Subtipo: pseudopalabras */
export interface ReactivoPseudopalabras extends ReactivoLecturaBase {
  sub_tipo_nombre: string; // "Pseudopalabras"
  payload: {
    instrucciones?: string;     // "Lee las siguientes pseudopalabras."
    pseudopalabras: string[];   // lista a leer
    habilitarTTS?: boolean;     // si quieres usar TTS
    vozTTS?: string;            // nombre de voz opcional
    audios?: string[];          // si el back te manda urls por línea (opcional)
  };
}

/** Genérico de lectura (fallback) */
export interface ReactivoLecturaGenerico extends ReactivoLecturaBase {
  payload: {
    instrucciones?: string;     // "Lee el siguiente texto."
    lineas: string[];           // líneas a leer
  };
}

export type ReactivoLectura =
  | ReactivoPseudopalabras
  | ReactivoLecturaGenerico;

export interface LecturaRendererProps {
  kitId: number;
  kitName?: string;
  ejercicioId: number;
  titulo?: string;
  totalReactivos?: number;
  reactivos: ReactivoLectura[];
  onFinishReactivo?: (args: {
    reactivoId: number;
    correcto?: boolean;
    respuesta?: string;
    tiempo_ms?: number;
  }) => void;
}
