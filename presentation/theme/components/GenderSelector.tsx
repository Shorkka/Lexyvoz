// GenderSelector.tsx
import React from 'react';
import { View, Platform, useWindowDimensions, ScrollView } from 'react-native';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import { ThemedText } from './ThemedText';

interface Props {
  selected: string;                 // ← string (no boolean)
  onSelect: (value: string) => void;
  showError?: boolean;
}

const GenderSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const shouldUseHorizontalScroll = !isWeb && width < 500; // umbral para móviles angostos

  const OPTIONS = ['Masculino', 'Femenino', 'Otro'];

  return (
    <>
      <ThemedText>Género</ThemedText>

      {shouldUseHorizontalScroll ? (
        // Móviles: fila con scroll horizontal
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 4,
            paddingRight: 8,
            alignItems: 'center',
          }}
        >
          {OPTIONS.map((gender, idx) => (
            <View key={gender} style={{ marginRight: idx === OPTIONS.length - 1 ? 0 : 12 }}>
              <RadioButton
                label={gender}
                value={gender}
                selected={selected === gender}
                onPress={onSelect}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        // Web/escritorios: layout responsive sin scroll
        <View
          style={{
            flexDirection: Platform.select({
              web: width < 600 ? 'column' : 'row',
              default: 'row',
            }),
            justifyContent: width < 500 ? 'flex-start' : 'space-around',
            gap: 12, // si tu RN no soporta gap, cambia por margins en cada item
            alignItems: 'center',
          }}
        >
          {OPTIONS.map((gender) => (
            <RadioButton
              key={gender}
              label={gender}
              value={gender}
              selected={selected === gender}
              onPress={onSelect}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default GenderSelector;
