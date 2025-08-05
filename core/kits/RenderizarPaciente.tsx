import { View, Text } from 'react-native'
import React from 'react'
interface Props {
  searchText: string; 
}


const RenderizarPaciente = ({searchText}: Props) => {
  return (
    <View>
      <Text>RenderizarPaciente</Text>
      <Text>Texto de búsqueda: {searchText}</Text>
    </View>
  )
}

export default RenderizarPaciente