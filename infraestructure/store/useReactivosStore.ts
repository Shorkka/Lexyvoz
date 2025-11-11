
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  crearReactivoKits,
  obtenerReactivoKits,
  obtenerSubtiposReactivosPorID,
  obtenerTiposReactivosPorID,
  obtenerCompatibilidadEjerciciosReactivos,
  obtenerReactivoKitsPorID,
  editarReactivo,
  eliminarReactivo,
  crearEjercicio,
  obtenerEjerciciosReactivos,
  editarEjerciciosReactivos,
  deleteEjercicioReactivo,
  CrearReactivo,
  CrearEjercicioReactivo,
  imagenCorrecta,
  imagenCorrectaResultados,
  imagenArchivada,
  obtenerReporteKitPaciente
} from "../interface/reactivos-actions";
import { ReporteKitPacienteResponse } from "@/core/auth/interface/reactivos";

export const useReactivosStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  const useReactivoKitsQuery = (
    page?: number,
    limit?: number,
    buscar?: string,
    activo?: boolean,
    sub_tipo_id?: number,
    tipo_id?: number
  ) =>
    useQuery({
      queryKey: ["reactivos", { page, limit, buscar, activo, sub_tipo_id, tipo_id }],
      queryFn: () => obtenerReactivoKits(page, limit, buscar, activo, sub_tipo_id, tipo_id),
      staleTime: 1000 * 60 * 5,
    });


  const useReactivoPorIdQuery = (reactivo_id?: number) =>
    useQuery({
      queryKey: ["reactivos", reactivo_id],
      queryFn: () => obtenerReactivoKitsPorID(reactivo_id as number),
      enabled: !!reactivo_id,
      staleTime: 1000 * 60 * 5,
    });

  const useSubtiposReactivosQuery = (sub_tipo_id?: number, page?: number, limit?: number, activo?: boolean) =>
    useQuery({
      queryKey: ["reactivos", "subtipos", sub_tipo_id, { page, limit, activo }],
      queryFn: () => obtenerSubtiposReactivosPorID(sub_tipo_id as number, page, limit, activo),
      enabled: !!sub_tipo_id,
      staleTime: 1000 * 60 * 5,
    });

  const useTiposReactivosQuery = (tipo_id?: number) =>
    useQuery({
      queryKey: ["reactivos", "tipos", tipo_id],
      queryFn: () => obtenerTiposReactivosPorID(tipo_id as number),
      enabled: !!tipo_id,
      staleTime: 1000 * 60 * 5,
    });


  const useCompatibilidadReactivosQuery = (ejercicio_id?: number, tipo_id?: number) =>
    useQuery({
      queryKey: ["reactivos", "compatibilidad", ejercicio_id, tipo_id],
      queryFn: () => obtenerCompatibilidadEjerciciosReactivos(ejercicio_id as number, tipo_id as number),
      enabled: !!ejercicio_id && !!tipo_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener ejercicios reactivos
  const useEjerciciosReactivosQuery = (ejercicio_id?: number) =>
    useQuery({
      queryKey: ["reactivos", "ejercicio", ejercicio_id],
      queryFn: () => obtenerEjerciciosReactivos(ejercicio_id as number),
      enabled: !!ejercicio_id,
      staleTime: 1000 * 60 * 5,
    });
        const useImagenCorrectaQuery = () =>
      useQuery({
        queryKey: ["reactivos", "imagen-correcta", "imagenes"],
        queryFn: () => imagenCorrecta(),
        staleTime: 1000 * 60 * 5,
      });


    const useImagenCorrectaResultadosQuery = () =>
      useQuery({
        queryKey: ["reactivos", "imagen-correcta", "resultados"],
        queryFn: () => imagenCorrectaResultados(),
        staleTime: 1000 * 60 * 5,
      });

  
    const useImagenArchivadaQuery = () =>
      useQuery({
        queryKey: ["reactivos", "imagen-correcta", "archivados"],
        queryFn: () => imagenArchivada(),
        staleTime: 1000 * 60 * 5,
      });
        
    const useReporteKitPacienteQuery = (kit_id?: number, paciente_id?: number) =>
    useQuery<ReporteKitPacienteResponse, Error>({
      queryKey: ["reportes", "kit-paciente", kit_id, paciente_id],
      queryFn: () => obtenerReporteKitPaciente(kit_id as number, paciente_id as number),
      enabled: !!kit_id && !!paciente_id,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });


  // ----------------- MUTATIONS -----------------

  // 🔹 Crear reactivo
  const crearReactivoMutation = useMutation({
    mutationFn: (reactivo: CrearReactivo) => crearReactivoKits(reactivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactivos"] });
    },
  });

  // 🔹 Editar reactivo
  const editarReactivoMutation = useMutation({
    mutationFn: ({ reactivo_id, data }: { reactivo_id: number; data: any }) =>
      editarReactivo(reactivo_id, data),
    onSuccess: (_, { reactivo_id }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos"] });
      queryClient.invalidateQueries({ queryKey: ["reactivos", reactivo_id] });
    },
  });

  // 🔹 Eliminar reactivo
  const eliminarReactivoMutation = useMutation({
    mutationFn: (reactivo_id: number) => eliminarReactivo(reactivo_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactivos"] });
    },
  });

  // 🔹 Crear ejercicio (vacío inicialmente, vinculado al id)
  const crearEjercicioMutation = useMutation({
    mutationFn: (ejercicio_id: number) => crearEjercicio(ejercicio_id),
    onSuccess: (_, ejercicio_id) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", "ejercicio", ejercicio_id] });
    },
  });

  // 🔹 Editar ejercicios reactivos (reordenar)
  const editarEjerciciosReactivosMutation = useMutation({
    mutationFn: ({ ejercicio_id, reactivos_orden }: { ejercicio_id: number; reactivos_orden: CrearEjercicioReactivo[] }) =>
      editarEjerciciosReactivos(ejercicio_id, reactivos_orden),
    onSuccess: (_, { ejercicio_id }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", "ejercicio", ejercicio_id] });
    },
  });

  // 🔹 Eliminar un reactivo de un ejercicio
  const eliminarEjercicioReactivoMutation = useMutation({
    mutationFn: ({ ejercicio_id, reactivo_id }: { ejercicio_id: number; reactivo_id: number }) =>
      deleteEjercicioReactivo(ejercicio_id, reactivo_id),
    onSuccess: (_, { ejercicio_id }) => {
      queryClient.invalidateQueries({ queryKey: ["reactivos", "ejercicio", ejercicio_id] });
    },
  });

  



  return {
    // Queries
    useReactivoKitsQuery,
    useReactivoPorIdQuery,
    useSubtiposReactivosQuery,
    useTiposReactivosQuery,
    useCompatibilidadReactivosQuery,
    useEjerciciosReactivosQuery,
    useImagenCorrectaQuery,
    useImagenCorrectaResultadosQuery,
    useImagenArchivadaQuery,

    useReporteKitPacienteQuery,
    // Mutations
    crearReactivoMutation,
    editarReactivoMutation,
    eliminarReactivoMutation,
    crearEjercicioMutation,
    editarEjerciciosReactivosMutation,
    eliminarEjercicioReactivoMutation,
  };
};
