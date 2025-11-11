import { productsApi } from "@/core/auth/api/productsApi";
import { DoctorResponse, PacienteResponse, UsuarioResponse, VinculacionResponse } from "@/core/auth/interface/auth";
import { DoctorMapper, PacienteMapper, UsuarioMapper, VinculacionMapper } from "../mappers/auth.mapper";

// Listar todos los doctores (con paginacion)
export const obtenerDoctores = async (
  page?: number,
  limit?: number,
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
    return DoctorMapper.fromApiToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los doctores");
  }
};

// Listar todos los pacientes
export const obtenerPacientes = async (
  page?: number,
  limit?: number,
  searchTerm?: string
): Promise<PacienteResponse> => {
  try {
    const { data } = await productsApi.get<PacienteResponse>(`/auth/patients`, {
      params: {
        page,
        limit,
        ...(searchTerm && { search: searchTerm }) // optional search parameter
      }
    });
    return PacienteMapper.fromApiToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los pacientes");
  }
};

// Lista vinculos doctor-paciente (con paginacion)
export const obtenerVinculosDoctorPaciente = async (
  page?: number,
  limit?: number
) => {
  try {
    const { data } = await productsApi.get<VinculacionResponse>(`/auth/doctor-patient-links`, {
      params: {
        page,
        limit
      }
    });
    return VinculacionMapper.fromApiToEntity(data);
  } catch (error) {
    console.error('Error al obtener los vínculos doctor-paciente:', error);
    throw error;
  }
};

// Listar todos los usuarios
export const obtenerUsuarios = async (
  page?: number,
  limit?: number,
  searchTerm?: string
): Promise<UsuarioResponse> => {
  try {
    const { data } = await productsApi.get<UsuarioResponse>(`/auth/users`, {
      params: {
        page,
        limit,
        ...(searchTerm && { search: searchTerm })
      }
    });
    return UsuarioMapper.fromApiToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los usuarios");
  }
};

