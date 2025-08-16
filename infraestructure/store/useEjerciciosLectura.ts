
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Escrito } from "@/core/auth/interface/ejercicios.kits.requerimientos";
import { crearEscrito, obtenerEscritos } from "../interface/ejercicios-lectura-acitons";

export const useEscritosStore = () => {
  const queryClient = useQueryClient();

  // Consulta para obtener todos los escritos
  const escritosQuery = useQuery({
    queryKey: ['escritos'],
    queryFn: obtenerEscritos,
    staleTime: 1000 * 60 * 10, // 10 minutos de fresh data
  });

  // Mutación para crear nuevo escrito
  const crearEscritoMutation = useMutation<Escrito, Error, { texto: string }>({
    mutationFn: ({ texto }) => crearEscrito(texto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escritos'] });
    },
    onError: (error) => {
      console.error('Error al crear escrito:', error);
    }
  });

  return {
    // Queries
    escritosQuery,
    
    // Mutations
    crearEscritoMutation
  };
};