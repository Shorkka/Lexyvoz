import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

const ThemedTextInput = ({ icon, rightIcon, onRightIconPress, error, errorMessage, label, value, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'secondaryText');
  const errorColor = '#ffffff';

  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Floating label animation
  const [labelAnim] = useState(new Animated.Value((value ? 1 : 0)));
  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isActive || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isActive, value, labelAnim]);

  const borderColor = error
    ? errorColor
    : isActive
    ? 'white'
    : '#ccc';

  return (
    <View style={{ marginTop: 10 }}>
      <View
        style={{
          ...styles.border,
          borderColor,
        }}
        onTouchStart={() => inputRef.current?.focus()}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={isActive ? primaryColor : textColor}
            style={{ marginRight: 10 }}
          />
        )}
        
        <View style={{ flex: 1, position: 'relative', justifyContent: 'center' }}>
          {/* Floating label */}
          {label && (
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  color: error ? errorColor : isActive ? primaryColor : placeholderColor,
                  top: labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Platform.OS === 'ios' ? 14 : 16, -8], // Ajuste específico para iOS
                  }),
                  fontSize: labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12],
                  }),
                  left: 0,
                  backgroundColor: '#fff3e7',
                  paddingHorizontal: 4,
                  zIndex: 1,
                },
              ]}
              pointerEvents="none"
            >
              {label}
            </Animated.Text>
          )}
          
          <TextInput 
            {...rest}
            value={value}
            ref={inputRef}
            placeholder={label ? undefined : rest.placeholder}
            placeholderTextColor={placeholderColor}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            style={{
              color: textColor,
              borderWidth: 0,
              paddingTop: label ? (Platform.OS === 'ios' ? 18 : 16) : 0, // Ajuste específico para iOS
              paddingBottom: Platform.OS === 'ios' ? 2 : 0, // Padding inferior para iOS
              fontSize: 16,
              textAlign: 'left',
              textAlignVertical: 'center', // Solo funciona en Android
              ...Platform.select({
                web: {
                  outlineWidth: 0,
                  outlineColor: 'transparent',
                },
                ios: {
                  lineHeight: 20, // Ayuda con la alineación vertical en iOS
                },
              }),
            }}
          />
        </View>
        
        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={{ padding: 4 }}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={isActive ? primaryColor : textColor}
            />
          </TouchableOpacity>
        )}
        
        {/* Error icon */}
        {error && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={errorColor}
            style={{ marginLeft: 4, marginRight: 4 }}
          />
        )}
      </View>
      
      {/* Error message */}
      {error && errorMessage && (
        <Text
          style={[
            styles.errorMessage,
            icon ? { marginLeft: 34 } : { marginLeft: 8 },
            { color: errorColor },
          ]}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center', // Esto centra verticalmente todos los elementos
    backgroundColor: '#fff3e7',
    minHeight: 48,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 0,
    fontWeight: '400',
  },
});