import React, { useContext, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text, TextInput, useTheme, IconButton, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../context/AppContext';

const ReminderTypes = {
    feeding: 'Besleme',
    medicine: 'İlaç',
    vaccine: 'Aşı',
};

const RemindersScreen = () => {
    const theme = useTheme();
    const { reminders, addReminder, removeReminder } = useContext(AppContext);

    const [type, setType] = useState('feeding');
    const [title, setTitle] = useState('Besleme hatırlatıcısı');
    const [dateTime, setDateTime] = useState(() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 30);
        return d;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [repeat, setRepeat] = useState('once'); // once | daily
    const [saving, setSaving] = useState(false);

    const sortedReminders = useMemo(
        () => [...reminders].sort((a, b) => new Date(b.date) - new Date(a.date)),
        [reminders]
    );

    const onTypeChange = (value) => {
        setType(value);
        if (!title.trim()) {
            setTitle(`${ReminderTypes[value]} hatırlatıcısı`);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type !== 'set' || !selectedDate) {
            return;
        }
            const current = new Date(dateTime);
            current.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setDateTime(current);
    };

    const handleTimeChange = (event, selectedDate) => {
        setShowTimePicker(false);
        if (event.type !== 'set' || !selectedDate) {
            return;
        }
            const current = new Date(dateTime);
            current.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
            setDateTime(current);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const dt = dateTime;
            if (dt <= new Date()) {
                Alert.alert('Geçersiz Zaman', 'Lütfen ileri bir tarih/saat seçin.');
                return;
            }

            await addReminder({
                type,
                title: title.trim() || `${ReminderTypes[type]} hatırlatıcısı`,
                date: dt.toISOString(),
                repeat,
            });

            const next = new Date(dt);
            next.setDate(next.getDate() + 1);
            setDateTime(next);
        } catch (e) {
            Alert.alert('Hata', e.message || 'Hatırlatıcı kaydedilemedi.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Title title="Yeni Hatırlatıcı" />
                <Card.Content>
                    <Text style={styles.label}>Tür</Text>
                    <SegmentedButtons
                        value={type}
                        onValueChange={onTypeChange}
                        buttons={[
                            { value: 'feeding', label: 'Besleme' },
                            { value: 'medicine', label: 'İlaç' },
                            { value: 'vaccine', label: 'Aşı' },
                        ]}
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Başlık</Text>
                    <TextInput
                        mode="outlined"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Örn: Gece beslemesi"
                        style={styles.input}
                        outlineColor={theme.colors.primaryContainer}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.label}>Tarih</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowDatePicker(true)}
                                style={styles.inputButton}
                            >
                                {dateTime.toLocaleDateString()}
                            </Button>
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.label}>Saat</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowTimePicker(true)}
                                style={styles.inputButton}
                            >
                                {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Button>
                        </View>
                    </View>

                    {showDatePicker && Platform.OS !== 'web' && (
                        <DateTimePicker
                            value={dateTime}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                    {showTimePicker && Platform.OS !== 'web' && (
                        <DateTimePicker
                            value={dateTime}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}

                    <Text style={[styles.label, { marginTop: 16 }]}>Tekrar</Text>
                    <SegmentedButtons
                        value={repeat}
                        onValueChange={setRepeat}
                        buttons={[
                            { value: 'once', label: 'Tek seferlik' },
                            { value: 'daily', label: 'Her gün' },
                        ]}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={saving}
                        disabled={saving}
                        style={styles.saveButton}
                    >
                        Kaydet
                    </Button>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Title title="Hatırlatıcılar" />
                <Card.Content>
                    {sortedReminders.length === 0 ? (
                        <Text>Henüz hatırlatıcı oluşturulmadı.</Text>
                    ) : (
                        sortedReminders.map((r, idx) => (
                            <View key={r.id}>
                                <View style={styles.reminderRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.reminderTitle}>
                                            {ReminderTypes[r.type] || 'Diğer'} · {r.title}
                                        </Text>
                                        <Text style={styles.reminderSubtitle}>
                                            {new Date(r.date).toLocaleString()}
                                            {r.repeat === 'daily' ? ' · Her gün' : ''}
                                        </Text>
                                    </View>
                                    <IconButton
                                        icon="delete"
                                        iconColor={theme.colors.error}
                                        onPress={() => removeReminder(r.id)}
                                        accessibilityLabel="Sil"
                                    />
                                </View>
                                {idx < sortedReminders.length - 1 ? <Divider /> : null}
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
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'transparent',
    },
    inputButton: {
        justifyContent: 'center',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 20,
    },
    row: {
        flexDirection: 'row',
        marginTop: 16,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    reminderTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    reminderSubtitle: {
        opacity: 0.7,
        marginTop: 2,
    },
});

export default RemindersScreen;

