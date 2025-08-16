import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(registroPaso1)/index">
          <Stack.Screen name="(registroPaso1)/index"    options={{
          title: '',
          headerShadowVisible: false,
        }}/>
          <Stack.Screen name="(registroPaso2)/index"    options={{
          title: '',
          headerShadowVisible: false,
        }}/>
          <Stack.Screen name='(registroPaso3)/index'   options={{
          title: '',
          headerShadowVisible: false,
        }}/>
      </Stack>
  );
}