import { View, TextInputProps, StyleSheet, TextInput} from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '../hooks/useThemeColor';
interface Props extends TextInputProps{
    icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedTextInput = ({icon, ...rest}: Props) => {
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'secondaryText');  

    const [isActrive, setIsActrive] = useState(false)
    const inputRef = useRef<TextInput>(null)
  return (
    <View style = {{
      ...styles.border,
      // TODOS cambiar si tiene el foco el input
      borderColor: isActrive ? primaryColor : '#ccc',
    }}
    onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={isActrive ? primaryColor : textColor}
          style = {{marginRight: 10}}
        />
      )}
      <TextInput
        {...rest}
        ref = {inputRef}
        
        placeholderTextColor={placeholderColor}
        onFocus={() => setIsActrive(true)}
        onBlur={() =>  setIsActrive(false)}
        style = {{
          flex: 1,
          color: textColor,
          marginRight: 10,
        }}
        />
    </View>
  )
}

export default ThemedTextInput;

const styles = StyleSheet.create({
  border:{
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e7'
  }
})