import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TrackCreateScreen from './src/screens/TrackCreateScreen';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';

const AppFlow = createStackNavigator();

const App = () => {
    return (
        <LocationProvider>
            <AuthProvider>
                <NavigationContainer>
                    <AppFlow.Navigator
                        initialRouteName={'TrackDetail'}
                        screenOptions={{
                            headerShown: false
                        }}
                    >
                        <AppFlow.Screen
                            name='TrackCreate' component={TrackCreateScreen}
                        />
                    </AppFlow.Navigator>
                </NavigationContainer>
            </AuthProvider>
        </LocationProvider>
    );
};

export default App;
