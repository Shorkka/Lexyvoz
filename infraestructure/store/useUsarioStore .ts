
import { useQuery } from "@tanstack/react-query";
import { User } from "@/core/auth/interface/user";
import { UserMapper } from "../mappers/user.mapper";
import { obtenerUsuarioPorID, searchDoctors } from "../interface/paciente-actions";

export const useDoctorSearchStore = () => {

  // Query para buscar doctores por ID de paciente
  const useDoctoresPorPacienteQuery = (pacienteId: number) => useQuery({
    queryKey: ['doctores-paciente', pacienteId],
    queryFn: () => searchDoctors(pacienteId),
    enabled: !!pacienteId, // Solo se ejecuta si existe pacienteId
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    select: (data) => data.map((doctor: any) => UserMapper.fromApiToEntity(doctor)), // Mapea cada doctor
  });

  // Query para obtener usuario/doctor por ID
  const useUsuarioPorIdQuery = (userId: number) => useQuery<User, Error>({
    queryKey: ['usuario', userId],
    queryFn: async () => {
      const response = await obtenerUsuarioPorID(userId);
      // Ensure the returned object matches the User interface, including 'contrasenia'
      return UserMapper.fromApiToEntity(response) as any;
    },
    enabled: !!userId,
    select: (data) => data, // Data is already mapped to User
  });

    return {
    // Queries
    useDoctoresPorPacienteQuery,
    useUsuarioPorIdQuery
  };
};