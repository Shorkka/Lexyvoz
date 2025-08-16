import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  igualDiferente,
  imagenCorrecto,
  imagenes,
  palabraMalEscrito,
  pares,
  visual,
} from "@/core/auth/interface/ejercicios.kits.requerimientos";

import {
  crearIgualDiferente,
  obtenerIgualDiferente,
  crearImagenCorrecto,
  obtenerImagenCorrecto,
  crearImagens,
  obtenerImagenes,
  crearPalabraMalEescrita,
  obtenerPalabraMalEscrita,
  crearPares,
  obtenerPares,
  crearVisuales,
  obtenerVisuales,
} from "../interface/ejercicios-visual-actions";

export const useVisualesStore = () => {
  const queryClient = useQueryClient();

  // Queries
  const igualDiferenteQuery = useQuery({
    queryKey: ['igual-diferente'],
    queryFn: obtenerIgualDiferente,
    staleTime: 1000 * 60 * 10,
  });

  const imagenCorrectoQuery = useQuery({
    queryKey: ['imagen-correcto'],
    queryFn: obtenerImagenCorrecto,
    staleTime: 1000 * 60 * 10,
  });

  const imagenesQuery = useQuery({
    queryKey: ['imagenes'],
    queryFn: obtenerImagenes,
    staleTime: 1000 * 60 * 10,
  });

  const palabraMalEscritaQuery = useQuery({
    queryKey: ['palabra-mal-escrita'],
    queryFn: obtenerPalabraMalEscrita,
    staleTime: 1000 * 60 * 10,
  });

  const paresQuery = useQuery({
    queryKey: ['pares'],
    queryFn: obtenerPares,
    staleTime: 1000 * 60 * 10,
  });

  const visualesQuery = useQuery({
    queryKey: ['visuales'],
    queryFn: obtenerVisuales,
    staleTime: 1000 * 60 * 10,
  });

  // Mutations
  const crearIgualDiferenteMutation = useMutation<igualDiferente, Error, { pregunta: string; opciones: string[] }>({
    mutationFn: ({ pregunta, opciones }) => crearIgualDiferente(pregunta, opciones),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['igual-diferente'] }),
  });

  const crearImagenCorrectoMutation = useMutation<imagenCorrecto, Error, { imagen: string; respuesta: string }>({
    mutationFn: ({ imagen, respuesta }) => crearImagenCorrecto(imagen, respuesta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['imagen-correcto'] }),
  });

  const crearImagenesMutation = useMutation<imagenes, Error, { reactivoId: string; url: string }>({
    mutationFn: ({ reactivoId, url }) => crearImagens(reactivoId, url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['imagenes'] }),
  });

  const crearPalabraMalEscritaMutation = useMutation<palabraMalEscrito, Error, { palabra: string; correcta: string }>({
    mutationFn: ({ palabra, correcta }) => crearPalabraMalEescrita(palabra, correcta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['palabra-mal-escrita'] }),
  });

  const crearParesMutation = useMutation<pares, Error>({
    mutationFn: () => crearPares(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pares'] }),
  });

  const crearVisualesMutation = useMutation<visual, Error>({
    mutationFn: () => crearVisuales(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visuales'] }),
  });

  return {
    // Queries
    igualDiferenteQuery,
    imagenCorrectoQuery,
    imagenesQuery,
    palabraMalEscritaQuery,
    paresQuery,
    visualesQuery,

    // Mutations
    crearIgualDiferenteMutation,
    crearImagenCorrectoMutation,
    crearImagenesMutation,
    crearPalabraMalEscritaMutation,
    crearParesMutation,
    crearVisualesMutation,
  };
};
