export interface ObtenerKitsAsignadosResponse {
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id:               number;
    kit_id:           number;
    paciente_id:      number;
    fecha_asignacion: Date;
    estado:           string;
    kit_nombre:       string;
    kit_descripcion:  string;
    paciente_nombre:  string;
    paciente_email:   string;
}

export interface Pagination {
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    itemsPerPage: number;
}

export interface ObtenerKitsASignadosIDResponse {
    message:    string;
    asignacion: Asignacion;
}

export interface Asignacion {
    id:               number;
    kit_id:           number;
    paciente_id:      number;
    fecha_asignacion: Date;
    estado:           string;
    kit_nombre:       string;
    kit_descripcion:  string;
    kit_imagen:       string;
    paciente_nombre:  string;
    paciente_email:   string;
}


export interface KitsAsignadosAPacientesPorID {
    message:    string;
    data:       Data[];
    pagination: PaginationPaciente;
}

export interface Data {
    id:               number;
    kit_id:           number;
    paciente_id:      number;
    fecha_asignacion: Date;
    estado:           string;
    kit_nombre:       string;
    kit_descripcion:  string;
    kit_imagen:       string;
}

export interface PaginationPaciente {
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    itemsPerPage: number;
}
