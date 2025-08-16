import { productsApi } from "@/core/auth/api/productsApi";
import { DoctorMapper } from "../mappers/doctor.mapper";
import { DoctorResponse } from "@/core/auth/interface/user";


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
    const { data } = await productsApi.post('/doctor-paciente/vincular', { usuario_id, doctor_id });
    return { success: true, data };
  } catch (error) {
    console.error('Error al vincular paciente:', error);
    return { success: false, error };
  }
};

export const obtenerDoctor = async (
  page: number = 1,
  limit: number = 10,
  searchTerm?: string
): Promise<DoctorResponse> => {
  try {
    const { data } = await productsApi.get<DoctorResponse>(`/auth/doctors`, {
      params: {
        page,
        limit,
        ...(searchTerm && { search: searchTerm }) // optional search parameter
      }
    });
    console.log('Doctores obtenidos:', data);
    return DoctorMapper.fromApiToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los doctores");
  }
}