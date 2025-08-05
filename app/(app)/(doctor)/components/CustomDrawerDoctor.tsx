import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedPressableDrawerItem from '@/presentation/theme/components/ThemedPressableDrawerItem';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import styles from '@/constants/GlobalStyles';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
const avatar = require('@/assets/images/perfil.png');

const DoctorDrawer = (props: DrawerContentComponentProps) => {
  const { logout,user } = useAuthStore();
  const textColor = useThemeColor({}, 'text');

  const exit = () => {
    logout();
    router.replace('/login');
  };

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
          <Text style={{ marginTop: 10, color: textColor, fontWeight: 'bold' }}>
            Dr./Dra. {user?.nombre}
          </Text>
        </View>

        {/* Sección de cuenta */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText type="subtitle" style={{ color: 'white' }}>Cuenta</ThemedText>
            <Pressable style={{ marginLeft: '10%' }} onPress = {() => router.push('/settings')}>
              <Ionicons name="cog-outline" size={34} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Items específicos para Doctor */}
        <ThemedPressableDrawerItem
          icon="home"
          label="Inicio"
          onPress={() => router.replace('/main')} 
        />
        <ThemedPressableDrawerItem
          icon="notifications-none"
          iconSet="MaterialIcons"
          label="Notificaciones"
          onPress={() => router.push('/notifications')}
        />
        <ThemedPressableDrawerItem
          icon="calendar"
          label="Agenda"
          onPress={() => router.push('/agenda')}
        />
        <View style={styles.divider} />

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de cerrar sesión */}
      <ThemedPressableDrawerItem
        icon="log-out-outline"
        label="Cerrar sesión"
        onPress={exit}
        style={styles.logoutButton}
        textColor={textColor}
      />
    </View>
  );
};

export default DoctorDrawer;