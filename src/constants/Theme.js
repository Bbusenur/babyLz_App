import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from 'react-native-paper';
import Colors from './Colors';

export function getAppTheme(mode = 'light', gender = 'unknown') {
    const isDark = mode === 'dark';
    const navigationBase = isDark ? NavigationDarkTheme : NavigationDefaultTheme;
    const paperBase = isDark ? PaperDarkTheme : PaperLightTheme;
    const palette = isDark ? Colors.dark : Colors.light;

    const isGirl = gender === 'girl';
    const isBoy = gender === 'boy';

    const genderPrimary = isGirl ? '#F8BBD0' : isBoy ? '#90CAF9' : palette.primary; // toz pembe / bebek mavisi
    const genderPrimaryLight = isGirl ? '#FCE4EC' : isBoy ? '#E3F2FD' : palette.primaryLight;

    return {
        ...navigationBase,
        ...paperBase,
        colors: {
            ...navigationBase.colors,
            ...paperBase.colors,
            primary: genderPrimary,
            onPrimary: isDark ? '#0B0F0C' : '#FFFFFF',
            primaryContainer: genderPrimaryLight,
            onPrimaryContainer: isDark ? '#FFFFFF' : genderPrimary,
            secondary: isDark ? '#A5D6A7' : '#81C784',
            background: palette.background,
            surface: palette.surface,
            error: palette.error,
        },
        roundness: 16,
    };
}
