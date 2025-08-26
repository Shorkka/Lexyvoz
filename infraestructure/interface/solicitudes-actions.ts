import { productsApi } from "@/core/auth/api/productsApi";
import { SolicitudesEstadisticasMapper, SolicitudesPendientesMapper } from "../mappers/solicitudes.mapper";
import { Pendientes, SolicitudesUsuario } from "@/core/auth/interface/solicitudes";

export interface EnviarSolicitdResponse {
    message:   string;
    solicitud: Solicitud;
}

export interface Solicitud {
    id:              number;
    usuario_id:      number;
    doctor_id:       number;
    mensaje:         string;
    estado:          string;
    fecha_solicitud: Date;
}

// Usuario envia solicitud para ser paciente de un doctor
export const enviarSolicitudAlDoctor = async (doctor_id: number) => {
    try {
        const { data } = await productsApi.post<EnviarSolicitdResponse>('/doctor-paciente/vincular', { doctor_id });
        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar solicitud al doctor:', error);
        return { success: false, error };
    }
}

// Obtener solicitudes pendientes para un doctor
export const obtenerSolicitudesDoctorPaciente = async (doctor_id: number) => {
    try {
        const { data } = await productsApi.get(`/solicitudes/doctor/${doctor_id}/pendientes`);
        return SolicitudesPendientesMapper.toDomain<Pendientes>(data);
    } catch (error) {
        console.error('Error al obtener solicitudes del doctor:', error);
        return { success: false, error };
    }
}

// Obtener solicitudes enviadas por el usuario
// Retorna todas las solicitudes que el usuario ha enviado a doctores
export const obtenerSolicitudesEnviadasPorUsuario = async () => {
    try{
        const resp = await productsApi.get('/solicitudes/mis-solicitudes');
        return SolicitudesPendientesMapper.toDomain<SolicitudesUsuario>(resp.data);
    } catch (error) {
        console.error('Error al obtener solicitudes enviadas por el usuario:', error);
        return { success: false, error };
    }
}

// Doctor responde a una solicitud de vinculacion
// Permite al doctor aceptar o rechazar una solicitud. Si acepta, automáticamente crea la vinculación.
export const responderSolicitudVinculacion = async (solicitud_id: number, respuesta: string) => {
    try {
        const { data } = await productsApi.post(`/solicitudes/vinculacion/${solicitud_id}/respuesta`, { respuesta });
        return { success: true, data };
    } catch (error) {
        console.error('Error al responder solicitud de vinculacion:', error);
        return { success: false, error };
    }
}

// Obtener estadisticas de solicitudes del doctor
export const obtenerEstadisticasSolicitudesDoctor = async (doctor_id: number) => {
    try {
        const { data } = await productsApi.get(`/solicitudes/doctor/${doctor_id}/estadisticas`);
        return SolicitudesEstadisticasMapper.toDomain(data);
    } catch (error) {
        console.error('Error al obtener estadisticas de solicitudes del doctor:', error);
        return { success: false, error };
    }
}