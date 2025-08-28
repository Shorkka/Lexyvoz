export interface ObtenerKitsResponse {
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    kit_id:           number;
    name:             string;
    descripcion:      string;
    creado_por:       number;
    fecha_creacion:   Date;
    updated_at:       Date;
    activo:           boolean;
    creador_nombre:   string;
    creador_correo:   string;
    total_ejercicios: string;
}


export interface Kit {
    kit_id:           number;
    name:             string;
    descripcion:      string;
    creado_por:       number;
    activo:           boolean;
    total_ejercicios: number;
}

export interface Pagination {
    current_page: number;
    total_pages:  number;
    total_items:  number;
}

export interface ObtenerKitsIDResponse {
    message:    string;
    kits:       Kit;
    pagination: Pagination;
}

export interface EjerciciosDeUnKit {
    message:    string;
    ejercicios: Ejercicio[];
    total:      number;
}

export interface Ejercicio {
    ejercicio_id:  number;
    titulo:        string;
    descripcion:   string;
    orden_en_kit:  number;
    activo_en_kit: boolean;
}
