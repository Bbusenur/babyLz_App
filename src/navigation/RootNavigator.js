import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ChatbotScreen from '../screens/ChatbotScreen';
import ChatFab from '../screens/components/ChatFab';

const Stack = createNativeStackNavigator();

const MainTabsWithChat = ({ navigation }) => {
    return (
        <>
            <TabNavigator />
            <ChatFab onPress={() => navigation.navigate('SohbetAsistanı')} />
        </>
    );
};

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AnaSekmeler"
                component={MainTabsWithChat}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SohbetAsistanı"
                component={ChatbotScreen}
                options={{ title: 'Sohbet Asistanı' }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;

