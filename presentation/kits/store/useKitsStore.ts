import { obtenerKits, crearKit } from "@/infraestructure/interface/kits-actions";
import { useMutation, useQuery } from "@tanstack/react-query"


export const useKitsStore = () => {

  const kitsQuery = useQuery({
    queryKey: ['kits'],
    queryFn: obtenerKits
  });
  const createQueryKit = useMutation ({
    mutationFn: crearKit
  });

  return {
    kitsQuery,
    createQueryKit
  };
};
