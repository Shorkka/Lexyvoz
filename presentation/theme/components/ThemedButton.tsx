import { Pressable,Text,  StyleSheet, View, PressableProps } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends PressableProps{
    icon?: keyof typeof Ionicons.glyphMap;
    children?: string;
}


const ThemedButton = ({children, icon, ...rest }: Props) => {
    const primaryColor = useThemeColor({}, 'primary');
    return (
    <View>
        <Pressable
            style={({pressed}) =>[
                {
                    backgroundColor: pressed ? primaryColor + '90' : primaryColor,
                }, 
                styles.button
            ]}

            {...rest}
        >
      <Text style = {{color: 'white'}}>{children}</Text>
        {icon && (
        <Ionicons
            name={icon}
            size={24}
            color="white"
            style={{marginHorizontal: 5}}/>
        )}
        </Pressable>
    </View>
    
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },

})