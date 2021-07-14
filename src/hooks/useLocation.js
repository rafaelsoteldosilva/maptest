import { useState, useEffect, useCallback } from 'react';

import * as Location from 'expo-location';

const useLocation = (addLocationCallback) => {
    const [locationSubscriber, setLocationSubscriber] = useState(null);
    const [errorMessage, setErrorMessage] = useState('')

    const startWatchingForeground = useCallback(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied');
            return;
        }

        let locSubscriber = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 20,
                distanceInterval: 10
            },
            newLocation => {
                addLocationCallback(newLocation);
            }
        );

        setLocationSubscriber(locSubscriber);
    }, []);

    const stopWatchingForeground = useCallback(() => {
        if (locationSubscriber) locationSubscriber.remove();
        setLocationSubscriber(null)
    }, []);

    return [locationSubscriber, startWatchingForeground, stopWatchingForeground, errorMessage]
};

export default useLocation
