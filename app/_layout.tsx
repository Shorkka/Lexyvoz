// app/_layout.tsx
import { useColorScheme } from '@/presentation/theme/components/hooks/useColorScheme';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRootNavigationState } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useRoleRouteProtector } from '@/presentation/hooks/useRoleRouteProtector';
import { useRoutePersistence } from '@/presentation/hooks/useRoutePersistence';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  // Tu color de fondo temático
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    KanitRegular: require('../assets/fonts/Kanit-Regular.ttf'),
    KanitBold: require('../assets/fonts/Kanit-Bold.ttf'),
    KanitThin: require('../assets/fonts/Kanit-Thin.ttf'),
  });

  const navState = useRootNavigationState();
  const isRouterReady = !!navState?.key;

  useRoleRouteProtector();
  useRoutePersistence();

  if (!loaded || !isRouterReady) {
    return null; // puedes poner aquí un splash con el mismo backgroundColor si quieres
  }

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;


  const MyTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: backgroundColor, // contenido/escenas
      card: backgroundColor,       // header / cards
      border: 'transparent',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor }}>
        <GestureHandlerRootView style={{ backgroundColor, flex: 1 }}>
          <ThemeProvider value={MyTheme}>
            {/* ✅ StatusBar consistente (Android/Web) */}
            <StatusBar
              style={colorScheme === 'dark' ? 'light' : 'dark'}
              backgroundColor={backgroundColor}
              translucent={false}
            />
            <Slot />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
