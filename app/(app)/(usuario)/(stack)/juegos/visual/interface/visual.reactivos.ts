export interface ReactivoVisualBase {
  ejercicio_reactivo_id: number;
  ejercicio_id: number;
  reactivo_id: number;
  orden: number;
  activo: boolean;
  tipo_id: 3;                 
  tipo_nombre: string;
  sub_tipo_id: number;
  sub_tipo_nombre: string;
  tiempo_duracion?: number;
  __raw?: any;
}

/** Subtipo: igual-diferente */
export interface ReactivoVisualIgualDiferente extends ReactivoVisualBase {
  sub_tipo_nombre: string; // "Igual-Diferente"
  payload: {
    instrucciones?: string; 
    items: Array<{
      izquierda: string;
      derecha: string;
      sonIguales?: boolean; // si el back lo manda
    }>;
  };
}

/** Subtipo: imagen-correcta */
export interface ReactivoVisualImagenCorrecta extends ReactivoVisualBase {
  sub_tipo_nombre: string; // "Imagen correcta"
  payload: {
    instrucciones?: string;
    enunciado?: string;
    opciones: Array<{
      imageUrl: string;
      label?: string;
      correcta?: boolean; // si el back lo manda
    }>;
  };
}

/** Subtipo: palabra-mal-escrita */
export interface ReactivoVisualPalabraMalEscrita extends ReactivoVisualBase {
  sub_tipo_nombre: string; // "Palabra mal escrita"
  payload: {
    instrucciones?: string; // "Selecciona la palabra incorrecta."
    pares: Array<{
      izquierda: string;
      derecha: string;
      incorrecta: 0 | 1; // 0 => izquierda es incorrecta, 1 => derecha
    }>;
  };
}

/** Fallback genérico */
export interface ReactivoVisualGenerico extends ReactivoVisualBase {
  payload: {
    instrucciones?: string;
    contenido?: any;
  };
}

export type ReactivoVisual =
  | ReactivoVisualIgualDiferente
  | ReactivoVisualImagenCorrecta
  | ReactivoVisualPalabraMalEscrita
  | ReactivoVisualGenerico;

export interface VisualRendererProps {
  kitId: number;
  kitName?: string;
  ejercicioId: number;
  titulo?: string;
  totalReactivos?: number;
  reactivos: ReactivoVisual[];
  onFinishReactivo?: (args: {
    reactivoId: number;
    correcto?: boolean;
    respuesta?: string;
    tiempo_ms?: number;
    meta?: Record<string, any>;
  }) => void;
}
