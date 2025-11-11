// infraestructure/store/useReactivosStore.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resultadoLecturaForm } from "@/infraestructure/interface/resultados-lectura-pseudopalabra-actions";
import type { ResultadoLecturaPayload, ResponseLectura } from "@/core/auth/interface/resultados";

export const useReactivosAudioStore = () => {
  const queryClient = useQueryClient();

  const enviarResultadoLecturaMutation = useMutation<
    ResponseLectura,
    Error,
    ResultadoLecturaPayload
  >({
    mutationKey: ["reactivos", "lectura", "enviar-resultado"],
    mutationFn: (payload) => resultadoLecturaForm(payload),
    onSuccess: (data, variables) => {
      // Invalida lo que necesites actualizar en UI
      queryClient.invalidateQueries({ queryKey: ["reactivos", "imagen-correcta", "resultados"] });
      queryClient.invalidateQueries({
        queryKey: ["reportes", "kit-paciente", variables.kit_id, variables.usuario_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactivos", "ejercicio", variables.ejercicio_id],
      });
    },
  });

  return { enviarResultadoLecturaMutation };
};
