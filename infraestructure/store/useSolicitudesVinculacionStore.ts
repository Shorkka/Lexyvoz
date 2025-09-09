import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  enviarSolicitudAlDoctor,
  obtenerSolicitudesDoctorPaciente,
  obtenerSolicitudesEnviadasPorUsuario,
  responderSolicitudVinculacion,
  obtenerEstadisticasSolicitudesDoctor,
} from "../interface/solicitudes-actions";

export const useSolicitudesVinculacionStore = () => {
  const queryClient = useQueryClient();

  // ----------------- QUERIES -----------------

  //  Solicitudes pendientes de un doctor
  const useSolicitudesDoctorQuery = (doctor_id: number) =>
    useQuery({
      queryKey: ["doctor", doctor_id, "solicitudesPendientes"],
      queryFn: () => obtenerSolicitudesDoctorPaciente(doctor_id),
      enabled: !!doctor_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Solicitudes enviadas por el usuario
  const solicitudesEnviadasQuery = useQuery({
    queryKey: ["solicitudesEnviadasUsuario"],
    queryFn: obtenerSolicitudesEnviadasPorUsuario,
    staleTime: 1000 * 60 * 5,
  });

  // 🔹 Estadísticas de solicitudes de un doctor
  const useEstadisticasSolicitudesDoctorQuery = (doctor_id?: number) =>
    useQuery({
      queryKey: ["doctor", doctor_id, "solicitudesEstadisticas"],
      queryFn: () => obtenerEstadisticasSolicitudesDoctor(doctor_id as number),
      enabled: !!doctor_id,
      staleTime: 1000 * 60 * 5,
    });

  // ----------------- MUTATIONS -----------------

  // 🔹 Enviar solicitud a un doctor
  const enviarSolicitudMutation = useMutation({
      mutationFn: ({
      doctor_id,
      mensaje
    }: {
      doctor_id: number;
      mensaje?: string;
    })=> enviarSolicitudAlDoctor(doctor_id, mensaje),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitudesEnviadasUsuario"] });
    },
  });

  // 🔹 Responder a una solicitud (aceptar/rechazar)
  const responderSolicitudMutation = useMutation({
    mutationFn: ({
      solicitud_id,
      respuesta,
    }: {
      solicitud_id: number;
      respuesta: string;
    }) => responderSolicitudVinculacion(solicitud_id, respuesta),
    onSuccess: (_data, { solicitud_id }) => {
      queryClient.invalidateQueries({ queryKey: ["solicitudesEnviadasUsuario"] });
      queryClient.invalidateQueries({ queryKey: ["solicitudesPendientes"] });
      queryClient.invalidateQueries({ queryKey: ["solicitud", solicitud_id] });
    },
  });

  return {
    // Queries
    useSolicitudesDoctorQuery,
    solicitudesEnviadasQuery,
    useEstadisticasSolicitudesDoctorQuery,

    // Mutations
    enviarSolicitudMutation,
    responderSolicitudMutation,
  };
};
