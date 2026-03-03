import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Baby, Bell, BookOpen, FileText, Home, Notebook, Settings } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import FeedingScreen from '../screens/FeedingScreen';
import PsychologyScreen from '../screens/PsychologyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RemindersScreen from '../screens/RemindersScreen';
import ReportScreen from '../screens/ReportScreen';
import GuideScreen from '../screens/GuideScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 0,
                    elevation: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute', // To show rounded corners nicely
                },
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tab.Screen
                name="Ana Sayfa"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Besleme"
                component={FeedingScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Baby color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Günlük"
                component={PsychologyScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Notebook color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Kılavuz"
                component={GuideScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <BookOpen color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Hatırlatıcılar"
                component={RemindersScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Bell color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Rapor"
                component={ReportScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FileText color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ayarlar"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Settings color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
