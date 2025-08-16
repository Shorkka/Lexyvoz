
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CitaBody } from "@/core/auth/interface/citas";
import { 
  crearCita, 
  obtenerTodasCitas, 
  obtenerCitasPorID, 
  editarCita, 
  eliminarCita,
  vincularCita
}from "../interface/cita-actions";

export const useCitasStore = () => {
  const queryClient = useQueryClient();

  // Consultas para citas
  const todasCitasQuery = useQuery({
    queryKey: ['citas'],
    queryFn: obtenerTodasCitas,
    staleTime: 1000 * 60 * 5 // 5 minutos de fresh data
  });

  const useCitaPorIdQuery = (citaID: string) => useQuery({
    queryKey: ['cita', citaID],
    queryFn: () => obtenerCitasPorID(citaID),
    enabled: !!citaID // Solo se ejecuta si hay un ID
  });

  // Mutaciones para citas
  const crearCitaMutation = useMutation({
    mutationFn: (citaData: {
      doctor_id: number;
      paciente_id: number;
      fecha_cita: string;
    }) => crearCita(citaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
    onError: (error) => {
      console.error('Error al crear cita:', error);
    }
  });

  const editarCitaMutation = useMutation({
    mutationFn: ({ citaID, citaData }: { citaID: string, citaData: CitaBody }) => 
      editarCita(citaID, citaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      queryClient.invalidateQueries({ queryKey: ['cita'] });
    }
  });

  const eliminarCitaMutation = useMutation({
    mutationFn: (citaID: string) => eliminarCita(citaID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    }
  });

  const vincularCitaMutation = useMutation({
    mutationFn: ({ doctor_id, pacienteID }: { doctor_id: string, pacienteID: string }) => 
      vincularCita(doctor_id, pacienteID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    }
  });

  return {
    // Queries
    todasCitasQuery,
    useCitaPorIdQuery,
    
    // Mutations
    crearCitaMutation,
    editarCitaMutation,
    eliminarCitaMutation,
    vincularCitaMutation
  };
};