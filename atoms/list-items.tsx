import React from 'react';
import {StyleSheet} from 'react-native'
import {ListItem} from '@rneui/themed';
import formatters from '../common/formatters';

type GeneratorLiveProps = {
    name: string;
    level: number;
}

export const GeneratorLive:React.FC<GeneratorLiveProps> = ({name, level}) => <ListItem>
   <ListItem.Content style={styles.generatorLiveContainer}>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{formatters.mw(level)}</ListItem.Subtitle>
    </ListItem.Content>
</ListItem>

const styles = StyleSheet.create({
    generatorLiveContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    }
})