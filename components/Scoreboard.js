import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';


export default function Scoreboard({ navigation }) {

    const [topScores, setTopScores] = useState([]);
    const [status, setStatus] = useState('Scoreboard is empty');

    useEffect(() => {
        getTopScores();
    }, []);

    //Function to fetch top scores from AsyncStorage
    const getTopScores = async () => {
        try {
            const scores = await AsyncStorage.getItem('@scores');
            if (scores) {
                const parsedScores = JSON.parse(scores);
                if (Array.isArray(parsedScores)) {
                    // Create a map to store the top scores for each player
                    const topScoresMap = new Map();
                    parsedScores.forEach(score => {
                        const { player, points } = score;
                        if (!topScoresMap.has(player)) {
                            topScoresMap.set(player, []);
                        }
                        const playerScores = topScoresMap.get(player);
                        playerScores.push(score);
                        // Sort scores for each player by points in descending order
                        playerScores.sort((a, b) => b.points - a.points);
                        // Keep only the top 5 scores for each player
                        topScoresMap.set(player, playerScores.slice(0, 5));
                    });
                    // Flatten the map values to get the top 5 scores overall
                    const topScoresArray = Array.from(topScoresMap.values()).flat();
                    // Sort the overall top scores by points in descending order
                    topScoresArray.sort((a, b) => b.points - a.points);
                    // Keep only the top 5 scores overall
                    const top5Scores = topScoresArray.slice(0, 5);
                    setTopScores(top5Scores);
                } else {
                    console.error('Error fetching scores: Scores is not an array');
                }
            }
        } catch (error) {
            console.error('Error fetching scores: ', error);
        }
    };



    //Function to clear the scoreboard
    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem('@scores');
            setTopScores([]);
        } catch (error) {
            console.error('Error clearing scoreboard: ', error);
        }
    };

    // Use useFocusEffect to refetch top scores when component gains focus
    useFocusEffect(
        React.useCallback(() => {
            getTopScores();
        }, [])
    );

    return (
        <ScrollView>
            <View>

                <MaterialIcons name="view-list" size={50} color="black" style={style.icon} />
                <Text style={style.text6}>Top 5 Scores</Text>
                {topScores.length === 0 ? (
                    <Text style={style.text}>{status}</Text>
                ) : null}

                <DataTable style={style.dataRow}>
                    {topScores.map((score, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={style.dataCellNum}>{index + 1}. </DataTable.Cell>
                            <DataTable.Cell style={style.dataCellName}>{score.player}</DataTable.Cell>
                            <DataTable.Cell style={style.dataCell}>{score.date}</DataTable.Cell>
                            <DataTable.Cell style={style.dataCell} numeric>{score.points}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
                <Pressable onPress={clearScoreboard} style={style.button}>
                    <Text style={style.buttonText}>Clear Scoreboard</Text>
                </Pressable>
            </View>
        </ScrollView>
    );


}
