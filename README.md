# 🍼 MPASI App — Menu Bayi dari Dapur Mama

Generator menu MPASI bertenaga AI untuk bayi usia 6–12 bulan.

---

## 🚀 Cara Deploy ke Vercel (Step by Step)

### Langkah 1 — Install Node.js
Download dan install dari: https://nodejs.org (pilih versi LTS)

### Langkah 2 — Buat Akun GitHub
1. Buka https://github.com → Sign Up (gratis)
2. Buat repository baru bernama `mpasi-app`
3. Upload semua file dari folder ini

### Langkah 3 — Upload ke GitHub
Buka terminal / command prompt di folder ini, lalu jalankan:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/mpasi-app.git
git push -u origin main
```
*(ganti USERNAME dengan username GitHub kamu)*

### Langkah 4 — Deploy ke Vercel
1. Buka https://vercel.com → Sign Up with GitHub (gratis)
2. Klik **"Add New Project"**
3. Pilih repository `mpasi-app`
4. Klik **"Deploy"** — tunggu 1–2 menit
5. ✅ Dapat link seperti: `mpasi-app.vercel.app`

### Langkah 5 — Tambah API Key (WAJIB untuk fitur AI)
1. Buka https://console.anthropic.com → daftar gratis
2. Klik **"API Keys"** → **"Create Key"** → copy key-nya
3. Di Vercel dashboard → pilih project → **Settings** → **Environment Variables**
4. Tambahkan:
   - **Name:** `VITE_ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxx...` (paste API key kamu)
5. Klik **Save** → lalu **Redeploy** project

---

## 💻 Menjalankan di Lokal (untuk testing)

```bash
# Install dependencies
npm install

# Buat file .env.local
echo "VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx" > .env.local

# Jalankan
npm run dev

# Buka browser → http://localhost:5173
```

---

## 📁 Struktur File

```
mpasi-app/
├── index.html          ← Entry HTML
├── vite.config.js      ← Konfigurasi Vite
├── package.json        ← Dependencies
├── vercel.json         ← Konfigurasi Vercel
└── src/
    ├── main.jsx        ← Entry React
    └── App.jsx         ← Semua kode aplikasi
```

---

## ✨ Fitur Aplikasi

- 🎯 **Onboarding** — Setup profil bayi (nama, usia, alergi)
- 🤖 **Generator AI** — Input bahan → dapat 4 resep dari AI
- 📅 **Jadwal Mingguan** — Atur menu Senin–Minggu
- 💾 **Simpan Favorit** — Koleksi resep kesukaan
- 📚 **Panduan Lengkap** — Tekstur, tabel usia, FAQ

---

## 🆓 Biaya

| Layanan | Biaya |
|---------|-------|
| Vercel hosting | **GRATIS** |
| GitHub | **GRATIS** |
| Anthropic API | $5 kredit gratis saat daftar |

---

Dibuat dengan ❤️ untuk semua Mama Indonesia
