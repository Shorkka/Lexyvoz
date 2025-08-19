import { productsApi } from "@/core/auth/api/productsApi";
import { Crearkits } from "@/core/auth/interface/kits";
import { ObtenerKitResponse } from "../mappers/interface/kit.mapper.interface";
import { KitMapper } from "../mappers/kit.mapper";

// Crear los kits
export const crearKit = async (kitData: Crearkits) => {
  try {
    const { data } = await productsApi.post('/kits', kitData);
    return data;
  }
  catch (error) {
    console.error('Error al crear el kit:', error);
    throw new Error("Error al crear los kits");
  }
};

export const obtenerKitsCreados = async(): Promise<ObtenerKitResponse> =>{
  try {
    const { data } = await productsApi.get<ObtenerKitResponse>('/kits');
    return KitMapper.fromApiToEntity(data);
  }catch (error){
    console.log(error);
    throw new Error("Error al obtener los kits");
  }
}
