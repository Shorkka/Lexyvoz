import {Platform } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress'

interface Props {
    widthAndroid?: number;
    widthWeb?: number;
    progress: number;
     color?: string;
}

const ThemedProgressBar: React.FC<Props> = ({ widthAndroid, widthWeb, progress, color }) => {
    return (
        <Progress.Bar
            progress={progress}
            width={Platform.select({
                web: widthWeb,
                default: widthAndroid,
            })}
            color = {color}
            
        />
    )
}

export default ThemedProgressBar
