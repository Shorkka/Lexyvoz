import { 
  crearEjercicio,
  obtenerEjercicios,
  obtenerEjercicioPorID,
  editarEjercicio,
  eliminarEjercicio
} from "@/infraestructure/interface/ejercicios-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useEjerciciosStore = () => {
  const queryClient = useQueryClient();

  // Consultas para ejercicios
  const ejerciciosQuery = useQuery({
    queryKey: ['ejercicios'],
    queryFn: obtenerEjercicios,
    staleTime: 1000 * 60 * 10 // 10 minutos de fresh data
  });

  const useEjercicioPorIdQuery = (ejercicioID: string) => useQuery({
    queryKey: ['ejercicio', ejercicioID],
    queryFn: () => obtenerEjercicioPorID(ejercicioID),
    enabled: !!ejercicioID, // Solo se ejecuta si hay un ID
    retry: 1 // Reintentar una vez si falla
  });

  // Mutaciones para ejercicios
  const crearEjercicioMutation = useMutation({
    mutationFn: ({ nombre, descripcion }: { nombre: string, descripcion: string }) => 
      crearEjercicio(nombre, descripcion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
    },
    onError: (error) => {
      console.error('Error al crear ejercicio:', error);
    }
  });

  const editarEjercicioMutation = useMutation({
    mutationFn: ({ ejercicioID, nombre, descripcion }: { 
      ejercicioID: string, 
      nombre: string, 
      descripcion: string 
    }) => editarEjercicio(nombre, descripcion, ejercicioID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      queryClient.invalidateQueries({ queryKey: ['ejercicio'] });
    }
  });

  const eliminarEjercicioMutation = useMutation({
    mutationFn: (ejercicioID: string) => eliminarEjercicio(ejercicioID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
    },
    onError: (error) => {
      console.error('Error al eliminar ejercicio:', error);
    }
  });

  return {
    // Queries
    ejerciciosQuery,
    useEjercicioPorIdQuery,
    
    // Mutations
    crearEjercicioMutation,
    editarEjercicioMutation,
    eliminarEjercicioMutation
  };
};