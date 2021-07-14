import * as Location from 'expo-location';

const tenMetersWithDegrees = 0.0001;

export const initialLocation = {
    latitude: -33.451065015700166,
    longitude: -70.63326357393795
}

const getLocation = increment => {
    return {
        timestamp: 10000000,
        coords: {
            speed: 0,
            heading: 0,
            accuracy: 5,
            altitudeAccuracy: 5,
            altitude: 5,
            latitude: initialLocation.latitude + increment * tenMetersWithDegrees,
            longitude: initialLocation.longitude + increment * tenMetersWithDegrees
        }
    };
};

export const startInterval = (oneMoreStepCallBack, stepNumberCallback, addLocationCallBack) => {
    Location.EventEmitter.addListener('locationChanged', (arg) => addLocationCallBack(arg))
    var intervalId = setInterval(() => {
        Location.EventEmitter.emit('locationChanged', getLocation(stepNumberCallback()));
        oneMoreStepCallBack()
    }, 1000);
    return intervalId;
};

export const stopInterval = refreshIntervalId => {
    clearInterval(refreshIntervalId);
    Location.EventEmitter.removeAllListeners('locationChanged')
};

