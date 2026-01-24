# Expense Tracker

Modern ve kullanıcı dostu bir gelir-gider takip uygulaması. React, TypeScript ve Tailwind CSS ile geliştirilmiştir.

![Expense Tracker](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Özellikler

- **Gelir/Gider Yönetimi**: İşlem ekleme, düzenleme ve silme (CRUD)
- **Kategoriler**: Varsayılan ve özel kategoriler ile işlem sınıflandırma
- **Grafikler**: Recharts ile görsel analiz (Pie, Bar, Area charts)
- **Filtreler**: Tarih, tip, kategori ve arama ile filtreleme
- **CSV Export**: Filtrelenmiş verileri CSV olarak dışa aktarma
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Dark Mode**: Koyu tema desteği
- **Veri Kalıcılığı**: localStorage ile offline veri saklama

## Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Zustand | State Management |
| React Hook Form | Form Handling |
| Zod | Validation |
| Recharts | Charts |
| React Router | Routing |
| Lucide React | Icons |
| date-fns | Date Formatting |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## Proje Yapısı

```
src/
├── components/
│   ├── ui/              # Button, Modal, Input, Card, Select
│   ├── layout/          # Header, Sidebar, Layout
│   ├── transactions/    # TransactionForm, TransactionList, TransactionItem
│   ├── categories/      # CategoryBadge
│   ├── charts/          # CategoryPieChart, MonthlyBarChart, ExpenseChart
│   └── filters/         # FilterBar
├── pages/
│   ├── Dashboard.tsx    # Ana sayfa
│   └── Transactions.tsx # İşlemler sayfası
├── stores/
│   ├── transactionStore.ts  # İşlem state'i
│   ├── categoryStore.ts     # Kategori state'i
│   └── filterStore.ts       # Filtre state'i
├── schemas/
│   └── transactionSchema.ts # Zod validasyon
├── types/
│   └── index.ts         # TypeScript tipleri
├── utils/
│   ├── localStorage.ts  # LocalStorage yardımcıları
│   ├── formatters.ts    # Tarih/para formatlaması
│   └── exportCSV.ts     # CSV export
├── App.tsx
├── main.tsx
└── index.css
```

## Sayfalar

### Dashboard (/)
- Toplam bakiye, gelir ve gider kartları
- Aylık trend grafiği (Area Chart)
- Kategori dağılımı (Pie Chart)
- Son 5 işlem listesi

### İşlemler (/transactions)
- Tam filtre desteği (tarih, tip, kategori, arama)
- Tüm işlemlerin listesi
- CSV export özelliği
- Filtrelenmiş özet bilgiler

## Varsayılan Kategoriler

**Gider Kategorileri:**
- Yiyecek, Ulaşım, Faturalar, Eğlence, Sağlık, Alışveriş, Diğer

**Gelir Kategorileri:**
- Maaş, Freelance, Yatırım, Hediye, Diğer

## Kullanım

1. **Yeni İşlem Ekle**: "Yeni İşlem" butonuna tıklayın
2. **İşlem Tipi Seç**: Gelir veya Gider seçin
3. **Detayları Girin**: Tutar, kategori, tarih ve açıklama
4. **Kaydet**: İşlemi kaydedin

## Geliştirme

```bash
# Lint kontrolü
npm run lint

# Type kontrolü
npx tsc --noEmit
```

## Deploy

Netlify için build komutu:

```bash
npm run build
```

Build çıktısı `dist` klasöründe oluşur.

## Lisans

MIT

---

**Geliştirici**: Expense Tracker Team
