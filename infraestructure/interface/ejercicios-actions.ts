import { productsApi } from "@/core/auth/api/productsApi";
import { EjercicioResponseMapper, EjerciciosDeLosKitsMapper, EjerciciosDisponiblesParaUnKitMapper, EjercicioUsuarioActualMapper, EstadisticasEjerciciosMapper, ReactivoMapper, VerificarCompatibilidadMapper } from "../mappers/ejercicios.mapper";

export interface EjercicioData{
    titulo: string;
    descripcion: string;
    tipo_ejercicio: string;
    creado_por: string;
}

export interface EjercicioResponse {
    message:    string;
    ejercicio:  EjercicioResponseEjercicio;
    properties: Properties;
}

export interface EjercicioResponseEjercicio {
    ejercicio_id:   number;
    titulo:         string;
    descripcion:    string;
    tipo_ejercicio: number;
    creado_por:     number;
    activo:         boolean;
    fecha_creacion: Date;
}

export interface Properties {
    message:   Message;
    ejercicio: PropertiesEjercicio;
}

export interface PropertiesEjercicio {
    $ref: string;
}

export interface Message {
    type:    string;
    example: string;
}
export interface EjercicioConReactivoResponse {
    titulo:         string;
    descripcion:    string;
    tipo_ejercicio: number;
    creado_por:     number;
    reactivos:      Reactivo[];
}

export interface Reactivo {
    id_reactivo: number;
    orden:       number;
}

export interface NuevoOrdenDeReactivos {
    nuevosOrdenes: NuevosOrdene[];
}

export interface NuevosOrdene {
    reactivo_id: number;
    orden:       number;
}

// Crear ejercicio basico
export const crearEjercicioBasico = async (ejercicioData: EjercicioData) => {
    try{
        const { data } = await productsApi.post<EjercicioResponse>('/ejercicios', ejercicioData);
        return data;
    }catch (error) {
        console.error("Error creating basic exercise:", error);
        throw error;
    }
}

// Obtener ejercicio por ID
export const obtenerEjercicio = async (
    page?: number,
    limit?: number,
    buscar?: string
) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/`, {
            params: {
                page, 
                limit,
                buscar,
            }
        });
        return EjercicioResponseMapper.toObtenerTodosLosEjercicios(data);
    } catch (error) {
        console.error("Error fetching exercise by ID:", error);
        throw error;
    }
}

// Obtener ejercicios creados por el usuario actual
export const obtenerEjerciciosCreadosPorUsuario = async (
    page?: string,
    limit?: string,
    activo?: boolean,
    buscar?: string,
) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/mis-ejercicios`, {
            params: {
                page,
                limit,
                activo,
                buscar
            }
        });
        return EjercicioUsuarioActualMapper.toObtenerEjerciciosUsuarioActual(data);
    } catch (error) {
        console.error("Error fetching exercises created by user:", error);
        throw error;
    }
}

// Obtener estadisticas generales de ejercicios
export const obtenerEstadisticasGeneralesEjercicios = async () => {
    try {
        const { data } = await productsApi.get('/ejercicios/estadisticas');
        return EstadisticasEjerciciosMapper.toEstadisticasEjercicios(data);
    } catch (error) {
        console.error("Error fetching general exercise statistics:", error);
        throw error;
    }
}

// Obtener ejercicios por tipos especificos
export const obtenerEjerciciosPorTipo = async (
    tipo_id: number,
    page?: number,
    limit?: number,
    activo?: boolean
) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/tipo/${tipo_id}`, {
            params: {
                page,
                limit,
                activo
            }
        });
        return EjercicioResponseMapper.toObtenerTodosLosEjercicios(data);
    } catch (error) {
        console.error("Error fetching exercises by type:", error);
        throw error;
    }
}

// Obtener ejercicios disponibles para un kit (no incluidos en el kit)
export const obtenerEjerciciosDisponiblesParaKit = async (
    kit_id: number,
    page?: number,
    limit?: number,
    activo?: boolean
) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/disponibles/${kit_id}`, {
            params: {
                page,
                limit,
                activo
            }
        });
        return EjerciciosDisponiblesParaUnKitMapper.toEjerciciosDisponiblesParaUnKit(data);
    } catch (error) {
        console.error("Error fetching exercises available for kit:", error);
        throw error;
    }
}

// Obtener un ejercicio especifico por ID
export const obtenerEjercicioPorID = async (id: number) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/${id}`);
        return EjercicioResponseMapper.toObtenerTodosLosEjercicios(data);
    } catch (error) {
        console.error("Error fetching exercise by ID:", error);
        throw error;
    }
}

// Actualizar un ejercicio existente
export const editarEjercicio = async (id: number, ejercicioData: EjercicioData) => {
    try {
        const { data } = await productsApi.put<EjercicioResponse>(`/ejercicios/${id}`, ejercicioData);
        return data;
    } catch (error) {
        console.error("Error updating exercise:", error);
        throw error;
    }
}


// Eliminar un ejercicio (soft delete)
export const eliminarEjercicio = async (id: number) => {
    try {
        const { data } = await productsApi.delete(`/ejercicios/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting exercise:", error);
        throw error;
    }
}

// Duplicar un ejercicio existente
export const duplicarEjercicio = async (id: number) => {
    try {
        const { data } = await productsApi.post(`/ejercicios/${id}/duplicar`);
        return data;
    } catch (error) {
        console.error("Error duplicating exercise:", error);
        throw error;
    }
}

// Crear un ejercicio con reactivos
export const crearEjercicioConReactivos = async (ejercicioData: EjercicioConReactivoResponse) => {
    try {
        const { data } = await productsApi.post<EjercicioConReactivoResponse>(`/ejercicios`, ejercicioData);
        return data;
    } catch (error) {
        console.error("Error creating exercise:", error);
        throw error;
    }
}

// Agregar reactivos a un ejercicio
export const agregarReactivosAEjercicio = async (ejercicioId: number, reactivos: Reactivo[]) => {
    try {
        const { data } = await productsApi.post(`/ejercicios/${ejercicioId}/reactivos`, { reactivos });
        return data;
    } catch (error) {
        console.error("Error adding reactivos to exercise:", error);
        throw error;
    }
}

// Obtener reactivos de un ejercicio
export const obtenerReactivosDeEjercicio = async (ejercicioId: number) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/${ejercicioId}/reactivos`);
        return ReactivoMapper.toObtenerReactivoDeEjercicio(data);
    } catch (error) {
        console.error("Error fetching reactivos from exercise:", error);
        throw error;
    }
}

// Remover reactivos de un ejercicio
export const removerReactivosDeEjercicio = async (ejercicioId: number, reactivoIds: number[]) => {
    try {
        const { data } = await productsApi.delete(`/ejercicios/${ejercicioId}/reactivos`, { data: { reactivoIds } });
        return data;
    } catch (error) {
        console.error("Error removing reactivos from exercise:", error);
        throw error;
    }
}

// Reordenar reactivos en ejercicio
export const reordenarReactivosEnEjercicio = async (ejercicioId: number, nuevosOrdenes: NuevosOrdene[]) => {
    try {
        const { data } = await productsApi.put(`/ejercicios/${ejercicioId}/reactivos/reordenar`, { nuevosOrdenes });
        return data;
    } catch (error) {
        console.error("Error reordering reactivos in exercise:", error);
        throw error;
    }
}

// Verificar compatibilidad de reactivos
export const verificarCompatibilidadReactivos = async (ejercicioId: number, tipoId: number) => {
    try {
        const { data } = await productsApi.post(`/ejercicios/${ejercicioId}/reactivos/compatibilidad`, { tipoId });
        return VerificarCompatibilidadMapper.toVerificarCompatibilidad(data);
    } catch (error) {
        console.error("Error verifying reactivos compatibility:", error);
        throw error;
    }
}

// Obtener Ejercicios de los kits por id
export const obtenerEjerciciosDeKitPorID = async (
    id: number,
    page?: number,
    limit?: number
) => {
    try {
        const { data } = await productsApi.get(`/ejercicios/${id}/kits`, {
            params: {
                page,
                limit
            }
        });
        return EjerciciosDeLosKitsMapper.toEjerciciosDeLosKits(data);
    } catch (error) {
        console.error("Error fetching exercises from kit:", error);
        throw error;
    }
}