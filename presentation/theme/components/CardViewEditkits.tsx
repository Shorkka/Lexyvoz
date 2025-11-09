import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import KitScrollView from './KitScrollView';
import ThemedBackground from './ThemedBackground';
import ThemedButton from './ThemedButton';

interface Props {
  isAsigning?: boolean;
  paciente_id?: number;
  kitId?: number;
  /** Máximo alto disponible para el área scrolleable de la lista */
  maxHeight?: number;
}

const CardViewEditkits = ({ isAsigning = false, maxHeight }: Props) => {
  const { height } = useWindowDimensions();

  const handleAddPress = () => {
    if (!isAsigning) { /* opcional */ }
    router.push('/(app)/(doctor)/(stack)/kits/createKit');
  };

  // Fallback: si no nos pasan maxHeight, usa 45% de alto de pantalla aprox.
  const computedMax = maxHeight ?? Math.floor(height * 0.45);

  return (
    <View style={{ width: '100%', alignSelf: 'stretch' }}>
      <ThemedBackground style={styles.background}>
        {/* Área scrolleable limitada por maxHeight (y con un mínimo para no verse “cortado”) */}
        <View
          style={[
            styles.listContainer,
            {
              maxHeight: computedMax,
              minHeight: 160,
              flexGrow: 0,
              overflow: 'hidden',
            },
          ]}
        >
          <KitScrollView />
        </View>

        {/* Botón al fondo del card (no absolute) */}
        <View style={styles.fixedButtonContainer}>
          <ThemedButton style={styles.buttonContainer} onPress={handleAddPress}>
            +
          </ThemedButton>
        </View>
      </ThemedBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: 12,
    padding: 10,
    // importante: que el card se estire en su contenedor y no cree stacking raro
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 0,
  },
  listContainer: {
    marginBottom: 10,
  },
  fixedButtonContainer: { marginTop: 10 },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#ee7200',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 2 },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
      },
    }),
  },
});

export default CardViewEditkits;
