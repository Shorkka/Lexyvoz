import { ObtenerKitResponse } from "./interface/kit.mapper.interface";


export class KitMapper {
  static fromApiToEntity(apiKit: any): ObtenerKitResponse {
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
