# TRD - Layihə İdarəetmə və Xərclərin Hesabat Sistemi

## 📋 Layihə Haqqında

TRD (Layihə İdarəetmə və Xərclərin Hesabat Sistemi) - bu, admin və işçilərin layihələrdə maliyyə əməliyyatlarını idarə etməsinə imkan verən müasir web tətbiqidir.

## ✨ Əsas Funksionallıqlar

### 🔐 Authentication & Authorization
- **Email + Şifrə ilə giriş**
- **OTP (One-Time Password) təsdiqləmə**
- **Rol əsaslı icazə sistemi** (Admin, User)
- **Təhlükəsiz sessiya idarəetməsi**

### 👥 İstifadəçi Rolları

#### Admin
- ✅ Yeni layihə yaradır
- ✅ Layihəyə işçiləri əlavə edir
- ✅ Layihənin ümumi xərclərini və qalıq büdcəsini izləyir
- ✅ Ümumi hesabatlara baxır
- ✅ Bütün istifadəçiləri idarə edir

#### İşçi (User)
- ✅ Daxil olduğu layihədə pul əlavə edir
- ✅ Xərc əlavə edir
- ✅ Öz əməliyyatlarını izləyir
- ✅ Layihə büdcəsinin avtomatik yenilənməsini görür

### 📊 Dashboard & Analytics
- **Real-time statistikalar**
- **Layihə büdcəsi və xərc analizi**
- **Son əməliyyatlar cədvəli**
- **Progress barları və vizual göstəricilər**

### 🏗️ Layihə İdarəetməsi
- **Layihə yaradılması və redaktəsi**
- **Status idarəetməsi** (Aktiv, Tamamlandı, Dayandırılıb)
- **Tarix və təsvir idarəetməsi**
- **İşçi təyin etməsi**
- **Avtomatik büdcə hesablanması**

### 💰 Əməliyyat Sistemi
- **Pul daxilolması** (vəsait əlavə etmə)
- **Xərc əlavə etmə**
- **8 fərqli kateqoriya** (Material, Maaş, Avadanlıq, və s.)
- **Real-time büdcə yenilənməsi**
- **Ətraflı əməliyyat tarixçəsi**

### 📈 Hesabatlar & Analitika
- **Ümumi və layihə əsaslı hesabatlar**
- **Tarix aralığı filtrləri**
- **Kateqoriya bölgüsü analizi**
- **Aylıq trend analizi**
- **PDF/CSV eksportu (gələcəkdə)**

### 🔔 Bildiriş Sistemi
- **Real-time bildirişlər**
- **Büdcə xəbərdarlıqları**
- **Yeni əməliyyat bildirişləri**
- **Bildiriş filtrləri və idarəetməsi**

### ⚙️ Tənzimləmələr
- **Profil məlumatları**
- **Şifrə dəyişdirilməsi**
- **Bildiriş tənzimləmələri**
- **Dil və vaxt qurşağı seçimi**
- **Sistem məlumatları**

## 🛠️ Texnologiyalar

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form management
- **Zod** - Validation
- **Recharts** - Charts (gələcəkdə)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static typing

## 🚀 Quraşdırma və İşə Salma

### Tələblər
- Node.js 18+ 
- npm və ya yarn

### Quraşdırma Addımları

1. **Repository-ni klonlayın:**
```bash
git clone <repository-url>
cd trdproject
```

2. **Dependencies quraşdırın:**
```bash
npm install
```

3. **Development server-i işə salın:**
```bash
npm run dev
```

4. **Brauzerdə açın:**
```
http://localhost:3000
```

## 🔑 Demo Giriş Məlumatları

### Admin Hesabı
- **Email:** admin@trd.az
- **Şifrə:** password123
- **OTP:** 123456

### İşçi Hesabı
- **Email:** memmed@trd.az
- **Şifrə:** password123
- **OTP:** 123456

## 📱 Responsive Design

Tətbiq bütün cihazlarda optimal işləyir:
- 📱 Mobil telefonlar
- 📱 Tabletlər
- 💻 Desktop kompüterlər
- 🖥️ Böyük ekranlar

## 🎨 UI/UX Xüsusiyyətləri

- **Modern və təmiz dizayn**
- **Dark/Light mode dəstəyi** (gələcəkdə)
- **Intuitive navigation**
- **Accessible design**
- **Loading states və animations**
- **Error handling və feedback**

## 🔒 Təhlükəsizlik

- **JWT token authentication**
- **Role-based access control**
- **Input validation və sanitization**
- **HTTPS ready**
- **Secure session management**

## 📊 Mock Data

Layihə tam funksional mock data ilə gəlir:
- **4 nümunə layihə**
- **5 nümunə istifadəçi**
- **100+ nümunə əməliyyat**
- **Realistic maliyyə məlumatları**

## 🚀 Gələcək Funksionallıqlar

- [ ] **Real backend API inteqrasiyası**
- [ ] **PDF/CSV eksportu**
- [ ] **Real-time notifications**
- [ ] **Advanced charts və graphs**
- [ ] **Offline mode**
- [ ] **Mobile app**
- [ ] **Multi-language support**
- [ ] **Advanced reporting**
- [ ] **API documentation**
- [ ] **Unit və integration testlər**

## 📁 Layihə Strukturu

```
trdproject/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard səhifəsi
│   ├── projects/          # Layihə idarəetməsi
│   ├── users/             # İstifadəçi idarəetməsi
│   ├── transactions/      # Əməliyyat idarəetməsi
│   ├── reports/           # Hesabatlar
│   ├── notifications/     # Bildirişlər
│   ├── settings/          # Tənzimləmələr
│   └── login/             # Giriş səhifəsi
├── components/            # React komponentləri
│   ├── layout/           # Layout komponentləri
│   └── modals/           # Modal komponentləri
├── contexts/             # React Context API
├── lib/                  # Utility funksiyaları
│   ├── mock-data.ts      # Mock data
│   ├── utils.ts          # Helper funksiyalar
│   └── validations.ts    # Validation schemas
├── types/                # TypeScript type definitions
└── public/               # Static fayllar
```

## 👨‍💻 Developer Notları

### Code Style
- **TypeScript** istifadə edin
- **Functional components** və **hooks** istifadə edin
- **Consistent naming conventions**
- **Proper error handling**
- **Accessibility** standartlarına uyğunluq

### Performance
- **Code splitting** və **lazy loading**
- **Image optimization**
- **Bundle size optimization**
- **Caching strategies**

## 📞 Dəstək və Əlaqə

- **Email:** support@trd.az
- **Telefon:** +994 12 345 67 89
- **İş saatları:** Bazar ertəsi - Cümə, 09:00 - 18:00

## 📄 Lisenziya

Bu layihə MIT lisenziyası altında lisenziyalaşdırılıb.

---

**TRD Sistem** - Layihə İdarəetmə və Xərclərin Hesabat Sistemi v1.0.0