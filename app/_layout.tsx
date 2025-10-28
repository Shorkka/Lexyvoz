import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { useColorScheme } from '@/presentation/theme/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';                                                     
import { useRoutePersistence } from '@/presentation/hooks/useRoutePersistence';

const queryClient = new QueryClient();

export default function RootLayout() {
   useRoutePersistence();
   const backgroundColor = useThemeColor({}, 'background');
  
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    KanitRegular: require('../assets/fonts/Kanit-Regular.ttf'),
    KanitBold: require('../assets/fonts/Kanit-Bold.ttf'),
    KanitThin: require('../assets/fonts/Kanit-Thin.ttf'),
  });
  
  if (!loaded) {
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider style={{ flex: 1, backgroundColor }}>
      <GestureHandlerRootView style ={{backgroundColor: backgroundColor, flex: 1}}>
        <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
            <Slot/>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  </QueryClientProvider>
  );
}

