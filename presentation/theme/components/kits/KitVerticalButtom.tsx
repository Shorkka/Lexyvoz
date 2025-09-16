import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { EjerciciosKits } from '@/core/auth/interface/kits';
import { ThemedText } from '../ThemedText';

interface Props{
  title?: string;
  kits: EjerciciosKits[];
}


const MoviesHorizontalList = ({title, kits}: Props) => {
  const isLoading = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      isLoading.current = false;
    }, 200)
  }, [kits])

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if( isLoading.current) return;

      const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

      const isEndReached = (contentOffset.x + layoutMeasurement.width + 600) >= contentSize.width;


      if ( !isEndReached )return;

      isLoading.current = true;

  }
  return (
    <View>
      {
        title && (
          <ThemedText type="title" style={{ marginLeft: 10, marginBottom: 10 }}>
            {title}
          </ThemedText>
        )
      }

      <FlatList
        data={kits}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.kitId}-${i}`}
        renderItem={({item}) => (
          <ThemedText type="subtitle" style={{ marginLeft: 10, marginBottom: 10 }}>
            {item.ejercicioId}
          </ThemedText>
        )}
      onScroll={onScroll}
      />
    </View>
  )
}

export default MoviesHorizontalList