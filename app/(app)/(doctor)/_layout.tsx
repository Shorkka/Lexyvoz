
import { Drawer } from 'expo-router/drawer';
import CustomDrawerDoctor from './components/CustomDrawerDoctor';
import { View } from 'react-native';


const DrawerLayout = () => {
  return (
    <View style = {{backgroundColor: '#fefcc3', flex: 1}}>
    <Drawer
      drawerContent={CustomDrawerDoctor}
      screenOptions={{
        // headerShown: false,
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'indigo',
              drawerStyle: {
          backgroundColor: '#ffb525',
        },

          drawerItemStyle: { display: 'none' }
      }}
    >
      <Drawer.Screen
        name="(stack)"
        options={{
          headerShown: false
        }}
      />
    </Drawer>
    </View>
  );
};
export default DrawerLayout;
