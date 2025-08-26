import { EjerciciosDeUnKit, ObtenerKitsIDResponse, ObtenerKitsResponse } from "@/core/auth/interface/kits";

export class KitMapper {
  static fromApiToEntity(apiKit: any): ObtenerKitsResponse {
    return {
      message: "Kit obtenido exitosamente",
      kits: [
        {
          kit_id: apiKit.kit_id,
          name: apiKit.name,
          descripcion: apiKit.descripcion,
          creado_por: apiKit.creado_por,
          activo: apiKit.activo,
          total_ejercicios: apiKit.total_ejercicios
        }
      ],
      pagination: {
        current_page: apiKit.current_page,
        total_pages: apiKit.total_pages,
        total_items: apiKit.total_items
      }
    };
  }
}

// Obtener kit por id
export class KitIDMapper {
  static fromApiToEntity(apiKit: any): ObtenerKitsIDResponse {
    return {
      message: "Kit obtenido exitosamente",
      kits: 
        {
          kit_id: apiKit.kit_id,
          name: apiKit.name,
          descripcion: apiKit.descripcion,
          creado_por: apiKit.creado_por,
          activo: apiKit.activo,
          total_ejercicios: apiKit.total_ejercicios
        },
      pagination: {
        current_page: apiKit.current_page,
        total_pages: apiKit.total_pages,
        total_items: apiKit.total_items
      }
    };
  }
}

// Maper de un ejercicio de un kit
export class ObtenerEjercicioKitMapper{
  static fromApiToEntity(apiEjercicio: any): EjerciciosDeUnKit {
    return {
      message: "Ejercicios del kit obtenidos exitosamente",
      ejercicios: apiEjercicio.ejercicios.map((ej: any) => ({
        ejercicio_id: ej.ejercicio_id,
        titulo: ej.titulo,
        descripcion: ej.descripcion,
        orden_en_kit: ej.orden_en_kit,
        activo_en_kit: ej.activo_en_kit
      })),
      total: apiEjercicio.total
    };
  }
}