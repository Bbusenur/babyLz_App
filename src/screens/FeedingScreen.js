import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, IconButton, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { AppContext } from '../context/AppContext';

const FeedingScreen = ({ navigation }) => {
    const theme = useTheme();
    const { feedings, addFeeding, removeFeeding, updateFeeding } = useContext(AppContext);
    const [type, setType] = useState('meme');
    const [amount, setAmount] = useState(50);
    const [loading, setLoading] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState('today'); // today | 7 | 30 | all
    const [filterType, setFilterType] = useState('all'); // all | Meme | Biberon | Mama
    const [editingId, setEditingId] = useState(null);
    const [isTiming, setIsTiming] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [timerVisible, setTimerVisible] = useState(false);

    const unit = type === 'meme' ? 'dk' : 'mL';
    const max = type === 'meme' ? 60 : 300;

    useEffect(() => {
        let interval;
        if (timerVisible && isTiming) {
            const start = Date.now() - elapsedSeconds * 1000;
            interval = setInterval(() => {
                const seconds = Math.floor((Date.now() - start) / 1000);
                setElapsedSeconds(seconds);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerVisible, isTiming, elapsedSeconds]);

    const filteredFeedings = useMemo(() => {
        const now = new Date();
        return feedings.filter(f => {
            const d = new Date(f.date);
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

            if (filterType !== 'all' && f.type !== filterType) return false;
            return true;
        });
    }, [feedings, filterPeriod, filterType]);

    const openTimer = () => {
        setElapsedSeconds(0);
        setIsTiming(false);
        setTimerVisible(true);
    };

    const closeTimer = () => {
        setIsTiming(false);
        setTimerVisible(false);
    };

    const startTimer = () => {
        setIsTiming(true);
    };

    const stopTimer = () => {
        setIsTiming(false);
    };

    const timerMinutes = Math.max(1, Math.round(elapsedSeconds / 60)); // en az 1 dk

    const handleEdit = (entry) => {
        setEditingId(entry.id);
        setType(entry.type === 'Meme' ? 'meme' : entry.type === 'Biberon' ? 'biberon' : 'mama');
        setAmount(entry.amount);
    };

    const handleSave = async () => {
        if (type === 'meme' && !editingId) {
            Alert.alert('Süre Tut', 'Meme için lütfen "Süre Tut" butonunu kullanın.');
            return;
        }

        if (amount <= 0) {
            Alert.alert('Hata', 'Lütfen geçerli bir miktar belirtiniz.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                type: type === 'meme' ? 'Meme' : type === 'biberon' ? 'Biberon' : 'Mama',
                amount: Math.round(amount),
                unit,
            };
            if (editingId) {
                await updateFeeding(editingId, payload);
            } else {
                await addFeeding(payload);
            }
            setEditingId(null);
            navigation.navigate('Ana Sayfa');
        } finally {
            setLoading(false);
        }
    };

    const handleTimerSave = async () => {
        if (elapsedSeconds <= 0) {
            Alert.alert('Süre Tut', 'Önce süreyi başlatın.');
            return;
        }
        try {
            setLoading(true);
            await addFeeding({
                type: 'Meme',
                amount: timerMinutes,
                unit: 'dk',
            });
            setEditingId(null);
            closeTimer();
            navigation.navigate('Ana Sayfa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SegmentedButtons
                value={type}
                onValueChange={setType}
                buttons={[
                    {
                        value: 'meme',
                        label: 'Meme',
                    },
                    {
                        value: 'biberon',
                        label: 'Biberon',
                    },
                    { value: 'mama', label: 'Mama' },
                ]}
                style={styles.segmentedControl}
            />

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.label}>
                        {type === 'meme' ? 'Süre (Dakika)' : 'Miktar (mL)'}: {Math.round(amount)} {unit}
                    </Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={max}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.outline}
                        thumbTintColor={theme.colors.primary}
                        value={amount}
                        onValueChange={setAmount}
                        disabled={type === 'meme' && !editingId} // yeni kayıt için manuel oynanamasın
                    />

                    {type === 'meme' && !editingId && (
                        <Button
                            mode="outlined"
                            onPress={openTimer}
                            style={styles.timerButton}
                        >
                            Süre Tut
                        </Button>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : editingId ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </Card.Content>
            </Card>

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
                    <View style={[styles.filterRow, { marginTop: 8 }]}>
                        <SegmentedButtons
                            value={filterType}
                            onValueChange={setFilterType}
                            buttons={[
                                { value: 'all', label: 'Hepsi' },
                                { value: 'Meme', label: 'Meme' },
                                { value: 'Biberon', label: 'Biberon' },
                                { value: 'Mama', label: 'Mama' },
                            ]}
                        />
                    </View>

                {filteredFeedings.length === 0 ? (
                        <Text>Henüz besleme kaydı yok.</Text>
                    ) : (
                        filteredFeedings.map((f, idx) => (
                            <View key={f.id}>
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.rowTitle}>{f.type} · {f.amount} {f.unit}</Text>
                                        <Text style={styles.rowSubtitle}>{new Date(f.date).toLocaleString()}</Text>
                                    </View>
                                    <IconButton
                                        icon="pencil"
                                        onPress={() => handleEdit(f)}
                                        accessibilityLabel="Düzenle"
                                    />
                                    <IconButton
                                        icon="delete"
                                        iconColor={theme.colors.error}
                                        onPress={() => removeFeeding(f.id)}
                                        accessibilityLabel="Sil"
                                    />
                                </View>
                                {idx < filteredFeedings.length - 1 ? <Divider /> : null}
                            </View>
                        ))
                    )}
                </Card.Content>
            </Card>

            <View style={{ height: 40 }} />

            <Modal
                visible={timerVisible}
                transparent
                animationType="fade"
                onRequestClose={closeTimer}
            >
                <TouchableWithoutFeedback onPress={closeTimer}>
                    <View style={styles.modalBackdrop} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContentWrapper}>
                    <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={styles.modalTitle}>Süre Tut</Text>
                        <View style={[styles.timerCircle, { borderColor: theme.colors.primary }]}>
                            <Text style={styles.timerCircleText}>
                                {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}
                                :
                                {(elapsedSeconds % 60).toString().padStart(2, '0')}
                            </Text>
                        </View>
                        <View style={styles.modalButtonsRow}>
                            {!isTiming && elapsedSeconds === 0 && (
                                <Button mode="contained" onPress={startTimer}>
                                    Başlat
                                </Button>
                            )}
                            {isTiming && (
                                <Button mode="outlined" onPress={stopTimer}>
                                    Durdur
                                </Button>
                            )}
                            {!isTiming && elapsedSeconds > 0 && (
                                <Button mode="outlined" onPress={startTimer}>
                                    Devam Et
                                </Button>
                            )}
                        </View>
                        <View style={styles.modalButtonsRow}>
                            <Button
                                mode="contained"
                                onPress={handleTimerSave}
                                disabled={elapsedSeconds <= 0 || loading}
                            >
                                Kaydet
                            </Button>
                            <Button mode="text" onPress={closeTimer}>
                                Kapat
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    segmentedControl: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 20,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        justifyContent: 'space-between',
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerButton: {
        borderRadius: 20,
    },
    filterRow: {
        marginBottom: 12,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContentWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    timerCircleText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rowSubtitle: {
        opacity: 0.7,
        marginTop: 2,
    },
});

export default FeedingScreen;
