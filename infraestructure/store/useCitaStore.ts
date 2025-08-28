import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CitaBody } from "@/core/auth/interface/citas";
import { 
  crearCita, 
  obtenerTodasCitas, 
  obtenerCitasPorID, 
  editarCita, 
  eliminarCita,
} from "../interface/cita-actions";

export const useCitasStore = () => {
  const queryClient = useQueryClient();

  //  Obtener todas las citas
  const todasCitasQuery = useQuery({
    queryKey: ['citas'],
    queryFn: obtenerTodasCitas,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Hook para obtener cita por ID
  const useCitaPorIdQuery = (citaID?: number) =>
    useQuery({
      queryKey: ['cita', citaID],
      queryFn: () => obtenerCitasPorID(citaID as number),
      enabled: !!citaID, // Solo si hay un ID
    });

  //  Crear cita
  const crearCitaMutation = useMutation({
    mutationFn: (citaData: CitaBody) => crearCita(citaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
    onError: (error) => {
      console.error('Error al crear cita:', error);
    },
  });

  //  Editar cita
  const editarCitaMutation = useMutation({
    mutationFn: ({ citaID, citaData }: { citaID: number; citaData: CitaBody }) =>
      editarCita(citaID, citaData),
    onSuccess: (_data, { citaID }) => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      queryClient.invalidateQueries({ queryKey: ['cita', citaID] });
    },
  });

  //  Eliminar cita
  const eliminarCitaMutation = useMutation({
    mutationFn: (citaID: number) => eliminarCita(citaID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });

  return {
    // Queries
    todasCitasQuery,
    useCitaPorIdQuery,

    // Mutations
    crearCitaMutation,
    editarCitaMutation,
    eliminarCitaMutation,
  };
};
