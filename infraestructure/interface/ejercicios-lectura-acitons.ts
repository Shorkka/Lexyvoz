import { productsApi } from "@/core/auth/api/productsApi";
import { Escrito } from "@/core/auth/interface/ejercicios.kits.requerimientos";

export const crearEscrito = async (texto: string): Promise<Escrito> => {
    try {
        const {data} = await productsApi.post('/ejercicios/escritos', { texto });
        return data;
    } catch (error) {
        console.log('Error al crear escrito:', error);
        return Promise.reject(error);
    }
}

export const obtenerEscritos = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/escritos');
        return data;
    } catch (error) {
        console.log('Error al obtener escritos:', error);
        return Promise.reject(error);
    }
}
