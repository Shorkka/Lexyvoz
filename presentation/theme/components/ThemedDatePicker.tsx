import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props {
  label?: string;
  value: Date;
  error?: boolean;
  onChange: (date: Date) => void;
}

const ThemedDatePicker = ({ label, value, onChange }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const textColor = useThemeColor({}, 'text');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      
    });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <ThemedText style={{ fontSize: 14, marginBottom: 5 }}>{label}</ThemedText>
      )}
      {Platform.OS === 'web' ? (
      <input
        type="date"
        value={value.toISOString().split('T')[0]}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          onChange(newDate);
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        max={new Date().toISOString().split('T')[0]}
        min="1900-01-01"
        style={{
          width: '100%',
          padding: 15,
          fontSize: 16,
          border: 'none',
          borderBottom: '1px solid grey',
          backgroundColor: 'transparent',
          color: textColor,
          fontFamily: 'inherit',
          outline: 'none',
          cursor: 'pointer',
        }}
      />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingVertical: 15,
              marginBottom: 10,
            }}
          >
            <ThemedText style={{ fontSize: 16 }}>
              {formatDate(value)}
            </ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={value}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  onChange(selectedDate);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </>
      )}
    </View>
  );
};

export default ThemedDatePicker;