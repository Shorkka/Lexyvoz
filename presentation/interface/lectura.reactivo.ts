// presentation/interface/lectura.reactivo.ts

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
  sub_tipo_nombre: string;
  payload: {
    instrucciones?: string;
    pseudopalabras: string[];
    habilitarTTS?: boolean;
    vozTTS?: string;
    audios?: string[];        // pistas opcionales
  };
}

/** Subtipo: lectura densa (párrafos) */
export interface ReactivoLecturaDensas extends ReactivoLecturaBase {
  payload: {
    instrucciones?: string;
    parrafos: string[];
    audios?: string[];        // pistas opcionales
  };
}

/** Subtipo: palabras sueltas */
export interface ReactivoLecturaPalabras extends ReactivoLecturaBase {
  payload: {
    instrucciones?: string;
    palabras: string[];
    audios?: string[];        // pistas opcionales
  };
}

/** Genérico de lectura (fallback) */
export interface ReactivoLecturaGenerico extends ReactivoLecturaBase {
  payload: {
    instrucciones?: string;   // "Lee el siguiente texto."
    lineas: string[];         // líneas a leer
    audios?: string[];        // pistas opcionales
  };
}

export type ReactivoLectura =
  | ReactivoPseudopalabras
  | ReactivoLecturaDensas
  | ReactivoLecturaPalabras
  | ReactivoLecturaGenerico;

export interface LecturaRendererProps {
  kitId: number;
  kitName?: string;
  ejercicioId: number;
  titulo?: string;
  totalReactivos?: number;
  reactivos: ReactivoLectura[];
  submitted?: boolean;         // para cambiar el CTA a "Siguiente"
  onNext?: () => void;         // para avanzar al siguiente reactivo
  onFinishReactivo?: (args: {
    reactivoId: number;
    correcto?: boolean;
    respuesta?: string;
    tiempo_ms?: number;
    audioUri?: string;
  }) => void;
}
