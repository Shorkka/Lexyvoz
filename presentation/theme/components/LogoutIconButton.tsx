import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useThemeColor } from '../hooks/useThemeColor';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

const LogoutIconButton = () => {
    const primaryColor = useThemeColor({}, 'primary');
    const { logout} = useAuthStore();
  return (
    <TouchableOpacity
    style={{
        marginRight: 10,
    }}
    onPress={() => logout()}
    >
        <Ionicons
            name="log-out-outline"
            size={24}
            color={primaryColor}
            style={{marginHorizontal: 5}}
            onPress={() => logout()}/>
    </TouchableOpacity>
  )
}

export default LogoutIconButton