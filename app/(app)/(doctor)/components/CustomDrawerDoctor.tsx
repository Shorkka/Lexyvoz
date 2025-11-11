import styles from '@/constants/GlobalStyles';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedPressableDrawerItem from '@/presentation/theme/components/ThemedPressableDrawerItem';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/components/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';


const DoctorDrawer = (props: DrawerContentComponentProps) => {
  const { logout, user } = useAuthStore();
  const textColor = useThemeColor({}, 'text');
  
  const avatar = user?.imagen_url ? user?.imagen_url :require('@/assets/images/perfil.png');
  const go = (href: string) => {
    props.navigation.closeDrawer();
    router.replace(href as any);
  };

  const exit = async () => {
    await logout();
    go('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        scrollEnabled={false}
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Perfil */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={user?.imagen_url ? { uri: user.imagen_url } : avatar} style={styles.avatar} />
          </View>
          <Text style={{ marginTop: 10, color: textColor, fontWeight: 'bold' }}>
            Dr./Dra. {user?.nombre ?? ''}
          </Text>
        </View>

        {/* Cuenta */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText type="subtitle" style={{ color: 'white' }}>Cuenta</ThemedText>
            <Pressable style={{ marginLeft: '10%' }} onPress={() => go('/settings')}>
              <Ionicons name="cog-outline" size={34} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Secciones top-level */}
        <ThemedPressableDrawerItem
          icon="home"
          label="Inicio"
          onPress={() => go('/main')}
        />
        <ThemedPressableDrawerItem
          icon="notifications-none"
          iconSet="MaterialIcons"
          label="Notificaciones"
          onPress={() => go('/notifications')}
        />
        <ThemedPressableDrawerItem
          icon="calendar"
          label="Agenda"
          onPress={() => go('/agenda')}
        />

        <View style={styles.divider} />

        {/* Evita DrawerItemList: navega con push por dentro */}
        {/* <DrawerItemList {...props} /> */}
      </DrawerContentScrollView>

      {/* Cerrar sesión */}
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
