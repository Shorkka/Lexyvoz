// ✅ useDoctorPaciente.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  vincularDoctorConPaciente,
  vincularDoctorConUsuario,
  obtenerPacientesDeDoctor,
  obtenerDoctoresDePaciente,
  desvincularDoctorDePaciente,
  obtenerVinculaciones,
} from "../interface/doctor-paciente-actions";

export const useDoctorPacienteStore = () => {
  const queryClient = useQueryClient();

  // 🔹 Obtener pacientes de un doctor
  const usePacientesDeDoctorQuery = (doctor_id?: number) =>
    useQuery({
      queryKey: ["doctor", doctor_id, "pacientes"],
      queryFn: () => obtenerPacientesDeDoctor(doctor_id as number),
      enabled: !!doctor_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener doctores de un paciente
  const useDoctoresDePacienteQuery = (paciente_id?: number) =>
    useQuery({
      queryKey: ["paciente", paciente_id, "doctores"],
      queryFn: () => obtenerDoctoresDePaciente(paciente_id as number),
      enabled: !!paciente_id,
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Obtener todas las vinculaciones
  const vinculacionesQuery = useQuery({
    queryKey: ["vinculaciones"],
    queryFn: obtenerVinculaciones,
    staleTime: 1000 * 60 * 5,
  });

  // ----------------- MUTATIONS -----------------

  // 🔹 Vincular doctor con paciente
  const vincularDoctorConPacienteMutation = useMutation({
    mutationFn: ({ doctor_id, paciente_id }: { doctor_id: number; paciente_id: number }) =>
      vincularDoctorConPaciente(doctor_id, paciente_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinculaciones"] });
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
      queryClient.invalidateQueries({ queryKey: ["paciente"] });
    },
  });

  // 🔹 Vincular doctor con usuario
  const vincularDoctorConUsuarioMutation = useMutation({
    mutationFn: ({ doctor_id, usuario_id }: { doctor_id: number; usuario_id: number }) =>
      vincularDoctorConUsuario(doctor_id, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinculaciones"] });
    },
  });

  // 🔹 Desvincular doctor de paciente
  const desvincularDoctorDePacienteMutation = useMutation({
    mutationFn: ({ doctor_id, paciente_id }: { doctor_id: number; paciente_id: number }) =>
      desvincularDoctorDePaciente(doctor_id, paciente_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinculaciones"] });
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
      queryClient.invalidateQueries({ queryKey: ["paciente"] });
    },
  });

  return {
    // Queries
    usePacientesDeDoctorQuery,
    useDoctoresDePacienteQuery,
    vinculacionesQuery,

    // Mutations
    vincularDoctorConPacienteMutation,
    vincularDoctorConUsuarioMutation,
    desvincularDoctorDePacienteMutation,
  };
};
