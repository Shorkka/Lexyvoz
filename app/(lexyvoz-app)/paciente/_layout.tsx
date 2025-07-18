
import CustomDrawer from '@/presentation/theme/components/CustomDrawer';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
 

const DrawerLayout = () => {
  const backgroundColor = useThemeColor({}, 'main');
  return (
    <Drawer
    drawerContent={CustomDrawer}

      screenOptions={{
        // headerShown: false,
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'white',
        headerShadowVisible: true,
        drawerStyle: {
          backgroundColor: backgroundColor,
          
        },
        
      }}
    >
      <Drawer.Screen
        name= "(stack)" // This is the name of the page and must match the url from root)"
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
        name="ajustes/index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Ajustes',
          title: 'Ajustes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="mensajes/index"
        options={{
          drawerLabel: 'mensajes',
          title: 'mensajes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name='chatbox-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name='notificaciones/index'
        options={{
          drawerLabel: 'Notificaciones',
          title: 'Notificaciones',
          drawerIcon: ({ color, size }) => (
            <Ionicons name='notifications-circle-outline' size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};
export default DrawerLayout;
