import { 
  crearEscrituraImagenPalabra,
  obtenerEscrituraImagenPalabra,
  crearEscrituraReordenamiento,
  obtenerEscrituraReordenamiento
} from "@/infraestructure/interface/ejercicios-escrito-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useEscrituraStore = () => {
  const queryClient = useQueryClient();

  // Consultas para escritura imagen-palabra
  const escrituraImagenPalabraQuery = useQuery({
    queryKey: ['escritura-imagen-palabra'],
    queryFn: obtenerEscrituraImagenPalabra,
    staleTime: 1000 * 60 * 15 // 15 minutos de fresh data
  });

  // Mutaciones para escritura imagen-palabra
  const crearEscrituraImagenPalabraMutation = useMutation({
    mutationFn: ({ palabra, imagen }: { palabra: string, imagen: string }) => 
      crearEscrituraImagenPalabra(palabra, imagen),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escritura-imagen-palabra'] });
    },
    onError: (error) => {
      console.error('Error al crear ejercicio imagen-palabra:', error);
    }
  });

  // Consultas para escritura reordenamiento
  const escrituraReordenamientoQuery = useQuery({
    queryKey: ['escritura-reordenamiento'],
    queryFn: obtenerEscrituraReordenamiento,
    staleTime: 1000 * 60 * 15 // 15 minutos de fresh data
  });

  // Mutaciones para escritura reordenamiento
  const crearEscrituraReordenamientoMutation = useMutation({
    mutationFn: (oracion: string) => crearEscrituraReordenamiento(oracion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escritura-reordenamiento'] });
    },
    onError: (error) => {
      console.error('Error al crear ejercicio de reordenamiento:', error);
    }
  });

  return {
    // Queries
    escrituraImagenPalabraQuery,
    escrituraReordenamientoQuery,
    
    // Mutations
    crearEscrituraImagenPalabraMutation,
    crearEscrituraReordenamientoMutation
  };
};