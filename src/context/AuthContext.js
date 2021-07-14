import AsyncStorage from '@react-native-async-storage/async-storage';

import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';

const ADD_ERROR = 'ADD_ERROR';
const SIGNIN = 'SIGNIN';
const SIGNOUT = 'SIGNOUT';
const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

const initialState = {
    token: null,
    errorMessage: '',
    appLaunch: true
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ERROR:
            return { ...state, errorMessage: action.payload };

        case SIGNIN:
            // state only has errorMessage and token, so we don´t need "...state" here
            return {
                ...state,
                token: action.payload,
                errorMessage: '',
                appLaunch: false
            };

        case SIGNOUT:
            return { ...state, token: null, errorMessage: '' };

        case CLEAR_ERROR_MESSAGE:
            return { ...state, errorMessage: '' };

        default:
            return state;
    }
};

const clearErrorMessage = dispatch => {
    return () => {
        dispatch({ type: CLEAR_ERROR_MESSAGE });
    };
};

const tryToSignin = dispatch => {
    return async () => {
        const jsonValue = await AsyncStorage.getItem('@token_Key');
        let obj = JSON.parse(jsonValue);
        if (obj) {
            dispatch({ type: SIGNIN, payload: obj });
        } 
    };
};

const signup = dispatch => {
    return async ({ email, password }, goToMainFlow) => {
        // make api request with received values. if successful, new state = authenticated. if fail, reflect error
        try {
            const response = await trackerApi.post('/signup', {
                email,
                password
            });
            const jsonValue = JSON.stringify(response.data.token);
            await AsyncStorage.setItem('@token_Key', jsonValue);
            // SIGNUP is identical to SIGNIN at the reducer level
            dispatch({ type: SIGNIN, payload: response.data.token });
            // Once signed up successfully, we need to navigate to the mainFlow
            goToMainFlow();
        } catch (error) {
            let err = `signup:: something went wrong ${error}`;
            dispatch({
                type: ADD_ERROR,
                payload: err
            });
        }
    };
};

const signin = dispatch => {
    return async ({ email, password }, goToMainFlow) => {
        try {
            const response = await trackerApi.post('/signin', {
                email,
                password
            });
            const jsonValue = JSON.stringify(response.data.token);
            await AsyncStorage.setItem('@token_Key', jsonValue);
            dispatch({ type: SIGNIN, payload: response.data.token });
            // Once signed up successfully, we need to navigate to the mainFlow
            goToMainFlow();
        } catch (error) {
            let err = `signin:: something went wrong ${error}`;
            dispatch({
                type: ADD_ERROR,
                payload: err
            });
        }
    };
};

const signout = dispatch => {
    return async () => {
        await AsyncStorage.removeItem('@token_Key');
        dispatch({ type: SIGNOUT });
    };
};

const { Provider, Context } = createDataContext(
    authReducer,
    { signup, signin, signout, clearErrorMessage, tryToSignin },
    initialState
);

const AuthProvider = Provider;
const AuthContext = Context;

export { AuthProvider, AuthContext };
