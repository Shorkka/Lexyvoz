import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedText } from './ThemedText';

interface ThemedDropdownProps {
  data: { label: string; value: string }[];
  value: string | null;
  onChangeValue: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: string;
  searchPlaceholder?: string;
  search?: boolean;
  error?: boolean;
}

const ThemedDropdown = ({
  data,
  value,
  onChangeValue,
  placeholder = 'Seleccionar...',
  label,
  icon = 'down',
  searchPlaceholder = 'Buscar...',
  search = false,
}: ThemedDropdownProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = 'grey';

  const renderLabel = () => {
    if (label && (value || isFocus)) {
      return (
        <ThemedText style={[styles.label, { backgroundColor, color: isFocus ? '#007AFF' : textColor }]}>
          {label}
        </ThemedText>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          { borderColor: isFocus ? '#007AFF' : borderColor, backgroundColor }
        ]}
        placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: textColor }]}
        inputSearchStyle={[styles.inputSearchStyle, { color: textColor }]}
        iconStyle={styles.iconStyle}
        data={data}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChangeValue(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? '#007AFF' : textColor}
            name={icon as any}
            size={20}
          />
        )}
      />
    </View>
  );
};

export default ThemedDropdown;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    position: 'absolute',
    left: 14,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
