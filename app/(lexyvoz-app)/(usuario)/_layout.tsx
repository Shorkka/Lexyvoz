import CustomDrawer from '@/presentation/theme/components/CustomDrawer';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Drawer } from 'expo-router/drawer';

const DrawerLayoutUser = () => {
  const backgroundColor = useThemeColor({}, 'main');
  
  return (
    <Drawer
      drawerContent={CustomDrawer} // Esto conecta tu diseño personalizado
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerShadowVisible: true,
        headerShown: false, // Oculta headers por defecto
        swipeEnabled: false, // Opcional: deshabilita gesto de swipe
        drawerStyle: {
        backgroundColor: backgroundColor,
        },
      }}
    >
      {/* Mantén todas tus pantallas definidas aquí */}
      <Drawer.Screen name="(stack)" />
      </Drawer>
  );
};

export default DrawerLayoutUser;