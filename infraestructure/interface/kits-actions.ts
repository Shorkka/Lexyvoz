import { productsApi } from "@/core/auth/api/productsApi";
import { EjerciciosDeUnKit, ObtenerKitsResponse } from "@/core/auth/interface/kits";
import { KitIDMapper, KitMapper, ObtenerEjercicioKitMapper } from "../mappers/kit.mapper";

export interface CrearKits {
  name:        string;
  descripcion: string;
  creado_por:  number;
}
export interface CrearKitsConEjercicioResponse {
  name:        string;
  descripcion: string;
  creado_por:  number;
  ejercicios:  Ejercicio[];
  activo:      boolean;
}

export interface Ejercicio {
  ejercicio_id: number;
  orden:        number;
}


// Crear Kit Basico
export const crearKitBasico = async (kitData: CrearKits) => {
  try {
    const { data } = await productsApi.post<CrearKits>('/kits', kitData);
    return data;
  } catch (error) {
    console.error('Error al crear el kit:', error);
    throw new Error("Error al crear los kits");
  }
};

// Obtener kits
export const obtenerKits = async (
  page?: number,
  limit?: number
) => {
  try {
    const { data } = await productsApi.get<ObtenerKitsResponse>('/kits', {
      params: {
        page,
        limit
      }
    });
    return KitMapper.fromApiToEntity(data);
  } catch (error) {
    console.error('Error al obtener los kits:', error);
    throw new Error("Error al obtener los kits");
  }
};

// Crear kit con ejercicios
export const crearKitConEjercicios = async (kitData: CrearKitsConEjercicioResponse) => {
  try {
    const { data } = await productsApi.post<CrearKitsConEjercicioResponse>('/kits/con-ejercicios', kitData);
    return data;
  } catch (error) {
    console.error('Error al crear el kit con ejercicios:', error);
    throw new Error("Error al crear el kit con ejercicios");
  }
};

// Obtener kit por ID
export const obtenerKitPorId = async (id: number) => {
  try {
    const { data } = await productsApi.get<ObtenerKitsResponse>(`/kits/${id}`);
    return KitIDMapper.fromApiToEntity(data);
  } catch (error) {
    console.error('Error al obtener el kit por ID:', error);
    throw new Error("Error al obtener el kit por ID");
  }
};

// Actualizar Kit
export const actualizarKit = async (id: number, kitData: CrearKits) => {
  try {
    const { data } = await productsApi.put<CrearKits>(`/kits/${id}`, kitData);
    return data;
  } catch (error) {
    console.error('Error al actualizar el kit:', error);
    throw new Error("Error al actualizar el kit");
  }
};

// Eliminar Kit
export const eliminarKit = async (id: number) => {
  try {
    const { data } = await productsApi.delete(`/kits/${id}`);
    return data;
  } catch (error) {
    console.error('Error al eliminar el kit:', error);
    throw new Error("Error al eliminar el kit");
  }
};

// Obtener ejercicios de un kit
export const obtenerEjerciciosDeUnKit = async (id: number) => {
  try {
    const { data } = await productsApi.get<EjerciciosDeUnKit>(`/kits/${id}/ejercicios`);
    return ObtenerEjercicioKitMapper.fromApiToEntity(data);
  } catch (error) {
    console.error('Error al obtener los ejercicios del kit:', error);
    throw new Error("Error al obtener los ejercicios del kit");
  }
};

// Agregar ejercicios a kit
export const agregarEjerciciosAKit = async (id: number, ejercicios: Ejercicio[]) => {
  try {
    const { data } = await productsApi.post(`/kits/${id}/ejercicios`, { ejercicios });
    return data;
  } catch (error) {
    console.error('Error al agregar ejercicios al kit:', error);
    throw new Error("Error al agregar ejercicios al kit");
  }
};


// Remover ejercicios de kit
export const removerEjerciciosDeKit = async (id: number, ejercicioIds: number[]) => {
  try {
    const { data } = await productsApi.delete(`/kits/${id}/ejercicios`, { data: { ejercicioIds } });
    return data;
  } catch (error) {
    console.error('Error al remover ejercicios del kit:', error);
    throw new Error("Error al remover ejercicios del kit");
  }
};