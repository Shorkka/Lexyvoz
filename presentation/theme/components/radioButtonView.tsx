// radioButtonView.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface RadioButtonProps {
  value: string;
  label: string;
  description?: string;
  selected: boolean;
  onPress: (value: string) => void;
}

const RadioButton = ({ value, label, description, selected, onPress }: RadioButtonProps) => {
  const handleOnPress = () => onPress(value);

  return (
    <Pressable onPress={handleOnPress}>
      <View style={styles.wrap}>
        <Dot selected={selected} />
        <View>
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
};

interface DotProps { selected: boolean; }
const Dot = ({ selected }: DotProps) => (
  <View style={styles.radio}>
    <View style={[styles.dot, { backgroundColor: selected ? '#FF7A00' : 'transparent' }]} />
  </View>
);

export default RadioButton;

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 5, gap: 10 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#FF7A00', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },
  label: { fontSize: 16, color: '#FF7A00', fontFamily: 'KanitRegular' },
  labelSelected: { fontWeight: 'bold' },
  description: { fontSize: 14, color: '#EEE', fontFamily: 'KanitRegular' },
});
