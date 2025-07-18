import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';



const CheckAuthenticationLayout = () => {

    const backgroundColor = useThemeColor({}, 'background');

    const {status, checkStatus} = useAuthStore();
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



return (
     <Stack screenOptions={{ 
      headerShown: false,  
       contentStyle: { backgroundColor: backgroundColor },
       
       }} >
    </Stack>
  )
};

export default CheckAuthenticationLayout

