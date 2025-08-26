import { productsApi } from "@/core/auth/api/productsApi";
import { ObtenerTiposKitResponse, TiposKitsResponse } from "@/core/auth/interface/tipos";
import { mapTiposKits, ObtenerTiposKitMapper } from "../mappers/tipos-kits.mapper";


export const listarTiposKits = async (): Promise<TiposKitsResponse> => {
    try{
        const { data } = await productsApi.get<TiposKitsResponse>('tipos/listados');
        return mapTiposKits.fromApiResponse(data);
    }catch (error) {
        console.error("Error al listar tipos de kits:", error);
        throw error;
    }
};


export const obtenerTiposPorID = async (id: number): Promise<ObtenerTiposKitResponse> => {
    try {
        const { data } = await productsApi.get<ObtenerTiposKitResponse>(`tipos/por-id/${id}`);
        return ObtenerTiposKitMapper.fromApiResponse(data);
    } catch (error) {
        console.error("Error al obtener tipos por ID:", error);
        throw error;
    }
};
