import { productsApi } from "@/core/auth/api/productsApi";
import { EjercicioRequerimiento } from "@/core/auth/interface/ejercicios.kits.requerimientos";

export const crearEjercicio = async (nombre: string, descripcion: string): Promise<EjercicioRequerimiento> => {
    try{
        const {data} = await productsApi.post('/ejercicios', { nombre, descripcion });
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const obtenerEjercicios = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios');
        return data;
    } catch (error) {
        console.log('Error al obtener ejercicios:', error);
        return Promise.reject(error);
    }
}

export const obtenerEjercicioPorID = async (ejercicioID: string): Promise<void> => {
    try {
        const {data} = await productsApi.get(`/ejercicios/${ejercicioID}`);
        return data;
    } catch (error) {
        console.log('Error al obtener ejercicio por ID:', error);
        return Promise.reject(error);
    }
}

export const editarEjercicio = async (nombre: string, descripcion: string, ejercicioID: string): Promise<EjercicioRequerimiento> => {
    try {
        const {data} = await productsApi.put(`/ejercicios/${ejercicioID}`, { nombre, descripcion });
        return data;
    } catch (error) {
        console.log('Error al editar ejercicio:', error);
        return Promise.reject(error);
    }
}

export const eliminarEjercicio = async (ejercicioID: string): Promise<void> => {
    try {
        await productsApi.delete(`/ejercicios/${ejercicioID}`);
    } catch (error) {
        console.log('Error al eliminar ejercicio:', error);
        return Promise.reject(error);
    }
}
