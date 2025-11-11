import {  ImagenCorrectaArchivo, ImagenCorrectaResponse, ImagenCorrectaResultado, Imagene, ObtenerCompatibilidadVerificadaResponse, ObtenerReactivoResponse, ObtenerReactivosEjericiosResponse, ObtenerSubTipoReactivoResponse, ObtenerTiposReactivosIDResponse, ReactivoIDResponse, ReporteEjercicioItem, ReporteKitPacienteResponse } from "@/core/auth/interface/reactivos";
export class ReactivoMapper {
    static fromApiResp(data: any): ObtenerReactivoResponse {
        return {
            message:    data.message,
            reactivos:  data.reactivos.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class SubTiposReactivosMapper {
    static fromApiResp(data: any): ObtenerSubTipoReactivoResponse {
        return {
            message:    data.message,
            data:       data.data.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class tiposReactivosMapper {
    static fromApiResp(data: any): ObtenerTiposReactivosIDResponse {
        return {
            message:    data.message,
            data:       data.data.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class CompatibilidadEjerciciosReactivosMapper {
    static fromApiResp(data: any): ObtenerCompatibilidadVerificadaResponse {
        return {
            message:       data.message,
            compatible:    data.compatible,
            mensaje:       data.mensaje,
            tipoExistente: {
                tipo_id:     data.tipoExistente.tipo_id,
                tipo_nombre: data.tipoExistente.tipo_nombre
            }
        };
    }
}
// Mapper obtener reactivo ID
export class ObtenerReactivosIDMapper{
    static fromApiResp(data: any): ReactivoIDResponse {
        return {
            message:  data.message,
            reactivo: {
                id:             data.reactivo.id,
                nombre:         data.reactivo.nombre,
                imagen_url:     data.reactivo.imagen_url,
                tipo_id:        data.reactivo.tipo_id,
                sub_tipo_id:    data.reactivo.sub_tipo_id,
                activo:         data.reactivo.activo,
                creado_por:     data.reactivo.creado_por,
                fecha_creacion: data.reactivo.fecha_creacion
            }
        };
    }
}

export class ObtenerEjerciciosReactivosMapper{
    static fromApiResp(data: any): ObtenerReactivosEjericiosResponse {
        return {
            message:      data.message,
            ejercicio_id: data.ejercicio_id,
            reactivos:    data.reactivos.map((item: any) => ({
                id:         item.id,
                nombre:    item.nombre,
                imagen_url: item.imagen_url,
                orden:      item.orden,
                activo:     item.activo
            })),
            total:        data.total
        };
    }
}


export class ImagenCorrectaMapper {
  static fromApiResp(d: any): ImagenCorrectaResponse {
    const imagenes: Imagene[] = Array.isArray(d?.imagenes)
      ? d.imagenes.map((i: any) => ({
          imagen_url: String(i?.imagen_url ?? ""),
          es_correcta: Boolean(i?.es_correcta),
        }))
      : [];

    return {
      id_sub_tipo: Number(d?.id_sub_tipo ?? 0),
      tiempo_duracion: Number(d?.tiempo_duracion ?? 0),
      oracion: String(d?.oracion ?? ""),
      imagenes,
    };
  }
}

export class ImagenCorrectaResultadosMapper {
  static fromApiResp(d: any): ImagenCorrectaResultado {
    return {
      usuario_id: Number(d?.usuario_id ?? 0),
      id_reactivo: Number(d?.id_reactivo ?? 0),
      // Convierte a Date (asumiendo que el backend manda ISO string o timestamp)
      tiempo_inicio_reactivo: new Date(d?.tiempo_inicio_reactivo),
      tiempo_terminar_reactivo: new Date(d?.tiempo_terminar_reactivo),
      imagen_seleccionada_id: Number(d?.imagen_seleccionada_id ?? 0),
    };
  }
}

export class ImagenCorrectaArchivoMapper {
  static fromApiResp(d: any): ImagenCorrectaArchivo {
    return {
      message: String(d?.message ?? ""),
      id_reactivo: Number(d?.id_reactivo ?? 0),
    };
  }
}

export class ReporteKitPacienteMapper {
  static fromApiResp(d: any): ReporteKitPacienteResponse {
    const ejercicios: ReporteEjercicioItem[] = Array.isArray(d?.ejercicios)
      ? d.ejercicios.map((e: any) => ({
          ejercicio_id:    Number(e?.ejercicio_id ?? 0),
          aciertos:        Number(e?.aciertos ?? 0),
          total:           Number(e?.total ?? 0),
          porcentaje:      Number(e?.porcentaje ?? 0),
          tiempo_promedio: Number(e?.tiempo_promedio ?? 0),
        }))
      : [];

    return {
      message: String(d?.message ?? ""),
      ejercicios,
    };
  }
}