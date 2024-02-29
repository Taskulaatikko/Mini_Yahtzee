import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
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
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import style from '../style/style';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

let board = [];

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [gameEndStatus, setGameEndStatus] = useState(false);

    //are dices selected or not?
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));

    //dice spots (1,2,3,4,5,6) for each dice
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));

    //are dice points selected or not
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    //const [scores, setScores] = useState([]);
    const [bonusPoints, SetBonusPoints] = useState(0);
    //one way to handle with useeffects
    //this one is for passing the player name to the screen
    const getScoreboardDate = () => {
        if (playerName !== '') {
            navigation.navigate('Scoreboard', { player: playerName });
        }
    }
    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
            //getScoreboardDate();
        }

    }, []);



    useEffect(() => {
        if (nbrOfThrowsLeft === 0) {
            let spots = [...diceSpots];
            let selected = [...selectedDices];
            let points = [...dicePointsTotal];
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selected[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                    spots[i] = randomNumber;
                }
            }
            setDiceSpots(spots);
            setStatus('Select your points before next throw');
        }
    }, [nbrOfThrowsLeft]);

    /*useEffect(() => {
        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            let selected = [...selectedDices];
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            for (let i = 0; i < MAX_SPOT; i++) {
                if (selectedPoints[i]) {
                    selectedPoints[i] = false;
                }
            }
            setDicePointsTotal(points);
            setSelectedDices(selected);
            setSelectedDicePoints(selectedPoints);
        }
    }, [gameEndStatus]);*/

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardDate();
        });
        return unsubscribe;
    }, [navigation]);

    //this useEffect is for reading scoeboard from the asyncStorage
    //when user is navigating back to screen (have look at the assigment instructions). trigger here is the
    //navigation for useEfect

    //this useEffect is for handling the gameflow so that the game does not stop too early
    //or not continue after it should not.
    //trigger for here (in teacher solution) is nbrOfThrowsLeft. Another reason for putting the nbrOfThrowsLeft
    const dicesRow = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={'dice' + dice}>
                <Pressable
                    key={'dice' + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key={'dice' + dice}
                        size={50}
                        color={getDiceColor(dice)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }



    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        )
    }


    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable
                    key={"buttonsRow" + diceButton}
                    onPress={() => selectDicePoints(diceButton)}
                >
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}
                    >
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }


    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw dices first');
        }
    }


    function getDiceColor(i) {
        return selectedDices[i] ? '#F8DFD4' : '#C69774';
    }

    //3 taso
    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedDicePoints[i]) {
                selectedPoints.fill(false);
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points.fill(0); // Reset all points
                points[i] = nbrOfDices * (i + 1);
                setDicePointsTotal(points);
            }
            else {
             // Deselect the clicked point
             selectedPoints[i] = false;
             // Reset the points to 0 for the deselected point
             points[i] = 0;
             setDicePointsTotal(points);
            }
            setSelectedDicePoints(selectedPoints);
            return points[i];
        }
        else {
            setStatus('Throw 3 times before setting points.')
        }
    }


    //1 taso. toimii
    /*const selectDicePoints = (i) => {
        let selected = [...selectedDices];
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDices(selected);
        setSelectedDicePoints(selectedPoints);  
        return points[i];
    }*/

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const throwDices = () => {

        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus('Select your points before next throw');
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again.')
    }

    function getDicePointsTotal() {
        let total = 0;
        for (let i = 0; i < MAX_SPOT; i++) {
            if (selectedDicePoints[i]) {
                total += dicePointsTotal[i];
            }
        }
        return total;
    }


    function getDicePointsColor(i) {
        if (selectedDicePoints[i] && !gameEndStatus) {
            return '#F8DFD4';
        }
        else {
            return '#C69774';
        }

    }


    return (
        <>
            <ScrollView>
                <Header />
                <View >


                    <Container fluid>
                        <FontAwesome6 name="dice" size={50} color="black" style={style.icon} />
                        <Row>{dicesRow}</Row>
                    </Container>
                    <Text style={style.text2}>Throws left: {nbrOfThrowsLeft}</Text>
                    <Text style={style.text}>{status}</Text>
                    <Pressable
                        onPress={() => throwDices()}
                        style={style.button}>
                        <Text style={style.buttonText}>THROW DICES</Text>
                    </Pressable>
                    <Text style={style.textTotal}>Total: {getDicePointsTotal()}</Text>
                    <Text style={style.text}>You are {BONUS_POINTS_LIMIT} points away from bonus</Text>

                    <Container fluid>
                        <Row>{pointsRow}</Row>
                    </Container>

                    <Container fluid>
                        <Row>{pointsToSelectRow}</Row>
                    </Container>

                    <Text style={style.text2}>Player: {playerName}</Text>
                </View>
                <Footer />
            </ScrollView>
        </>
    )
}

/*              <Text style={style.text2}>Throw 3 times before setting points.</Text>
                <Text style={style.text2}>Select your points before next throw.</Text>
                <Text style={style.text2}>You already selected points for 1</Text>
                <Text style={style.text2}>Select and throw dices again.</Text>
                <Text style={style.text2}>Game over. All points selected.</Text>
                
                
                <Text style={style.text}>Congrats! Bonus points ... added</Text>
                */