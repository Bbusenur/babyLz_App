import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { getAppTheme } from './src/constants/Theme';
import { AppContext } from './src/context/AppContext';
import { useColorScheme } from 'react-native';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

const AppShell = () => {
  const colorScheme = useColorScheme();
  const { themeMode, babyProfile } = useContext(AppContext);

  const resolvedMode = themeMode === 'system'
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeMode;

  const theme = getAppTheme(resolvedMode, babyProfile?.gender || 'unknown');

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};
