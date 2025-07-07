import { Pressable,Text,  StyleSheet, View, PressableProps, useWindowDimensions, Platform } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends PressableProps{
    icon?: keyof typeof Ionicons.glyphMap;
    children?: string;
    widthWeb?: number;
    widthAndroid?: number;
}


const ThemedButton = ({children, widthWeb = 0, widthAndroid = 0, icon, ...rest }: Props) => {
    const {width} = useWindowDimensions();
    const resto= () => {
        if (widthAndroid === 0 && widthWeb === 0){
            return null
        }
        return   {width: Platform.select({ 
                    web:width*widthWeb,
                    default:width*widthAndroid})}
    }
    const primaryColor = useThemeColor({}, 'primary');
    return (
    <View>
        <Pressable
            style={({pressed}) => [
                {
                    backgroundColor: pressed ? primaryColor + '90' : primaryColor,
                }, 
                resto(),
                styles.button,
               
            ]}
            
            {...rest}
        >
      <Text style = {{color: 'white'}}>{children}</Text>
        {icon && (
        <Ionicons
            name={icon}
            size={24}
            color="white"
            style={{alignItems: 'flex-end', left: Platform.select({ web: width *0.08, default: width*0.2})}}/>
        )}
        </Pressable>
    </View>
    
  )
}

export default ThemedButton


const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',

    },

})