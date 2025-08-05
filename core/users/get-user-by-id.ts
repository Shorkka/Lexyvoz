import { UserMapper } from "@/infraestructure/mappers/user.mapper";
import { productsApi } from "../auth/api/productsApi";
import { User } from "../auth/interface/user";


const getUserById = async (userId: number): Promise<User> => {
  try{
    const {data} = await productsApi.get<User>(`/usuarios/${userId}`);
    console.log('Usuario obtenido:', data);
    return UserMapper.fromApiToEntity(data);


  }catch( error){
    console.log(error);
    throw new Error("Error al obtener el usuario por ID");
  }
}

export default getUserById;
