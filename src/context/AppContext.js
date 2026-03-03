import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

const STORAGE_KEYS = {
    feedings: '@feedings',
    moods: '@moods',
    themeMode: '@themeMode',
    babyProfile: '@babyProfile',
    reminders: '@reminders',
};

export const AppProvider = ({ children }) => {
    const [feedings, setFeedings] = useState([]);
    const [moods, setMoods] = useState([]);
    const [themeMode, setThemeModeState] = useState('system'); // 'system' | 'light' | 'dark'
    const [babyProfile, setBabyProfileState] = useState({ name: '', birthDate: '', gender: 'unknown' });
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storedFeedings, storedMoods, storedThemeMode, storedBabyProfile, storedReminders] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.feedings),
                AsyncStorage.getItem(STORAGE_KEYS.moods),
                AsyncStorage.getItem(STORAGE_KEYS.themeMode),
                AsyncStorage.getItem(STORAGE_KEYS.babyProfile),
                AsyncStorage.getItem(STORAGE_KEYS.reminders),
            ]);

            if (storedFeedings) setFeedings(JSON.parse(storedFeedings));
            if (storedMoods) setMoods(JSON.parse(storedMoods));
            if (storedThemeMode) setThemeModeState(storedThemeMode);
            if (storedBabyProfile) {
                const parsed = JSON.parse(storedBabyProfile);
                setBabyProfileState({
                    name: parsed?.name ?? '',
                    birthDate: parsed?.birthDate ?? '',
                    gender: parsed?.gender ?? 'unknown',
                });
            }
            if (storedReminders) setReminders(JSON.parse(storedReminders));
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const addFeeding = async (feeding) => {
        const entry = { id: Date.now().toString(), date: new Date().toISOString(), ...feeding };
        setFeedings(prev => {
            const next = [entry, ...prev];
            AsyncStorage.setItem(STORAGE_KEYS.feedings, JSON.stringify(next)).catch(() => {});
            return next;
        });
    };

    const addMood = async (mood) => {
        const entry = { id: Date.now().toString(), date: new Date().toISOString(), ...mood };
        setMoods(prev => {
            const next = [entry, ...prev];
            AsyncStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(next)).catch(() => {});
            return next;
        });
    };

    const removeFeeding = async (id) => {
        setFeedings(prev => {
            const next = prev.filter(f => f.id !== id);
            AsyncStorage.setItem(STORAGE_KEYS.feedings, JSON.stringify(next)).catch(() => {});
            return next;
        });
    };

    const removeMood = async (id) => {
        setMoods(prev => {
            const next = prev.filter(m => m.id !== id);
            AsyncStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(next)).catch(() => {});
            return next;
        });
    };

    const setThemeMode = async (mode) => {
        setThemeModeState(mode);
        await AsyncStorage.setItem(STORAGE_KEYS.themeMode, mode);
    };

    const setBabyProfile = async (profile) => {
        const next = {
            name: profile?.name ?? '',
            birthDate: profile?.birthDate ?? '',
            gender: profile?.gender ?? 'unknown',
        };
        setBabyProfileState(next);
        await AsyncStorage.setItem(STORAGE_KEYS.babyProfile, JSON.stringify(next));
    };

    const clearAllData = async () => {
        setFeedings([]);
        setMoods([]);
        await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.feedings),
            AsyncStorage.removeItem(STORAGE_KEYS.moods),
        ]);
    };

    const addReminder = async ({ type, title, date, repeat = 'once' }) => {
        const triggerDate = new Date(date);
        if (Number.isNaN(triggerDate.getTime())) {
            throw new Error('Geçersiz tarih/saat');
        }
        const entry = {
            id: Date.now().toString(),
            type,
            title,
            date: triggerDate.toISOString(),
            repeat,
            notificationId: null,
        };

        setReminders(prev => {
            const next = [entry, ...prev];
            AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(next)).catch(() => { });
            return next;
        });
    };

    const removeReminder = async (id) => {
        setReminders(prev => {
            const next = prev.filter(r => r.id !== id);
            AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(next)).catch(() => { });
            return next;
        });
    };

    const updateFeeding = async (id, updates) => {
        setFeedings(prev => {
            const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
            AsyncStorage.setItem(STORAGE_KEYS.feedings, JSON.stringify(next)).catch(() => { });
            return next;
        });
    };

    const updateMood = async (id, updates) => {
        setMoods(prev => {
            const next = prev.map(m => m.id === id ? { ...m, ...updates } : m);
            AsyncStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(next)).catch(() => { });
            return next;
        });
    };

    return (
        <AppContext.Provider value={{
            feedings,
            moods,
            addFeeding,
            addMood,
            removeFeeding,
            removeMood,
            updateFeeding,
            updateMood,
            themeMode,
            setThemeMode,
            babyProfile,
            setBabyProfile,
            clearAllData,
            reminders,
            addReminder,
            removeReminder,
        }}>
            {children}
        </AppContext.Provider>
    );
};
