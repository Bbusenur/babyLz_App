import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, List, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { AppContext } from '../context/AppContext';

const AGE_GROUPS = [
    { id: '0-3', label: '0-3 ay', min: 0, max: 3 },
    { id: '4-6', label: '4-6 ay', min: 4, max: 6 },
    { id: '7-9', label: '7-9 ay', min: 7, max: 9 },
    { id: '10-12', label: '10-12 ay', min: 10, max: 12 },
    { id: '13-24', label: '13-24 ay', min: 13, max: 24 },
];

const GUIDE_CONTENT = {
    '0-3': {
        overview: 'Bu dönem bebeğinizin dünyaya alışma ve temel güven duygusunun oluştuğu dönemdir.',
        items: [
            {
                title: 'Beslenme',
                points: [
                    'Genellikle 2-3 saatte bir, bebeğin isteğine göre emzirme önerilir.',
                    'Gece beslenmeleri normaldir, uzun açlıklar beklenmez.',
                    'Her beslenmede tek memeyi tamamen boşaltmasına izin verin, sonra diğer memeye geçin.',
                ],
            },
            {
                title: 'Uyku',
                points: [
                    'Günde toplam 14-17 saat uyku normal kabul edilir.',
                    'Gece-gündüz ayrımını desteklemek için gündüzleri ortamı aydınlık, geceleri loş ve sakin tutun.',
                    'Bebeği her zaman sırtüstü yatırın, yatağına yastık/oyuncak koymayın.',
                ],
            },
            {
                title: 'Gelişim & Oyun',
                points: [
                    'Göz teması kurup yumuşak sesle konuşmak temel bağlanmayı güçlendirir.',
                    'Kısa süreli karın üstü (tummy time) çalışmaları boyun kaslarını destekler.',
                    'Kontrastlı (siyah-beyaz) görseller ilgisini çeker.',
                ],
            },
            {
                title: 'Doktora ne zaman başvurmalı?',
                points: [
                    'Emzirme/red durumunda belirgin azalma, emmeyi tamamen bırakma varsa.',
                    'Solunumda zorlanma, morarma, hızlı nefes alma gözlüyorsanız.',
                    '38°C ve üzeri ateş, özellikle 3 aydan küçük bebekte acil değerlendirme gerektirir.',
                ],
            },
            {
                title: 'Aşı takvimi (bilgilendirme)',
                points: [
                    'Ülkemizde doğumdan itibaren Hepatit B ve diğer rutin aşılar yapılır.',
                    'Kesin tarih ve dozlar için her zaman aile hekiminizin aşı kartını esas alın.',
                    'Aşı randevularını kaçırmamak için BebekIz hatırlatıcılarını kullanabilirsiniz.',
                ],
            },
            {
                title: 'Anne / baba psikolojisi',
                points: [
                    'Yorgun ve karışık hissetmek bu dönemde çok yaygındır, yalnız değilsiniz.',
                    'Uyku bulabildiğiniz her anda kısa dinlenmeler yapmaya çalışın, yardım istemekten çekinmeyin.',
                    'Uzun süren mutsuzluk, keyifsizlik veya kendinize/ bebeğe zarar verme düşünceleri varsa profesyonel destek alın.',
                ],
            },
        ],
    },
    '4-6': {
        overview: 'Bebeğiniz daha uyanık, çevreyle daha ilgili ve hareketlenmeye başlar.',
        items: [
            {
                title: 'Beslenme',
                points: [
                    'Emzirme devam ediyorsa, hala ana besin anne sütüdür.',
                    'Ek gıdaya geçiş planını mutlaka çocuk doktorunuzla konuşun (genellikle 6. ay civarı).',
                    'Su tüketimi için doktor önerisini dikkate alın, aşırıya kaçmayın.',
                ],
            },
            {
                title: 'Uyku',
                points: [
                    'Gün içinde 3-4 uyku, gece daha uzun blok uyku görülebilir.',
                    'Uyku öncesi kısa, sakin bir rutin (şarkı, loş ışık, sarılma) oluşturmak uykuya geçişi kolaylaştırır.',
                ],
            },
            {
                title: 'Gelişim & Oyun',
                points: [
                    'Ses çıkaran yumuşak oyuncaklar, kumaş kitaplar ilgisini çeker.',
                    'Bebeğin adıyla hitap etmek ve cevap verince gülümsemek sosyal gelişimi destekler.',
                    'Ellerini, ayaklarını keşfetmesine izin verin; battaniye üzerine serbest zamanlar tanıyın.',
                ],
            },
            {
                title: 'Doktora ne zaman başvurmalı?',
                points: [
                    'Beslenme sonrası aşırı kusma, kilo alamama fark ediyorsanız.',
                    'Nefeste hırıltı, inleme, çekilme (kaburga aralarında) gibi nefes darlığı bulguları varsa.',
                    'Önceki döneme göre gelişiminde gerileme hissediyorsanız.',
                ],
            },
            {
                title: 'Aşı takvimi (bilgilendirme)',
                points: [
                    '4-6 ay arası bazı aşıların tekrarı yapılır (karma, pnömokok vb.).',
                    'Aşı sonrası hafif ateş, huzursuzluk olabilir; doktorunuzun önerdiği takip planını uygulayın.',
                ],
            },
            {
                title: 'Anne / baba psikolojisi',
                points: [
                    'Rutinler oturmaya başladıkça beklentilerinizi gerçekçi tutmak sizi rahatlatır.',
                    'Eşler arası iş bölümü yapmak, yükü paylaşmak anne-baba iyilik halini güçlendirir.',
                ],
            },
        ],
    },
    '7-9': {
        overview: 'Bu dönemde dönme, desteksiz oturma ve emekleme gibi kaba motor beceriler gelişir.',
        items: [
            {
                title: 'Beslenme',
                points: [
                    'Ek gıdalar yavaş yavaş çeşitlenir; yeni gıdaları tek tek ve küçük miktarlarda deneyin.',
                    'Boğulma riskine karşı parçaların yumuşak ve çok küçük olmasına dikkat edin.',
                ],
            },
            {
                title: 'Uyku',
                points: [
                    'Gündüz 2-3 uykuya düşebilir, gece uyanmaları hala normaldir.',
                    'Uyku öncesi ekrana maruziyetten kaçının.',
                ],
            },
            {
                title: 'Gelişim & Oyun',
                points: [
                    'Kutuların içine/üstüne koyma oyunları el-göz koordinasyonunu destekler.',
                    'Ayna karşısında oyunlar, ses çıkarma ve hece tekrarlarını (ba-ba, da-da) teşvik edin.',
                ],
            },
            {
                title: 'Doktora ne zaman başvurmalı?',
                points: [
                    'Ani düşme, çarpma sonrası bilinç değişikliği veya kusma olursa.',
                    'Başını tutma, yuvarlanma, oturma gibi becerilerde belirgin gecikme hissediyorsanız.',
                ],
            },
            {
                title: 'Aşı takvimi (bilgilendirme)',
                points: [
                    '6. aydan sonra grip aşısı gibi ek aşılar için doktorunuzla görüşebilirsiniz.',
                    'Seyahat planlıyorsanız ek aşı gereksinimlerini mutlaka önceden sorun.',
                ],
            },
            {
                title: 'Anne / baba psikolojisi',
                points: [
                    'Bebeğiniz hareketlendikçe kaygılar artabilir; güvenli ortam hazırlamak kaygıyı azaltır.',
                    'Kendinize kısa da olsa “nefes alanları” yaratmak tükenmişliği önlemeye yardımcı olur.',
                ],
            },
        ],
    },
    '10-12': {
        overview: 'İlk adımlar, ilk kelimeler ve daha belirgin kişilik özellikleri bu dönemde ortaya çıkar.',
        items: [
            {
                title: 'Beslenme',
                points: [
                    'Aile sofrasına yavaş yavaş uyum sağlanır; tuz ve şeker kullanımı konusunda dikkatli olun.',
                    'Kendi kendine yemeye teşvik etmek için küçük parça gıdalar sunabilirsiniz.',
                ],
            },
            {
                title: 'Uyku',
                points: [
                    'Gece uykusu daha stabil hale gelir, gündüz uykuları 1-2’ye düşebilir.',
                    'Uyku rutinini korumaya çalışmak (aynı saat, aynı ritüel) çok yardımcı olur.',
                ],
            },
            {
                title: 'Gelişim & Oyun',
                points: [
                    'Basit yönergeler (gel, ver, al) ile iletişim becerilerini destekleyin.',
                    'Nesneleri isimlendirerek gösterme oyunları oynayın.',
                ],
            },
            {
                title: 'Doktora ne zaman başvurmalı?',
                points: [
                    'Yürümeye başlama konusunda belirgin gecikme ya da dengesizlik gözlüyorsanız.',
                    'Göz temasından kaçınma, isme tepki vermeme gibi durumlar fark ederseniz.',
                ],
            },
            {
                title: 'Aşı takvimi (bilgilendirme)',
                points: [
                    '1 yaş civarında kızamık-kabakulak-kızamıkçık (KKK) ve diğer aşılar uygulanır.',
                    'Aşı kartınızı düzenli kontrol ederek eksik dozu kalmadığından emin olun.',
                ],
            },
            {
                title: 'Anne / baba psikolojisi',
                points: [
                    '“İnat dönemi” başlangıcıyla birlikte sınır koymak zorlaşabilir; sakin kalmak çok önemlidir.',
                    'Kendinizi suçlamak yerine, zorlandığınız noktaları biriyle paylaşmak rahatlatıcı olur.',
                ],
            },
        ],
    },
    '13-24': {
        overview: 'Yürüyen, merak eden, “ben” duygusu gelişen aktif bir dönemdir.',
        items: [
            {
                title: 'Beslenme',
                points: [
                    'İştah günlere göre dalgalanabilir; tek öğünlere değil, haftalık toplam dengeye bakın.',
                    'Tatlı ve paketli gıdaları mümkün olduğunca sınırlayın.',
                ],
            },
            {
                title: 'Uyku',
                points: [
                    'Çoğu çocuk 1 gündüz uykusuna geçmiş olur.',
                    'Gece korkuları, ayrılma kaygısı görülebilir; yanında olduğunuzu sakin bir dille hissettirin.',
                ],
            },
            {
                title: 'Gelişim & Oyun',
                points: [
                    'Açık uçlu oyuncaklar (bloklar, büyük legolar, toplar) yaratıcılığı destekler.',
                    'Basit kitaplar okuyup resimler üzerinden sohbet edin.',
                    'Sınır koyarken sakin, net ve tutarlı olmaya çalışın.',
                ],
            },
            {
                title: 'Doktora ne zaman başvurmalı?',
                points: [
                    '2 yaş civarında halen tek kelimelik bile olsa hiç konuşma yoksa.',
                    'Yürüyüşte belirgin aksama, kas sertliği veya gevşekliği fark ederseniz.',
                    'Sık ve şiddetli öfke nöbetleri günlük yaşamı çok zorluyorsa profesyonel destek düşünebilirsiniz.',
                ],
            },
            {
                title: 'Aşı takvimi (bilgilendirme)',
                points: [
                    '18-24 ay arası bazı aşıların rapel (pekiştirme) dozları yapılır.',
                    'Her kontrolde çocuk doktorunuzla aşı kartını birlikte gözden geçirmek yararlıdır.',
                ],
            },
            {
                title: 'Anne / baba psikolojisi',
                points: [
                    'Kariyer, sosyal hayat ve ebeveynlik arasında denge kurmak kolay değildir; küçük adımlarla ilerleyin.',
                    'Ebeveynlikte “mükemmel” değil, “yeterince iyi” olmak hedeflenmelidir.',
                ],
            },
        ],
    },
};

const GuideScreen = () => {
    const theme = useTheme();
    const { babyProfile } = useContext(AppContext);

    const calculatedGroupId = useMemo(() => {
        const birth = babyProfile?.birthDate ? new Date(babyProfile.birthDate) : null;
        if (!birth || Number.isNaN(birth.getTime())) return '0-3';
        const now = new Date();
        const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        const ageMonths = Math.max(0, months);
        const match = AGE_GROUPS.find(g => ageMonths >= g.min && ageMonths <= g.max);
        return match ? match.id : '13-24';
    }, [babyProfile]);

    const [selectedGroupId, setSelectedGroupId] = useState(calculatedGroupId);

    const ageGroup = AGE_GROUPS.find(g => g.id === selectedGroupId) || AGE_GROUPS[0];
    const content = GUIDE_CONTENT[ageGroup.id];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Title title="Bebek Kılavuzu" />
                <Card.Content>
                    <Text style={styles.label}>Yaş Aralığı</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.ageScrollContent}
                    >
                        <SegmentedButtons
                            value={selectedGroupId}
                            onValueChange={setSelectedGroupId}
                            buttons={AGE_GROUPS.map(g => ({
                                value: g.id,
                                label: g.label,
                            }))}
                            style={styles.ageSegments}
                        />
                    </ScrollView>
                    {babyProfile?.birthDate ? (
                        <Text style={[styles.infoText, { marginTop: 8 }]}>
                            Doğum tarihi: {babyProfile.birthDate} · Bu bilgi yaş aralığını otomatik seçmek için kullanılır.
                        </Text>
                    ) : (
                        <Text style={[styles.infoText, { marginTop: 8 }]}>
                            Daha kişiselleştirilmiş öneriler için Ayarlar &gt; Bebek Profili bölümünden doğum tarihini
                            ekleyebilirsiniz.
                        </Text>
                    )}
                </Card.Content>
            </Card>

            {content && (
                <Card style={[styles.card, { marginTop: 16 }]}>
                    <Card.Content>
                        <Text style={styles.overview}>{content.overview}</Text>
                    </Card.Content>
                </Card>
            )}

            {content?.items.map(section => (
                <Card key={section.title} style={[styles.card, { marginTop: 12 }]}>
                    <List.Section>
                        <List.Accordion
                            title={section.title}
                            style={styles.accordion}
                            titleStyle={styles.accordionTitle}
                        >
                            <View style={styles.listContent}>
                                {section.points.map((p, idx) => (
                                    <View key={idx} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.point}>{p}</Text>
                                    </View>
                                ))}
                            </View>
                        </List.Accordion>
                    </List.Section>
                </Card>
            ))}

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
    ageScrollContent: {
        paddingVertical: 4,
    },
    ageSegments: {
        minWidth: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    overview: {
        fontSize: 14,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
    },
    accordion: {
        borderRadius: 16,
    },
    accordionTitle: {
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    bullet: {
        marginRight: 6,
    },
    point: {
        flex: 1,
        fontSize: 13,
    },
});

export default GuideScreen;

