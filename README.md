# AR Measure

AR Measure adalah aplikasi mobile portrait untuk membantu mengukur lebar dan tinggi benda datar dengan referensi marker ArUco. Proyek ini dibuat di template mobile WebDev menggunakan Expo SDK 54, React Native, TypeScript, dan `expo-camera` agar dapat dijalankan serta diuji melalui alur mobile yang tersedia.

## Status Implementasi

Layar **Measure** sudah memiliki preview kamera belakang, permintaan permission kamera, overlay reticle, overlay marker dan bounding box, status kesiapan, kontrol Start camera, Scan marker, Measure object, Reset, serta kartu hasil Width dan Height. Karena runtime Expo standar tidak menyertakan OpenCV/ArUco native, tombol Scan marker saat ini mengaktifkan state demonstrasi agar seluruh alur UI dapat diuji tanpa memasukkan angka palsu sebelum marker dinyatakan valid. Lapisan computer vision nyata harus dihubungkan melalui native module atau custom development client.

Layar **Guide** menjelaskan penempatan marker, alignment, stabilisasi, perspektif, dan faktor akurasi. Layar **Settings** menyimpan kontrak pengaturan ukuran marker, perspective correction, camera calibration, dan processing rate. Layar **History** menyiapkan empty state untuk penyimpanan lokal.

## Kontrak Pengukuran

Domain logic di `lib/measurement.ts` berisi `calculateScale(markerSizeCm, markerPixelSize)`, `measureObject(widthPx, heightPx, pixelScale)`, `smooth(previous, next, alpha)`, serta `validateSnapshot(...)`. Kontrak ini sengaja dipisahkan dari UI sehingga implementation adapter berikut dapat dipasang tanpa mengubah `MeasurementEngine` atau layar:

| Adapter | Tanggung jawab |
|---|---|
| `ArucoDetector` native | Mendeteksi corner/ID marker, menghitung ukuran pixel rata-rata, dan scale cm/pixel |
| `ObjectDetector` contour | Grayscale, blur, edge/threshold, `findContours`, filtering, dan bounding rectangle |
| `PerspectiveAdapter` | `getPerspectiveTransform` dan `warpPerspective` pada benda datar |
| `CalibrationAdapter` | `undistort` menggunakan camera matrix dan distortion coefficients |
| `MeasurementEngine` | Menggabungkan scale dan bounding box, smoothing, confidence, dan validation |

## Catatan Python/Kivy/OpenCV

Prompt awal meminta Python, Kivy, OpenCV, NumPy, dan Buildozer. Build WebDev mobile yang tersedia di lingkungan ini adalah Expo/React Native, bukan toolchain Python/Kivy. Untuk menghasilkan APK Python/Kivy yang sesungguhnya, struktur domain berikut dapat dipindahkan ke proyek terpisah: `CameraManager` memakai kamera Android/Kivy, `ArucoDetector` memakai OpenCV, `ObjectDetector` memakai interface adapter, `MeasurementEngine` memakai rumus yang sama, dan `ui.py` menggambar overlay. `buildozer.spec` perlu mendeklarasikan `python3,kivy,opencv,numpy` serta permission `CAMERA`; kompatibilitas OpenCV ArUco perlu dikunci terhadap versi paket yang tersedia pada python-for-android.

Jangan mengklaim akurasi milimeter. Marker fisik yang diketahui diperlukan karena kamera biasa tidak dapat memperoleh ukuran absolut dari satu citra tanpa skala referensi. Perspektif, focal length, distorsi lensa, resolusi, autofocus, motion blur, pencahayaan, posisi marker, kemiringan objek, dan kualitas contour dapat mengubah hasil.

## Menjalankan

Gunakan `pnpm dev` untuk menjalankan server pengembangan, `pnpm check` untuk pemeriksaan TypeScript, `pnpm lint` untuk linting, dan `pnpm test` untuk pengujian yang tersedia. Pada perangkat Android, aplikasi meminta permission kamera saat pengguna menekan Start camera. Build APK dilakukan melalui alur Publish pada Management UI setelah checkpoint dibuat; proyek ini tidak menjalankan Buildozer di runtime Expo.
