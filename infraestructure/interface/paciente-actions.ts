import { productsApi } from "@/core/auth/api/productsApi";
import { UserMapper } from "../mappers/user.mapper";
import { UserResponse } from "@/core/auth/interface/user";

export const searchDoctors = async (number_id: number) => {
  try {
    const { data } = await productsApi.get(`/pacientes/${number_id}/doctores`);
    return data;
  } catch (error) {
    console.error('Error al buscar doctores:', error);
    throw error;
  }
};

export const obtenerUsuarioPorID = async (userId: number): Promise<UserResponse> => {
  try{
    const {data} = await productsApi.get<UserResponse>(`/usuarios/${userId}`);
    console.log('Usuario obtenido:', data);
    return UserMapper.fromApiToEntity(data);


  }catch( error){
    console.log(error);
    throw new Error("Error al obtener el usuario por ID");
  }
}

