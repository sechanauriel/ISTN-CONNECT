# ISTN CONNECT SC-DATA

SC-DATA adalah prototipe portal akademik terpadu.
Sistem menggabungkan UI role-based, backend FastAPI, database DuckDB, pipeline CSV, pencarian dokumen RAG, audit log, backup, dan final validation.

## Ringkasan

ISTN CONNECT SC-DATA dibuat sebagai demo sistem akademik lokal yang lengkap dan siap dipresentasikan.
Proyek ini berjalan sepenuhnya tanpa ketergantungan layanan eksternal, sehingga dapat digunakan sebagai bukti konsep yang stabil di lingkungan offline.

Dengan satu klik (`START_ONE_CLICK.bat`), aplikasi akan:
- menyiapkan virtual environment Python lokal,
- menginstal dependency backend,
- membuat dan memeriksa skema DuckDB,
- menyiapkan data sample dan dokumen RAG,
- menjalankan backend FastAPI,
- membuka UI frontend dan halaman bukti demo.

## Tujuan Sistem

SC-DATA dirancang sebagai ekosistem kampus yang datanya dapat dilacak, divalidasi, diamankan, dan siap (AI-Ready).

## Layanan Terpadu

Mahasiswa, dosen, admin, dan pimpinan masuk ke portal yang sama, dengan menu dan aksi yang direstriksi mengikuti role masing-masing (RBAC).

## Knowledge Base (RAG)

Dokumen KRS, skripsi, cuti, dan SOP dipecah menjadi chunk data sistem AI agar dapat dicari dan dijadikan sumber referensi akurat.

## Kualitas Data

Data CSV tidak langsung ditampilkan. Sistem memvalidasi kolom, mencegah duplikasi, mengatasi nilai kosong, dan menstandarisasi domain nilai.

## Bukti Evaluasi

Setiap proses kritikal menghasilkan evidence digital secara otomatis: `pipeline_log`, `event_log`, `audit_log`, dan mekanisme final validation.

## Fitur Utama

- **One Click Demo**: Proses setup otomatis dengan `START_ONE_CLICK.bat`.
- **Frontend Interaktif**: UI login role-based, dashboard personalisasi, command center, dan banyak fitur modul.
- **Backend Lokal FastAPI**: layanan API REST dengan autentikasi, RBAC, audit, export, backup, dan validasi.
- **Database DuckDB**: penyimpanan lokal tabel analitik dan log untuk eksekusi cepat.
- **ETL / Data Pipeline**: impor CSV, validasi, dan pencatatan masalah data.
- **RAG / Smart Search**: pencarian dokumen akademik berbasis chunking dan TF-IDF lokal.
- **Audit & Governance**: pencatatan aktivitas, backup lokal, dan ekspor CSV bukti.
- **Role-Based Access**: antarmuka dan jalur akses berbeda untuk Mahasiswa, Dosen, Administrator, dan Pimpinan.

## Backend

Backend proyek dibangun dengan **FastAPI** dan menyediakan API lokal untuk semua fungsi inti.

- `backend/main.py` menyediakan endpoint REST, autentikasi, RBAC, audit, dan logika bisnis.
- `backend/db.py` mengelola koneksi DuckDB, fungsi export CSV, dan pencatatan audit.
- `backend/init_db.py` melakukan inisialisasi skema database dan membuat tabel serta indeks.
- `backend/seed_data.py` menyiapkan data sample CSV, event, dan dokumen RAG untuk demo.
- `backend/sc_data.duckdb` adalah database lokal yang berisi tabel operasional dan analitik.

### Endpoint Utama Backend
- `POST /api/auth/login` — login dan terima token Base64.
- `GET /api/auth/validate` — validasi token.
- `GET /api/health` — cek kesehatan backend dan koneksi database.
- `GET /api/db/tables` — daftar tabel dan jumlah baris DuckDB.
- `GET /api/dashboard/summary` — ringkasan statistik dashboard.
- `POST /api/events/load` — muat event kehadiran.
- `POST /api/pipeline/run` — jalankan pipeline ETL untuk data akademik.
- `POST /api/rag/build` — bangun indeks dokumen RAG.
- `POST /api/rag/search` — pencarian dokumen berbasis query.
- `GET /api/audit/log` — tampilkan audit log.
- `POST /api/backup/create` — buat backup DuckDB.
- `GET /api/validation/final` — validasi akhir sistem.

## Pipeline Data

Pipeline ETL bertanggung jawab memuat dan memvalidasi data dari CSV ke DuckDB.

- Data pipeline membaca file data di `data/csv/` lalu melakukan validasi kolom dan baris.
- Tabel target pipeline:
  - `mahasiswa`
  - `dosen`
  - `mata_kuliah`
  - `krs`
  - `nilai`
  - `kehadiran`
- Setiap dataset divalidasi untuk:
  - kolom wajib lengkap,
  - nilai kosong atau string kosong,
  - duplikat primary key,
  - aturan domain khusus (`nilai` 0-100, status kehadiran valid).
- Baris yang valid dimuat ke tabel DuckDB; baris bermasalah dicatat ke `pipeline_issue_log`.
- Ringkasan proses tersimpan di `pipeline_log` yang mencatat total baris, valid, invalid, duplikat, dan nilai hilang.

## Integrasi RAG

Sistem RAG memanfaatkan dokumen akademik lokal untuk menyediakan pencarian konten berbasis sumber.

- Dokumen dimuat dari folder `docs/rag/`.
- Backend mem-parsing dan membagi dokumen ke dalam chunk teks.
- Chunk disimpan di tabel `document_chunks` di DuckDB.
- Pencarian `POST /api/rag/search` menggunakan query user untuk menilai relevansi dan mengembalikan jawaban berbasis dokumen.
- Fitur ini berjalan sepenuhnya lokal tanpa ketergantungan API eksternal.

## Keamanan & Governance

Bagian keamanan proyek ini fokus pada kontrol akses, audit, validasi input, dan backup data:
- **Autentikasi**: login menggunakan `POST /api/auth/login` menghasilkan token Base64 dengan format `Role:Username`.
- **RBAC**: endpoint sensitif seperti `POST /api/events/load`, `POST /api/pipeline/run`, `POST /api/rag/build`, dan `POST /api/backup/create` memerlukan role `Administrator`.
- **Validasi input**: semua input JSON diperiksa oleh Pydantic model untuk mencegah payload tidak valid.
- **Audit log**: setiap aktivitas penting disimpan ke tabel `audit_log` dengan role, action, detail, status, dan metadata.
- **Data integrity**: pipeline memeriksa duplikat, nilai kosong, nilai di luar rentang, dan status kehadiran yang tidak valid.
- **Backup lokal**: `POST /api/backup/create` membuat salinan file DuckDB dan mencatat metadata backup ke tabel `backup_log`.
- **Ekspor bukti**: log audit, event, dan pipeline dapat diunduh sebagai CSV dari endpoint export.

## Strategi Deployment

Strategi deployment proyek ini dirancang untuk lingkungan lokal / on-premise:

- **One-click deployment**: gunakan `START_ONE_CLICK.bat` untuk menyiapkan lingkungan langsung.
- **Virtual environment lokal**: `.venv` dibuat di root proyek untuk isolasi dependency.
- **Database embedded**: DuckDB berjalan sebagai file lokal sehingga tidak memerlukan server database terpisah.
- **Backup rutin**: backup DuckDB disimpan di `backend/backups/` untuk pemulihan cepat.
- **Dev / testing**: jalankan backend dengan `uvicorn backend.main:app --reload` pada fase pengembangan.
- **Production / on-premise**: jalankan backend via production ASGI server seperti `uvicorn` atau `gunicorn` dengan worker Python yang sesuai, dan pastikan folder `backend/backups/` serta `backend/outputs/` aman.
- **Dokumentasi dan bukti**: `docs/project/README.md` dan `architecture_diagram.md` mendukung deployment dan audit.

## Struktur Folder

- `index.html` — UI utama.
- `frontend/` — aset frontend, CSS, JS, dan screenshot.
- `backend/` — backend API, database utils, init, seed data, dan backup.
- `data/` — data sumber `csv` dan `json`.
- `docs/` — dokumentasi dan dokumen RAG.
- `scripts/` — batch file bantu untuk menjalankan dan mengelola demo.

## File Penting

- `backend/requirements.txt` — dependency Python backend.
- `backend/init_db.py` — buat skema DuckDB dan indeks dasar.
- `backend/seed_data.py` — buat data sample CSV, event, dan dokumen RAG.
- `backend/main.py` — implementasi endpoint FastAPI.
- `backend/db.py` — utilitas database, audit, export, dan koneksi.
- `frontend/index.html` — halaman login dan kerangka aplikasi.
- `frontend/js/features/features.js` — fitur UI tambahan.
- `frontend/assets/` — screenshot dan logo proyek. Gambar ini dapat digunakan sebagai dokumentasi visual jika repositori diposting di GitHub.
- `docs/project/README.md` — dokumentasi arsitektur dan alur.
- `docs/images/` — gambar pendukung dokumentasi.
- `architecture_diagram.md` — diagram arsitektur dan flow sistem.
- `scripts/START_ONE_CLICK.bat` — launcher demo satu klik.

## Dokumentasi GitHub

Folder dokumentasi dan aset di repositori sudah disusun agar GitHub dapat menampilkan dokumentasi visual dan teks:
- `docs/project/` berisi dokumen HTML, markdown, dan panduan lengkap.
- `docs/images/` berisi gambar pendukung yang dapat langsung ditampilkan di README atau wiki.
- `frontend/assets/` berisi screenshot UI untuk bukti tampilan aplikasi.

### Saran Penataan GitHub

- Gunakan `README.md` ini sebagai halaman utama repositori.
- Tambahkan gambar screenshot dari `frontend/assets/` ke README agar pembaca langsung melihat UI.
- Sertakan link ke `docs/project/README.md` dan `architecture_diagram.md` di bagian dokumentasi.
- Jika ingin, aktifkan GitHub Pages dengan folder `docs/` atau `docs/project/` untuk dokumentasi terpublikasi.

Contoh Markdown untuk memasukkan screenshot dari `frontend/assets/`:

```md
![Login ISTN CONNECT](frontend/assets/login.png)
![Admin Dashboard](frontend/assets/admin.png)
![Mahasiswa Dashboard](frontend/assets/mahasiswa.png)
```

> Pastikan file gambar di-commit ke repositori agar GitHub menampilkan thumbnail dengan benar.

## Data dan Tabel DuckDB

Data awal diambil dari folder `data/csv/`:
- `mahasiswa.csv`
- `dosen.csv`
- `mata_kuliah.csv`
- `krs.csv`
- `nilai.csv`
- `kehadiran.csv`
- `kehadiran_event.csv`

## Pipeline Data & Validasi

Pipeline ETL backend memproses data CSV berikut ini:
- `mahasiswa.csv` → tabel `mahasiswa`
- `dosen.csv` → tabel `dosen`
- `mata_kuliah.csv` → tabel `mata_kuliah`
- `krs.csv` → tabel `krs`
- `nilai.csv` → tabel `nilai`
- `kehadiran.csv` → tabel `kehadiran`

Aturan validasi pipeline:
- Periksa kolom wajib sesuai spesifikasi setiap file.
- Hapus duplikat berdasarkan primary key (`nim`, `nidn`, `kode_mk`, `krs_id`, `nilai_id`, `hadir_id`).
- Deteksi nilai kosong atau string kosong pada kolom wajib.
- Untuk `nilai.csv`: konversi nilai tugas/UTS/UAS ke numerik, pastikan 0-100, lalu hitung `nilai_akhir` dan `grade` otomatis.
- Untuk `kehadiran.csv`: normalisasi `status_hadir` dan pastikan hanya `hadir`, `izin`, `sakit`, atau `alfa`.
- Baris valid dimuat ke tabel DuckDB, sementara baris bermasalah dicatat ke `pipeline_issue_log`.
- Ringkasan hasil pipeline disimpan di `pipeline_log` dengan jumlah total, valid, duplikat, dan nilai hilang.

Sumber event log khusus:
- `kehadiran_event.csv` dimuat ke tabel `event_log` melalui endpoint event monitor.
- Sistem mencegah duplikat `event_id` dan mencatat status kehadiran.

Tabel DuckDB inti:
- `event_log`
- `pipeline_log`
- `pipeline_issue_log`
- `audit_log`
- `document_chunks`
- `mahasiswa`
- `dosen`
- `mata_kuliah`
- `krs`
- `nilai`
- `kehadiran`
- `backup_log`

## Dokumen RAG

Dokumen RAG tersedia di:
- `docs/rag/pedoman_krs.txt`
- `docs/rag/pedoman_skripsi.txt`
- `docs/rag/aturan_cuti_akademik.txt`
- `docs/rag/sop_perkuliahan.txt`

Sistem dapat membangun indeks dokumen dan melakukan pencarian lokal tanpa API eksternal.

## Cara Menjalankan (One-Click)

1. Extrak proyek jika perlu.
2. Jalankan `scripts/START_ONE_CLICK.bat` atau `START_ONE_CLICK.bat` dari root.
3. Tunggu proses setup selesai.
4. Buka browser ke `http://127.0.0.1:8000` untuk backend atau buka `index.html` secara langsung untuk frontend.

### Apa `START_ONE_CLICK.bat` Lakukan?

`backend/one_click_demo.py` menjalankan otomatisasi berikut:
- menunggu backend FastAPI aktif,
- login sebagai Administrator untuk mendapat token,
- memuat `kehadiran_event.csv` ke `event_log`,
- menjalankan pipeline 6 CSV ke tabel DuckDB,
- membangun index RAG untuk `document_chunks`,
- membuat backup DuckDB,
- menjalankan final validation,
- membuka browser ke Database Proof, Final Validation, dan portal frontend.

## Cara Menjalankan Manual

Buka PowerShell di folder proyek dan jalankan:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend/requirements.txt
python backend/init_db.py
python backend/seed_data.py
python -m uvicorn backend.main:app --reload
```

Kemudian buka `index.html` di browser.

## Akun Demo

- Administrator: `admin / admin123`
- Pimpinan: `pimpinan / pimpinan123`
- Mahasiswa: username = NIM, password = NIM
- Dosen: username/password dapat disesuaikan dalam UI demo

## User & Role

Sistem mendukung empat peran utama dengan hak akses berbeda:
- **Administrator**: akses penuh untuk menjalankan pipeline, memuat event, membangun RAG, backup, dan ekspor data.
- **Pimpinan**: tampilan strategis, laporan ringkas, dan akses baca terhadap data analitik.
- **Dosen**: akses fitur akademik untuk mengelola pengumuman, jadwal, dan memberikan data terkait mahasiswa.
- **Mahasiswa**: akses ke dashboard personal, notifikasi, pengumuman, nilai, kehadiran, dan fitur akademik.

Hak akses penting:
- `Administrator` wajib untuk endpoint sensitif seperti `POST /api/pipeline/run`, `POST /api/events/load`, `POST /api/rag/build`, `POST /api/backup/create`.
- Semua peran dapat menggunakan login frontend, namun hanya role yang diotorisasi dapat melihat menu dan fungsi tertentu.

## Login & Demo Access

Akun demo yang tersedia di frontend:
- **Administrator**: `admin / admin123`
- **Pimpinan**: `pimpinan / pimpinan123`
- **Mahasiswa**: `24360001 / 24360001`
- **Dosen**: `oni / oni123`

Login ini dapat langsung digunakan untuk masuk ke portal dan melihat menu serta dashboard yang sesuai dengan role.

## Dashboard Role-Based

Setiap role melihat dashboard khusus:
- **Mahasiswa**: `Dashboard Mahasiswa` menampilkan KRS, jadwal, tugas, presensi, nilai, dokumen, pesan, dan AI akademik.
- **Dosen**: `Dashboard Dosen` menampilkan kelas yang diampu, pengelolaan tugas, input presensi/nilai, daftar bimbingan, dan AI teaching assistant.
- **Administrator**: `Dashboard Administrator` menampilkan master data, pipeline ETL, audit log, RBAC, governance, backup, dan status sistem.
- **Pimpinan**: `Dashboard Pimpinan Fakultas` menampilkan KPI kampus, rata-rata IPK, kehadiran, risiko akademik, compliance, audit, dan insight strategis.

Menu frontend akan otomatis menyesuaikan dengan role yang login.

## Endpoint Backend Lengkap

### Autentikasi
- `POST /api/auth/login` — login dan terima token Base64.
- `GET /api/auth/validate` — validasi token aktif.

### Kesehatan & Proof
- `GET /api/health` — status backend.
- `GET /api/db/tables` — daftar tabel DuckDB dan jumlah baris.
- `GET /api/dashboard/summary` — ringkasan status dashboard.

### Event Monitor
- `POST /api/events/load` — muat event kehadiran baru.
- `GET /api/events/summary` — ringkasan status event.
- `GET /api/events/latest` — list event terbaru.
- `POST /api/events/reset` — reset event log.

### Data Pipeline
- `POST /api/pipeline/run` — jalankan pipeline ETL dari file CSV.
- `GET /api/pipeline/log` — lihat log pipeline terakhir.

### RAG Search
- `POST /api/rag/build` — bangun index dokumen RAG.
- `POST /api/rag/search` — cari dokumen berdasarkan query.

### Audit & Export
- `GET /api/audit/log` — lihat audit log.
- `GET /api/export/event-log` — unduh event log CSV.
- `GET /api/export/pipeline-log` — unduh pipeline log CSV.
- `GET /api/export/audit-log` — unduh audit log CSV.

### Backup & Validasi
- `POST /api/backup/create` — buat backup DuckDB.
- `GET /api/validation/final` — jalankan validasi akhir sistem.

## Skrip dan Batch File

- `START_ONE_CLICK.bat` — auto setup dan demo.
- `STOP_BACKEND.bat` — hentikan backend di port 8000.
- `RESET_DATABASE_AND_START.bat` — reset database dan start ulang.
- `OPEN_ALL_PROOF.bat` — buka semua halaman bukti di browser.
- `CHECK_SYSTEM.bat` — cek sistem cepat.

## Alur Demo yang Direkomendasikan

1. Jalankan `START_ONE_CLICK.bat`.
2. Login sebagai `Administrator`.
3. Buka dashboard utama dan cek sistem pulse.
4. Periksa `Database Proof` untuk melihat status tabel.
5. Jalankan `Event Monitor` untuk memuat dan meninjau data kehadiran.
6. Jalankan `Data Pipeline` untuk impor dan validasi data CSV.
7. Bangun RAG dengan `Search/RAG` dan lakukan pencarian dokumen.
8. Periksa `Final Validation` untuk memastikan semua checklist lulus.

## Detail yang Belum Dibahas

Beberapa area workspace ini belum dijelaskan secara penuh dalam dokumentasi utama:
- `backend/one_click_demo.py` dan detail otomatisasi `START_ONE_CLICK.bat`.
- `scripts/dev-server.js`, `capture_screens.py`, dan fungsi batch helper lain.
- Logika detail `final validation` dan status evaluasi yang dikembalikan.
- Algoritma RAG internal, chunking dokumen, dan scoring relevansi.
- Semua halaman dan fitur tambahan di `frontend/js/features/`.
- Folder `docs/images/` serta konten lengkap `docs/project/`.
- `export_ai_usage.py`, file backup, dan output CSV detail.

## Catatan Tambahan

- Sistem dibuat untuk presentasi dan validasi internal.
- Semua proses bisa dijalankan offline.
- Dokumentasi tambahan tersedia di `docs/project/` dan `architecture_diagram.md`.
- Proyek ini cocok sebagai bukti konsep untuk integrasi SIAKAD + analytics + RAG.

## Lisensi

Tidak ada lisensi khusus yang disertakan. Gunakan untuk presentasi, demo, dan studi internal.
