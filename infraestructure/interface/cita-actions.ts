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

export const obtenerTodasCitas = async () =>{
  try {
    const {data} = await productsApi.get('/citas/obtener-citas');
    return data;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return Promise.reject(error);
  }
};

export const obtenerCitasPorID = async (citaID: string) => {
  try {
    const {data} = await productsApi.get(`/citas/obtener-cita/${citaID}`);
    return data;
  } catch (error) {
    console.error('Error al obtener cita por ID:', error);
    return Promise.reject(error);
  }
};

export const editarCita = async (citaID: string, citaData: CitaBody): Promise<CitaBody> => {
  try {
    const { data } = await productsApi.put(`/citas/editar-cita/${citaID}`, citaData);
    return data;
  } catch (error) {
    console.error('Error al editar cita:', error);
    return Promise.reject(error);
  }
}

export const eliminarCita = async (citaID: string): Promise<void> => {
  try {
    await productsApi.delete(`/citas/eliminar-cita/${citaID}`);
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    return Promise.reject(error);
  }
}

export const vincularCita = async (doctor_id: string, pacienteID: string): Promise<void> => {
  try {
    const {data} = await productsApi.post('/citas/vincular', {doctor_id, pacienteID});
    return data;
  } catch (error) {
    console.error('Error al vincular cita:', error);
    return Promise.reject(error);
  }
}

