import { productsApi } from "@/core/auth/api/productsApi";
import { CitaBody } from "@/core/auth/interface/citas";

// Crea una nueva cita
export const crearCita = async (citaData: CitaBody) => {
  try {
    const { data } = await productsApi.post('/citas/crear-cita', citaData);
    return data;
  } catch (error) {
    console.error('Error al crear cita:', error);
    return Promise.reject(error);
  }
};

// Obtiene todas las citas
export const obtenerTodasCitas = async () =>{
  try {
    const {data} = await productsApi.get('/citas/obtener-citas');
    return data;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return Promise.reject(error);
  }
};

// Obtiene una cita por su ID
export const obtenerCitasPorID = async (id: number) => {
  try {
    const {data} = await productsApi.get(`/citas/obtener-cita/${id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener cita por ID:', error);
    return Promise.reject(error);
  }
};

// Edita una cita existente
export const editarCita = async (id: number, citaData: CitaBody): Promise<CitaBody> => {
  try {
    const { data } = await productsApi.put(`/citas/editar-cita/${id}`, citaData);
    return data;
  } catch (error) {
    console.error('Error al editar cita:', error);
    return Promise.reject(error);
  }
};

// Elimina una cita por su ID
export const eliminarCita = async (id: number): Promise<void> => {
  try {
    await productsApi.delete(`/citas/eliminar-cita/${id}`);
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    return Promise.reject(error);
  }
};

