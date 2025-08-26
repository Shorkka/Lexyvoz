import { productsApi } from "@/core/auth/api/productsApi";
import {  EstadisticasSubTiposMapper, SubTipoConteoPorTipoMapper, SubTipoIDMapper, SubTiposMapper } from "../mappers/subtipos.mapper";
import { EstadisticasSubTiposResponse, SubTipoConteoPorTipo, SubTipoIDResponse, SubTiposResponse } from "@/core/auth/interface/subtipos";


export const obtenerSubTiposListados = async (): Promise<SubTiposResponse> => {
  try {
    const { data } = await productsApi.get<SubTiposResponse>('/subtipos/listado');
    return SubTiposMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener subtipos listados:", error);
    throw error;
  }
};

export const obtenerSubTipoPorID = async (id: number) => {
  try {
    const { data } = await productsApi.get(`//subtipo/obtener/${id}`);
    return SubTipoIDMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener subtipo por ID:", error);
    throw error;
  }
};

export const obtenerSubTipoPorTipoID = async (tipo_id: number) => {
  try {
    const { data } = await productsApi.get(`/subtipos/por-tipo/${tipo_id}`);
    return SubTipoIDMapper.fromApiResp(data);
  } catch (error) {
    console.error("Error al obtener subtipo por Tipo ID:", error);
    throw error;
  }
};


export const crearSubTipo = async(SubTipo: SubTipoIDResponse) => {
    try{
        const { data } = await productsApi.post('/subtipos/crear', SubTipo);
        return data;
    } catch (error) {
        console.error("Error al crear subtipo:", error);
        throw error;
    }
}

export const editarSubtipos = async (id: number,SubTipo: SubTiposResponse) => {
    try {
        const { data } = await productsApi.put(`/subtipos/editar/${id}`, SubTipo);
        return SubTipoIDMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al editar subtipo:", error);
        throw error;
    }
};

export const eliminarSubTipo = async (id: number) => {
    try {
        const { data } = await productsApi.delete(`/subtipos/eliminar/${id}`);
        return data;
    } catch (error) {
        console.error("Error al eliminar subtipo:", error);
        throw error;
    }
};

export const buscarSubtipos = async (q: string) => {
    try {
        const { data } = await productsApi.get(`/subtipos/buscar?q=${q}`);
        return SubTiposMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al buscar subtipos:", error);
        throw error;
    }
};
    
export const subtiposConteoPorTipo = async (tipo_id: number): Promise<SubTipoConteoPorTipo> => {
    try {
        const { data } = await productsApi.get<SubTipoConteoPorTipo>(`/subtipos/conteo/por-tipo/${tipo_id}`);
        return SubTipoConteoPorTipoMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al obtener conteo de subtipos por tipo:", error);
        throw error;
    }
};

export const verificarExistenciaSubTipo = async (id: number): Promise<boolean> => {
    try {
        const { data } = await productsApi.get(`/subtipos/verificar/${id}`);
        return data.exists;
    } catch (error) {
        console.error("Error al verificar existencia de subtipo:", error);
        throw error;
    }
};

export const estadisticasSubtipo = async (): Promise<EstadisticasSubTiposResponse> => {
    try {
        const { data } = await productsApi.get<EstadisticasSubTiposResponse>(`/subtipos/estadisticas/`);
        return EstadisticasSubTiposMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al obtener estadísticas de subtipo:", error);
        throw error;
    }
};

export const obtenerSubtipos = async (id: number): Promise<SubTipoIDResponse> => {
    try {
        const { data } = await productsApi.get<SubTipoIDResponse>(`/subtipos/por-tipo/${id}`);
        return SubTipoIDMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al obtener subtipos:", error);
        throw error;
    }
};

export const obtenerSubtipoPorTipo = async (id: number): Promise<SubTiposResponse> => {
    try {
        const { data } = await productsApi.get<SubTiposResponse>(`/subtipos/por-tipo/${id}`);
        return SubTiposMapper.fromApiResp(data);
    } catch (error) {
        console.error("Error al obtener subtipo por tipo:", error);
        throw error;
    }
};
