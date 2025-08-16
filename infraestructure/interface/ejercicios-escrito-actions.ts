import { productsApi } from "@/core/auth/api/productsApi";
import { EscrituraImagenPalabra, EscrituraReordenamiento } from "@/core/auth/interface/ejercicios.kits.requerimientos";

export const crearEscrituraImagenPalabra = async (palabra: string, imagen: string): Promise<EscrituraImagenPalabra> => {
    try {
        const {data} = await productsApi.post('/ejercicios/escritura-imagen-palabra', { palabra, imagen });
        return data;
    } catch (error) {
        console.log('Error al crear escritura imagen palabra:', error);
        return Promise.reject(error);
    }
}
export const obtenerEscrituraImagenPalabra = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/escritura-imagen-palabra');
        return data;
    } catch (error) {
        console.log('Error al obtener escritos imagen palabra:', error);
        return Promise.reject(error);
    }
}
export const crearEscrituraReordenamiento = async (oracion: string): Promise<EscrituraReordenamiento> => {
    try {
        const {data} = await productsApi.post('/ejercicios/escritura-reordenamiento', { oracion });
        return data;
    } catch (error) {
        console.log('Error al crear escritura reordenamiento:', error);
        return Promise.reject(error);
    }
}

export const obtenerEscrituraReordenamiento = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/escritura-reordenamiento');
        return data;
    } catch (error) {
        console.log('Error al obtener escritos reordenamiento:', error);
        return Promise.reject(error);
    }
}