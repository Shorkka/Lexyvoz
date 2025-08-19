export interface ObtenerKitResponse {
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
