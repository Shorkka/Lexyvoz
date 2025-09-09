export interface ObtenerTodosLosEjercicios {
    message:    string;
    ejercicios: Ejercicio[];
    pagination?: Pagination;
}

export interface Ejercicio {
    ejercicio_id:   number;
    titulo:         string;
    descripcion:    string;
    tipo_ejercicio: number;
    tipo_nombre?:   string; 
    creado_por:     number;
    activo:         boolean;
    created_at?: string;
}

export interface Pagination {
    current_page:  number;
    total_pages:  number;
    total_items: number;
    items_per_page?: number;
}


export interface ObtenerEjericiosUsuarioActual {
    message:    string;
    data:       Datum[];
    pagination: PaginationUsuarioActual;
}

export interface Datum {
    titulo:         string;
    descripcion:    string;
    tipo_ejercicio: number;
    creado_por:     number;
}

export interface PaginationUsuarioActual {
    current_page:   number;
    total_pages:    number;
    total_items:    number;
    items_per_page: number;
}


export interface EstadisticasEjercicios {
    message:      string;
    estadisticas: Estadisticas;
}

export interface Estadisticas {
    total_ejercicios:     number;
    ejercicios_activos:   number;
    ejercicios_inactivos: number;
    total_creados:       number;
    tipos_diferentes:    number;
}

export interface PorTipo {
    tipo:     string;
    cantidad: number;
}


export interface EjerciciosDisponiblesParaUnKit {
    message:    string;
    data:       Datum[];
    pagination: PaginationUsuarioActual;
}

export interface ObtenerEjercicioID {
    message:   string;
    ejercicio: EjercicioID;
}

export interface EjercicioID {
    titulo:         string;
    descripcion:    string;
    tipo_ejercicio: number;
    creado_por:     number;
}

export interface ObtenerReactivoDeEjercicio {
    message:         string;
    ejercicio:       Ejercicio;
    total_reactivos: number;
}

export interface VerificarCompatibilidad {
    message:        string;
    compatibilidad: Compatibilidad;
}

export interface Compatibilidad {
    compatible: boolean;
    mensaje:    string;
}


export interface EjerciciosDeLosKits {
    message:    string;
    kits:       Kit[];
    pagination: PaginationKits;
}

export interface Kit {
    kit_id:          number;
    kit_name:        string;
    kit_descripcion: string;
    orden_en_kit:    number;
    activo_en_kit:   boolean;
    fecha_agregado:  Date;
}

export interface PaginationKits {
    total:      number;
    page:       number;
    totalPages: number;
}
export interface ObtenerEjercicioPorTipo {
    message:    string;
    data:       Data[];
    pagination: PaginationPorTipo;
}

export interface Data {
    ejercicio_id:   number;
    titulo:         string;
    descripcion:    string;
    creado_por:     number;
    created_at:     Date;
    activo:         boolean;
    creador_nombre: string;
    tipo_nombre:    string;
}

export interface PaginationPorTipo {
    current_page:   number;
    total_pages:    number;
    total_items:    number;
    items_per_page: number;
}
