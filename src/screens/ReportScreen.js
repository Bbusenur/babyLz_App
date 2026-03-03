import React, { useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppContext } from '../context/AppContext';

const ReportScreen = () => {
    const theme = useTheme();
    const { feedings, moods, babyProfile } = useContext(AppContext);

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    });
    const [endDate, setEndDate] = useState(() => new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [exporting, setExporting] = useState(false);

    const inRange = (dateStr) => {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return false;
        return d >= startOfDay(startDate) && d <= endOfDay(endDate);
    };

    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

    const { feedingStats, moodStats } = useMemo(() => {
        const fs = {
            count: 0,
            totalMinutes: 0,
            totalMl: 0,
        };
        const ms = {
            count: 0,
            happinessSum: 0,
            tirednessSum: 0,
            interestSum: 0,
        };

        feedings.forEach((f) => {
            if (!inRange(f.date)) return;
            fs.count += 1;
            if (f.unit === 'dk') fs.totalMinutes += Number(f.amount) || 0;
            if (f.unit === 'mL') fs.totalMl += Number(f.amount) || 0;
        });

        moods.forEach((m) => {
            if (!inRange(m.date)) return;
            ms.count += 1;
            ms.happinessSum += Number(m.happiness) || 0;
            ms.tirednessSum += Number(m.tiredness) || 0;
            ms.interestSum += Number(m.interest) || 0;
        });

        return { feedingStats: fs, moodStats: ms };
    }, [feedings, moods, startDate, endDate]);

    const exportCsv = async () => {
        try {
            setExporting(true);
            const lines = [];
            lines.push('section,type,date,time,detail1,detail2,detail3,note');

            feedings.forEach((f) => {
                if (!inRange(f.date)) return;
                const d = new Date(f.date);
                lines.push([
                    'feeding',
                    f.type,
                    d.toLocaleDateString(),
                    d.toLocaleTimeString(),
                    `${f.amount}`,
                    f.unit,
                    '',
                    '',
                ].map(escapeCsv).join(','));
            });

            moods.forEach((m) => {
                if (!inRange(m.date)) return;
                const d = new Date(m.date);
                lines.push([
                    'mood',
                    '',
                    d.toLocaleDateString(),
                    d.toLocaleTimeString(),
                    `happiness:${m.happiness}`,
                    `tiredness:${m.tiredness}`,
                    `interest:${m.interest}`,
                    m.note || '',
                ].map(escapeCsv).join(','));
            });

            const csv = lines.join('\n');
            const fileName = `bebekiz-rapor-${new Date().toISOString().slice(0, 10)}.csv`;
            const fileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) {
                Alert.alert('Paylaşım desteklenmiyor', `Dosya konumu: ${fileUri}`);
                return;
            }

            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/csv',
                dialogTitle: 'BebekIz raporunu paylaş',
            });
        } catch (e) {
            Alert.alert('Hata', 'Rapor dışa aktarılırken bir sorun oluştu.');
        } finally {
            setExporting(false);
        }
    };

    const onStartChange = (_, date) => {
        setShowStartPicker(false);
        if (date) setStartDate(date);
    };

    const onEndChange = (_, date) => {
        setShowEndPicker(false);
        if (date) setEndDate(date);
    };

    const formatDate = (d) => d.toLocaleDateString();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Title title="Rapor Özeti" />
                <Card.Content>
                    <Text style={styles.label}>Tarih Aralığı</Text>
                    <View style={styles.row}>
                        <Button
                            mode="outlined"
                            onPress={() => setShowStartPicker(true)}
                            style={styles.dateButton}
                        >
                            {formatDate(startDate)}
                        </Button>
                        <Text style={{ marginHorizontal: 8 }}>–</Text>
                        <Button
                            mode="outlined"
                            onPress={() => setShowEndPicker(true)}
                            style={styles.dateButton}
                        >
                            {formatDate(endDate)}
                        </Button>
                    </View>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            onChange={onStartChange}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            onChange={onEndChange}
                        />
                    )}

                    <View style={{ height: 16 }} />
                    <Text style={styles.sectionTitle}>Beslenme</Text>
                    <Text>Toplam kayıt: {feedingStats.count}</Text>
                    <Text>Toplam emzirme süresi: {feedingStats.totalMinutes} dk</Text>
                    <Text>Toplam biberon/mama: {feedingStats.totalMl} mL</Text>

                    <View style={{ height: 16 }} />
                    <Text style={styles.sectionTitle}>Duygu (PANAS)</Text>
                    <Text>Toplam kayıt: {moodStats.count}</Text>
                    {moodStats.count > 0 ? (
                        <>
                            <Text>Ortalama mutluluk: {(moodStats.happinessSum / moodStats.count).toFixed(1)}/5</Text>
                            <Text>Ortalama yorgunluk: {(moodStats.tirednessSum / moodStats.count).toFixed(1)}/5</Text>
                            <Text>Ortalama ilgi: {(moodStats.interestSum / moodStats.count).toFixed(1)}/5</Text>
                        </>
                    ) : null}

                    <View style={{ height: 16 }} />
                    <Text style={styles.sectionTitle}>Bebek</Text>
                    <Text>İsim: {babyProfile?.name || '-'}</Text>
                    <Text>Doğum tarihi: {babyProfile?.birthDate || '-'}</Text>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { marginTop: 16 }]}>
                <Card.Title title="Dışa Aktar" />
                <Card.Content>
                    <Text>
                        Seçilen tarih aralığındaki beslenme ve duygu kayıtlarını CSV dosyası olarak dışa aktarabilir ve
                        doktorunuzla paylaşabilirsiniz.
                    </Text>
                    <View style={{ height: 16 }} />
                    <Button
                        mode="contained"
                        onPress={exportCsv}
                        loading={exporting}
                        disabled={exporting}
                        style={styles.exportButton}
                    >
                        CSV Olarak Paylaş
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

function escapeCsv(value) {
    const str = String(value ?? '');
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 16,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateButton: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    exportButton: {
        borderRadius: 20,
    },
});

export default ReportScreen;

