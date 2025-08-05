import { productsApi } from "@/core/auth/api/productsApi";


export const searchPacientes = async ( doctor_id: number) => {
  try {
    const { data } = await productsApi.get(`/doctores/${doctor_id}/pacientes`);
    return data;
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    throw error;
  }
}


export const enlazarPaciente = async (usuario_id: number, doctor_id: number) => {
  try {
    const { data } = await productsApi.post('/vincular', { usuario_id, doctor_id });
    return { success: true, data };
  } catch (error) {
    console.error('Error al vincular paciente:', error);
    return { success: false, error };
  }
};