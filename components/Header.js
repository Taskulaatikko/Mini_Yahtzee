import { Text, View } from 'react-native';
import styles from '../style/style';
import React from 'react';


export default Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Mini-Yahtzee</Text>
        </View>
    );
}