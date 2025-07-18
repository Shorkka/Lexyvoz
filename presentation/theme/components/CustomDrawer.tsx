import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useThemeColor } from '../hooks/useThemeColor';

const avatar = require('../../../assets/images/perfil.png');

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const backgroundColor = useThemeColor({}, 'main');
  const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 10,
    height: 150,
    borderRadius: 12,
    backgroundColor: backgroundColor,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor,
    borderRadius: 999, 
    height: 96,
    width: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
});
  return (
    <DrawerContentScrollView
      scrollEnabled={false}
      {...props}
    >
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;


