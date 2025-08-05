import {Modal, View, Text } from 'react-native'
import React from 'react'
import { useKitsStore } from '@/presentation/kits/store/useKitsStore';

const RenderKits = () => {
    const {obtenerKits} = useKitsStore();
    const kits = await obtenerKits();
  return (
    <View>
        {kits.map((kit) => (
            <View key={kit.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{kit.nombre}</Text>
            <Text>{kit.descripcion}</Text>
            <Text>Creado por: {kit.creado_por}</Text>
            </View>
        ))}
    </View>
  )
}

export default RenderKits