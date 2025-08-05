import { productsApi } from "../auth/api/productsApi";

export const obtenerKits = async (kit_id: string) => {
  try{
    const response = await productsApi.get(`/kits/ejercicios/kit/${kit_id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener kits:', error);
  }
};
