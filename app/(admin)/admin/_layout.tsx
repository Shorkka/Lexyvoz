import React from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image, Platform, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/presentation/theme/components/ThemedText';

const BG = '#fefcc3';
const BRAND = '#ffa500';
const avatar = require('@/assets/images/perfil.png');

export default function UsersStack() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const atRoot = pathname === '/admin';

  const handleLeft = () => {
    if (atRoot) navigation.dispatch(DrawerActions.toggleDrawer());
    else if ('canGoBack' in router && router.canGoBack()) router.back();
  };

  const goAdminHome = () => {
    if ('canDismiss' in router && router.canDismiss()) router.dismiss();
    router.replace('/admin');
  };

  const common = {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: BG },
    contentStyle: { backgroundColor: BG },
    headerTitleAlign: 'center' as const,
    headerTitle: () => (
      <Pressable onPress={goAdminHome} hitSlop={10}>
        <ThemedText
          type="title"
          style={{
            fontWeight: '900',
            
            color: BRAND,
            fontSize: Platform.select({
              ios: 20,
              android: 20,
              default: Math.max(18, Math.min(22, width * 0.05)),
            }),
          }}
          numberOfLines={1}
        >
          Lexyvoz
        </ThemedText>
      </Pressable>
    ),
    headerLeft: () => (
      <Pressable
        onPress={handleLeft}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginLeft: 15, marginRight: 5 })}
        hitSlop={10}
      >
        {atRoot ? (
          <Image source={avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
        ) : (
          <Ionicons name="arrow-back-outline" size={24} color={BRAND} />
        )}
      </Pressable>
    ),
    headerRight: () => (
      <Pressable onPress={goAdminHome} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 15 })} hitSlop={10}>
        <Ionicons name="home-outline" size={24} color={BRAND} />
      </Pressable>
    ),
  };

  return (
    <Stack screenOptions={common}>
      <Stack.Screen name="kits/index"  options={{ title: '' }} />
      <Stack.Screen name="kits/wizard"  options={{ title: '' }} />
      <Stack.Screen name="users/index" options={{ title: '' }} />
      <Stack.Screen name="settings/index"   options={{ title: '' }} />
    </Stack>
  );
}
