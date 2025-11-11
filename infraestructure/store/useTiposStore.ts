import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ObtenerTiposKitResponse, TiposKitsResponse } from "@/core/auth/interface/tipos";
import { actualizarTipo, crearTipo, eliminarTipo, listarTiposKits, obtenerTiposPorID } from "../interface/tipos-actions";
interface Tipo{
  tipo_nombre: string;
}


export const useTiposStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  // Listar todos los tipos de kits
  const useListarTiposKitsQuery = () =>
    useQuery<TiposKitsResponse, Error>({
      queryKey: ["tiposKits"],
      queryFn: listarTiposKits,
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });

  // Obtener tipos de kit por ID
  const useObtenerTiposPorIDQuery = (id?: number) =>
    useQuery<ObtenerTiposKitResponse, Error>({
      queryKey: ["tiposKit", id],
      queryFn: () => obtenerTiposPorID(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });

  // ----------------- MUTATIONS -----------------

  // Crear tipo
  const useCrearTipoMutation = () =>
    useMutation<Tipo, Error, number>({
      mutationFn: (id: number) => crearTipo(id),
      onSuccess: () => {
        // refresca el listado
        queryClient.invalidateQueries({ queryKey: ["tiposKits"] });
      },
    });

  // Actualizar tipo
  const useActualizarTipoMutation = () =>
    useMutation<Tipo, Error, number>({
      mutationFn: (id: number) => actualizarTipo(id),
      onSuccess: (_data, id) => {
        // refresca el listado y el detalle del tipo actualizado
        queryClient.invalidateQueries({ queryKey: ["tiposKits"] });
        queryClient.invalidateQueries({ queryKey: ["tiposKit", id] });
      },
    });

  // Eliminar tipo
  const useEliminarTipoMutation = () =>
    useMutation<unknown, Error, number>({
      mutationFn: (id: number) => eliminarTipo(id),
      onSuccess: () => {
        // refresca el listado (el detalle ya no aplica porque se borró)
        queryClient.invalidateQueries({ queryKey: ["tiposKits"] });
      },
    });

  return {
    // Queries
    useListarTiposKitsQuery,
    useObtenerTiposPorIDQuery,

    // Mutations
    useCrearTipoMutation,
    useActualizarTipoMutation,
    useEliminarTipoMutation,
  };
};