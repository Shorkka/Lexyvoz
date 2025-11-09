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
  };

  const goHome = () => {
    if (router.canDismiss()) router.dismiss();
    router.replace('/home');
  };

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fefcc3' },
        contentStyle: { backgroundColor: '#fefcc3' },

        // ⬇️ TÍTULO CENTRADO Y COMPLETO
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
        // Ayuda a centrar realmente el título cuando hay avatar a la izquierda y botón a la derecha

        // ⬅️ Avatar / back
        headerLeft: () => (
          <Pressable
            onPress={handleHeaderLeftPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              marginLeft: 15,
              marginRight: 5,
            })}
            hitSlop={10}
          >
            {pathname !== '/home' ? (
              <Ionicons name="arrow-back-outline" size={24} color="#ffa500" />
            ) : (
              <Image source={avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
            )}
          </Pressable>
        ),

        // ➡️ Botón pequeño (no texto largo aquí)
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
      <Stack.Screen name="home/index" options={{ title: '', headerShown: true }} />
      <Stack.Screen name="ejercicios/index" options={{ title: '', headerBackVisible: false }} />
      <Stack.Screen name="busqueda-doctores/index" options={{ title: ' ', headerBackVisible: false }} />
      <Stack.Screen name="juegos/index" options={{ title: '', headerBackVisible: true }} />
      <Stack.Screen name="juegos/escrito/index" options={{ title: '', headerBackVisible: true }} />
      <Stack.Screen name="juegos/lectura/index" options={{ title: '', headerBackVisible: true }} />
      <Stack.Screen name="juegos/visual/index" options={{ title: '', headerBackVisible: true }} />
      <Stack.Screen name="settings/index" options={{ title: 'Perfil', headerBackVisible: false }} />
      <Stack.Screen name ="notifications/index" options = {{title: "Notificaciones", headerBackVisible: false}}/>
    </Stack>
  );
};

export default StackLayout;
