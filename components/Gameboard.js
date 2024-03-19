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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { horizontalScale, moderateScale, verticalScale } from '../style/Metrics';

let board = [];

export default Gameboard = ({ route }) => {

    const [gameOngoing, setGameOngoing] = useState(false);
    const [throwsLeft, setThrowsLeft] = useState(18);
    const [totalPoints, setTotalPoints] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [dicesThrown, setDicesThrown] = useState(false);
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [roundCount, setRoundCount] = useState(0);


    // Function to render the bonus points on the screen
    const renderBonusPoints = () => {
        const bonusPoints = calculateBonusPoints();
        return <Text style={style.text3}>You need {bonusPoints} more points to get the bonus</Text>;
    };


    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);


    const saveScore = async (player, points) => {
        try {
            const scores = await AsyncStorage.getItem('@scores');
            let topScores = scores ? JSON.parse(scores) : [];
            const currentDate = new Date().toLocaleString(); // Get the current date and time
            topScores.push({ player: player, points: points, date: currentDate });
            topScores.sort((a, b) => b.points - a.points);
            await AsyncStorage.setItem('@scores', JSON.stringify(topScores));
        } catch (error) {
            console.error('Error saving score: ', error);
        }
    };


    useEffect(() => {
        if (throwsLeft === 0) {
            handleGameEnd();
        }
    });


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
        );
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
        /*else {
            setStatus('You have to throw dices first');//---------------------------------------------------Tämä teksti EI näy
        }*/
    }

    function getDiceColor(i) {
        return selectedDices[i] ? '#FEECE2' : '#FFBE98';
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            if (!selectedDicePoints[i] && dicePointsTotal[i] === 0) {
                let selectedPoints = [...selectedDicePoints];
                let points = [...dicePointsTotal];
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
                selectedPoints.fill(false);
                selectedPoints[i] = true;
                setDicePointsTotal(points);
                setSelectedDicePoints(selectedPoints);
            } else {
                setStatus('You already selected points for this spot.');
            }
        } else {
            setStatus('Throw 3 times before setting points.');
        }
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }


    const throwDices = () => {
        if (gameEndStatus) {
            let finalPoints = getDicePointsTotal();
            saveScore(playerName, finalPoints);
            startNewGame();
        }
        if (nbrOfThrowsLeft === 0) {
            if (!gameEndStatus) {
                const pointsSelected = selectedDicePoints.some(selected => selected);
                if (pointsSelected) {
                    setNbrOfThrowsLeft(NBR_OF_THROWS);
                    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
                    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
                    const newDiceSpots = Array.from({ length: NBR_OF_DICES }, () => Math.floor(Math.random() * 6) + 1);
                    setDiceSpots(newDiceSpots);
                    setDicesThrown(true); // Set dicesThrown to true after throwing dices
                } else {
                    setStatus('Select points before throwing dices.');
                }
            } else {
                //setGameEndStatus(false);
                //setNbrOfThrowsLeft(NBR_OF_THROWS);
                //setPlayerName('');
            }
        } else {
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
            setStatus('Select and throw dices again.');
            setDicesThrown(true); // Set dicesThrown to true after throwing dices
            setThrowsLeft(throwsLeft - 1);
        }
    };


    function getDicePointsTotal() {
        let total = 0;
        for (let i = 0; i < MAX_SPOT; i++) {
            total += dicePointsTotal[i];
        }
        if (total >= BONUS_POINTS_LIMIT) {
            total += BONUS_POINTS;
        }
        return total;
    }


    function getDicePointsColor(i) {
        if (selectedDicePoints[i]) {
            return '#FEECE2';
        } else {
            return '#FFBE98';
        }
    }

    const calculateUpperSectionTotal = () => {
        let total = 0;
        for (let i = 0; i < 6; i++) {
            total += dicePointsTotal[i];
        }
        return total;
    };

    const calculateBonusPoints = () => {
        const upperSectionTotal = calculateUpperSectionTotal();
        const zero = BONUS_POINTS_LIMIT - upperSectionTotal
        if (zero > 0) {
            return zero;
        } else {
            return 0;
        }
    };

    const calculateBonusPoints2 = () => {
        const upperSectionTotal = calculateUpperSectionTotal();
        return upperSectionTotal >= BONUS_POINTS_LIMIT ? BONUS_POINTS : 0;
    };

    const renderBonusPointsMessage = () => {
        if (gameEndStatus) {
            const totalPointsWithBonus = calculateAndAddBonusPoints();
            if (totalPointsWithBonus >= BONUS_POINTS_LIMIT) {
                return <Text style={style.text}>Congrats! You earned {BONUS_POINTS} bonus points!</Text>;
            }
        }
    };

    const calculateAndAddBonusPoints = () => {
        const bonusPoints = calculateBonusPoints2();
        const totalPointsWithBonus = getDicePointsTotal() + bonusPoints;
        return totalPointsWithBonus;
    };

    const handleGameEnd = () => {
        setStatus('Choose last points and press button one last time.');
        setGameEndStatus(true);
    };


    const startNewGame = () => {
        setThrowsLeft(18);
        setTotalPoints(0);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('Throw dices.');
        setGameEndStatus(false);
        setDicesThrown(false);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setRoundCount(0);
        if (!playerName) {
            setPlayerName(true);
        }
        setGameOngoing(true);
    };


    return (
        <>
            <ScrollView>
                <Header />
                <View >
                    {dicesThrown ? (
                        <Container fluid>
                            <Row>{dicesRow}</Row>
                        </Container>
                    ) : (
                        <FontAwesome6 name="dice" size={50} color="black" style={style.icon} />
                    )}
                    <Text style={style.text}>{status}</Text>
                    <Text style={style.text2}>Throws left: {nbrOfThrowsLeft}</Text>

                    <Container fluid >
                        <Row>{pointsRow}</Row>
                    </Container>
                    <Container fluid>
                        <Row>{pointsToSelectRow}</Row>
                    </Container>
                    <Pressable
                        onPress={() => throwDices()}
                        style={style.button}>
                        <Text style={style.buttonText}>THROW DICES</Text>
                    </Pressable>

                    <View style={style.viewInfo}>
                        <Text style={style.textTotal}>Total: {getDicePointsTotal()}</Text>
                        {gameEndStatus && renderBonusPointsMessage()}
                        {renderBonusPoints()}
                    </View>
                    <Text style={style.text4}>Player: {playerName}</Text>
                </View>
                <Footer />
            </ScrollView>
        </>
    );
}