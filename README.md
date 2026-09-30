# LMS UNINDRA

Demo LMS mahasiswa berbasis HTML, CSS, dan JavaScript tanpa proses build.

## Struktur

- `index.html` adalah entry point dan tempat semua aset aplikasi dimuat.
- `css/styles.css` berisi tampilan, tema terang/gelap, dan aturan responsif.
- `js/data.js` berisi ikon, data mahasiswa, dosen, mata kuliah, semester, serta state bersama.
- `js/auth-shell.js` menangani login, reset kata sandi, navigasi utama, pencarian, tema, dan bantuan.
- `js/pages.js` membentuk dashboard, rekap presensi, data materi, jadwal, dan data tugas.
- `js/notifications.js` menangani daftar notifikasi, status baca, dan penghapusan.
- `js/classes.js` menangani halaman kelas, materi, tugas, kuis, diskusi, profil, dan routing halaman. Aktivitas ujian dibuat sebagai tugas esai: UTS pada pertemuan 8 dan UAS/UPM pada pertemuan 16 (`*` menandai UPM).

## Menjalankan

Buka `index.html` di browser. Tidak perlu instalasi paket atau server.

Skrip JavaScript dimuat berurutan sebagai skrip klasik karena bagian-bagiannya berbagi state dan beberapa aksi dipanggil dari HTML yang dirender. Pertahankan urutan tag `<script>` di entry point saat menambah atau memindahkan berkas.

Data dan aksi backend pada aplikasi ini bersifat simulasi demo; perubahan state hanya berlaku selama halaman masih terbuka.
