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
      navigation.dispatch(DrawerActions.toggleDrawer());
    } else if (router.canGoBack()) {
      router.back();
    }
  }
  const goHome = () => {
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
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Pressable onPress={goHome} hitSlop={10}>
            <ThemedText
              type="title"
              // evita que se recorte, usa un contenedor flexible
              style={{
                fontWeight: '900',
                color: '#ffa500',
                // Opcional: ajuste por plataforma/tamaño
                fontSize: Platform.select({
                  ios: 20,
                  android: 20,
                  default: Math.max(18, Math.min(22, width * 0.05)),
                }),
              }}
              numberOfLines={1}
            >
              Lexyvoz
            </ThemedText>
          </Pressable>
        ),
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>

            <Pressable 
              onPress={handleHeaderLeftPress}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
            
              })}
            >
              {pathname !== '/main' ? (
                <Ionicons name="arrow-back-outline" size={24} color={'#ffa500'} />
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
          <Pressable
            onPress={goHome}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 15 })}
            hitSlop={10}
          >
            <Ionicons name="home-outline" size={24} color="#ffa500" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen 
        name="main/index" 
        options={{ 
          title: '',
          headerShown: true
          
        }} 
      />
      <Stack.Screen 
        name="add_paciente/index" 
        options={{ 
          title: ' ',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="kits/kits-list/index" 
        options={{ 
          title: 'Listar Kit',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="kits/createKit/index" 
        options={{ 
          title: 'Crear Kits',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="kits/editKit/[kitId]/index" 
        options={{ 
          title: 'Editar Kit',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="agenda/index" 
        options={{ 
          title: 'Agenda',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name = "ver_perfil_usuario/[paciente_id]/index"
        options={{ 
          title: 'Perfil paciente',
          headerShown: true,
        }}
      />
          <Stack.Screen 
        name="notifications/index" 
        options={{ 
          title: 'Notificaciones',
          headerShown: true,
        }} 
      />
            <Stack.Screen 
        name="kits/(terminardeCrearKit)/index" 
        options={{ 
          title: 'Terminar de Crear Kit',
          headerShown: true,
        }}
      />

      </Stack>

  );
};

export default StackLayout;