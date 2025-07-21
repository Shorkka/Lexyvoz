import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { useColorScheme } from '@/presentation/theme/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CheckAuthenticationLayout from './(lexyvoz-app)/_layout';

export default function RootLayout() {
   const backgroundColor = useThemeColor({}, 'background');
  
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    //SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    KanitRegular: require('../assets/fonts/Kanit-Regular.ttf'),
    KanitBold: require('../assets/fonts/Kanit-Bold.ttf'),
    KanitThin: require('../assets/fonts/Kanit-Thin.ttf'),
  });
  
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      
    <GestureHandlerRootView
    style ={{backgroundColor: backgroundColor, flex: 1}}
    >
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
          <CheckAuthenticationLayout />
    </ThemeProvider>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
