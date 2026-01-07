# 📱 Catatan Harian Komisi Treatment - OREA 85

Aplikasi pencatatan komisi treatment terapis yang modern dan elegan dikembangkan oleh OREA 85.

## 🌟 Fitur Utama

### 📝 Manajemen Komisi
- **Input Data**: Form lengkap dengan 35+ pilihan treatment
- **Real-time WIB Clock**: Jam digital Indonesia Barat (GMT+7) yang update otomatis
- **Auto Date Management**: Pergantian tanggal tengah malam otomatis
- **Input Time Tracking**: Mencatat waktu input setiap entry
- **Luxury Design**: UI/UX yang elegan dan modern

### 📊 Dashboard & Analytics
- **Weekly Statistics**: Total komisi mingguan dengan navigasi
- **Daily Logs**: Tabel data harian dengan grouping per tanggal
- **Export Features**: Export ke CSV dan share ke WhatsApp/Telegram
- **Smart Filter**: Filter data berdasarkan rentang tanggal
- **Delete Confirmation**: Hapus data dengan konfirmasi detail

### 🎨 PWA Features
- **Install to Home Screen**: Bisa diinstall sebagai aplikasi native
- **Offline Support**: Berfungsi tanpa koneksi internet
- **Service Worker**: Cache management untuk performa optimal
- **Responsive Design**: Berfungsi sempurna di semua device

## 🛠️ Teknologi

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5 untuk type safety
- **Styling**: Tailwind CSS 4 dengan shadcn/ui components
- **State Management**: React hooks dengan localStorage
- **Icons**: Lucide React icons
- **Timezone**: WIB (GMT+7) untuk akurasi waktu Indonesia
- **PWA**: Complete Progressive Web App implementation

## 💰 Daftar Treatment

### 🪑 Chair Refleksi
- Chair Refleksi 1 jam: Rp 50.000 (Komisi: Rp 15.000)
- Chair Refleksi 1,5 jam: Rp 75.000 (Komisi: Rp 22.500)
- Chair Refleksi 2 jam: Rp 100.000 (Komisi: Rp 30.000)

### 💆 Facial Bath (FB)
- FB 1,5 jam: Rp 120.000 (Komisi: Rp 36.000)
- FB 2 jam: Rp 150.000 (Komisi: Rp 45.000)
- FB + Lulur 1,5 jam: Rp 175.000 (Komisi: Rp 52.500)
- FB + Lulur 2 jam: Rp 200.000 (Komisi: Rp 60.000)
- FB + Totok Wajah 1,5 jam: Rp 175.000 (Komisi: Rp 52.500)
- FB + Totok Wajah 2 jam: Rp 200.000 (Komisi: Rp 60.000)
- FB + Kerokan 1,5 jam: Rp 175.000 (Komisi: Rp 52.500)
- FB + Kerokan 2 jam: Rp 200.000 (Komisi: Rp 60.000)
- FB + Refleksi 1,5 jam: Rp 175.000 (Komisi: Rp 52.500)

### 🎯 Sport Massage
- Sport Massage 1 jam: Rp 80.000 (Komisi: Rp 24.000)
- Sport Massage 1,5 jam: Rp 110.000 (Komisi: Rp 33.000)

### 🤰 Prenatal
- Prenatal 1,5 jam: Rp 120.000 (Komisi: Rp 36.000)
- Prenatal 2 jam: Rp 150.000 (Komisi: Rp 45.000)
- Prenatal + Lulur 1,5 jam: Rp 175.000 (Komisi: Rp 52.500)
- Prenatal + Lulur 2 jam: Rp 205.000 (Komisi: Rp 61.500)

### 👶 Post Natal
- Post Natal 1 jam: Rp 80.000 (Komisi: Rp 24.000)
- Pijat Laktasi: Rp 80.000 (Komisi: Rp 24.000)
- Bengkung: Rp 80.000 (Komisi: Rp 24.000)
- Post Natal Paket 2 jam: Rp 150.000 (Komisi: Rp 45.000)

### 💆 Specialized Treatments
- Brazilian Lympatic 1 jam: Rp 150.000 (Komisi: Rp 45.000)
- Brazilian Lympatic 1,5 jam: Rp 200.000 (Komisi: Rp 60.000)
- Facial Lympatic 30 menit: Rp 100.000 (Komisi: Rp 30.000)
- Manual Lympatic 1 jam: Rp 120.000 (Komisi: Rp 36.000)

### ➕ Add On Services
- Add on FB: Rp 120.000 (Komisi: Rp 36.000)
- Add on Lulur: Rp 55.000 (Komisi: Rp 16.500)
- Add on Totok Wajah: Rp 55.000 (Komisi: Rp 16.500)
- Add on Kerokan: Rp 55.000 (Komisi: Rp 16.500)
- Add on Refleksi: Rp 55.000 (Komisi: Rp 16.500)

## 🚀 Installation

### Prerequisites
- Node.js 14+ 
- npm atau yarn

### Development Setup
```bash
# Clone repository
git clone https://github.com/orea-85/komisi-treatment-app.git

# Install dependencies
cd komisi-treatment-app
npm install

# Run development server
npm run dev
```

Buka http://localhost:3000 di browser

### Production Build
```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

## 📱 Cara Penggunaan

### 1. Input Data Treatment
- Pilih nama treatment dari dropdown
- Tanggal otomatis menggunakan hari ini (WIB)
- Komisi terhitung otomatis
- Klik "Add Entry" untuk menyimpan

### 2. View Data
- Data dikelompokkan per tanggal
- Menampilkan waktu input, treatment, dan komisi
- Statistik real-time total komisi mingguan
- Navigasi minggu sebelumnya/selanjutnya

### 3. Export & Share
- **CSV Export**: Download data dalam format CSV
- **WhatsApp Share**: Bagikan ke WhatsApp
- **Telegram Share**: Bagikan ke Telegram  
- **Copy to Clipboard**: Salin data

### 4. Filter Data
- Filter berdasarkan rentang tanggal
- Apply filter untuk menampilkan data spesifik
- Reset filter untuk kembali ke semua data

## 🌐 PWA Installation

### Install ke Home Screen
1. Buka aplikasi di Chrome/Edge/Firefox/Safari
2. Klik tombol "Install" yang muncul
3. Aplikasi akan terinstall di device
4. Icon muncul di home screen

### Offline Mode
- Aplikasi berfungsi tanpa internet
- Data tersimpan lokal di browser
- Sync otomatis saat online kembali

## 📊 Data Management

### Security & Privacy
- Data tersimpan 100% lokal di browser
- Tidak ada pengiriman data ke server
- Full privacy compliance
- GDPR compliant

### Backup & Export
- Export data kapan saja dalam format CSV
- Share data ke berbagai platform
- Copy data untuk backup manual

## 🛠️ Developer Information

- **Developer**: OREA 85 Team
- **Version**: 1.0.0
- **License**: Private
- **Contact**: Instagram: @orea_85
- **Website**: https://orea-85.com

## 📄 Tech Stack Details

### Frontend
- Next.js 15.3.8 dengan App Router
- TypeScript 5.7.2
- Tailwind CSS 4.0
- shadcn/ui components
- Lucide React icons
- date-fns untuk date handling

### PWA Features
- Service Worker dengan cache-first strategy
- Complete manifest.json dengan metadata
- 8 ukuran icons (72x72 hingga 512x512)
- Splash screens untuk berbagai orientasi
- Background sync capabilities

### Performance
- Optimized build dengan Next.js
- Lazy loading untuk components
- Efficient caching strategy
- Minimal bundle size
- Fast loading times

## 🎯 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### Docker
```bash
docker build -t komisi-treatment .
docker run -p 3000:3000 komisi-treatment
```

### Static Hosting
Build dan deploy folder `.next` ke hosting manapun

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Configuration

### Environment Variables
Tidak diperlukan untuk development basic

### Customization
- Edit treatment list di `src/app/page.tsx`
- Customize styling di `src/app/globals.css`
- Modify PWA settings di `public/manifest.json`

## 📞 Support

Untuk support dan pertanyaan:
- Instagram: @orea_85
- Email: info@orea-85.com

---

📱 **Dikembangkan dengan ❤️ oleh OREA 85**  
🌟 **Untuk therapist Indonesia yang modern dan produktif**