import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import ThemedBackground from './ThemedBackground';
import ThemedButton from './ThemedButton';
import { router } from 'expo-router';
import KitScrollView from './KitScrollView';

interface Props {
  isAsigning?: boolean;
  paciente_id?: number;
  kitId?: number;
}

const CardViewEditkits = ({ isAsigning = false }: Props) => {
  const { height } = useWindowDimensions();

  const handleAddPress = () => {
    if (!isAsigning) {
      // lógica extra si se requiere
    }
    router.push('/(app)/(doctor)/(stack)/kits/createKit');
  };

  return (
    <View>
      <ThemedBackground style={styles.background}>
        {/* Lista scrolleable con altura limitada */}
        <View style={[styles.listContainer, { maxHeight: height * 0.3 }]}>
          <KitScrollView />
        </View>

        {/* Botón fijo al fondo */}
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
  },
  listContainer: {
    marginBottom: 10,
  },
  fixedButtonContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#ee7200',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 4,
      },
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
