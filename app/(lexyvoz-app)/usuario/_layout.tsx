import CustomDrawer from '@/presentation/theme/components/CustomDrawer';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Drawer } from 'expo-router/drawer';

const DrawerLayoutUser = () => {
  const backgroundColor = useThemeColor({}, 'main');
  return (
    <Drawer
      drawerContent={CustomDrawer} 
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerShadowVisible: true,
        headerShown: false, 
        swipeEnabled: false, 
        drawerStyle: {
        backgroundColor: backgroundColor,
        },
      }}
    >
        <Drawer.Screen name="(stack)" />
      </Drawer>
  );
};

export default DrawerLayoutUser;