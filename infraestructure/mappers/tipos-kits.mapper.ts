import { ObtenerTiposKitResponse, TiposKitsResponse } from "@/core/auth/interface/tipos";

export class mapTiposKits{
    static fromApiResponse(data: TiposKitsResponse): TiposKitsResponse{
        return {
            ...data,
            data: data.data.map(item => ({
                ...item,
                created_at: new Date(item.created_at),
                updated_at: new Date(item.updated_at),
            })),
        };
    }
};


export class ObtenerTiposKitMapper {
    static fromApiResponse(data: ObtenerTiposKitResponse): ObtenerTiposKitResponse {
        return {    
            ...data,
            data: {
                ...data.data,
                created_at: new Date(data.data.created_at),
                updated_at: new Date(data.data.updated_at),
            },
        };
    }
}