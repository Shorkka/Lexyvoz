import { 
  obtenerKits, 
  crearKit, 
  obtenerKitPorId, 
  editarKit, 
  eliminarKit,
  asignarKit,
  obtenerKitsAsignados,
  editarKitAsignado,
  eliminarKitAsignado,
  agregarEjercicioAKit,
  obtenerEjerciciosDeKit,
  eliminarEjercicioDeKit
} from "@/infraestructure/interface/kits-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useKitsStore = () => {
  const queryClient = useQueryClient();

  // Consultas para kits
  const kitsQuery = useQuery({
    queryKey: ['kits'],
    queryFn: obtenerKits
  });

  const useKitByIdQuery = (kit_id: number) => useQuery({
    queryKey: ['kit', kit_id],
    queryFn: () => obtenerKitPorId(kit_id)
  });

  // Mutaciones para kits
  const createKitMutation = useMutation({
    mutationFn: crearKit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kits'] });
    }
  });

  const editKitMutation = useMutation({
    mutationFn: ({ kit_id, kitData }: { kit_id: number, kitData: { nombre?: string; descripcion?: string } }) => 
      editarKit(kit_id, kitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kits'] });
    }
  });

  const deleteKitMutation = useMutation({
    mutationFn: (kit_id: number) => eliminarKit(kit_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kits'] });
    }
  });

  // Consultas para kits asignados
  const useAssignedKitsQuery = (usuario_id: number) => useQuery({
    queryKey: ['assigned-kits', usuario_id],
    queryFn: () => obtenerKitsAsignados(usuario_id)
  });

  // Mutaciones para kits asignados
  const assignKitMutation = useMutation({
    mutationFn: ({ kit_id, usuario_id }: { kit_id: number, usuario_id: number }) => 
      asignarKit(kit_id, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-kits'] });
    }
  });

  const editAssignedKitMutation = useMutation({
    mutationFn: ({ kitAsignadoId, kitData }: { kitAsignadoId: string, kitData: any }) => 
      editarKitAsignado(kitAsignadoId, kitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-kits'] });
    }
  });

  const deleteAssignedKitMutation = useMutation({
    mutationFn: (kitAsignadoId: string) => eliminarKitAsignado(kitAsignadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-kits'] });
    }
  });

  // Consultas para ejercicios en kits
  const useKitExercisesQuery = (kitId: string) => useQuery({
    queryKey: ['kit-exercises', kitId],
    queryFn: () => obtenerEjerciciosDeKit(kitId)
  });

  // Mutaciones para ejercicios en kits
  const addExerciseToKitMutation = useMutation({
    mutationFn: ({ kitId, ejercicioId }: { kitId: string, ejercicioId: string }) => 
      agregarEjercicioAKit(kitId, ejercicioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kit-exercises'] });
    }
  });

  const removeExerciseFromKitMutation = useMutation({
    mutationFn: ({ kitId, ejercicioId }: { kitId: string, ejercicioId: string }) => 
      eliminarEjercicioDeKit(kitId, ejercicioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kit-exercises'] });
    }
  });

  return {
    // Queries
    kitsQuery,
    useKitByIdQuery,
    useAssignedKitsQuery,
    useKitExercisesQuery,
    
    // Mutations
    createKitMutation,
    editKitMutation,
    deleteKitMutation,
    assignKitMutation,
    editAssignedKitMutation,
    deleteAssignedKitMutation,
    addExerciseToKitMutation,
    removeExerciseFromKitMutation
  };
};