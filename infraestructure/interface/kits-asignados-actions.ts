import { productsApi } from "@/core/auth/api/productsApi";
import { KitsAsignadosAPacientesPorIDMapper, ObtenerKitAsignadoPorIdMapper, ObtenerKitsAsignadosMapper } from "../mappers/kits-asignados.mapper";

export interface AsignarKitsResponse {
  message:    string;
  asignacion: Asignacion;
}

export interface Asignacion {
  id:               number;
  kit_id:           number;
  paciente_id:      number;
  fecha_asignacion: Date;
  estado:           string;
}


// Asignar kits
export const asignarKit = async (kit_id: number, paciente_id: number) => {
  try {
    const { data } = await productsApi.post<AsignarKitsResponse>(`/kits-asignados`, { kit_id, paciente_id });
    return { data };
  } catch (error) {
    console.error('Error al asignar kit:', error);
    return Promise.reject(error);
  }
};

// Obtener kits asignados
export const obtenerKitsAsignados = async (
  page: number,
  limit: number,
  estado: string
) => {
  try {
    const { data } = await productsApi.get(`/kits-asignados`, {
      params: { page, limit, estado }
    });
    return ObtenerKitsAsignadosMapper.toResponse(data);
  } catch (error) {
    console.error('Error al obtener kits asignados:', error);
    throw error;
  }
};

// Obtener kit asignado por ID
export const obtenerKitAsignadoPorId = async (id: string) => {
  try {
    const { data } = await productsApi.get(`/kits-asignados/${id}`);
    return ObtenerKitAsignadoPorIdMapper.toResponse(data);
  } catch (error) {
    console.error('Error al obtener kit asignado por ID:', error);
    throw error;
  }
};

// Eliminar kits Asignados
export const eliminarKitAsignado = async (kitAsignadoId: string) => {
  try {
    await productsApi.delete(`/kits-asignados/${kitAsignadoId}`);
  } catch (error) {
    console.error('Error al eliminar kit asignado:', error);
    return Promise.reject(error);
  }
};

// Obtener kits asignados a pacientes
export const obtenerKitsAsignadosAPacientesPorID = async (paciente_id: string, 
  page?: number,
  limit?: number
  ) => {
  try {
    const { data } = await productsApi.get(`/kits-asignados/pacientes/${paciente_id}`, {
      params: { page, limit }
    });
    return KitsAsignadosAPacientesPorIDMapper.toResponse(data);
  } catch (error) {
    console.error('Error al obtener kits asignados a pacientes por ID:', error);
    throw error;
  }
};  

// Editar estado del kit asignados
export const editarEstadoKitAsignado = async (id: string, estado: string) => {
  try {
    await productsApi.put(`/kits-asignados/${id}/estado`, { estado });
  } catch (error) {
    console.error('Error al editar estado del kit asignado:', error);
    return Promise.reject(error);
  }
};
