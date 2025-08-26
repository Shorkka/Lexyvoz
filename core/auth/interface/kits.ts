export interface ObtenerKitsResponse {
    message:    string;
    kits:       Kit[];
    pagination: Pagination;
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
