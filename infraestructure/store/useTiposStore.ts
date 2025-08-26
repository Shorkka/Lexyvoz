// ✅ useTiposStore.ts
import { useQuery } from "@tanstack/react-query";
import { ObtenerTiposKitResponse, TiposKitsResponse } from "@/core/auth/interface/tipos";
import { listarTiposKits, obtenerTiposPorID } from "../interface/tipos-actions";


export const useTiposStore = () => {
  // ----------------- QUERIES -----------------

  // 🔹 Listar todos los tipos de kits
  const useListarTiposKitsQuery = () =>
    useQuery<TiposKitsResponse, Error>({
      queryKey: ["tiposKits"],
      queryFn: listarTiposKits,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  // 🔹 Obtener tipos de kit por ID
  const useObtenerTiposPorIDQuery = (id?: number) =>
    useQuery<ObtenerTiposKitResponse, Error>({
      queryKey: ["tiposKit", id],
      queryFn: () => obtenerTiposPorID(id as number),
      enabled: !!id, // Solo se ejecuta si hay un ID
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  // ----------------- MUTATIONS -----------------
  // (Si necesitas mutaciones en el futuro, puedes agregarlas aquí)

  return {
    // Queries
    useListarTiposKitsQuery,
    useObtenerTiposPorIDQuery,

    // Mutations (puedes agregarlas luego si es necesario)
  };
};