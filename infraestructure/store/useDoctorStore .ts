import { 
  searchPacientes,
  enlazarPaciente,
  obtenerDoctor
} from "@/infraestructure/interface/doctor-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DoctorResponse } from "@/core/auth/interface/user";
import { DoctorMapper } from "../mappers/doctor.mapper";

export const useDoctorStore = () => {
  const queryClient = useQueryClient();

  // Query to search patients by doctor ID
  const usePacientesQuery = (doctor_id: number) => useQuery({
    queryKey: ['pacientes', doctor_id],
    queryFn: () => searchPacientes(doctor_id),
    enabled: !!doctor_id, // Only runs when doctor_id exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Mutation to link patient to doctor
  const enlazarPacienteMutation = useMutation({
    mutationFn: ({ usuario_id, doctor_id }: { usuario_id: number, doctor_id: number }) => 
      enlazarPaciente(usuario_id, doctor_id),
    onSuccess: (data, variables) => {
      // Invalidate both the specific doctor's patients list and general queries
      queryClient.invalidateQueries({ queryKey: ['pacientes', variables.doctor_id] });
      queryClient.invalidateQueries({ queryKey: ['doctor-pacientes'] });
    },
    onError: (error) => {
      console.error('Error linking patient:', error);
    }
  });

  // Query to get doctor by ID with mapper transformation
const useDoctorQuery = (page: number = 1, limit: number = 10, searchTerm?: string) => 
  useQuery<DoctorResponse, Error>({
    queryKey: ['doctor', page, limit, searchTerm],
    queryFn: () => obtenerDoctor(page, limit, searchTerm),
    select: (data) => DoctorMapper.fromApiToEntity(data),
  });

  return {
    // Queries
    usePacientesQuery,
    useDoctorQuery,
    
    // Mutations
    enlazarPacienteMutation
  };
};