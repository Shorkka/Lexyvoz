
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  obtenerDoctores,
  obtenerPacientes,
  obtenerVinculosDoctorPaciente,
  obtenerUsuarios,
} from "../interface/auth-actions";
import {
  DoctorResponse,
  PacienteResponse,
  UsuarioResponse,
  VinculacionResponse
} from "@/core/auth/interface/auth";

export const useAuthKitsStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  //  Obtener doctores con paginación y búsqueda
  const useObtenerDoctoresQuery = (
    page?: number,
    limit?: number,
    searchTerm?: string
  ) =>
    useQuery<DoctorResponse, Error>({
      queryKey: ["doctores", page, limit, searchTerm],
      queryFn: () => obtenerDoctores(page, limit, searchTerm),
      staleTime: 1000 * 60 * 5,
      placeholderData: undefined,
    });

  //  Obtener pacientes con paginación y búsqueda
  const useObtenerPacientesQuery = (
    page?: number,
    limit?: number,
    searchTerm?: string
  ) =>
    useQuery<PacienteResponse, Error>({
      queryKey: ["pacientes", page, limit, searchTerm],
      queryFn: () => obtenerPacientes(page, limit, searchTerm),
      staleTime: 1000 * 60 * 5,
      placeholderData: undefined, 
    });

  //  Obtener vínculos doctor-paciente con paginación
  const useObtenerVinculosDoctorPacienteQuery = (
    page?: number,
    limit?: number
  ) =>
    useQuery<VinculacionResponse, Error>({
      queryKey: ["vinculosDoctorPaciente", page, limit],
      queryFn: () => obtenerVinculosDoctorPaciente(page, limit),
      staleTime: 1000 * 60 * 5,
    placeholderData: undefined,
    });

  //  Obtener usuarios con paginación y búsqueda
  const useObtenerUsuariosQuery = (
    page?: number,
    limit?: number,
    searchTerm?: string
  ) =>
    useQuery<UsuarioResponse, Error>({
      queryKey: ["usuarios", page, limit, searchTerm],
      queryFn: () => obtenerUsuarios(page, limit, searchTerm),
      staleTime: 1000 * 60 * 5,
      placeholderData: undefined,
    });

  // ----------------- REFETCH FUNCTIONS -----------------
  const refetchDoctores = () => {
    queryClient.invalidateQueries({ queryKey: ["doctores"] });
  };

  const refetchPacientes = () => {
    queryClient.invalidateQueries({ queryKey: ["pacientes"] });
  };

  const refetchVinculos = () => {
    queryClient.invalidateQueries({ queryKey: ["vinculosDoctorPaciente"] });
  };

  const refetchUsuarios = () => {
    queryClient.invalidateQueries({ queryKey: ["usuarios"] });
  };

  return {
    // Queries
    useObtenerDoctoresQuery,
    useObtenerPacientesQuery,
    useObtenerVinculosDoctorPacienteQuery,
    useObtenerUsuariosQuery,

    // Refetch functions
    refetchDoctores,
    refetchPacientes,
    refetchVinculos,
    refetchUsuarios,
  };
};