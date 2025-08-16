import { productsApi } from "@/core/auth/api/productsApi";
import { KitAsignadoAlUsuario } from "@/core/auth/interface/kits";

export const asignarKit = async (kit_id: number, usuario_id: number, estado: string): Promise<KitAsignadoAlUsuario> => {
  try {
    const { data } = await productsApi.post(`/kits/asignados`, { kit_id, usuario_id, estado });
    return { kit_id: data.kit_id, usuario_id: data.usuario_id, estado: data.estado };
  } catch (error) {
    console.error('Error al asignar kit:', error);
    return Promise.reject(error);
  }
};

export const obtenerKitsAsignados = async (usuario_id: number) => {
  try {
    const { data } = await productsApi.get(`/kits/asignados/${usuario_id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener kits asignados:', error);
    throw error;
  }
};
export const editarKitAsignado = async (kitAsignadoId: string, kitData: KitAsignadoAlUsuario) => {
  try {
    const { data } = await productsApi.put(`/kits/asignados/${kitAsignadoId}`, kitData);
    return data;
  } catch (error) {
    console.error('Error al editar kit asignado:', error);
    return Promise.reject(error);
  }
}
export const eliminarKitAsignado = async (kitAsignadoId: string) => {
  try {
    await productsApi.delete(`/kits/asignados/${kitAsignadoId}`);
  } catch (error) {
    console.error('Error al eliminar kit asignado:', error);
    return Promise.reject(error);
  }
};
