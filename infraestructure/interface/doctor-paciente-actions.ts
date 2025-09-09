import { productsApi } from "@/core/auth/api/productsApi";
import { DoctorPacienteMapper } from "../mappers/doctor-paciente.mapper";
import { Doctor, Paciente } from "@/core/auth/interface/doctor-paciente";



export interface VincularDoctorConPacienteResponse {
    message: string;
    vinculo: Vinculo;
}

export interface VincularDoctorConUsuarioResponse {
    message:             string;
    vinculo:             Vinculo;
    paciente_id:         number;
    fue_creado_paciente: boolean;
}

export interface Vinculo {
    doctor_id:   number;
    paciente_id: number;
}


// Vincula un doctor con un paciente
export const vincularDoctorConPaciente = async (doctor_id: number, paciente_id: number) => {
  try {
    const { data } = await productsApi.post<VincularDoctorConPacienteResponse>('/doctor-paciente/vincular', { doctor_id, paciente_id });
    return { success: true, data };
  } catch (error) {
    console.error('Error al vincular doctor con paciente:', error);
    return { success: false, error };
  }
}

// Vincular con un doctor con un usuario (creando paciente) o paciente existente
// Esta función permite dos tipos de vinculación:
// 1. Proporciona doctor_id y usuario_id si el usuario no es paciente, se convierte en paciente
// 2. Si el usuario ya es paciente, simplemente se vincula al doctor
export const vincularDoctorConUsuario = async (doctor_id: number, usuario_id: number) => {
  try {
    const { data } = await productsApi.post<VincularDoctorConUsuarioResponse>('/doctor-paciente/vincular-usuario', { doctor_id, usuario_id });
    return { success: true, data };
  } catch (error) {
    console.error('Error al vincular doctor con usuario:', error);
    return { success: false, error };
  }
}

// Obtiene todos los pacientes de un doctor
export const obtenerPacientesDeDoctor = async (doctor_id: number) => {
  try {
    const { data } = await productsApi.get(`/doctor-paciente/doctor/${doctor_id}/pacientes`);

    // Asegúrate de que la respuesta tenga la estructura correcta
    if (data && data.pacientes) {
      return DoctorPacienteMapper.toDomain<Paciente>(data);
    } else {
      console.error('Estructura de datos inesperada:', data);
      return { 
        message: 'Estructura de datos inesperada', 
        data: [], 
        total: 0 
      };
    }
  } catch (error) {
    console.error('Error al obtener pacientes de doctor:', error);
    throw error; // Importante: lanzar el error para que React Query lo capture
  }
}

// Obtiene todos los doctores de un paciente
export const obtenerDoctoresDePaciente = async (paciente_id: number) => {
  try {
    const { data } = await productsApi.get(`/doctor-paciente/${paciente_id}/doctores`);
    
    if (data && data.doctores) {
      return DoctorPacienteMapper.toDomain<Doctor>(data);
    } else {
      console.error('Estructura de datos inesperada:', data);
      return { 
        message: 'Estructura de datos inesperada', 
        data: [], 
        total: 0 
      };
    }
  } catch (error) {
    console.error('Error al obtener doctores de paciente:', error);
    throw error;
  }
}

// desvincular un doctor de un paciente
export const desvincularDoctorDePaciente = async (doctor_id: number, paciente_id: number) => {
  try {
    const { data } = await productsApi.post('/doctor-paciente/desvincular', { doctor_id, paciente_id });
    return { success: true, data };
  } catch (error) {
    console.error('Error al desvincular doctor de paciente:', error);
    return { success: false, error };
  }
}

// Obtiene todas las vinculaciones doctor-paciente
export const obtenerVinculaciones = async () => {
  try {
    const { data } = await productsApi.get('/doctor-paciente/vinculaciones');
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener vinculaciones doctor-paciente:', error);
    return { success: false, error };
  }
}