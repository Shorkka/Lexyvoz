export interface ObtenerReactivoResponse {
    message:    string;
    reactivos:  Reactivo[];
    pagination: Pagination;
}
export interface ObtenerSubTipoReactivoResponse {
    message:    string;
    data:       Reactivo[];
    pagination: Pagination;
}    
export interface ObtenerSubTipoReactivoIDResponse {
    message:    string;
    data:       Reactivo;
    pagination: Pagination;
}    

export interface ObtenerTiposReactivosIDResponse {
    message:    string;
    data:       Reactivo[];
    pagination: Pagination;
}


export interface Pagination {
    totalItems:  number;
    totalPages:  number;
    currentPage: number;
}    

export interface Reactivo {
    id:          number;
    nombre:      string;
    imagen_url:  string;
    tipo_id:     number;
    sub_tipo_id: number;
    activo:      boolean;
}    

export interface ObtenerCompatibilidadVerificadaResponse {
    message:       string;
    compatible:    boolean;
    mensaje:       string;
    tipoExistente: TipoExistente;
}

export interface TipoExistente {
    tipo_id:     number;
    tipo_nombre: string;
}

export interface ObtenerReactivosIDRespoonse {
    message:  string;
    reactivo: Reactivo;
}

export interface ReactivoIDResponse {
    message:  string;
    reactivo: ReactivoID;
}

export interface ReactivoID {
    id:             number;
    nombre:         string;
    imagen_url:     string;
    tipo_id:        number;
    sub_tipo_id:    number;
    activo:         boolean;
    creado_por:     number;
    fecha_creacion: Date;
}

export interface ObtenerReactivosEjericiosResponse {
    message:      string;
    ejercicio_id: number;
    reactivos:    ReactivoEjercicio[];
    total:        number;
}

export interface ReactivoEjercicio {
    id:         number;
    nombre:     string;
    imagen_url: string;
    orden:      number;
    activo:     boolean;
}
