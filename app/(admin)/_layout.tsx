import { Drawer } from 'expo-router/drawer';
import AdminDrawer from './_drawerContent';
import { Image, Platform, Pressable, useWindowDimensions } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/presentation/theme/components/ThemedText';

const BG = '#fefcc3';
const ACCENT = '#ee7200';
const avatar = require('@/assets/images/perfil.png');

export default function AdminDrawerLayout() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const onHeaderLeft = () => {
    const isAdminHome = pathname === '/admin';
    if (isAdminHome) {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } else if ('canGoBack' in router && router.canGoBack()) {
      router.back();
    }
  };

  const goAdminHome = () => {
    if ('canDismiss' in router && router.canDismiss()) router.dismiss();
    router.replace('/admin');
  };

  return (
    <Drawer
      drawerContent={(props) => <AdminDrawer {...props} />}
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerActiveTintColor: 'indigo',
        headerShadowVisible: true,
        drawerStyle: { backgroundColor: '#ffb525' },
        // ocultamos los ítems autogenerados porque usamos contenido custom
        drawerItemStyle: { display: 'none' },

        headerShown: false,
        headerStyle: { backgroundColor: BG },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Pressable onPress={goAdminHome} hitSlop={10}>
            <ThemedText
              type="title"
              style={{
                fontWeight: '900',
                color: ACCENT,
                fontSize: Platform.select({
                  ios: 20, android: 20, default: Math.max(18, Math.min(22, width * 0.05)),
                }),
              }}
              numberOfLines={1}
            >
              Lexyvoz
            </ThemedText>
          </Pressable>
        ),
        headerLeft: () => (
          <Pressable onPress={onHeaderLeft} style={{ marginLeft: 15, marginRight: 5 }} hitSlop={10}>
            {pathname === '/admin'
              ? <Image source={avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
              : <Ionicons name="arrow-back-outline" size={24} color={ACCENT} />
            }
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={goAdminHome} style={{ marginRight: 15 }} hitSlop={10}>
            <Ionicons name="home-outline" size={24} color={ACCENT} />
          </Pressable>
        ),
      }}
    >
      {/* Solo personalizo /admin (index). El resto (users/kits/settings) se generan solos. */}
      <Drawer.Screen name="admin" options={{ title: '' }} />
    </Drawer>
  );
}
