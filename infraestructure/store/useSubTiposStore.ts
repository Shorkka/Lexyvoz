// ✅ useSubTiposStore.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  obtenerSubTiposListados,
  obtenerSubTipoPorID,
  obtenerSubTipoPorTipoID,
  crearSubTipo,
  editarSubtipos,
  eliminarSubTipo,
  buscarSubtipos,
  subtiposConteoPorTipo,
  verificarExistenciaSubTipo,
  estadisticasSubtipo,
  obtenerSubtipos,
  obtenerSubtipoPorTipo
} from "../interface/subtipos-actions";
import {
  EstadisticasSubTiposResponse,
  SubTipoConteoPorTipo,
  SubTipoIDResponse,
  SubTiposResponse
} from "@/core/auth/interface/subtipos";

export const useSubTiposStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  // 🔹 Obtener todos los subtipos listados
  const useSubTiposListadosQuery = () =>
    useQuery<SubTiposResponse, Error>({
      queryKey: ["subtiposListados"],
      queryFn: obtenerSubTiposListados,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener subtipo por ID
  const useSubTipoPorIDQuery = (id?: number) =>
    useQuery<SubTipoIDResponse, Error>({
      queryKey: ["subTipo", id],
      queryFn: () => obtenerSubTipoPorID(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener subtipos por Tipo ID
  const useSubTipoPorTipoIDQuery = (tipo_id?: number) =>
    useQuery<SubTipoIDResponse, Error>({
      queryKey: ["subTiposPorTipo", tipo_id],
      queryFn: () => obtenerSubTipoPorTipoID(tipo_id as number),
      enabled: !!tipo_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Buscar subtipos
  const useBuscarSubtiposQuery = (q?: string) =>
    useQuery<SubTiposResponse, Error>({
      queryKey: ["subtiposBuscar", q],
      queryFn: () => buscarSubtipos(q as string),
      enabled: !!q && q.length > 0,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Conteo de subtipos por tipo
  const useSubtiposConteoPorTipoQuery = (tipo_id?: number) =>
    useQuery<SubTipoConteoPorTipo, Error>({
      queryKey: ["subtiposConteo", tipo_id],
      queryFn: () => subtiposConteoPorTipo(tipo_id as number),
      enabled: !!tipo_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Verificar existencia de subtipo
  const useVerificarExistenciaSubTipoQuery = (id?: number) =>
    useQuery<boolean, Error>({
      queryKey: ["subTipoExistencia", id],
      queryFn: () => verificarExistenciaSubTipo(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Estadísticas de subtipos
  const useEstadisticasSubtipoQuery = () =>
    useQuery<EstadisticasSubTiposResponse, Error>({
      queryKey: ["subtiposEstadisticas"],
      queryFn: estadisticasSubtipo,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener subtipos por tipo (alternativa)
  const useObtenerSubtiposQuery = (id?: number) =>
    useQuery<SubTipoIDResponse, Error>({
      queryKey: ["subtiposPorTipo", id],
      queryFn: () => obtenerSubtipos(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener subtipo por tipo (alternativa 2)
  const useObtenerSubtipoPorTipoQuery = (id?: number) =>
    useQuery<SubTiposResponse, Error>({
      queryKey: ["subtipoPorTipo", id],
      queryFn: () => obtenerSubtipoPorTipo(id as number),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  // ----------------- MUTATIONS -----------------

  // 🔹 Crear subtipo
  const crearSubTipoMutation = useMutation({
    mutationFn: (subTipo: SubTipoIDResponse) => crearSubTipo(subTipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtiposListados"] });
      queryClient.invalidateQueries({ queryKey: ["subtiposEstadisticas"] });
    },
  });

  // 🔹 Editar subtipo
  const editarSubtiposMutation = useMutation({
    mutationFn: ({ id, subTipo }: { id: number; subTipo: SubTiposResponse }) =>
      editarSubtipos(id, subTipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtiposListados"] });
      queryClient.invalidateQueries({ queryKey: ["subTipos"] });
      queryClient.invalidateQueries({ queryKey: ["subtiposEstadisticas"] });
    },
  });

  // 🔹 Eliminar subtipo
  const eliminarSubTipoMutation = useMutation({
    mutationFn: (id: number) => eliminarSubTipo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtiposListados"] });
      queryClient.invalidateQueries({ queryKey: ["subtiposEstadisticas"] });
    },
  });

  return {
    // Queries
    useSubTiposListadosQuery,
    useSubTipoPorIDQuery,
    useSubTipoPorTipoIDQuery,
    useBuscarSubtiposQuery,
    useSubtiposConteoPorTipoQuery,
    useVerificarExistenciaSubTipoQuery,
    useEstadisticasSubtipoQuery,
    useObtenerSubtiposQuery,
    useObtenerSubtipoPorTipoQuery,

    // Mutations
    crearSubTipoMutation,
    editarSubtiposMutation,
    eliminarSubTipoMutation,
  };
};