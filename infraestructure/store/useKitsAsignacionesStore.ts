// ✅ useKitsAsignaciones.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  asignarKit,
  obtenerKitsAsignados,
  obtenerKitAsignadoPorId,
  eliminarKitAsignado,
  obtenerKitsAsignadosAPacientesPorID,
  editarEstadoKitAsignado,
} from "../interface/kits-asignados-actions";

export const useKitsAsignacionesStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  // 🔹 Obtener todos los kits asignados (con filtros y paginación)
  const useKitsAsignadosQuery = (page: number, limit: number, estado: string) =>
    useQuery({
      queryKey: ["kits-asignados", { page, limit, estado }],
      queryFn: () => obtenerKitsAsignados(page, limit, estado),
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener kit asignado por ID
  const useKitAsignadoPorIdQuery = (id?: string) =>
    useQuery({
      queryKey: ["kits-asignados", id],
      queryFn: () => obtenerKitAsignadoPorId(id as string),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener kits asignados a un paciente
  const useKitsAsignadosAPacientesQuery = (paciente_id?: string, page?: number, limit?: number) =>
    useQuery({
      queryKey: ["kits-asignados", "paciente", paciente_id, { page, limit }],
      queryFn: () => obtenerKitsAsignadosAPacientesPorID(paciente_id as string, page, limit),
      enabled: !!paciente_id,
      staleTime: 1000 * 60 * 5,
    });

  // ----------------- MUTATIONS -----------------

  // 🔹 Asignar un kit a un paciente
  const asignarKitMutation = useMutation({
    mutationFn: ({ kit_id, paciente_id }: { kit_id: number; paciente_id: number }) =>
      asignarKit(kit_id, paciente_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits-asignados"] });
    },
  });

  // 🔹 Eliminar kit asignado
  const eliminarKitAsignadoMutation = useMutation({
    mutationFn: (kitAsignadoId: string) => eliminarKitAsignado(kitAsignadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits-asignados"] });
    },
  });

  // 🔹 Editar estado de un kit asignado
  const editarEstadoKitAsignadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      editarEstadoKitAsignado(id, estado),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kits-asignados"] });
      queryClient.invalidateQueries({ queryKey: ["kits-asignados", id] });
    },
  });

  return {
    // Queries
    useKitsAsignadosQuery,
    useKitAsignadoPorIdQuery,
    useKitsAsignadosAPacientesQuery,

    // Mutations
    asignarKitMutation,
    eliminarKitAsignadoMutation,
    editarEstadoKitAsignadoMutation,
  };
};
