import { productsApi } from "@/core/auth/api/productsApi";


export const crearKit = async (kitData: {
  nombre: string;
  descripcion: string;
  creado_por: number;
}) => {
  try {
    const { data } = await productsApi.post('/kits', kitData);
    return { success: true, data };
  } catch (error) {
    console.error('Error al crear kit:', error);
    return { success: false, error };
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