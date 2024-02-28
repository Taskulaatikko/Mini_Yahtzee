import { Text, View } from 'react-native';
import styles from '../style/style';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../style/style';

export default Scoreboard = () => {
    return (
        <View >
            <MaterialIcons name="format-list-numbered" size={50} color="black"  style={style.icon}/>
            <Text style={style.header2}>TOP 3</Text>
        </View>
    );
}