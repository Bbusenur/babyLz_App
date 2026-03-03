import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, useTheme, Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { Baby, Activity } from 'lucide-react-native';

const DashboardScreen = ({ navigation }) => {
    const theme = useTheme();
    const { feedings, moods, babyProfile } = useContext(AppContext);

    const latestFeeding = feedings.length > 0 ? feedings[0] : null;
    const todayMoods = moods.filter(m => new Date(m.date).toDateString() === new Date().toDateString());
    const todayFeedings = feedings.filter(f => new Date(f.date).toDateString() === new Date().toDateString());

    const totals = todayFeedings.reduce((acc, f) => {
        if (f.unit === 'dk') acc.totalMinutes += Number(f.amount) || 0;
        if (f.unit === 'mL') acc.totalMl += Number(f.amount) || 0;
        acc.count += 1;
        return acc;
    }, { totalMinutes: 0, totalMl: 0, count: 0 });

    const moodAverages = todayMoods.length > 0 ? {
        happiness: Math.round(todayMoods.reduce((s, m) => s + (Number(m.happiness) || 0), 0) / todayMoods.length),
        tiredness: Math.round(todayMoods.reduce((s, m) => s + (Number(m.tiredness) || 0), 0) / todayMoods.length),
        interest: Math.round(todayMoods.reduce((s, m) => s + (Number(m.interest) || 0), 0) / todayMoods.length),
    } : null;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.headerText, { color: theme.colors.primary }]}>
                {babyProfile?.name?.trim() ? `${babyProfile.name.trim()} · ` : ''}Bugünkü Özet
            </Text>

            {feedings.length === 0 && moods.length === 0 ? (
                <View style={styles.emptyState}>
                    <Title style={{ color: theme.colors.secondary, textAlign: 'center' }}>Bugün henüz kayıt girmediniz.</Title>
                    <Button
                        mode="contained"
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Besleme')}
                    >
                        Kayıt Ekle
                    </Button>
                </View>
            ) : (
                <>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>Bugün</Title>
                            <Paragraph>Besleme sayısı: {totals.count}</Paragraph>
                            {totals.totalMinutes > 0 ? <Paragraph>Toplam emzirme: {totals.totalMinutes} dk</Paragraph> : null}
                            {totals.totalMl > 0 ? <Paragraph>Toplam biberon/mama: {totals.totalMl} mL</Paragraph> : null}
                            {moodAverages ? (
                                <Paragraph>
                                    Ortalama duygu: Mutluluk {moodAverages.happiness}/5 · Yorgunluk {moodAverages.tiredness}/5 · İlgi {moodAverages.interest}/5
                                </Paragraph>
                            ) : (
                                <Paragraph>Bugün için duygu kaydı yok.</Paragraph>
                            )}
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <Baby color={theme.colors.primary} size={24} />
                                <Title style={styles.cardTitle}>Son Beslenme</Title>
                            </View>
                            {latestFeeding ? (
                                <>
                                    <Paragraph>Tür: {latestFeeding.type}</Paragraph>
                                    <Paragraph>Miktar: {latestFeeding.amount} {latestFeeding.unit}</Paragraph>
                                    <Paragraph>Zaman: {new Date(latestFeeding.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Paragraph>
                                </>
                            ) : (
                                <Paragraph>Henüz besleme kaydı yok.</Paragraph>
                            )}
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => navigation.navigate('Besleme')}>Yeni Kayıt</Button>
                        </Card.Actions>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <Activity color={theme.colors.primary} size={24} />
                                <Title style={styles.cardTitle}>Duygu Durumu (Bugün)</Title>
                            </View>
                            {todayMoods.length > 0 ? (
                                <Paragraph>{todayMoods.length} kayıt girildi.</Paragraph>
                            ) : (
                                <Paragraph>Bugün için duygu kaydı bulunamadı.</Paragraph>
                            )}
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => navigation.navigate('Günlük')}>Günlük Ekle</Button>
                        </Card.Actions>
                    </Card>

                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2, // Soft shadow
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    actionButton: {
        marginTop: 20,
        borderRadius: 20,
    }
});

export default DashboardScreen;
