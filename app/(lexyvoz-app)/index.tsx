import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
//import React, { useEffect } from 'react';
//import { ActivityIndicator, View } from 'react-native';



const CheckAuthenticationLayout = () => {

    const backgroundColor = useThemeColor({}, 'background');

    // const {status, checkStatus} = useAuthStore(); // checkStatus ya no se usa
    const { status, userType } = useAuthStore(); // Solo usamos status

    /*
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
    */
   useEffect(() => {
        // Aquí podrías hacer algo si es necesario cuando el estado cambie

    }, [status]);
    if ( status === 'unauthenticated'){
        return <Redirect href={'/auth/login'}/>
    }
        if (status === 'authenticated') {
            console.log(userType);
            if (userType === 'Doctor') return <Redirect href="/doctor" />
            if (userType === 'Paciente' || userType === 'Usuario') return <Redirect href='/usuario/home' />
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