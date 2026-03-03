# BebekIz (babyLz App)

BebekIz, ebeveynlerin bebeklerinin günlük bakımını ve gelişimini takip etmesini kolaylaştırmak için hazırlanmış bir **mobil takip uygulamasıdır**.  
Beslenme, ruh hali, hatırlatıcılar, raporlar, psikoloji günlüğü ve yaşa göre kılavuz gibi bölümler içerir.

---

## Özellikler

- **Ana Sayfa (Dashboard)**: Son beslenmeler, ruh hali girişleri ve hızlı özetler.
- **Besleme**: Emzirme / mama gibi beslenme kayıtları.
- **Günlük (Psikoloji)**: Anne/baba duyguları ve notlar için günlük alanı.
- **Kılavuz**: Bebeğin yaş ayına göre dinamik içerik ve öneriler.
- **Hatırlatıcılar**: Aşı, ilaç vb. için uygulama içi hatırlatma kayıtları.
- **Rapor**: Zaman içindeki verileri özetleyen rapor ekranı.
- **Sohbet Asistanı (Chatbot)**: Annelerin basit sorularına yanıt veren, uygulama içi mini asistan.

Ek olarak projeye bir **`.spk` dosyası** eklendi; bu dosya proje ile ilgili ek materyal/doküman olarak repoda saklanmaktadır.

---

## Kurulum

1. Depoyu klonla:

```bash
git clone https://github.com/Bbusenur/babyLz_App.git
cd babyLz_App
```

2. Bağımlılıkları yükle:

```bash
npm install
```

veya

```bash
yarn
```

---

## Geliştirme Ortamında Çalıştırma

Expo ile:

```bash
npx expo start
```

Sonrasında:

- Terminalde **`a`** ile Android emülatörde,
- **`w`** ile web tarayıcıda,
- veya QR kod ile gerçek cihazda çalıştırabilirsin.

> Not: Bu projede `expo-notifications` push fonksiyonu Expo Go içinde devre dışı bırakılmıştır; hatırlatıcılar şu an sadece uygulama içinde liste olarak tutulur.

---

## Kullanılan Teknolojiler

- **React Native** (Expo)
- **React Navigation** (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
- **React Native Paper** (UI bileşenleri)
- **AsyncStorage** (yerel veri saklama)
- **Lucide React Native** (ikon seti)

---

## Geliştirme Notları

- Kod yapısı temel olarak:
  - `src/screens` – ekran bileşenleri
  - `src/navigation` – sekme ve stack navigasyonları
  - `src/context` – `AppContext` ile global durum yönetimi
  - `src/constants` – tema ve sabitler

