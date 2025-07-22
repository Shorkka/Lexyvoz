import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Redirect, Stack } from 'expo-router';
//import React, { useEffect } from 'react';
//import { ActivityIndicator, View } from 'react-native';



const CheckAuthenticationLayout = () => {

    const backgroundColor = useThemeColor({}, 'background');

    // const {status, checkStatus} = useAuthStore(); // checkStatus ya no se usa
    const { status, user } = useAuthStore(); // Solo usamos status

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
    console.log(status)
    if ( status === 'unauthenticated'){
        return <Redirect href={'/auth/login'}/>
    }
        if (status === 'authenticated') {
        if (user?.tipo === 'Doctor') return <Redirect href="/doctor/home" />
        if (user?.tipo === 'Paciente' || user?.tipo === 'Usuario') return <Redirect href="/paciente/home" />
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

