import { EstadisticasSubTiposResponse, SubTipoConteoPorTipo, SubTipoIDResponse, SubTiposResponse } from "@/core/auth/interface/subtipos";

export class SubTiposMapper {
    static fromApiResp(data: any): SubTiposResponse {
        return {
            success: data.success,
            message: data.message,
            count:   data.count,
            data:    data.data.map((item: any) => ({
                id_sub_tipo:     item.id_sub_tipo,
                sub_tipo_nombre: item.sub_tipo_nombre,
                tipo_id:         item.tipo_id,
                tipo_nombre:     item.tipo_nombre,
                created_at:      item.created_at,
                updated_at:      item.updated_at
            }))
        };
    }
}

export class SubTipoIDMapper {
    static fromApiResp(data: any): SubTipoIDResponse {
        return {
            success: data.success,
            message: data.message,
            data: {
                id_sub_tipo:     data.data.id_sub_tipo,
                sub_tipo_nombre: data.data.sub_tipo_nombre,
                tipo_id:         data.data.tipo_id,
                tipo_nombre:     data.data.tipo_nombre,
                created_at:      data.data.created_at,
                updated_at:      data.data.updated_at
            }
        };
    }
}

export class SubTipoConteoPorTipoMapper{
    static fromApiResp(data: any): SubTipoConteoPorTipo {
        return {
            success: data.success,
            message: data.message,
            count:   data.count,
            data:    data.data.map((item: any) => ({
                id_tipo:        item.id_tipo,
                tipo_nombre:    item.tipo_nombre,
                total_subtipos: item.total_subtipos
            }))
        };
    }
}
export class EstadisticasSubTiposMapper {
    static fromApiResp(data: any): EstadisticasSubTiposResponse {
        return {
            success: data.success,
            message: data.message,
            data:    {
                existe:  data.data.existe,
                nombre:  data.data.nombre,
                tipo_id: data.data.tipo_id
            }
        };
    }
}