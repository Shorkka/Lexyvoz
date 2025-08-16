import { Image, Platform, Pressable, useWindowDimensions } from 'react-native';
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
    if (pathname === '/home') {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } else if (router.canGoBack()) {
      router.back();
    }
  }

  const handleHeaderRightPress = () => {
    if (router.canDismiss()) {
      router.dismiss(); 
    }
    router.replace('/home');
  };

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fefcc3',
        },
        contentStyle: {
          backgroundColor: '#fefcc3',
       },
        headerLeft: () => (
          <Pressable 
            onPress={handleHeaderLeftPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              marginLeft: 15,
              marginRight: 5
            })}
          >
            {pathname === 'home' ? (
              <Ionicons name="arrow-back-outline" size={24} color={'white'} />
            ) : (
              <Image 
                source={avatar} 
                style={{ width: 32, height: 32, borderRadius: 16 }} 
              />
            )}
          </Pressable>
        ),
        headerRight: () => (
          <Pressable 
            onPress={handleHeaderRightPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              marginRight: 15
            })}
          >
          <ThemedText type = 'title' style = {{right: Platform.select ({web: width* 0.1, default: width*0.1 })}}>Lexyvoz</ThemedText>
          </Pressable>
        )
      }}
    >
      <Stack.Screen 
        name="home/index" 
        options={{ 
          title: '',
          headerShown: true
          
          
        }} 
      />
      <Stack.Screen 
        name="ejercicios/index" 
        options={{ 
          title: '',
          headerBackVisible: false
        }} 
      />
      <Stack.Screen 
        name="busqueda-doctores/index" 
        options={{ 
          title: 'Buscar Doctores',
          headerBackVisible: true
        }}
      />
    </Stack>
  );
};

export default StackLayout;