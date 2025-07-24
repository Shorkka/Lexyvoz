import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedPressableDrawerItem from './ThemedPressableDrawerItem';
import { router } from 'expo-router';

const avatar = require('../../../assets/images/perfil.png');

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { logout, userType } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'main');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'background');

  const styles = StyleSheet.create({
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12,
      padding: 10,
      height: 150,
      borderRadius: 12,
      backgroundColor: backgroundColor,
      marginBottom: 20,
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 16,
      marginTop: 20,
      marginBottom: 10,
      color: textColor,
    },
    menuItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuItemText: {
      marginLeft: 10,
      fontSize: 14,
    },
    divider: {
      height: 1,
      backgroundColor: borderColor,
      marginHorizontal: 16,
      marginVertical: 8,
    },
    logoutButton: {
      marginTop: 'auto',
      marginBottom: 30,
      marginHorizontal: 16,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        scrollEnabled={false}
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Sección de perfil */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={avatar} style={styles.avatar} />
          </View>
          {userType && (
            <Text style={{ marginTop: 10, color: textColor, fontWeight: 'bold' }}>
              {userType === 'Doctor' ? 'Dr./Dra.' : 'Paciente'}
            </Text>
          )}
        </View>

        {/* Sección de cuenta */}
        <View>
          <Text style={styles.sectionTitle}>Cuenta</Text>

        </View>
        
        <ThemedPressableDrawerItem
          icon="notifications-none"
          iconSet="MaterialIcons"
          label="Notificaciones"
          onPress={() => router.push('/')} 
          style={styles.menuItem}
          textColor={textColor}
        />
        <View style={styles.divider} />
        {/* Items del drawer */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de cerrar sesión */}
      <ThemedPressableDrawerItem
        icon="log-out-outline"
        label="Cerrar sesión"
        onPress={logout}
        style={styles.logoutButton}
        textColor={textColor}
      />
    </View>
  );
};

export default CustomDrawer;