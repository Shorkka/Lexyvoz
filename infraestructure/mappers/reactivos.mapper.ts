import {  ObtenerCompatibilidadVerificadaResponse, ObtenerReactivoResponse, ObtenerReactivosEjericiosResponse, ObtenerSubTipoReactivoResponse, ObtenerTiposReactivosIDResponse, ReactivoIDResponse } from "@/core/auth/interface/reactivos";

export class ReactivoMapper {
    static fromApiResp(data: any): ObtenerReactivoResponse {
        return {
            message:    data.message,
            reactivos:  data.reactivos.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class SubTiposReactivosMapper {
    static fromApiResp(data: any): ObtenerSubTipoReactivoResponse {
        return {
            message:    data.message,
            data:       data.data.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class tiposReactivosMapper {
    static fromApiResp(data: any): ObtenerTiposReactivosIDResponse {
        return {
            message:    data.message,
            data:       data.data.map((item: any) => ({
                id:          item.id,
                nombre:      item.nombre,
                imagen_url:  item.imagen_url,
                tipo_id:     item.tipo_id,
                sub_tipo_id: item.sub_tipo_id,
                activo:      item.activo
            })),
            pagination: {
                totalItems:  data.pagination.totalItems,
                totalPages:  data.pagination.totalPages,
                currentPage: data.pagination.currentPage
            }
        };
    }
}

export class CompatibilidadEjerciciosReactivosMapper {
    static fromApiResp(data: any): ObtenerCompatibilidadVerificadaResponse {
        return {
            message:       data.message,
            compatible:    data.compatible,
            mensaje:       data.mensaje,
            tipoExistente: {
                tipo_id:     data.tipoExistente.tipo_id,
                tipo_nombre: data.tipoExistente.tipo_nombre
            }
        };
    }
}
// Mapper obtener reactivo ID
export class ObtenerReactivosIDMapper{
    static fromApiResp(data: any): ReactivoIDResponse {
        return {
            message:  data.message,
            reactivo: {
                id:             data.reactivo.id,
                nombre:         data.reactivo.nombre,
                imagen_url:     data.reactivo.imagen_url,
                tipo_id:        data.reactivo.tipo_id,
                sub_tipo_id:    data.reactivo.sub_tipo_id,
                activo:         data.reactivo.activo,
                creado_por:     data.reactivo.creado_por,
                fecha_creacion: data.reactivo.fecha_creacion
            }
        };
    }
}

export class ObtenerEjerciciosReactivosMapper{
    static fromApiResp(data: any): ObtenerReactivosEjericiosResponse {
        return {
            message:      data.message,
            ejercicio_id: data.ejercicio_id,
            reactivos:    data.reactivos.map((item: any) => ({
                id:         item.id,
                nombre:    item.nombre,
                imagen_url: item.imagen_url,
                orden:      item.orden,
                activo:     item.activo
            })),
            total:        data.total
        };
    }
}