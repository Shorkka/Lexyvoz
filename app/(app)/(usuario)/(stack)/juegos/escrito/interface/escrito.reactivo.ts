export interface ReactivoBase {
  ejercicio_reactivo_id: number;
  ejercicio_id: number;
  reactivo_id: number;
  orden: number;
  activo: boolean;
  tipo_id: 2;                 // Escrito
  tipo_nombre: string;
  sub_tipo_id: number;
  sub_tipo_nombre: string;
  tiempo_duracion?: number;
  __raw?: any;
}

/** Subtipo: escribir-bien (ortografía/selección múltiple, por ejemplo) */
export interface ReactivoEscribirBien extends ReactivoBase {
  sub_tipo_nombre: string; // "Escribir bien"
  payload: {
    instrucciones?: string;
    enunciado?: string;
    opciones: string[];     // opciones para elegir la correcta
    correctaIndex?: number; // si el back lo manda
  };
}

/** Subtipo: reordenamiento (anagrama/ordenar letras/palabra) */
export interface ReactivoReordenamiento extends ReactivoBase {
  sub_tipo_nombre: string; // "Reordenamiento"
  payload: {
    instrucciones?: string; // "Ordena las letras para formar la palabra"
    objetivo?: string;      // palabra correcta, si viene
    desordenado: string;    // letras desordenadas
    longitud?: number;
  };
}

/** Genérico por si llega un subtipo desconocido */
export interface ReactivoEscritoGenerico extends ReactivoBase {
  payload: {
    instrucciones?: string;
    texto?: string;
    opciones?: string[];
    meta?: Record<string, any>;
  };
}

export type ReactivoEscrito =
  | ReactivoEscribirBien
  | ReactivoReordenamiento
  | ReactivoEscritoGenerico;

/** Props que recibirán los renderers de cada subtipo */
export interface EscritoRendererProps {
  kitId: number;
  kitName?: string;
  ejercicioId: number;
  titulo?: string;
  totalReactivos?: number;
  // Lista de reactivos ya mapeados a uno de los tipos anteriores
  reactivos: ReactivoEscrito[];
  // Callbacks útiles que tú ya tienes en tu app
  onFinishReactivo?: (args: {
    reactivoId: number;
    correcto?: boolean;
    respuesta?: string;
    tiempo_ms?: number;
  }) => void;
}
