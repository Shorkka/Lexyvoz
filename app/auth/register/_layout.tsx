import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="registerStep1" />
          <Stack.Screen name="registerStep2" />
          <Stack.Screen name="registerStep3" />
      </Stack>
  );
}