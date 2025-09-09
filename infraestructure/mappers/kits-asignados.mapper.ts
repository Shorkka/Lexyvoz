import { KitsAsignadosAPacientesPorID, ObtenerKitsASignadosIDResponse, ObtenerKitsAsignadosResponse } from "@/core/auth/interface/kits-asignaciones";



// Maper Obtener kits asignados
export class ObtenerKitsAsignadosMapper {
  static toResponse(data: any): ObtenerKitsAsignadosResponse {
    return {
      message: data.message,
      data: data.data.map((item: any) => ({
        id: item.id,
        kit_id: item.kit_id,
        paciente_id: item.paciente_id,
        fecha_asignacion: item.fecha_asignacion,
        estado: item.estado,
        kit_nombre: item.kit_nombre,
        kit_descripcion: item.kit_descripcion,
        paciente_nombre: item.paciente_nombre,
        paciente_email: item.paciente_email
      })),
      pagination: {
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalItems: data.pagination.total_items,
        itemsPerPage: data.pagination.items_per_page
      }
    };
  }
}

// Obtener kits asginados por id
export class ObtenerKitAsignadoPorIdMapper{
    static toResponse(data: any): ObtenerKitsASignadosIDResponse {
        return {
            message: data.message,
            asignacion: {
                id: data.data.id,
                kit_id: data.data.kit_id,
                paciente_id: data.data.paciente_id,
                fecha_asignacion: data.data.fecha_asignacion,
                estado: data.data.estado,
                kit_nombre: data.data.kit_nombre,
                kit_descripcion: data.data.kit_descripcion,
                paciente_nombre: data.data.paciente_nombre,
                paciente_email: data.data.paciente_email,
                kit_imagen: data.data.kit_imagen
            }
        };
    }
}

// Mapear kit asignado al paciente
export class KitsAsignadosAPacientesPorIDMapper {
    static toResponse(data: any): KitsAsignadosAPacientesPorID {
        return {
            message: data.message,
            data: data.data.map((item: any) => ({
                id: item.id,
                kit_id: item.kit_id,
                paciente_id: item.paciente_id,
                fecha_asignacion: item.fecha_asignacion,
                estado: item.estado,
                kit_nombre: item.kit_nombre,
                kit_descripcion: item.kit_descripcion,
                paciente_nombre: item.paciente_nombre,
                paciente_email: item.paciente_email
            })),
            pagination: {
                currentPage: data.pagination.current_page,
                totalPages: data.pagination.total_pages,
                totalItems: data.pagination.total_items,
                itemsPerPage: data.pagination.items_per_page
            }
        };
    }
}