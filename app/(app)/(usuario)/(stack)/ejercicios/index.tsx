import { KeyboardAvoidingView, Platform, SafeAreaView, View, StyleSheet} from 'react-native';
import React from 'react';
import AuthGuard from '@/presentation/theme/components/AuthGuard';
import ThemedBackground from '@/presentation/theme/components/ThemedBackground';
import RenderKits from '@/presentation/theme/components/RenderKits';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import { useKitsStore } from '@/presentation/kits/store/useKitsStore';

const EjerciciosKits = () => {
  const { kitsQuery } = useKitsStore();
  const [kits, setKits] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  
  React.useEffect(() => {
    if (Array.isArray(kitsQuery.data)) {
      setKits(kitsQuery.data);
    } else {
      setKits([]);
    }
    setCurrentPage(0);
  }, [kitsQuery.data]);

  const PAGE_SIZE = 6;
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleKits = kits.slice(startIndex, endIndex);
  const totalPages = Math.ceil(kits.length / PAGE_SIZE);
  
  const canGoBack = currentPage > 0;
  const canGoForward = endIndex < kits.length;

  const goToNextPage = () => canGoForward && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => canGoBack && setCurrentPage(currentPage - 1);

return (
    <AuthGuard>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ThemedBackground 
            fullHeight 
            backgroundColor="#fba557" 
            style={{ 
              width: '90%',
              marginHorizontal: '5%',
              borderRadius: 20, 
              padding: 20,
              marginVertical: 20,
            }}
          >
            <View style={{ flex: 1, width: '100%' }}>
              <RenderKits 
                currentPage={currentPage}
                visibleKits={visibleKits}
                totalPages={totalPages}
              />
            </View>

            {/* Botones de navegación */}
            <View style={styles.navigationContainer}>
              <ThemedButton 
                onPress={goToPrevPage} 
                disabled={!canGoBack}
                style={[
                  styles.navButton,
                  { backgroundColor: !canGoBack ? '#cccccc' : '#ee7200' }
                ]}
              >
                <Ionicons
                  name="play-back-outline"
                  size={24} 
                  color="white"
                />
              </ThemedButton>

              <ThemedButton 
                onPress={goToNextPage} 
                disabled={!canGoForward}
                style={[
                  styles.navButton,
                  { backgroundColor: !canGoForward ? '#cccccc' : '#ee7200' }
                ]}
              >
                <Ionicons
                  name="play-forward-outline"
                  size={24} 
                  color="white"
                />
              </ThemedButton>
            </View>
          </ThemedBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  navButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10, 
    padding: 10,
    width: 60,
    height: 60,
  },
});

export default EjerciciosKits;