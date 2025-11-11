import styles from '@/constants/GlobalStyles';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedPressableDrawerItem from '@/presentation/theme/components/ThemedPressableDrawerItem';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

const UserDrawer = (props: DrawerContentComponentProps) => {
  const { logout,user } = useAuthStore();
  const avatar =user?.imagen_url? user?.imagen_url :require('@/assets/images/perfil.png');
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
            <Image source={user?.imagen_url ? { uri: user.imagen_url } : avatar} style={styles.avatar} />
          </View>
          <Text style={{ marginTop: 10, color: textColor, fontWeight: 'bold' }}>
            {}{user?.nombre}
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
          onPress={() => router.replace('/(app)/(usuario)/(stack)/home')} 
        />
        <ThemedPressableDrawerItem
          icon="notifications-none"
          iconSet="MaterialIcons"
          label="Notificaciones"
          onPress={() => router.push('/notifications')}
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

export default UserDrawer;