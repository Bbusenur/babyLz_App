import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Card, IconButton, List, Text, TextInput, useTheme } from 'react-native-paper';

const INITIAL_MESSAGES = [
    {
        id: 'welcome-1',
        sender: 'bot',
        text: 'Merhaba, ben BebekIz asistanı. Bebeğinizle ilgili aklınızdaki soruları bana sorabilirsiniz. 😊',
    },
    {
        id: 'welcome-2',
        sender: 'bot',
        text: 'Örnek: "6 aylık bebeğim gece çok uyanıyor, normal mi?" ya da "Ek gıdaya ne zaman başlamalıyım?"',
    },
];

const ChatbotScreen = () => {
    const theme = useTheme();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: trimmed,
        };

        const botMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: getBotReply(trimmed),
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        setInput('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.content}>
                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <Text style={styles.infoTitle}>Bilgilendirme</Text>
                            <Text style={styles.infoText}>
                                Bu sohbet alanı sadece genel bilgilendirme içindir, tıbbi tanı veya acil durumlar için
                                kullanılmamalıdır. Endişelendiğiniz her durumda mutlaka doktorunuza veya 112&apos;ye başvurun.
                            </Text>
                        </Card.Content>
                    </Card>

                    <List.Section style={styles.chatSection}>
                        {messages.map(msg => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.bubbleRow,
                                    msg.sender === 'user' ? styles.bubbleRowUser : styles.bubbleRowBot,
                                ]}
                            >
                                <Card
                                    style={[
                                        styles.bubble,
                                        msg.sender === 'user'
                                            ? { backgroundColor: theme.colors.primary }
                                            : { backgroundColor: theme.colors.surface },
                                    ]}
                                >
                                    <Card.Content>
                                        <Text
                                            style={[
                                                styles.bubbleText,
                                                msg.sender === 'user' ? { color: '#fff' } : { color: theme.colors.onSurface },
                                            ]}
                                        >
                                            {msg.text}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            </View>
                        ))}
                    </List.Section>
                </View>

                <View style={styles.inputRow}>
                    <TextInput
                        mode="outlined"
                        placeholder="Bebeğinizle ilgili sorunuzu yazın..."
                        value={input}
                        onChangeText={setInput}
                        style={styles.input}
                        multiline
                    />
                    <IconButton
                        icon="send"
                        mode="contained-tonal"
                        onPress={handleSend}
                        size={24}
                        disabled={!input.trim()}
                        style={styles.sendButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const getBotReply = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('ateş') || lower.includes('ates') || lower.includes('ateşi')) {
        return 'Bebeklerde 38°C ve üzeri ateş özellikle 3 aydan küçük bebekte acil değerlendirme gerektirebilir. Bebeğinizde halsizlik, emmeme, solunumda zorlanma gibi bulgular varsa vakit kaybetmeden en yakın acil servise başvurun. Genel bilgilendirme için aile hekiminiz veya çocuk doktorunuzla da görüşebilirsiniz.';
    }

    if (lower.includes('ek gıda') || lower.includes('ek gida') || lower.includes('ekgıda')) {
        return 'Ek gıdaya başlama zamanı genellikle 6. ay civarıdır; ancak bu, bebeğinizin gelişimine göre değişebilir. Başlamadan önce mutlaka kendi çocuk doktorunuzla konuşmanız en sağlıklısıdır. İlk gıdalarda tek tek ve küçük miktarlarda ilerlemek, alerji bulgularını fark etmeyi kolaylaştırır.';
    }

    if (lower.includes('uyku') || lower.includes('gece çok uyan') || lower.includes('gece uyan')) {
        return 'İlk 1 yaş içinde bebeklerin geceleri sık uyanması oldukça yaygındır ve çoğu zaman normaldir. Kısa, sakin ve tekrarlayan bir uyku rutini (ışık azaltma, ninni, sarılma gibi) uykuya geçişi kolaylaştırabilir. Aşırı huzursuzluk, nefes darlığı, yüksek ateş gibi ek bulgular varsa mutlaka hekime başvurun.';
    }

    if (lower.includes('gaz') || lower.includes('kolik') || lower.includes('sancı')) {
        return 'İlk aylarda gaz sancısı (kolik) sık görülebilir ve hem bebeği hem ebeveynleri zorlayabilir. Karnını saat yönünde hafifçe dairesel masaj yapmak, kucağa alıp dik tutmak ve kısa yürüyüşler bazı bebeklerde rahatlama sağlayabilir. Çok şiddetli ağlama, beslenme reddi veya kilo alamama varsa mutlaka doktorunuza danışın.';
    }

    if (lower.includes('aşı') || lower.includes('asi')) {
        return 'Aşı takvimi, ülkenin ulusal aşı programına ve bebeğinizin özel durumuna göre değişebilir. En güncel ve doğru bilgi için bebeğinizin aşı kartını aile hekiminizle birlikte değerlendirmeniz gerekir. Aşı sonrası hafif ateş ve huzursuzluk sık görülen yan etkilerdir; ancak yüksek ateş, nefes darlığı veya döküntü gibi şikayetlerde acilen sağlık kuruluşuna başvurun.';
    }

    if (lower.includes('emzir') || lower.includes('sütüm') || lower.includes('sütum') || lower.includes('anne süt')) {
        return 'Emzirme sıklığı ve süresi bebekten bebeğe değişir; ilk aylarda 2–3 saatte bir emzirme yaygındır. Bebeğin yeterince beslendiğini anlamak için kilo takibi, idrar miktarı ve genel huzuru önemlidir. Süt miktarıyla ilgili kaygınız varsa bir emzirme danışmanı veya çocuk doktorundan destek almanız iyi olur.';
    }

    if (lower.includes('gelişim') || lower.includes('motor') || lower.includes('konuşma') || lower.includes('dönüm')) {
        return 'Gelişim dönüm noktaları (dönme, oturma, yürüme, konuşma vb.) her çocukta tam aynı ayda olmaz; küçük farklılıklar normaldir. Ancak sizde “yaşıtlarına göre belirgin geri kaldı” hissi varsa bunu mutlaka çocuk doktorunuzla paylaşın. Erken fark edilen gelişimsel farklılıklara daha erken destek verilebilir.';
    }

    return 'Sorunuzu anladığım kadarıyla genel bir bilgi vermeye çalıştım, ancak ben yerel doktorunuzun yerini tutamam. Bebeğinizin durumu sizi endişelendiriyorsa lütfen kendi çocuk doktorunuzla görüşün veya acil bir durum hissediyorsanız 112\'yi arayın.';
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    infoCard: {
        borderRadius: 16,
        marginBottom: 12,
    },
    infoTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#555',
    },
    chatSection: {
        flex: 1,
        marginTop: 4,
    },
    bubbleRow: {
        marginVertical: 4,
        flexDirection: 'row',
    },
    bubbleRowUser: {
        justifyContent: 'flex-end',
    },
    bubbleRowBot: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 16,
    },
    bubbleText: {
        fontSize: 14,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 4,
        marginBottom: 4,
    },
});

export default ChatbotScreen;

