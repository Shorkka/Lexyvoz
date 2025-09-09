export interface EstadisticasSolicitudes {
    message:      string;
    estadisticas: Estadisticas;
}

export interface Estadisticas {
    pendientes: number;
    aceptadas:  number;
    rechazadas: number;
    total:      number;
}

export interface Solicitudes<T> {
    message: string;
    solicitudes: T[];
    total: number;
    success?: boolean; // Para respuestas de error
    error?: any; // Para respuestas de error
}


export interface Pendientes{
    usuario_id:      number;
    estado:              string;
    usuario_nombre:  string;
    usuario_correo:  string;
    usuario_imagen:  string;
}

export interface SolicitudesUsuario{
    doctor_id:           number;
    fecha_respuesta:     Date;
    doctor_nombre:       string;
    doctor_especialidad: string;
}

export type ObtenerSolicitudesPendientes = Solicitudes<Pendientes>;
export type ObtenerSolicitudesUsuario = Solicitudes<SolicitudesUsuario>;