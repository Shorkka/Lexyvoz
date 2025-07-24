import { View, Text } from 'react-native'
import React from 'react'
import { DrawerActions, useNavigation } from '@react-navigation/native';

const DoctorScreen = () => {
  const navigation = useNavigation();
    const onToggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer);
    }
  
  return (
    <View>
      <Text className='text-white'>DoctorScreen</Text>
    </View>
  )
}

export default DoctorScreen