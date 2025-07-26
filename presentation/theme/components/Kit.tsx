import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';

interface KitProps {
  kitNumber: number;
  isCompleted?: boolean;
  onPress?: () => void;
  showPlayButton?: boolean;
}

const Kit = ({ kitNumber, isCompleted = false, onPress, showPlayButton = false }: KitProps) => {
  const cardColor = isCompleted ? '#E5E7EB' : '#FFFFFF';
  const textColor = isCompleted ? '#6B7280' : '#374151';
  const borderColor = isCompleted ? '#D1D5DB' : '#FB923C';

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      minWidth: Platform.select({
        web: 80,
        default: 70,
      }),
      maxWidth: Platform.select({
        web: 100,
        default: 90,
      }),
    },
    kitCard: {
      backgroundColor: cardColor,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: borderColor,
      elevation: 3,
      minHeight: 50,
    },
    playButtonContainer: {
      marginTop: 8,
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.kitCard,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={onPress}
      >
        <ThemedText 
          style={{ color: textColor, fontSize: 14, fontWeight: 'bold' }}
        >
          Kit {kitNumber}
        </ThemedText>
      </Pressable>
      {showPlayButton && (
        <View style={styles.playButtonContainer}>
          <ThemedButton
            widthWeb={0.08}
            widthAndroid={0.15}
            onPress={onPress}
          >
            JUGAR
          </ThemedButton>
        </View>
      )}
    </View>
  );
};

export default Kit;
