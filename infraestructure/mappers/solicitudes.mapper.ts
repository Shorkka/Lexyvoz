import { EstadisticasSolicitudes, Solicitudes } from "@/core/auth/interface/solicitudes";


// Mapper de las solicitudes pendientes
// Mapper de las solicitudes pendientes con validación
export class SolicitudesPendientesMapper {
    static toDomain<T>(data: any): Solicitudes<T> {
        // Verificar que data sea un objeto válido
        if (!data || typeof data !== 'object') {
            throw new Error('Datos de respuesta inválidos');
        }
        
        // Buscar el array de solicitudes en las posibles propiedades
        const solicitudesArray = data.solicitudes || 
                               data.solicitudesUsuario || 
                               data.pendientes || 
                               data.data;
        
        // Validar que sea un array
        if (!Array.isArray(solicitudesArray)) {
            console.warn('La respuesta no contiene un array de solicitudes:', data);
            return {
                message: data.message || 'Respuesta recibida',
                solicitudes: [] as T[], // Array vacío como fallback
                total: data.total || 0
            };
        }
        
        return {
            message: data.message,
            solicitudes: solicitudesArray,
            total: data.total
        };
    }
}

// Mapper de las estadisticas de solicitudes
export class SolicitudesEstadisticasMapper {
    static toDomain(data: any): EstadisticasSolicitudes {
        return {
            message: data.message,
            estadisticas: {
                pendientes: data.estadisticas.pendientes,
                aceptadas: data.estadisticas.aceptadas,
                rechazadas: data.estadisticas.rechazadas,
                total: data.estadisticas.total
            }
        };
    }
}