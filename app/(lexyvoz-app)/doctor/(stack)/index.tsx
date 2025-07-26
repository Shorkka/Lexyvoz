import { Image, Platform, Pressable, useWindowDimensions} from 'react-native';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/presentation/theme/components/ThemedText';




const StackLayout = () => {
  const avatar = require( '../../../../assets/images/perfil.png');
  const backgroundColor = useThemeColor({}, 'background');
  const { width } = useWindowDimensions();
  const onHeaderLeftClick = (navigation: any) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  };

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        contentStyle: {backgroundColor},
        headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerRight: () => {return (<ThemedText type = 'title' style = {{right: Platform.select ({web: width* 0.1, default: width*0.1 })}}>Lexyvoz</ThemedText>)},
        headerLeft: () => (
          <Pressable 
            onPress={() => onHeaderLeftClick(navigation)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              marginLeft: 15,
              marginRight: 5
            })}
          >
            {navigation.canGoBack() ? (
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={'white'}
              />
            ) : avatar ? (
              <Image 
                source={avatar}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (null)}
          </Pressable>
        )
      })}
    >
      <Stack.Screen
        name='home/index'
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;