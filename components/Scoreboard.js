import { Text, View, Pressable } from 'react-native';
import styles from '../style/style';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../style/style';
import { useState } from 'react';


export default Scoreboard = () => {
    const [scoreboard, setScoreboard] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerPoints, setPlayerPoints] = useState(0);
    
    const ClearPoints = () => {
        if (scoreboard.length > 0 === 'Scoreboard is empty') {
            setScoreboard([]);
        }
    }


    const topData = [
        { player: 'Sari', points: 150 },
        { player: 'Matti', points: 100 },
        { player: 'Teppo', points: 50 },
        { player: 'Maija', points: 40 },
        { player: 'Liisa', points: 30 },
    ];



    return (
        <View >
            <MaterialIcons name="view-list" size={50} color="black" style={style.icon} />
            <Text style={style.header2}>TOP 5</Text>
            <Text style={style.text}>1. {topData[0].player} {topData[0].points} points</Text>
            <Text style={style.text}>2. {topData[1].player} {topData[1].points} points</Text>
            <Text style={style.text}>3. {topData[2].player} {topData[2].points} points</Text>
            <Text style={style.text}>4. {topData[3].player} {topData[3].points} points</Text>
            <Text style={style.text}>5. {topData[4].player} {topData[4].points} points</Text>
            <Pressable
                onPress={() => ClearPoints(true)}
                style={style.button}>
                <Text style={style.buttonText}>Clear Scoreboard</Text>
            </Pressable>
        </View>
    );
}