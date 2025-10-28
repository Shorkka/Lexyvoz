// GenderSelector.tsx
import React from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import RadioButton from '@/presentation/theme/components/radioButtonView';
import { ThemedText } from './ThemedText';

interface Props {
  selected: string;                 // ← string (no boolean)
  onSelect: (value: string) => void;
  showError?: boolean;
}

const GenderSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <ThemedText>Género</ThemedText>

      <View
        style={{
          flexDirection: Platform.select({
            web: width < 600 ? 'column' : 'row',
            default: width < 300 ? 'column' : 'row',
          }),
          justifyContent: width < 500 ? 'flex-start' : 'space-around',
          gap: 12,
        }}
      >
        {['Masculino', 'Femenino', 'Otro'].map((gender) => (
          <RadioButton
            key={gender}
            label={gender}
            value={gender}
            selected={selected === gender} // ← aquí sí es boolean
            onPress={onSelect}
          />
        ))}
      </View>
    </>
  );
};

export default GenderSelector;
