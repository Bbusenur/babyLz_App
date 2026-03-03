import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Card, ActivityIndicator, Divider, IconButton, SegmentedButtons } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { AppContext } from '../context/AppContext';

const PsychologyScreen = ({ navigation }) => {
    const theme = useTheme();
    const { moods, addMood, removeMood, updateMood } = useContext(AppContext);
    const [happiness, setHappiness] = useState(3);
    const [tiredness, setTiredness] = useState(3);
    const [interest, setInterest] = useState(3);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState('today'); // today | 7 | 30 | all
    const [editingId, setEditingId] = useState(null);

    const filteredMoods = useMemo(() => {
        const now = new Date();
        return moods.filter(m => {
            const d = new Date(m.date);
            if (Number.isNaN(d.getTime())) return false;

            if (filterPeriod === 'today') {
                if (d.toDateString() !== now.toDateString()) return false;
            } else if (filterPeriod === '7') {
                const diff = (now - d) / (1000 * 60 * 60 * 24);
                if (diff > 7) return false;
            } else if (filterPeriod === '30') {
                const diff = (now - d) / (1000 * 60 * 60 * 24);
                if (diff > 30) return false;
            }
            return true;
        });
    }, [moods, filterPeriod]);

    const handleSave = async () => {
        if (!note.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen bebeğiniz için kısa bir not yazınız.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                happiness: Math.round(happiness),
                tiredness: Math.round(tiredness),
                interest: Math.round(interest),
                note: note.trim(),
            };
            if (editingId) {
                await updateMood(editingId, payload);
            } else {
                await addMood(payload);
            }
            setEditingId(null);
            setNote('');
            navigation.navigate('Ana Sayfa');
        } finally {
            setLoading(false);
        }
    };

    const renderSlider = (label, value, setValue) => (
        <View style={styles.sliderContainer}>
            <Text style={styles.label}>{label}: {Math.round(value)}</Text>
            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>Hiç</Text>
                <Text style={styles.sliderLabelText}>Çok</Text>
            </View>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={5}
                step={1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#000000"
                thumbTintColor={theme.colors.primary}
                value={value}
                onValueChange={setValue}
            />
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Title title="PANAS Duygu Durumu (1-5)" />
                <Card.Content>
                    {renderSlider('Mutluluk', happiness, setHappiness)}
                    {renderSlider('Yorgunluk', tiredness, setTiredness)}
                    {renderSlider('İlgi', interest, setInterest)}
                </Card.Content>
            </Card>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Content>
                    <Text style={styles.label}>Bebeğim için bugün...</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Neler yaptınız?"
                        multiline
                        numberOfLines={4}
                        value={note}
                        onChangeText={setNote}
                        style={styles.textInput}
                        outlineColor={theme.colors.primaryLight}
                        activeOutlineColor={theme.colors.primary}
                    />
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : editingId ? 'Güncelle' : 'Kaydet'}
            </Button>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Title title="Kayıtlar" />
                <Card.Content>
                    <View style={styles.filterRow}>
                        <SegmentedButtons
                            value={filterPeriod}
                            onValueChange={setFilterPeriod}
                            buttons={[
                                { value: 'today', label: 'Bugün' },
                                { value: '7', label: '7 gün' },
                                { value: '30', label: '30 gün' },
                                { value: 'all', label: 'Tümü' },
                            ]}
                        />
                    </View>
                    {filteredMoods.length === 0 ? (
                        <Text>Bu filtreye uygun kayıt yok.</Text>
                    ) : (
                        filteredMoods.map((m, idx) => (
                            <View key={m.id}>
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.rowTitle}>
                                            Mutluluk {m.happiness}/5 · Yorgunluk {m.tiredness}/5 · İlgi {m.interest}/5
                                        </Text>
                                        <Text style={styles.rowSubtitle}>{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                        <Text style={styles.noteText}>{m.note}</Text>
                                    </View>
                                    <IconButton
                                        icon="pencil"
                                        onPress={() => {
                                            setEditingId(m.id);
                                            setHappiness(m.happiness);
                                            setTiredness(m.tiredness);
                                            setInterest(m.interest);
                                            setNote(m.note);
                                        }}
                                        accessibilityLabel="Düzenle"
                                    />
                                    <IconButton
                                        icon="delete"
                                        iconColor={theme.colors.error}
                                        onPress={() => removeMood(m.id)}
                                        accessibilityLabel="Sil"
                                    />
                                </View>
                                {idx < filteredMoods.length - 1 ? <Divider /> : null}
                            </View>
                        ))
                    )}
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
    sliderContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    sliderLabelText: {
        fontSize: 12,
        color: '#666',
    },
    textInput: {
        marginTop: 8,
        backgroundColor: '#fff',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 20,
        marginBottom: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    rowTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    rowSubtitle: {
        opacity: 0.7,
        marginTop: 2,
    },
    noteText: {
        marginTop: 6,
    },
    filterRow: {
        marginBottom: 12,
    },
});

export default PsychologyScreen;
