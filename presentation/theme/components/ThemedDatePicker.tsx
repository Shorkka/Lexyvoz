import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from './hooks/useThemeColor';
import { ThemedText } from './ThemedText';

interface Props {
  label?: string;
  value: Date;
  error?: boolean;
  onChange: (date: Date) => void;
  style?: any;
}

const ThemedDatePicker = ({ label, value, onChange, error, style }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const textColor = useThemeColor({}, error ? 'error' : 'primary');
  const borderColor = useThemeColor({}, error ? 'error' : 'primary');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View
      style={[
        {
          marginBottom: 20,
          width: '100%',
          maxWidth: 480,
        },
        style,
      ]}
    >
      {label && (
        <ThemedText style={{ fontSize: 14, marginBottom: 5, color: borderColor }}>
          {label}
        </ThemedText>
      )}
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            onChange(newDate);
          }}
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '1px solid',
            borderColor: borderColor,
            borderRadius: 5,
            backgroundColor: '#fff3e7',
            color: textColor,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            marginBottom: 0,
            marginTop: 0,
            transition: 'border-color 0.2s',
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 5,
              backgroundColor: '#fff3e7',
              paddingVertical: 12,
              paddingHorizontal: 12,
              marginBottom: 0,
              marginTop: 0,
              width: '100%',
            }}
            activeOpacity={0.7}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>
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