/* eslint-disable prettier/prettier */
//import liraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {ProgressBar} from '@react-native-community/progress-bar-android';

// create a component
const loading1 = () => {
    return (
        <View style={styles.container222}>
            <Text>Loading Please Wait...</Text>
            <ProgressBar width={70}/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container222: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1,
        backgroundColor:'rgba(0,0,0,0.1)',
    },
});

//make this component available to the app
export default loading1;
