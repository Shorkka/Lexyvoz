import { useState } from "react";

export interface Doctor {
  usuario_id: string;
  nombre: string;
  especialidad: string;
  correo: string;
  numero_telefono: string;
  [key: string]: any;
}

export const useDoctorModal = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const openDoctor = (doctor: Doctor) => setSelectedDoctor(doctor);
  const closeDoctor = () => setSelectedDoctor(null);

  const vincularPaciente = (doctorId: string) => {
    console.log("Vinculando paciente con doctor:", doctorId);
    // Aquí haces la petición al backend
    closeDoctor();
  };

  return {
    selectedDoctor,
    openDoctor,
    closeDoctor,
    vincularPaciente,
  };
};
