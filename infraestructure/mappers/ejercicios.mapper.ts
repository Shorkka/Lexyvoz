import { EjerciciosDeLosKits, EjerciciosDisponiblesParaUnKit, EstadisticasEjercicios, ObtenerEjercicioID, ObtenerEjericiosUsuarioActual, ObtenerEjercicioPorTipo, ObtenerTodosLosEjercicios, VerificarCompatibilidad, ResponseReactivoDeEjercicio, MisEjercicios, NuevoResponseEjercicioReactivo } from "@/core/auth/interface/ejercicios";


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
                current_page: data.pagination.current_page,
                total_pages: data.pagination.total_pages,
                total_items: data.pagination.total_items,
                items_per_page: data.pagination.items_per_page
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
                total_creados: data.estadisticas.total_creados,
                tipos_diferentes: data.estadisticas.tipos_diferentes,
            }
        };
    };
}

// Mapear ejercicios disponibles para un kit
export class EjerciciosDisponiblesParaUnKitMapper {
  static toArray = (data: any): EjerciciosDisponiblesParaUnKit => {
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return list.map((item: any) => ({
      ejercicio_id:   Number(item?.ejercicio_id ?? item?.id ?? item?.ejercicioId) || 0,
      titulo:         String(item?.titulo ?? ''),
      descripcion:    String(item?.descripcion ?? ''),
      creado_por:     Number.isFinite(Number(item?.creado_por)) ? Number(item?.creado_por) : null,
      tipo_id:        Number.isFinite(Number(item?.tipo_id ?? item?.tipo ?? item?.tipo_ejercicio))
                        ? Number(item?.tipo_id ?? item?.tipo ?? item?.tipo_ejercicio)
                        : null,
      tipo_nombre:    String(item?.tipo_nombre ?? item?.tipoNombre ?? ''),
      creador_nombre: String(item?.creador_nombre ?? item?.creadorNombre ?? ''),
      __raw:          item,
    }));
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

export class ReactivoMapper {
  static toObtenerReactivoDeEjercicio = (data: any): NuevoResponseEjercicioReactivo => {
    const ejerciciosRaw = Array.isArray(data?.ejercicios)
      ? data.ejercicios
      : (data?.ejercicio ? [data.ejercicio] : []);

    const ejercicio = ejerciciosRaw.length
      ? {
          ejercicio_id: Number(ejerciciosRaw[0]?.ejercicio_id ?? ejerciciosRaw[0]?.id) || 0,
          titulo: String(ejerciciosRaw[0]?.titulo ?? ''),
          descripcion: String(ejerciciosRaw[0]?.descripcion ?? ''),
        }
      : { ejercicio_id: 0, titulo: '', descripcion: '' };

    const reactivos = Array.isArray(data?.reactivos)
      ? data.reactivos.map((r: any) => ({
          ejercicio_reactivo_id: Number(r?.ejercicio_reactivo_id) || 0,
          ejercicio_id: Number(r?.ejercicio_id) || 0,
          reactivo_id: Number(r?.reactivo_id) || 0,
          orden: Number(r?.orden) || 0,
          activo: Boolean(r?.activo),
          pseudopalabra: String(r?.pseudopalabra ?? ''),
          tiempo_duracion: Number(r?.tiempo_duracion) || 0,
          sub_tipo_id: Number(r?.sub_tipo_id) || 0,
          sub_tipo_nombre: String(r?.sub_tipo_nombre ?? ''),
          tipo_id: Number(r?.tipo_id) || 0,
          tipo_nombre: String(r?.tipo_nombre ?? ''),
        }))
      : [];

    return {
      message: String(data?.message ?? ''),
      ejercicio,
      reactivos,
      total_reactivos: Number(data?.total_reactivos ?? reactivos.length ?? 0),
    };
  };
}

// tipos de ejercicios
// tipos de ejercicios
export class TiposEjerciciosMapper {
  static toTiposEjercicios = (data: any): ObtenerEjercicioPorTipo => {
    const arr = data?.data ?? data?.items ?? data?.rows ?? [];

    const mapped = Array.isArray(arr)
      ? arr.map((item: any) => ({
          // IDs robustos
          ejercicio_id: item.ejercicio_id ?? item.id,

          // Básicos
          titulo: item.titulo,
          descripcion: item.descripcion,

          // Autor / creador (normalizamos ambos nombres por compatibilidad)
          creado_por: item.creado_por,
          creador_nombre: item.creador_nombre ?? item.creado_nombre ?? undefined,
          creado_nombre: item.creado_nombre ?? item.creador_nombre ?? undefined,

          // Tipo (aceptamos distintas formas del backend)
          tipo_ejercicio: item.tipo_ejercicio, // puede ser 1/2/3 o un label según tu backend
          tipo_id: item.tipo_id ?? item.tipo?.id ?? item.tipo_ejercicio,
          tipo_nombre: item.tipo_nombre ?? item.tipo?.nombre ?? undefined,
          created_at: item.created_at,
          activo: item.activo,
        }))
      : [];

    const pag = data?.pagination ?? {};
    const pagination = {
      total_items:    pag?.total_items    ?? 0,
      total_pages:    pag?.total_pages    ?? 1,
      current_page:   pag?.current_page   ?? 1,
      items_per_page: pag?.items_per_page ?? mapped.length,
    };

    return {
      message: data?.message ?? '',
      data: mapped,
      pagination,
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


export class EjerciciosReactivosMappper {
    static toEjerciciosReactivos = (data: any): any => {
        return data.map((ejercicio: ResponseReactivoDeEjercicio) => ({
            message: ejercicio.message,
            reactivos: ejercicio.reactivos.map((reactivo: any) => ({
                reactivo_id: reactivo.reactivo_id,
                contenido: reactivo.contenido,
                tipo_reactivo: reactivo.tipo_reactivo,
                opciones: reactivo.opciones,
                respuesta_correcta: reactivo.respuesta_correcta
            })),
            total_reactivos: ejercicio.total_reactivos
        }));
    };

}

export class MisEjerciciosMapper {
  static toMisEjercicios = (data: any): MisEjercicios => {
    return {
      message: String(data?.message ?? ''),
      data: (data?.data || []).map((item: any) => ({
        ejercicio_id:    Number(item?.ejercicio_id ?? item?.id) || 0,
        titulo:          String(item?.titulo ?? ''),
        descripcion:     String(item?.descripcion ?? ''),
        creado_por:      Number.isFinite(Number(item?.creado_por)) ? Number(item?.creado_por) : null,
        tipo_ejercicio:  Number.isFinite(Number(item?.tipo_ejercicio)) ? Number(item?.tipo_ejercicio) : null,
        created_at:      new Date(item?.created_at ?? Date.now()),
        updated_at:      new Date(item?.updated_at ?? Date.now()),
        activo:          Boolean(item?.activo),
        creador_nombre:  String(item?.creador_nombre ?? ''),
        creador_correo:  String(item?.creador_correo ?? ''),
        tipo_nombre:     String(item?.tipo_nombre ?? ''),
        total_reactivos: Number(item?.total_reactivos ?? 0),
        total_kits:      Number(item?.total_kits ?? 0),
      })),
      pagination: {
        current_page:   Number(data?.pagination?.current_page ?? 1),
        total_pages:    Number(data?.pagination?.total_pages ?? 1),
        total_items:    Number(data?.pagination?.total_items ?? 0),
        items_per_page: Number(data?.pagination?.items_per_page ?? 50),
      },
    };
  };
}