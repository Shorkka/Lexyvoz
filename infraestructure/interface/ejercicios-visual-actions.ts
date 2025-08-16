import { productsApi } from "@/core/auth/api/productsApi";
import { igualDiferente, imagenCorrecto, imagenes, palabraMalEscrito, pares, visual } from "@/core/auth/interface/ejercicios.kits.requerimientos";


export const crearIgualDiferente = async (pregunta: string, opciones: string[]): Promise<igualDiferente> => {
    try {
        const {data} = await productsApi.post('/ejercicios/igual-diferente', { pregunta, opciones });
        return data;
    } catch (error) {
        console.log('Error al crear igual diferente:', error);
        return Promise.reject(error);
    }
}

export const obtenerIgualDiferente = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/igual-diferente');
        return data;
    } catch (error) {
        console.log('Error al obtener igual diferente:', error);
        return Promise.reject(error);
    }
}

export const crearImagenCorrecto = async (imagen: string, respuesta: string): Promise<imagenCorrecto> => {
    try {
        const {data} = await productsApi.post('/ejercicios/imagen-correcto', { imagen, respuesta });
        return data;
    } catch (error) {
        console.log('Error al crear imagen correcto:', error);
        return Promise.reject(error);
    }
}
export const obtenerImagenCorrecto = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/imagen-correcto');
        return data;
    } catch (error) {
        console.log('Error al obtener imagen correcto:', error);
        return Promise.reject(error);
    }
}

export const crearImagens = async (reactivoId: string, url: string): Promise<imagenes> => {
    try {
        const {data} = await productsApi.post('/ejercicios/imagenes', { reactivoId, url });
        return data;
    } catch (error) {
        console.log('Error al crear imagenes:', error);
        return Promise.reject(error);
    }
}

export const obtenerImagenes = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/imagenes');
        return data;
    } catch (error) {
        console.log('Error al obtener imagenes:', error);
        return Promise.reject(error);
    }
}

export const crearPalabraMalEescrita = async (palabra: string, correcta: string): Promise<palabraMalEscrito> => {
    try {
        const {data} = await productsApi.post('/ejercicios/palabra-mal-escrita', { palabra, correcta });
        return data;
    } catch (error) {
        console.log('Error al crear palabra mal escrita:', error);
        return Promise.reject(error);
    }
}

export const obtenerPalabraMalEscrita = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/palabra-mal-escrita');
        return data;
    } catch (error) {
        console.log('Error al obtener palabra mal escrita:', error);
        return Promise.reject(error);
    }
}

export const crearPares = async (): Promise<pares> => {
    try {
        const {data} = await productsApi.post('/ejercicios/pares');
        return data;
    } catch (error) {
        console.log('Error al crear pares:', error);
        return Promise.reject(error);
    }
}
export const obtenerPares = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/pares');
        return data;
    } catch (error) {
        console.log('Error al obtener pares:', error);
        return Promise.reject(error);
    }
}
export const crearVisuales = async (): Promise<visual> => {
    try {
        const {data} = await productsApi.post('/ejercicios/visuales');
        return data;
    } catch (error) {
        console.log('Error al crear visuales:', error);
        return Promise.reject(error);
    }
}
export const obtenerVisuales = async (): Promise<void> => {
    try {
        const {data} = await productsApi.get('/ejercicios/visuales');
        return data;
    } catch (error) {
        console.log('Error al obtener visuales:', error);
        return Promise.reject(error);
    }
}