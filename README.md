# FE Test Dexa - Authentication & Authorization App

Aplikasi React dengan sistem authentication dan authorization yang memiliki 3 halaman utama: Login,# Sistem Absensi Karyawan - Frontend

Ini adalah aplikasi frontend untuk sistem manajemen absensi karyawan. Dibangun menggunakan React, aplikasi ini menyediakan antarmuka bagi karyawan untuk melakukan absensi dan bagi admin untuk mengelola data karyawan serta memantau rekap absensi.

## Fitur Utama

### Untuk Karyawan
- **Login & Autentikasi**: Sistem login aman menggunakan kredensial (Employee ID & Password). Sesi dikelola menggunakan cookie `HttpOnly`.
- **Dashboard Utama**: Menampilkan informasi pengguna yang sedang login, waktu saat ini (dalam zona waktu WIB), dan status API backend.
- **Absensi (Clock-in/Clock-out)**: Karyawan dapat melakukan absensi dengan mengambil foto selfie.
- **Riwayat Absensi Pribadi**: Melihat riwayat absensi pribadi langsung di dashboard.

### Untuk Admin
- **Dashboard Admin**: Halaman khusus yang hanya dapat diakses oleh pengguna dengan peran 'admin'.
- **Manajemen Karyawan**:
  - Menambah karyawan baru.
  - Mengedit informasi karyawan yang sudah ada.
  - Melihat daftar semua karyawan.
- **Rekap Absensi Keseluruhan**:
  - Melihat riwayat absensi dari semua karyawan dalam satu tampilan.
  - Fitur filter berdasarkan **ID/Nama Karyawan** dan **Tanggal** untuk memudahkan pencarian.
  - Melihat foto absensi dari setiap catatan.

## Teknologi yang Digunakan

- **Framework**: [React.js](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
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
    - Tambahkan variabel berikut ke dalam file `.env` dan sesuaikan nilainya dengan URL backend Anda:
      ```
      VITE_API_BASE_URL=http://localhost:3000
      ```

## Menjalankan Aplikasi

1.  **Menjalankan dalam Mode Development:**
    Perintah ini akan menjalankan aplikasi dengan hot-reloading, cocok untuk pengembangan.
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173` (atau port lain jika 5173 sudah digunakan).

2.  **Membuat Build untuk Produksi:**
    Perintah ini akan membuat versi optimis dari aplikasi Anda di dalam folder `dist`.
    ```bash
    npm run build
    ```

3.  **Menjalankan Build Produksi secara Lokal:**
    Gunakan perintah ini untuk melihat hasil build produksi di lingkungan lokal.
    ```bash
    npm run preview
    ```

## Struktur Proyek

```
/
├── public/         # Aset statis
├── src/
│   ├── assets/       # Gambar dan aset lainnya
│   ├── components/   # Komponen React yang dapat digunakan kembali
│   ├── context/      # React Context untuk state global (misal: AuthContext)
│   ├── pages/        # Komponen yang berfungsi sebagai halaman (misal: Home, Login)
│   ├── utils/        # Fungsi bantuan (misal: api.js untuk koneksi backend)
│   ├── App.jsx       # Komponen utama dan routing
│   └── main.jsx      # Titik masuk aplikasi
├── .env            # File environment variable (dibuat manual)
├── package.json    # Daftar dependensi dan skrip proyek
└── README.md       # Dokumentasi proyek
```
 dan Admin Dashboard.

## 🚀 Fitur

- **Authentication System**: Login/logout dengan penyimpanan session di localStorage
- **Role-based Authorization**: Pembatasan akses berdasarkan role user
- **Protected Routes**: Halaman yang hanya dapat diakses setelah login
- **Attendance System**: Absensi dengan upload foto untuk verifikasi kehadiran
- **File Upload**: Upload gambar dengan validasi format dan ukuran
- **Responsive Design**: Menggunakan Tailwind CSS untuk styling

## 📱 Halaman

### 1. Login Page (`/login`)
- Halaman publik untuk login
- Demo accounts tersedia:
  - **Admin**: `admin` / `admin123` (role: hr)
  - **User**: `user` / `user123` (role: user)
- Redirect otomatis ke `/home` jika sudah login

### 2. Home Page (`/home`)
- **Protected route** - hanya bisa diakses setelah login
- Menampilkan informasi profile user
- **Attendance System**: Form absensi dengan upload foto
- Riwayat attendance
- JWT token info (untuk debugging)
- Tombol logout
- Tombol "Admin Dashboard" (hanya tampil untuk role hr)

### 3. Admin Dashboard (`/admin`)
- **Protected route** dengan **role restriction** - hanya bisa diakses oleh role `hr`
- Menampilkan dashboard HR dengan statistik dan tools
- Tombol logout dan navigasi ke home

## 🛡️ Sistem Keamanan

### Authentication
- User harus login untuk mengakses halaman protected
- Session disimpan di localStorage
- Auto-redirect ke login jika belum authenticate

### Authorization
- **Role-based access control**
- User biasa: hanya bisa akses `/home`
- HR role: bisa akses `/home` dan `/admin`
- Access denied message untuk user yang tidak memiliki permission

## 🏗️ Struktur Project

```
src/
├── context/
│   └── AuthContext.jsx      # Context untuk authentication
├── components/
│   └── ProtectedRoute.jsx   # Component untuk protected routes
├── pages/
│   ├── Login.jsx           # Halaman login
│   ├── Home.jsx            # Halaman home (protected)
│   └── AdminDashboard.jsx  # Dashboard admin (hr only)
└── App.jsx                 # Main app dengan routing
```

## 📦 Dependencies

- **React Router DOM**: Untuk routing dan navigasi
- **Tailwind CSS**: Untuk styling
- **React Context**: Untuk state management authentication

## 🚀 Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
# Copy example env file
cp .env.example .env

# Edit .env file sesuai kebutuhan
# Default: VITE_API_BASE_URL=http://localhost:3000
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di `http://localhost:5173`

## ⚙️ Environment Variables

Aplikasi menggunakan environment variables untuk konfigurasi:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base URL untuk API backend |
| `VITE_NODE_ENV` | `development` | Environment mode |

**Catatan:** Vite memerlukan prefix `VITE_` untuk environment variables yang dapat diakses di frontend.

## � API Integration

Aplikasi ini telah diintegrasikan dengan API backend untuk authentication:

- **API Endpoint**: `http://localhost:3000/auth/login`
- **Authentication**: JWT Token based
- **Storage**: Token dan user data disimpan di localStorage
- **Status Indicator**: Real-time API connection status di login page

### API Requirements
Pastikan backend API Anda running di `http://localhost:3000` dengan endpoint:
- `POST /auth/login` - untuk login authentication

**Response Format yang didukung:**
```json
{
  "token": "jwt_token",
  "user": { 
    "email": "string", 
    "role": "hr|user", 
    "fullName": "string" 
  }
}
```

### API Endpoints
- `POST /auth/login` - Authentication
- `POST /attendance` - Submit attendance dengan foto

Lihat [API_INTEGRATION.md](./API_INTEGRATION.md) dan [ATTENDANCE_FEATURE.md](./ATTENDANCE_FEATURE.md) untuk detail lengkap.

## 🎯 Flow Aplikasi

1. **Start**: User mengakses aplikasi → redirect ke `/login`
2. **Login**: User login dengan credentials → redirect ke `/home`
3. **Home**: User melihat profile dan bisa logout
4. **Admin** (jika role hr): User bisa akses admin dashboard
5. **Logout**: User logout → redirect ke `/login`

## ✨ Fitur Keamanan

- ✅ Protected routes dengan authentication check
- ✅ Role-based authorization untuk admin features
- ✅ Auto-redirect untuk unauthenticated users  
- ✅ Session persistence dengan localStorage
- ✅ Access denied handling untuk unauthorized access
- ✅ Logout functionality di semua protected pages+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
