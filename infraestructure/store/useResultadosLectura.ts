// infraestructure/store/useReactivosStore.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resultadoLecturaForm, respuestaResultadosBackend } from "@/infraestructure/interface/resultados-lectura-pseudopalabra-actions";
import type { ResultadoLecturaPayload, ResponseLectura } from "@/core/auth/interface/resultados";

type CompletarResp = { message: string };

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

  const completarKitMutation = useMutation<
    CompletarResp,
    Error,
    { kitId: number; pacienteId: number }
  >({
    mutationKey: ["kits", "completar"],
    mutationFn: async ({ kitId, pacienteId }) => {
      const resp = await respuestaResultadosBackend(kitId, pacienteId);
      if (!resp) throw new Error("No se pudo completar el kit (sin respuesta).");
      // Si tu acción ya regresa el .data desenvuelto, esto puede ser: `return resp as CompletarResp;`
      return (resp as any).data as CompletarResp;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["kits", "asignados"] });
      queryClient.invalidateQueries({ queryKey: ["reactivos", "progreso", vars.kitId] });
      queryClient.invalidateQueries({
        queryKey: ["reportes", "kit-paciente", vars.kitId, vars.pacienteId],
      });
    },
  });

  return {
    enviarResultadoLecturaMutation,
    completarKitMutation,
  };
};
