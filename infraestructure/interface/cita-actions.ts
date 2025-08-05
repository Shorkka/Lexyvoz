import { productsApi } from "@/core/auth/api/productsApi";
import { CitaBody } from "@/core/auth/interface/citas";

export const crearCita = async (citaData: {
  doctor_id: number;
  paciente_id: number;
  fecha_cita: string;
}) : Promise<CitaBody> => {
  try {
    const body = {
      doctorId: citaData.doctor_id.toString(),
      pacienteId: citaData.paciente_id.toString(),
      fecha: citaData.fecha_cita,
    };

    const { data } = await productsApi.post('/citas/crear-cita', body);
    return data;
  } catch (error) {
    console.error('Error al crear cita:', error);
    return Promise.reject(error);
  }
};
