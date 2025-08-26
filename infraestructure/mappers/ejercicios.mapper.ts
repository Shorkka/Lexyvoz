import { EjerciciosDeLosKits, EjerciciosDisponiblesParaUnKit, EstadisticasEjercicios, ObtenerEjercicioID, ObtenerEjericiosUsuarioActual, ObtenerReactivoDeEjercicio, ObtenerTodosLosEjercicios, VerificarCompatibilidad } from "@/core/auth/interface/ejercicios";


// Mapeo de la respuesta de obtenerEjercicioPor
export class EjercicioResponseMapper {
    static toObtenerTodosLosEjercicios = (data: any): ObtenerTodosLosEjercicios => {
        return {
            message: data.message,
            ejercicios: data.ejercicios.map((ejercicio: any) => ({
                ejercicio_id: ejercicio.ejercicio_id,
                titulo: ejercicio.titulo,
                descripcion: ejercicio.descripcion,
                tipo_ejercicio: ejercicio.tipo_ejercicio,
                creado_por: ejercicio.creado_por,
                activo: ejercicio.activo
            })),
            pagination: {
                totalItems: data.pagination.totalItems,
                totalPages: data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    };
}

export class EjercicioUsuarioActualMapper {
    static toObtenerEjerciciosUsuarioActual = (data: any): ObtenerEjericiosUsuarioActual => {
        return {
            message: data.message,
            data: data.data.map((item: any) => ({
                titulo: item.titulo,
                descripcion: item.descripcion,
                tipo_ejercicio: item.tipo_ejercicio,
                creado_por: item.creado_por
            })),
            pagination: {
                current_page: data.pagination.current_page,
                total_pages: data.pagination.total_pages,
                total_items: data.pagination.total_items,
                items_per_page: data.pagination.items_per_page
            }
        };
    };
}

// Mapear estadisticas de los ejercicios
export class EstadisticasEjerciciosMapper {
    static toEstadisticasEjercicios = (data: any): EstadisticasEjercicios => {
        return {
            message: data.message,
            estadisticas: {
                total_ejercicios: data.estadisticas.total_ejercicios,
                ejercicios_activos: data.estadisticas.ejercicios_activos,
                ejercicios_inactivos: data.estadisticas.ejercicios_inactivos,
                por_tipo: data.estadisticas.por_tipo.map((item: any) => ({
                    tipo: item.tipo,
                    cantidad: item.cantidad
                }))
            }
        };
    };
}

// Mapear ejercicios disponibles para un kit
export class EjerciciosDisponiblesParaUnKitMapper {
    static toEjerciciosDisponiblesParaUnKit = (data: any): EjerciciosDisponiblesParaUnKit => {
        return {
            message: data.message,
            data: data.data.map((item: any) => ({
                titulo: item.titulo,
                descripcion: item.descripcion,
                tipo_ejercicio: item.tipo_ejercicio,
                creado_por: item.creado_por
            })),
            pagination: {
                current_page: data.pagination.current_page,
                total_pages: data.pagination.total_pages,
                total_items: data.pagination.total_items,
                items_per_page: data.pagination.items_per_page
            }
        };
    };
}

// Mapear un ejercicio por ID
export class EjercicioIDMapper {
    static toObtenerEjercicioID = (data: any): ObtenerEjercicioID => {
        return {
            message: data.message,
            ejercicio: {
                titulo: data.ejercicio.titulo,
                descripcion: data.ejercicio.descripcion,
                tipo_ejercicio: data.ejercicio.tipo_ejercicio,
                creado_por: data.ejercicio.creado_por
            }
        };
    };
}

// Mapear los reactivos de un ejercicio
export class ReactivoMapper {
    static toObtenerReactivoDeEjercicio = (data: any): ObtenerReactivoDeEjercicio => {
        return {
            message: data.message,
            ejercicio: data.ejercicios.map((ejercicio: any) => ({
                ejercicio_id: ejercicio.ejercicio_id,
                titulo: ejercicio.titulo,
                descripcion: ejercicio.descripcion,
                tipo_ejercicio: ejercicio.tipo_ejercicio,
                creado_por: ejercicio.creado_por,
                activo: ejercicio.activo
            })),
            total_reactivos: data.total_reactivos
        };
    };
}

// Mapear Verificacion de compatibilidad de los reactivos
export class VerificarCompatibilidadMapper {
    static toVerificarCompatibilidad = (data: any): VerificarCompatibilidad => {
        return {
            message: data.message,
            compatibilidad: {
                compatible: data.compatibilidad.compatible,
                mensaje: data.compatibilidad.mensaje
            }
        };
    };
}

// Mapear los kits de los Ejercicios
export class EjerciciosDeLosKitsMapper {
    static toEjerciciosDeLosKits = (data: any): EjerciciosDeLosKits => {
        return {
            message: data.message,
            kits: data.kits.map((item: any) => ({
                kit_id: item.kit_id,
                kit_name: item.kit_name,
                kit_descripcion: item.kit_descripcion,
                orden_en_kit: item.orden_en_kit,
                activo_en_kit: item.activo_en_kit,
                fecha_agregado: item.fecha_agregado
            })),
            pagination: {
                total: data.pagination.total,
                page: data.pagination.page,
                totalPages: data.pagination.totalPages
            }
        };
    };
}
