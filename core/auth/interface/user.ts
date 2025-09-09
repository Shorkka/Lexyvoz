export interface User {
    usuario_id: number;
    nombre:              string;
    correo:              string;
    contrasenia:          string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    domicilio:           string;
    codigo_postal:        string;
tipo_id:                number;
    doctor_id?:          number;    
    paciente_id?:        number;
}
export interface Enlace{
    usuario_id: number;
    doctor_id: number;
}

export interface UserResponse {
    usuario_id:           number;
    nombre:              string;
    correo:              string;
    fecha_de_nacimiento: Date;
    numero_telefono:     string;
    sexo:                string;
    tipo:                string;
    escolaridad?:         string;
    especialidad?:        string;
    domicilio:           string;
    codigo_postal:        string;
    imagen_url?:         string;
    doctor_id?:          number;
    paciente_id?:        number;
    tipo_id: number;
}

