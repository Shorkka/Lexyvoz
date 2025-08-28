
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  crearKitBasico,
  obtenerKits,
  crearKitConEjercicios,
  obtenerKitPorId,
  actualizarKit,
  eliminarKit,
  obtenerEjerciciosDeUnKit,
  agregarEjerciciosAKit,
  removerEjerciciosDeKit,
  CrearKits,
  CrearKitsConEjercicioResponse,
  Ejercicio
} from "../interface/kits-actions";

export const useKitsStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  // 🔹 Obtener todos los kits (con paginación opcional)
  const useKitsQuery = (page?: number, limit?: number) =>
    useQuery({
      queryKey: ["kits", page, limit],
      queryFn: () => obtenerKits(page, limit),
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener kit por ID
  const useKitPorIdQuery = (id?: number) =>
    useQuery({
      queryKey: ["kits", id],
      queryFn: () => obtenerKitPorId(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener ejercicios de un kit
  const useEjerciciosDeUnKitQuery = (id?: number) =>
    useQuery({
      queryKey: ["kits", id, "ejercicios"],
      queryFn: () => obtenerEjerciciosDeUnKit(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // ----------------- MUTATIONS -----------------

  // 🔹 Crear kit básico
  const crearKitBasicoMutation = useMutation({
    mutationFn: (kitData: CrearKits) => crearKitBasico(kitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });

  // 🔹 Crear kit con ejercicios
  const crearKitConEjerciciosMutation = useMutation({
    mutationFn: (kitData: CrearKitsConEjercicioResponse) => crearKitConEjercicios(kitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });

  // 🔹 Actualizar kit
  const actualizarKitMutation = useMutation({
    mutationFn: ({ id, kitData }: { id: number; kitData: CrearKits }) =>
      actualizarKit(id, kitData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
      queryClient.invalidateQueries({ queryKey: ["kits", id] });
    },
  });

  // 🔹 Eliminar kit
  const eliminarKitMutation = useMutation({
    mutationFn: (id: number) => eliminarKit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });

  // 🔹 Agregar ejercicios a un kit
  const agregarEjerciciosMutation = useMutation({
    mutationFn: ({ id, ejercicios }: { id: number; ejercicios: Ejercicio[] }) =>
      agregarEjerciciosAKit(id, ejercicios),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kits", id, "ejercicios"] });
    },
  });

  // 🔹 Remover ejercicios de un kit
  const removerEjerciciosMutation = useMutation({
    mutationFn: ({ id, ejercicioIds }: { id: number; ejercicioIds: number[] }) =>
      removerEjerciciosDeKit(id, ejercicioIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kits", id, "ejercicios"] });
    },
  });

  return {
    // Queries
    useKitsQuery,
    useKitPorIdQuery,
    useEjerciciosDeUnKitQuery,

    // Mutations
    crearKitBasicoMutation,
    crearKitConEjerciciosMutation,
    actualizarKitMutation,
    eliminarKitMutation,
    agregarEjerciciosMutation,
    removerEjerciciosMutation,
  };
};
