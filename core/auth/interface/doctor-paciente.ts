// Base común para pacientes y doctores
export interface UsuarioBase {
  usuario_id: string;
  nombre: string;
  correo: string;
  fecha_de_nacimiento: Date;
  numero_telefono: string;
  sexo: string;
  domicilio: string;
  codigo_postal: string;
  imagen_url: string;
  fecha_vinculacion: Date;
}

// Paciente extiende de UsuarioBase
export interface Paciente extends UsuarioBase {
  escolaridad: string;
  domicilio:   string;
  paciente_id: number;
}

// Doctor extiende de UsuarioBase
export interface Doctor extends UsuarioBase {
  especialidad: string;
  domicilio:         string;
}

// Respuesta genérica
export interface ObtenerTodos<T> {
  message: string;
  data: T[];
  total: number;
}

// Alias para respuestas específicas
export type ObtenerTodosLosPacientes = ObtenerTodos<Paciente>;
export type ObtenerTodosLosDoctores = ObtenerTodos<Doctor>;


export interface Vinculaciones {
    message:       string;
    vinculaciones: Vinculacione[];
    total:         number;
}

export interface Vinculacione {
    doctor_id:         string;
    paciente_id:       string;
    fecha_vinculacion: Date;
    doctor_nombre:     string;
    especialidad:      string;
    paciente_nombre:   string;
    escolaridad:       string;
    domicilio:         string;
}
