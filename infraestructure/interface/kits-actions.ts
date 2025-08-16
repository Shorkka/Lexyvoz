import { productsApi } from "@/core/auth/api/productsApi";
import { CreateKit, EjerciciosKits } from "@/core/auth/interface/kits";


export const crearKit = async (kitData: {
  nombre: string;
  descripcion: string;
  creado_por: number;
}): Promise<CreateKit> => {
  try {
    const { data } = await productsApi.post('/kits', kitData);
    return { nombre: data.nombre, descripcion: data.descripcion, creado_por: data.creado_por };
  } catch (error) {
    console.error('Error al crear kit:', error);
    return Promise.reject(error);
  }
};

export const obtenerKits = async () => {
  try {
    const { data } = await productsApi.get('/kits');
    return data;
  } catch (error) {
    console.error('Error al obtener kits:', error);
    throw error;
  }
};

export const obtenerKitPorId = async (kit_id: number) => {
  try {
    const { data } = await productsApi.get(`/kits/${kit_id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener kit por ID:', error);
    throw error;
  }
};

export const editarKit = async (kit_id: number, kitData: {
  nombre?: string;
  descripcion?: string;
}) => {
  try {
    const { data } = await productsApi.put(`/kits/${kit_id}`, kitData);
    return { success: true, data };
  } catch (error) {
    console.error('Error al editar kit:', error);
    return { success: false, error };
  }
};

export const eliminarKit = async (kit_id: number) => {
  try {
    const { data } = await productsApi.delete(`/kits/${kit_id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Error al eliminar kit:', error);
    return { success: false, error };
  }
};

export const agregarEjercicioAKit = async (kitId: string, ejercicioId: string): Promise<EjerciciosKits> => {
  try {
    const { data } = await productsApi.post(`/kits/ejercicios/agregar`, { kitId, ejercicioId });
    return { kitId: data.kitId, ejercicioId: data.ejercicioId };
  } catch (error) {
    console.error('Error al agregar ejercicio a kit:', error);
    return Promise.reject(error);
  }
};

export const obtenerEjerciciosDeKit = async (kitId: string): Promise<EjerciciosKits[]> => {
  try {
    const { data } = await productsApi.get(`/kits/ejercicios/kit/${kitId}`);
    return data;
  } catch (error) {
    console.error('Error al obtener ejercicios de kit:', error);
    throw error;
  }
};
export const eliminarEjercicioDeKit = async (kitId: string, ejercicioId: string): Promise<EjerciciosKits> => {
  try {
    const { data } = await productsApi.delete(`/kits/ejercicios/eliminar`, {
      data: { kitId, ejercicioId }
    });
    return { kitId: data.kitId, ejercicioId: data.ejercicioId };
  } catch (error) {
    console.error('Error al eliminar ejercicio de kit:', error);
    return Promise.reject(error);
  }
};
