import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';



const CheckAuthenticationLayout = () => {

    const backgroundColor = useThemeColor({}, 'background');
    const { status, userType,checkStatus, loadSession } = useAuthStore(); // Solo usamos status

      useEffect(() => {
    // Cargar la sesión al iniciar la aplicación
    const initializeApp = async () => {
      await loadSession();
    };
    
    initializeApp();
  }, [loadSession]);

    useEffect(() => {
        checkStatus();
    },[checkStatus]);
    
    if (status === 'checking'){    
        return(
            <View style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 5,
            }}>
            <ActivityIndicator />
            </View>
        )
    }
    
    if ( status === 'unauthenticated'){
        return <Redirect href={'/auth/login'}/>
    } 
    if (status === 'authenticated') {

            if (!userType) {
                console.error('Tipo de usuario no definido');
                return <Redirect href={'/auth/login'}/>;
            }
            if (userType === 'Doctor') return <Redirect href="/" />
            if (userType === 'Paciente' || userType === 'Usuario') return <Redirect href='/' />
        }
    return (
        <Stack screenOptions={{ 
            headerShown: false,  
            contentStyle: { backgroundColor: backgroundColor },
        }} >
        </Stack>
    )
};

export default CheckAuthenticationLayout