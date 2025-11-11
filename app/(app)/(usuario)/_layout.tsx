
import { Drawer } from 'expo-router/drawer';
import CustomDrawerUsuario from './components/CustomDrawerUsuario';
import { View } from 'react-native';


const DrawerLayout = () => {
  return (
    <View style = {{backgroundColor: '#fefcc3', flex: 1}}>

    <Drawer
      drawerContent={CustomDrawerUsuario}
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'indigo',
        headerShadowVisible: false,
        drawerStyle: {
          backgroundColor: '#ffb525',
        },
        drawerItemStyle: { display: 'none' },
        
      }}
      
    >
      <Drawer.Screen
        name="(stack)" 
        options={{
          headerShown: false,
          drawerContentStyle: false
        }}
      />
    </Drawer>
  </View>
  );
};
export default DrawerLayout;