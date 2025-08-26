import { EstadisticasSolicitudes, Solicitudes } from "@/core/auth/interface/solicitudes";


// Mapper de las solicitudes pendientes
export class SolicitudesPendientesMapper {
    static toDomain<T>(data: any): Solicitudes<T> {
        return {
            message: data.message,
            solicitudes: data.solicitudesUsuario ?? data.pendientes ?? data.data,
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