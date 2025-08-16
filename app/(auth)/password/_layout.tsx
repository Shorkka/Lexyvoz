import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="reset/index">
            <Stack.Screen name='reset/index'   options={{
                title: '',
                headerShadowVisible: false,
            }}/>
            <Stack.Screen name="(confirmar-cambio)/index"    options={{
                title: '',
                headerShadowVisible: false,
            }}/>
            <Stack.Screen name="(new-password)/index"    options={{
                title: '',
                headerShadowVisible: false,
            }}/>
            <Stack.Screen name='(codigo)/index'   options={{
                title: '',
                headerShadowVisible: false,
            }}/>
            
        </Stack>
    );
}