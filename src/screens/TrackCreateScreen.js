import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
    Platform,
    Pressable
} from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';

import Map from '../components/Map';
import TrackForm from '../components/TrackForm';
import { startInterval, stopInterval } from '../mockMovement';
import { LocationContext } from '../context/LocationContext';
import useLocation from '../hooks/useLocation';
import useStateAsync from '../hooks/useStateAsync';

const TrackCreateScreen = ({ navigation, route }) => {
    const [intervalId, setIntervalId] = useState(0);
    const [drawLineSw, setDrawLineSw] = useState(false)
    const [moving, setMoving] = useState(false);
    const [tracking, setTracking] = useState(false);
    const [steps, setSteps] = useStateAsync(0)

    const { addLocation } = useContext(LocationContext);

    function toggleDrawLineSw() {
        setDrawLineSw(!drawLineSw)
    }

    const oneMoreStep = () => {
        setSteps(steps.current + 1)
    }

    const stepNumber = () => {
        return steps.current
    }

    const [
        locationSubscriber,
        startWatchingForeground,
        stopWatchingForeground,
        errorMessage
    ] = useLocation(addLocation);

    const toggleMoving = () => {
        if (moving) {
            stopInterval(intervalId);
            setMoving(false);
        } else {
            setIntervalId(startInterval(oneMoreStep, stepNumber, addLocation));
            setMoving(true);
        }
    };

    const toggleTracking = () => {
        if (tracking) {
            startWatchingForeground();
            setTracking(false)
        } else {
            stopWatchingForeground();
            setTracking(true)
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={toggleMoving}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'blue' : '#2196F3'
                    },
                    styles.firstButton
                ]}
            >
                <Text style={styles.buttonText}>
                    {moving ? 'Stop Moving' : 'Start Moving'}
                </Text>
            </Pressable>
            <Pressable
                onPress={toggleTracking}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'blue' : '#2196F3'
                    },
                    styles.firstButton, styles.secondButton,
                ]}
            >
                <Text style={styles.buttonText}>
                    {tracking ? 'Stop Tracking' : 'Start Tracking'}
                </Text>
            </Pressable>
            <Pressable
                onPress={toggleDrawLineSw}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'blue' : '#2196F3'
                    },
                    styles.firstButton, styles.thirdButton,
                ]}
            >
                <Text style={styles.buttonText}>
                    Draw
                </Text>
            </Pressable>
            <Map drawLine={drawLineSw}/>
            <TrackForm />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        justifyContent: 'center',

    },
    firstButton: {
        borderRadius: 8,
        padding: 6,
        marginLeft: 5,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondButton: {
        marginLeft: 120,
        marginTop: -31,
    },
    thirdButton: {
        marginLeft: 235,
        marginTop: -31,
    },
    buttonText: {
        color: 'white'
    },
});

export default TrackCreateScreen;
