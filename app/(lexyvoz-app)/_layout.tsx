import React, { useEffect } from 'react'
import { View, ActivityIndicator, Text} from 'react-native'
import { useAuthStore } from '@/presentation/auth/store/useAuthStore'
import { Redirect, Stack } from 'expo-router';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import LogoutIconButton from '@/presentation/theme/components/LogoutIconButton';


const CheckAuthenticationLayout = () => {

    const backgroundColor = useThemeColor({}, 'background');
    const {status, checkStatus} = useAuthStore();
    useEffect(() => {
        checkStatus();
    },[]);
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
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: backgroundColor,
                },
                contentStyle: {
                    backgroundColor: backgroundColor,
                }
            }}
        >
            <Stack.Screen name ="(home)/index"
            options = {{
                title: 'Productos',
                headerLeft: () => <LogoutIconButton />
            }}
            />

        </Stack>
  )
};

export default CheckAuthenticationLayout

