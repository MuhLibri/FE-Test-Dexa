# Sistem Absensi dan Manajemen Karyawan - Frontend

Ini adalah aplikasi frontend untuk sistem manajemen absensi karyawan. Dibangun menggunakan React, aplikasi ini menyediakan antarmuka bagi karyawan untuk melakukan absensi dan bagi admin untuk mengelola data karyawan serta memantau rekap absensi.

## Fitur Utama

### Untuk Karyawan
- **Login & Autentikasi**: Sistem login aman menggunakan kredensial (Employee ID & Password). Sesi dikelola menggunakan cookie `HttpOnly` untuk keamanan.
- **Dashboard Utama**: Menampilkan informasi pengguna yang sedang login, waktu saat ini (dalam zona waktu WIB), dan absensi pengguna.
- **Absensi**: Karyawan dapat melakukan absensi dengan mengirim foto sebagai bukti kehadiran.
- **Riwayat Absensi Pribadi**: Melihat riwayat absensi pribadi langsung di dashboard.

### Untuk Admin (Peran: `hr`)
- **Dashboard Admin**: Halaman khusus yang hanya dapat diakses oleh pengguna dengan peran 'hr'.
- **Manajemen Karyawan**:
  - Menambah karyawan baru dengan detail lengkap.
  - Mengedit informasi karyawan yang sudah ada (beberapa field seperti ID, nama, dan email tidak dapat diubah).
  - Melihat daftar semua karyawan dalam satu tampilan.
- **Rekap Absensi Keseluruhan**:
  - Melihat riwayat absensi dari semua karyawan dalam satu tampilan modal.
  - Fitur filter berdasarkan **ID/Nama Karyawan** dan **Tanggal** untuk memudahkan pencarian data.
  - Melihat foto absensi dari setiap catatan untuk verifikasi.

## Teknologi yang Digunakan

- **Framework**: [React.js](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API untuk manajemen autentikasi global.
- **Bahasa**: JavaScript (ES6+)

## Prasyarat

- [Node.js](https://nodejs.org/) (versi 18.x atau lebih tinggi direkomendasikan)
- [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)

## Instalasi dan Setup

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/MuhLibri/FE-Test-Dexa.git
    cd FE-Test-Dexa
    ```

2.  **Instal dependensi proyek:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable:**
    - Buat file baru bernama `.env` di root direktori proyek.
    - Tambahkan variabel berikut ke dalam file `.env` dan sesuaikan nilainya agar menunjuk ke URL API backend Anda:
      ```
      VITE_API_BASE_URL=http://localhost:3000
      ```

## Menjalankan Aplikasi

1.  **Menjalankan dalam Mode Development:**
    Perintah ini akan menjalankan server pengembangan dengan fitur *hot-reloading*.
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173` (atau port lain jika 5173 sudah digunakan).

2.  **Membuat Build untuk Produksi:**
    Perintah ini akan mengkompilasi dan mengoptimalkan aplikasi untuk produksi ke dalam folder `dist`.
    ```bash
    npm run build
    ```

3.  **Menjalankan Build Produksi secara Lokal:**
    Gunakan perintah ini untuk melihat pratinjau dari build produksi di lingkungan lokal.
    ```bash
    npm run preview
    ```

## Struktur Proyek

```
/
├── public/         # Aset statis (contoh: ikon)
├── src/
│   ├── assets/       # Gambar dan aset lainnya (svg, dll.)
│   ├── components/   # Komponen React yang dapat digunakan kembali di berbagai halaman
│   ├── context/      # React Context untuk state global (AuthContext)
│   ├── pages/        # Komponen yang berfungsi sebagai halaman (Home, Login, AdminDashboard)
│   ├── utils/        # Fungsi bantuan (api.js untuk koneksi backend, env.js, dll.)
│   ├── App.jsx       # Komponen utama yang mengatur routing aplikasi
│   └── main.jsx      # Titik masuk (entry point) aplikasi React
├── .env            # File environment variable (dibuat manual)
├── package.json    # Daftar dependensi dan skrip proyek
└── README.md       # Dokumentasi proyek
```

## Flow Aplikasi

1. **Start**: User mengakses aplikasi → redirect ke `/login`
2. **Login**: User login dengan credentials → redirect ke `/home`
3. **Home**: User melihat profile dan bisa logout
4. **Admin** (jika role hr): User bisa akses admin dashboard
5. **Logout**: User logout → redirect ke `/login`
