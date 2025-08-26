import { productsApi } from "@/core/auth/api/productsApi"
import { CompatibilidadEjerciciosReactivosMapper, ObtenerEjerciciosReactivosMapper, ReactivoMapper, SubTiposReactivosMapper, tiposReactivosMapper } from "../mappers/reactivos.mapper";
export interface CrearReactivo {
  pseudopalabra:   string;
  id_sub_tipo:     number;
  tiempo_duracion: number;
}
export interface CrearReactivoResponse {
  message:  string;
  reactivo: CrearReactivoResponseReactivo;
}

export interface CrearReactivoResponseReactivo {
  reactivo_id:     number;
  pseudopalabra:   string;
  id_sub_tipo:     number;
  tiempo_duracion: number;
  activo:          boolean;
  fecha_creacion:  Date;
  message:         Message;
  reactivo:        ReactivoReactivo;
}

export interface Message {
  type:    string;
  example: string;
}

export interface ReactivoReactivo {
  $ref: string;
}

export interface CrearEjercicioReactivo {
  reactivos: number[];
}


// Crear Reactivo
export const crearReactivoKits = async (reactivos: CrearReactivo) => {
  try {
    const { data } = await productsApi.post<CrearReactivoResponse>('/reactivos', reactivos);
    return data;
  } catch (error) {
    console.error("Error al crear reactivos kits:", error);
    throw error;
  }
};

export const obtenerReactivoKits = async (
  page?: number,
  limit?: number,
  buscar?: string,
  activo?: boolean,
  sub_tipo_id?: number,
  tipo_id?: number,
) => {
  try {
    const { data } = await productsApi.get('/reactivos', {
      params: { page, limit, buscar, activo, sub_tipo_id, tipo_id }
    });
    return ReactivoMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener reactivos kits:", error);
    throw error;
  }
};

export const obtenerSubtiposReactivosPorID = async (
  sub_tipo_id: number,
  page?: number,
  limit?: number,
  activo?: boolean,
) => {
  try {
    const { data } = await productsApi.get(`/reactivos/sub-tipo/${sub_tipo_id}`, {
      params: { page, limit, activo }
    });
    return SubTiposReactivosMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener subtipos de reactivos:", error);
    throw error;
  }
};

export const obtenerTiposReactivosPorID = async (tipo_id: number) => {
  try {
    const { data } = await productsApi.get(`/reactivos/tipo/${tipo_id}`);
    return tiposReactivosMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener tipos de reactivos:", error);
    throw error;
  }
};

export const obtenerCompatibilidadEjerciciosReactivos = async (
  ejercicio_id: number,
  tipo_id: number
) => {
  try {
    const { data } = await productsApi.get(`/reactivos/compatibilidad/${ejercicio_id}/${tipo_id}`);
    return CompatibilidadEjerciciosReactivosMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener compatibilidad de ejercicios reactivos:", error);
    throw error;
  }
};

export const obtenerReactivoKitsPorID = async (reactivo_id: number) => {
  try {
    const { data } = await productsApi.get(`/reactivos/${reactivo_id}`);
    return ReactivoMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener reactivo kits por ID:", error);
    throw error;
  }
};

export const editarReactivo = async (reactivo_id: number, data: any) => {
  try {
    const response = await productsApi.put<CrearReactivo>(`/reactivos/${reactivo_id}`, data);
    return ReactivoMapper.fromApiResp(response.data);
  } catch (error) {
    console.error("Error al editar reactivo:", error);
    throw error;
  }
};

export const eliminarReactivo = async (reactivo_id: number) => {
  try {
    const response = await productsApi.delete(`/reactivos/${reactivo_id}`);
    return ReactivoMapper.fromApiResp(response.data);
  } catch (error) {
    console.error("Error al eliminar reactivo:", error);
    throw error;
  }
};

export const crearEjercicio = async (
  ejercicio_id: number
) => {
  try {
    const response = await productsApi.post<CrearEjercicioReactivo>(
      `/reactivos/ejercicio/${ejercicio_id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    throw error;
  }
};

export const obtenerEjerciciosReactivos = async (ejercicio_id: number) => {
  try {
    const { data } = await productsApi.get(`/reactivos/ejercicio/${ejercicio_id}`);
    return ObtenerEjerciciosReactivosMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener ejercicios reactivos:", error);
    throw error;
  }
};

export const editarEjerciciosReactivos = async (
  ejercicio_id: number,
  reactivos_orden: CrearEjercicioReactivo[]
) => {
  try {
    const response = await productsApi.put<CrearEjercicioReactivo>(
      `/reactivos/ejercicio/${ejercicio_id}/reordenar`,
      { reactivos_orden },
    );
    return response.data;
  } catch (error) {
    console.error("Error al editar ejercicios reactivos:", error);
    throw error;
  }
};

export const deleteEjercicioReactivo = async (
  ejercicio_id: number,
  reactivo_id: number
) => {
  try {
    const response = await productsApi.delete(`/reactivos/ejercicio/${ejercicio_id}/${reactivo_id}`, {
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar ejercicio reactivo:", error);
    throw error;
  }
};
