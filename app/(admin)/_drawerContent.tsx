// app/(admin)/admin/_drawerContent.tsx
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

const avatar = require('@/assets/images/perfil.png');

const AdminDrawer = (props: DrawerContentComponentProps) => {
  const { logout, user } = useAuthStore();
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
        contentContainerStyle={{ flexGrow: 1}}
      >
        {/* Perfil */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={user?.imagen_url ? { uri: user.imagen_url } : avatar}
              style={styles.avatar}
            />
          </View>
          <Text style={{ marginTop: 10, color: textColor, fontWeight: 'bold' }}>
            {user?.nombre ?? 'Administrador'}
          </Text>
          <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>Rol: Admin</ThemedText>
        </View>

        {/* Cuenta / Ajustes */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 }}>
          <ThemedText type="subtitle">Cuenta</ThemedText>
          <Pressable onPress={() => router.push('/admin/settings')}>
            <Ionicons name="cog-outline" size={26} />
          </Pressable>
        </View>
        <View style={styles.divider} />

        <DrawerItemList {...props} />
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

export default AdminDrawer;
