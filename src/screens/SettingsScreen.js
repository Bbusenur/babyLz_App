import React, { useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { AppContext } from '../context/AppContext';

const SettingsScreen = () => {
    const theme = useTheme();
    const { themeMode, setThemeMode, babyProfile, setBabyProfile, clearAllData } = useContext(AppContext);

    const [name, setName] = useState(babyProfile?.name ?? '');
    const [birthDate, setBirthDate] = useState(babyProfile?.birthDate ?? '');
    const [gender, setGender] = useState(babyProfile?.gender ?? 'unknown');
    const hasUnsavedProfile = useMemo(() => {
        return (
            (name ?? '') !== (babyProfile?.name ?? '') ||
            (birthDate ?? '') !== (babyProfile?.birthDate ?? '') ||
            (gender ?? 'unknown') !== (babyProfile?.gender ?? 'unknown')
        );
    }, [name, birthDate, gender, babyProfile]);

    const saveProfile = async () => {
        await setBabyProfile({ name: name.trim(), birthDate: birthDate.trim(), gender });
    };

    const confirmClear = () => {
        Alert.alert(
            'Tüm veriler silinsin mi?',
            'Besleme ve günlük kayıtlarınız kalıcı olarak silinecek.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                    }
                },
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Title title="Görünüm" />
                <Card.Content>
                    <Text style={styles.label}>Tema</Text>
                    <SegmentedButtons
                        value={themeMode}
                        onValueChange={(value) => setThemeMode(value)}
                        buttons={[
                            { value: 'system', label: 'Sistem' },
                            { value: 'light', label: 'Aydınlık' },
                            { value: 'dark', label: 'Karanlık' },
                        ]}
                    />
                </Card.Content>
            </Card>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Title title="Bebek Profili" />
                <Card.Content>
                    <Text style={styles.label}>İsim</Text>
                    <TextInput
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        placeholder="Örn: Ada"
                        outlineColor={theme.colors.primaryContainer}
                        activeOutlineColor={theme.colors.primary}
                        style={styles.input}
                    />

                    <Text style={[styles.label, { marginTop: 12 }]}>Doğum tarihi (opsiyonel)</Text>
                    <TextInput
                        mode="outlined"
                        value={birthDate}
                        onChangeText={setBirthDate}
                        placeholder="Örn: 2025-10-12"
                        outlineColor={theme.colors.primaryContainer}
                        activeOutlineColor={theme.colors.primary}
                        style={styles.input}
                    />

                    <Text style={[styles.label, { marginTop: 12 }]}>Cinsiyet</Text>
                    <SegmentedButtons
                        value={gender}
                        onValueChange={setGender}
                        buttons={[
                            { value: 'unknown', label: 'Belirtme' },
                            { value: 'girl', label: 'Kız' },
                            { value: 'boy', label: 'Erkek' },
                        ]}
                    />

                    <View style={{ height: 12 }} />
                    <Button
                        mode="contained"
                        onPress={saveProfile}
                        disabled={!hasUnsavedProfile}
                        style={styles.primaryButton}
                    >
                        Kaydet
                    </Button>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Title title="Veri" />
                <Card.Content>
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                        Bu işlem sadece kayıtları siler (tema ve profil korunur).
                    </Text>
                    <View style={{ height: 12 }} />
                    <Button mode="outlined" onPress={confirmClear} textColor={theme.colors.error}>
                        Kayıtları Temizle
                    </Button>
                </Card.Content>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'transparent',
    },
    primaryButton: {
        borderRadius: 20,
    },
});

export default SettingsScreen;

