import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, } from '@react-navigation/native';
import { Stack, } from 'expo-router';

const StackLayout = () => {
  const onHeaderLeftClick = (navigation: any) =>{
    {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }
      }
      
  }
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
        headerLeft: () => (
          <Ionicons
            name={navigation.canGoBack() ? 'arrow-back-outline' : 'grid-outline'}
            size={20}
            color="#fff"
            onPress={() => onHeaderLeftClick(navigation)}
          />
        ),
      })}
    >
      <Stack.Screen
        name="home/index"
        options={{
          title: 'True',
          
          headerShown: true, 
        }}
      />

    </Stack>
  );
};
export default StackLayout;
