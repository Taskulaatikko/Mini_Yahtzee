import { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS,
} from '../constants/Game';
import style from '../style/style';
import { SimpleLineIcons } from '@expo/vector-icons';



export default function Home({ navigation }) {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header style={style.header} />
            <View >
                {!hasPlayerName ?
                    <>
                        <Text style={style.header2}>
                            Enter your playername </Text>
                        <TextInput onChangeText={setPlayerName} autoFocus={true} style={style.textinput}></TextInput>
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}
                            style={style.button}>
                            <Text style={style.buttonText}>OK</Text>
                        </Pressable>
                    </>

                    :
                    <>
                        <SimpleLineIcons name="info" size={50} color="black" style={style.icon}/>
                        <Text style={style.header2}>Rules of the game</Text>
                        <Text multiline='true' style={style.text}>
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS}
                            throws. After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.
                        </Text>
                        <Text multiline='true' style={style.text}>POINTS: After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from
                            {MIN_SPOT} to {MAX_SPOT} again. </Text>

                        <Text multiline='true' style={style.text}>GOAL: To get points as much as possible.
                            {BONUS_POINTS_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS}
                            points more. </Text>
                        <Text style={style.text2}>Good luck, {playerName}</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Gameboard', { player: playerName })}
                            style={style.button2}>
                            <Text style={style.buttonText}>PLAY</Text>
                        </Pressable>
                    </>
                }
            </View>
            <Footer></Footer>
        </>
    )
}