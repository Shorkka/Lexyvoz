import { Image, Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const StackLayout = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const avatar = require('../../../../assets/images/perfil.png');
  const pathname = usePathname();
  const handleHeaderLeftPress = () => {
    if (pathname === '/main') {
      // Si estamos en /main, abre el drawer
      navigation.dispatch(DrawerActions.toggleDrawer());
    } else if (router.canGoBack()) {
      // Si hay historial, regresa
      router.back();
    }
  }
  const handleHeaderRightPress = () => {
    if (router.canDismiss()) {
      router.dismiss(); // Cierra modales si existen
    }
    router.replace('/main'); // Navegación con Expo Router
  };

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fefcc3',
        },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>

            <Pressable 
              onPress={handleHeaderLeftPress}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
            
              })}
            >
              {pathname === 'main' ? (
                <Ionicons name="arrow-back-outline" size={24} color={'white'} />
              ) : (
                <Image 
                  source={avatar} 
                  style={{ width: 32, height: 32, borderRadius: 16 }} 
                />
              )}
            </Pressable>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          <Pressable 
            onPress={handleHeaderRightPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              marginRight: 15
            })}
          >
          <ThemedText type = 'title' style = {{right: Platform.select ({web: width* 0.1, default: width*0.1 })}}>Lexyvoz</ThemedText>
          </Pressable>
          </View>
        )
      }}
    >
      <Stack.Screen 
        name="main/index" 
        options={{ 
          title: '',
          headerShown: true
          
        }} 
      />
    </Stack>
  );
};

export default StackLayout;