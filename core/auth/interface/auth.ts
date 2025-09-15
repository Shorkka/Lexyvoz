export interface DoctorResponse {
    page:    number;
    limit:   number;
    total:   number;
    count:   number;
    doctors: { [key: string]: null | string }[];
}

export interface PacienteResponse {
    page:     number;
    limit:    number;
    total:    number;
    count:    number;
    patients: { [key: string]: null | string }[];
}

export interface VinculacionResponse {
    page:  number;
    limit: number;
    total: number;
    count: number;
    links: Link[];
}

export interface Link {
    doctor_id:            string;
    paciente_id:          string;
    doctor_nombre:        string;
    doctor_correo:        string;
    doctor_imagen_url:    null | string;
    doctor_especialidad:  string;
    paciente_nombre:      string;
    paciente_correo:      string;
    paciente_imagen_url:  null | string;
    paciente_escolaridad: string;
}

export interface UsuarioResponse {
    page:  number;
    limit: number;
    total: number;
    count: number;
    users: User[];
}

export interface User {
    doctor_id?:            string;
    paciente_id?:          string;
    usuario_id:            string;
    nombre:                string;
    correo:                string;
    fecha_de_nacimiento:   Date;
    numero_telefono:       string;
    sexo:                  string;
    tipo:                  string;
    imagen_url:            string;
    imagen_id:             string;
    doctor_especialidad?:  string;
    domicilio:             string;
    codigo_postal:         string;
    paciente_escolaridad?: string;
}
