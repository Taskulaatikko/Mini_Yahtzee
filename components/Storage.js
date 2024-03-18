/*import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCOREBOARD_KEY } from '../constants/Game';


export const saveScoreboardData = async (data) => {
    try {
        await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving scoreboard data:', error);
    }
};

export const getScoreboardData = async () => {
    try {
        const data = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (data !== null) {
            return JSON.parse(data);
        } else {
            
            return [];
        }
    } catch (error) {
        console.error('Error retrieving scoreboard data:', error);
        return [];
    }
};

export const clearScoreboardData = async () => {
    try {
        await AsyncStorage.removeItem(SCOREBOARD_KEY);
    } catch (error) {
        console.error('Error clearing scoreboard data:', error);
    }
};*/