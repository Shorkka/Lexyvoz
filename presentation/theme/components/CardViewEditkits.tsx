import { useKitsStore } from '@/presentation/kits/store/useKitsStore'
import ThemedBackground from '@/presentation/theme/components/ThemedBackground'
import ThemedButton from '@/presentation/theme/components/ThemedButton'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import KitVerticalButtom from '@/presentation/theme/components/kits/KitVerticalButtom'
import { router } from 'expo-router'
import React from 'react'

const CardViewEditkits = () => {
  const {kitsQuery} = useKitsStore();
  const createKit = () => {
    router.push('/kits/createKit')
  }
  return (
    <ThemedBackground>
      <ThemedButton onPress = {createKit}
       style = {{ backgroundColor: '#c3bfbf', width: '100%', 
       height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
        <KitVerticalButtom
        kits = {kitsQuery.data ?? []}/>
        <ThemedText style = {{color: 'white'}}>+</ThemedText>
      </ThemedButton>
    </ThemedBackground>
  )
}

export default CardViewEditkits