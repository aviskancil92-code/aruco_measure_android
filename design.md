# AR Measure — Rencana Desain Antarmuka

## Arah Produk

AR Measure adalah alat ukur berbasis kamera untuk memperkirakan lebar dan tinggi benda datar menggunakan marker ArUco sebagai referensi skala. Antarmuka dirancang untuk penggunaan satu tangan dalam orientasi portrait, dengan kamera sebagai fokus utama dan status pengukuran yang selalu terbaca.

Spesifikasi awal pengguna menyebut Python, Kivy, OpenCV, NumPy, dan Buildozer. Proyek WebDev mobile ini menggunakan Expo/React Native sebagai runtime aplikasi yang tersedia; karena itu desain dan domain pipeline dibuat modular agar lapisan kamera dan computer vision native dapat diganti atau dihubungkan kemudian tanpa mengubah MeasurementEngine dan UI utama.

## Daftar Layar

| Layar | Konten utama | Fungsi |
|---|---|---|
| Ukur / Measure | Preview kamera, reticle, overlay marker dan bounding box, status, hasil width/height | Menjalankan sesi pengukuran real-time, mulai, ukur, reset |
| Panduan / Guide | Langkah menempatkan marker 5 cm, tips pencahayaan dan jarak, batasan akurasi | Membantu pengguna mendapatkan hasil yang lebih stabil |
| Pengaturan / Settings | Ukuran marker, mode koreksi perspektif, calibration opsional, FPS processing | Mengubah parameter lokal tanpa akun atau cloud |
| Riwayat / History | Daftar pengukuran tersimpan secara lokal dengan waktu dan dimensi | Melihat hasil sebelumnya dan menghapus riwayat |

## Layar Ukur

Header menampilkan nama AR Measure, indikator kamera aktif, serta tombol ringkas menuju panduan. Di bawahnya terdapat kartu status yang memakai warna semantik: amber untuk “Position marker”, hijau untuk “Ready to measure”, merah untuk error kamera/marker, dan ungu untuk hasil yang masih distabilkan.

Sebagian besar layar diisi preview kamera berbentuk rounded rectangle dengan frame gelap. Reticle tipis di tengah membantu pengguna menempatkan benda. Overlay visual menggunakan garis cyan untuk corner marker ArUco, garis lime untuk bounding box objek, label ID marker, serta label dimensi yang menempel dekat sisi objek. Jika kamera belum tersedia pada preview web, layar menampilkan simulasi visual yang menjelaskan mode kamera belum aktif tanpa menyajikan angka pengukuran palsu.

Panel hasil di bagian bawah preview memakai dua kolom besar: **Width** dan **Height**, masing-masing menampilkan “—” sebelum pengukuran valid dan satuan cm setelah valid. Tombol utama “Start camera” berubah menjadi “Pause camera” saat aktif. Tombol sekunder “Measure” hanya aktif setelah marker dan objek tervalidasi. Tombol “Reset” menghapus overlay dan hasil sesi.

## Layar Panduan

Panduan memakai kartu vertikal dengan ilustrasi sederhana: tempel marker ArUco 5 × 5 cm pada bidang yang sama, pastikan keempat sudut terlihat, ratakan kamera dengan objek, lalu tekan Measure. Bagian “Mengapa perlu marker?” menjelaskan bahwa ukuran absolut tidak dapat diperoleh dari satu citra tanpa referensi fisik. Bagian “Akurasi” menekankan bahwa perspektif, distorsi lensa, blur, cahaya, fokus, resolusi, dan kualitas contour memengaruhi estimasi.

## Layar Pengaturan

Pengaturan memakai kontrol yang mudah dijangkau ibu jari. Ukuran marker memakai numeric input dengan default 5.0 cm. Toggle “Perspective correction” aktif secara default sebagai kesiapan integrasi homography. Toggle “Camera calibration” nonaktif sampai camera matrix dan distortion coefficients tersedia. Picker processing rate menyediakan 15, 20, dan 30 FPS. Setiap perubahan disimpan lokal.

## Layar Riwayat

Riwayat menampilkan kartu dengan tanggal, lebar, tinggi, dan status kualitas seperti “Stable” atau “Needs review”. Empty state menjelaskan bahwa hasil pertama akan muncul setelah pengukuran disimpan. Data bersifat lokal dan tidak memerlukan login.

## Alur Pengguna Utama

1. Pengguna membuka layar Ukur dan memberi izin kamera.
2. Pengguna menempatkan marker ArUco yang ukurannya telah dikonfigurasi dan benda pada bidang yang sama.
3. Sistem memproses frame secara berkala: resize, deteksi marker, estimasi skala pixel-ke-cm, deteksi contour objek, koreksi perspektif bila tersedia, lalu smoothing.
4. Overlay memberi feedback apakah marker, objek, dan kualitas sudut valid.
5. Setelah status Ready to measure, pengguna menekan Measure.
6. MeasurementEngine mengunci hasil yang sudah distabilkan, menampilkan width dan height dalam cm, lalu menawarkan penyimpanan ke riwayat.
7. Pengguna dapat Reset untuk sesi baru atau membuka Guide/Settings untuk memperbaiki kondisi pengambilan gambar.

## Pilihan Warna

| Token | Warna | Makna |
|---|---|---|
| Background | `#0B1020` | Latar kamera gelap yang menjaga kontras overlay |
| Surface | `#151D32` | Kartu informasi dan panel kontrol |
| Foreground | `#F7F8FC` | Teks utama |
| Muted | `#9AA6BF` | Instruksi sekunder |
| Primary cyan | `#52D6FF` | Marker, fokus, aksi utama |
| Measurement lime | `#B8F36B` | Bounding box dan hasil valid |
| Warning amber | `#F7B955` | Marker kecil/miring atau hasil belum stabil |
| Error coral | `#FF6B6B` | Kamera gagal, marker hilang, atau objek tidak ditemukan |
| Border | `#2A3754` | Pemisah dan outline kartu |

Tipografi menggunakan hierarki yang tegas: judul 28–32 pt, angka pengukuran 30–36 pt, label 12–13 pt dengan tracking ringan, dan body 14–16 pt. Sudut kartu 20–24 pt, target sentuh minimal 44 pt, serta feedback press ringan mengikuti pola iOS HIG.

## Catatan Arsitektur Visual

UI menerima `MeasurementSnapshot` yang berisi status kamera, corner marker, marker ID, bounding box, pixel scale, width/height cm, confidence, dan warning. Dengan kontrak ini, implementasi contour OpenCV, YOLO/TFLite, atau modul native ArUco dapat bertukar tanpa memodifikasi layar. Semua angka yang belum tersedia harus ditampilkan sebagai “—”, bukan nilai contoh.
