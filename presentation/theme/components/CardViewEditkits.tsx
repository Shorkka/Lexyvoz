import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ThemedBackground from './ThemedBackground';
import ThemedButton from './ThemedButton';
import { router } from 'expo-router';
import KitScrollView from './KitScrollView';

interface Props{
  isAsigning?: boolean;
  paciente_id?: number;
  kitId?: number
}

const CardViewEditkits = ({isAsigning= false}: Props) => {
 
    const handleAddPress = () => {
      if(!isAsigning){
          
        }
      router.push('/(app)/(doctor)/(stack)/kits/createKit');
    };

  return (
    <View style={styles.container}>
      <ThemedBackground
        justifyContent="center"
        height={'100%'}
      >
          <KitScrollView/>
          <ThemedButton style={styles.buttonContainer} onPress={handleAddPress}>
            +
          </ThemedButton>
      </ThemedBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%', 
    width: '100%',
  },
  background: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    bottom: 10,
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