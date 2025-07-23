
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import CustomDrawer from '@/presentation/theme/components/CustomDrawer';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
 

const DrawerLayoutUser = () => {
  const backgroundColor = useThemeColor({}, 'main');
  const { user } = useAuthStore();
  return (
<Drawer
  drawerContent={CustomDrawer}
  screenOptions={{
    overlayColor: 'rgba(0,0,0,0.4)',
    drawerActiveTintColor: 'white',
    headerShadowVisible: true,
    drawerStyle: {
      backgroundColor: backgroundColor,
    },
  }}
>
  <Drawer.Screen
    name="(stack)"
    options={{
      headerShown: false,
      drawerLabel: 'Inicio',
      title: 'Lexyvoz',
      drawerIcon: ({ color, size }) => (
        <Ionicons name="home-outline" size={size} color={color} />
      ),
    }}
  />

  <Drawer.Screen
    name="ajustes/index"
    options={{
      drawerLabel: 'Ajustes',
      title: 'Ajustes',
      drawerIcon: ({ color, size }) => (
        <Ionicons name="settings-outline" size={size} color={color} />
      ),
    }}
  />

  {/* Mostrar mensajes solo si el usuario es Paciente */}
  {user?.tipo === 'Paciente' || (
    <Drawer.Screen
      name="mensajes/index"
      options={{
        drawerLabel: 'Mensajes',
        title: 'Mensajes',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="chatbox-outline" size={size} color={color} />
        ),
      }}
    />
  )}

  <Drawer.Screen
    name="notificaciones/index"
    options={{
      drawerLabel: 'Notificaciones',
      title: 'Notificaciones',
      drawerIcon: ({ color, size }) => (
        <Ionicons name="notifications-circle-outline" size={size} color={color} />
      ),
    }}
  />
  
</Drawer>
  );
};
export default DrawerLayoutUser;
