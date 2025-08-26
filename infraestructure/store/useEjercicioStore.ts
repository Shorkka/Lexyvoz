// ✅ useEjerciciosStore.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  crearEjercicioBasico,
  obtenerEjercicio,
  obtenerEjerciciosCreadosPorUsuario,
  obtenerEstadisticasGeneralesEjercicios,
  obtenerEjerciciosPorTipo,
  obtenerEjerciciosDisponiblesParaKit,
  obtenerEjercicioPorID,
  editarEjercicio,
  eliminarEjercicio,
  duplicarEjercicio,
  crearEjercicioConReactivos,
  agregarReactivosAEjercicio,
  obtenerReactivosDeEjercicio,
  removerReactivosDeEjercicio,
  reordenarReactivosEnEjercicio,
  verificarCompatibilidadReactivos,
  obtenerEjerciciosDeKitPorID,
  EjercicioData,
  EjercicioConReactivoResponse,
  Reactivo,
  NuevosOrdene,
} from "../interface/ejercicios-actions";

export const useEjerciciosStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  const useEjerciciosQuery = (page?: number, limit?: number, buscar?: string) =>
    useQuery({
      queryKey: ["ejercicios", page, limit, buscar],
      queryFn: () => obtenerEjercicio(page, limit, buscar),
      staleTime: 1000 * 60 * 5,
    });

  const useEjerciciosUsuarioQuery = (
    page?: string,
    limit?: string,
    activo?: boolean,
    buscar?: string
  ) =>
    useQuery({
      queryKey: ["ejerciciosUsuario", page, limit, activo, buscar],
      queryFn: () =>
        obtenerEjerciciosCreadosPorUsuario(page, limit, activo, buscar),
      staleTime: 1000 * 60 * 5,
    });

  const estadisticasEjerciciosQuery = useQuery({
    queryKey: ["ejerciciosEstadisticas"],
    queryFn: obtenerEstadisticasGeneralesEjercicios,
    staleTime: 1000 * 60 * 10,
  });

  const useEjerciciosPorTipoQuery = (
    tipo_id: number,
    page?: number,
    limit?: number,
    activo?: boolean
  ) =>
    useQuery({
      queryKey: ["ejerciciosTipo", tipo_id, page, limit, activo],
      queryFn: () => obtenerEjerciciosPorTipo(tipo_id, page, limit, activo),
      enabled: !!tipo_id,
    });

  const useEjerciciosDisponiblesParaKitQuery = (
    kit_id: number,
    page?: number,
    limit?: number,
    activo?: boolean
  ) =>
    useQuery({
      queryKey: ["ejerciciosDisponiblesKit", kit_id, page, limit, activo],
      queryFn: () =>
        obtenerEjerciciosDisponiblesParaKit(kit_id, page, limit, activo),
      enabled: !!kit_id,
    });

  const useEjercicioPorIdQuery = (id?: number) =>
    useQuery({
      queryKey: ["ejercicio", id],
      queryFn: () => obtenerEjercicioPorID(id as number),
      enabled: !!id,
    });

  const useReactivosDeEjercicioQuery = (ejercicioId?: number) =>
    useQuery({
      queryKey: ["reactivos", ejercicioId],
      queryFn: () => obtenerReactivosDeEjercicio(ejercicioId as number),
      enabled: !!ejercicioId,
    });

  const useEjerciciosDeKitQuery = (id?: number, page?: number, limit?: number) =>
    useQuery({
      queryKey: ["ejerciciosDeKit", id, page, limit],
      queryFn: () => obtenerEjerciciosDeKitPorID(id as number, page, limit),
      enabled: !!id,
    });

  // ----------------- MUTATIONS -----------------

  const crearEjercicioMutation = useMutation({
    mutationFn: (ejercicio: EjercicioData) => crearEjercicioBasico(ejercicio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
      queryClient.invalidateQueries({ queryKey: ["ejerciciosUsuario"] });
    },
  });

  const editarEjercicioMutation = useMutation({
    mutationFn: ({ id, ejercicio }: { id: number; ejercicio: EjercicioData }) =>
      editarEjercicio(id, ejercicio),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ejercicio", id] });
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
    },
  });

  const eliminarEjercicioMutation = useMutation({
    mutationFn: (id: number) => eliminarEjercicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
      queryClient.invalidateQueries({ queryKey: ["ejerciciosUsuario"] });
    },
  });

  const duplicarEjercicioMutation = useMutation({
    mutationFn: (id: number) => duplicarEjercicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
      queryClient.invalidateQueries({ queryKey: ["ejerciciosUsuario"] });
    },
  });

  const crearEjercicioConReactivosMutation = useMutation({
    mutationFn: (ejercicio: EjercicioConReactivoResponse) =>
      crearEjercicioConReactivos(ejercicio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
    },
  });

  const agregarReactivosMutation = useMutation({
    mutationFn: ({
      ejercicioId,
      reactivos,
    }: {
      ejercicioId: number;
      reactivos: Reactivo[];
    }) => agregarReactivosAEjercicio(ejercicioId, reactivos),
    onSuccess: (_, { ejercicioId }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", ejercicioId] });
    },
  });

  const removerReactivosMutation = useMutation({
    mutationFn: ({
      ejercicioId,
      reactivoIds,
    }: {
      ejercicioId: number;
      reactivoIds: number[];
    }) => removerReactivosDeEjercicio(ejercicioId, reactivoIds),
    onSuccess: (_, { ejercicioId }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", ejercicioId] });
    },
  });

  const reordenarReactivosMutation = useMutation({
    mutationFn: ({
      ejercicioId,
      nuevosOrdenes,
    }: {
      ejercicioId: number;
      nuevosOrdenes: NuevosOrdene[];
    }) => reordenarReactivosEnEjercicio(ejercicioId, nuevosOrdenes),
    onSuccess: (_, { ejercicioId }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", ejercicioId] });
    },
  });

  const verificarCompatibilidadMutation = useMutation({
    mutationFn: ({
      ejercicioId,
      tipoId,
    }: {
      ejercicioId: number;
      tipoId: number;
    }) => verificarCompatibilidadReactivos(ejercicioId, tipoId),
  });

  return {
    // 🔹 Queries
    useEjerciciosQuery,
    useEjerciciosUsuarioQuery,
    estadisticasEjerciciosQuery,
    useEjerciciosPorTipoQuery,
    useEjerciciosDisponiblesParaKitQuery,
    useEjercicioPorIdQuery,
    useReactivosDeEjercicioQuery,
    useEjerciciosDeKitQuery,

    // 🔹 Mutations
    crearEjercicioMutation,
    editarEjercicioMutation,
    eliminarEjercicioMutation,
    duplicarEjercicioMutation,
    crearEjercicioConReactivosMutation,
    agregarReactivosMutation,
    removerReactivosMutation,
    reordenarReactivosMutation,
    verificarCompatibilidadMutation,
  };
};
