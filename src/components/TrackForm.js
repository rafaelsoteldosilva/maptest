import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
    Pressable
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Input } from 'react-native-elements';
import { LocationContext } from '../context/LocationContext';
import useStateAsync from '../hooks/useStateAsync'
import useLocation from '../hooks/useLocation';

const TrackForm = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [recording, setRecording] = useStateAsync(false, false);

    const { setTrackName, startRecording, stopRecording, addLocation } = useContext(
        LocationContext
    );

    const [
        locationSubscriber,
        startWatchingForeground,
        stopWatchingForeground,
        errorMessage
    ] = useLocation(addLocation);

    const toggleRecording = () => {
        if (recording.current) {
            setRecording(false);
            stopRecording();
        } else {
            setRecording(true);
            startRecording();
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (recording.current) {
                startWatchingForeground();
                startRecording()
            }

            return () => {
                if (recording.current) {
                    stopWatchingForeground();
                    stopRecording()
                }
            };
        }, [])
    );

    return (
        <View>
            <Pressable
                onPress={toggleRecording}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'blue' : '#2196F3'
                    },
                    styles.secondButton
                ]}
            >
                <Text style={styles.buttonText}>
                    {recording.current ? 'Stop Recording' : 'Start Recording'}
                </Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    secondButton: {
        borderRadius: 8,
        padding: 6,
        marginLeft: 5,
        width: '50%',
        marginLeft: 155,
        marginTop: -31,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white'
    }
});

export default TrackForm;
