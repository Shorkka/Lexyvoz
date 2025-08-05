import { productsApi } from "@/core/auth/api/productsApi";

export const searchDoctors = async (number_id: number) => {
  try {
    const { data } = await productsApi.get(`/pacientes/${number_id}/doctores`);
    return data;
  } catch (error) {
    console.error('Error al buscar doctores:', error);
    throw error;
  }
};
