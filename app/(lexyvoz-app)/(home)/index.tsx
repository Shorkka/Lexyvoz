
import { router } from 'expo-router';
  const user = {
   tipo: 'paciente'
  };

const index = () => {

    switch (user.tipo) {
      case 'Paciente': {
        router.replace('/paciente/home');
      }
      case 'Doctor':{
        router.replace('/doctor/home');
      }
      case 'Visitante':{
        router.replace('/paciente/home');
      }
  }
}

export default index