# ISTN Connect SC-DATA API DuckDB — ONE CLICK ULTRA V3

Versi ini dibuat untuk demo paling praktis: **extract ZIP → double click `START_ONE_CLICK.bat` → web, Database Proof, dan Final Validation terbuka otomatis**.

## Jalankan dengan 1 klik

1. Extract ZIP.
2. Double click:

```text
START_ONE_CLICK.bat
```

File ini otomatis melakukan:

- cek Python,
- membuat `.venv` lokal,
- install dependency otomatis ke `.venv`,
- membuat `backend/sc_data.duckdb`,
- membuat/mengecek CSV dan dokumen akademik,
- menjalankan FastAPI di `http://127.0.0.1:8000`,
- auto-load `event_log`,
- auto-run `pipeline_log`,
- auto-build `document_chunks`,
- membuat backup DuckDB,
- membuka web `index.html`, Database Proof, dan Final Validation.

## Syarat minimal

Tidak perlu install library manual. Script akan mengurus dependency otomatis.

Satu-satunya syarat: komputer harus punya Python 3.10+ yang terbaca di PATH atau melalui launcher `py`.

## Link bukti demo

Setelah `START_ONE_CLICK.bat` dijalankan:

- Backend Health: `http://127.0.0.1:8000/api/health`
- Database Proof: `http://127.0.0.1:8000/api/db/tables`
- Final Validation: `http://127.0.0.1:8000/api/validation/final`
- Web Frontend: `index.html`

## Login demo

- Administrator: `admin / admin123`
- Pimpinan: `pimpinan / pimpinan123`
- Mahasiswa: username = NIM, password = NIM

## File penting

- `START_ONE_CLICK.bat` — launcher utama satu klik.
- `STOP_BACKEND.bat` — menutup backend di port 8000.
- `RESET_DATABASE_AND_START.bat` — reset DuckDB lalu start ulang.
- `OPEN_ALL_PROOF.bat` — buka semua halaman bukti.
- `CHECK_SYSTEM.bat` — cek cepat sistem.
- `backend/sc_data.duckdb` — database DuckDB lokal.
- `backend/outputs/` — export CSV.
- `backend/backups/` — backup DuckDB.

## Alur demo

```text
Double click START_ONE_CLICK.bat
        ↓
Virtual environment disiapkan otomatis
        ↓
DuckDB dibuat dan seed data disiapkan
        ↓
FastAPI berjalan lokal
        ↓
event_log, pipeline_log, document_chunks, audit_log terisi otomatis
        ↓
Browser membuka Database Proof, Final Validation, dan frontend
```

---

# ISTN Connect SC-DATA API DuckDB — POWERFUL V2

Versi ini adalah paket lengkap web akademik ISTN Connect yang sudah ditingkatkan menjadi **fullstack lokal**:

- Frontend tetap: `index.html`, `style.css`, `app.js`.
- Backend lokal: FastAPI.
- Database lokal: DuckDB di `backend/sc_data.duckdb`.
- Tanpa API key.
- Tanpa layanan eksternal.
- Tanpa Streamlit.

Alur utama:

```text
Tombol web diklik
  ↓
app.js mengirim fetch API
  ↓
FastAPI menerima perintah
  ↓
Backend membaca CSV/dokumen
  ↓
DuckDB menyimpan/membaca data
  ↓
Response JSON dikirim balik ke web
```

## Fitur POWERFUL V2

1. **SC-DATA Cockpit V2**
   - Health backend.
   - DB size.
   - Row count event_log, pipeline_log, document_chunks, audit_log, backup_log.
   - Quick action demo.
   - Chart status event.
   - Final validation API.

2. **Event Monitor Dashboard**
   - `POST /api/events/load`.
   - Baca `data/kehadiran_event.csv`.
   - Cegah event duplikat.
   - Simpan ke `event_log`.
   - Ringkasan hadir/izin/sakit/alfa.
   - Export event log.

3. **Data Pipeline Builder**
   - `POST /api/pipeline/run`.
   - Baca 6 CSV akademik.
   - Validasi kolom wajib, missing value, duplikasi, status hadir, range nilai.
   - Simpan data valid ke DuckDB.
   - Simpan hasil ke `pipeline_log`.
   - Simpan isu validasi ke `pipeline_issue_log`.

4. **Academic Search/RAG**
   - `POST /api/rag/build`.
   - Baca 4 dokumen akademik di folder `docs/`.
   - Chunking dokumen ke `document_chunks`.
   - `POST /api/rag/search` untuk pencarian berbasis sumber.

5. **Security & Governance**
   - RBAC frontend.
   - Audit log server-side.
   - Masking NIM/email.
   - Compliance checklist.
   - Backup DuckDB.

6. **Deployment Decision Canvas**
   - Local, on-premise, cloud, hybrid.
   - Rekomendasi hybrid.
   - ADR sederhana.

7. **Database Proof V2**
   - Bukti koneksi backend.
   - Daftar tabel DuckDB.
   - Jumlah baris tiap tabel.
   - Status PASS/PARTIAL/FAIL.

8. **Final Validation V2**
   - Checklist otomatis dari endpoint `/api/validation/final`.
   - Status berubah sesuai data aktual di DuckDB.

## Cara menjalankan backend

Buka terminal di folder project, lalu jalankan:

```bash
python -m pip install -r backend/requirements.txt
python backend/init_db.py
python backend/seed_data.py
python -m uvicorn backend.main:app --reload
```

Kalau berhasil, buka:

```text
http://localhost:8000/api/health
```

Harus muncul status `ok` dan `database: connected`.

## Cara menjalankan frontend

Buka `index.html` langsung di browser.

Login admin:

```text
admin / admin123
```

Lalu buka menu:

```text
SC-DATA Cockpit
Database Proof
Event Monitor
Data Pipeline
Search/RAG
Final Validation
```

## Urutan demo terbaik untuk dosen

1. Jalankan backend.
2. Buka `http://localhost:8000/api/health`.
3. Login web sebagai admin.
4. Buka **SC-DATA Cockpit**.
5. Klik **Load Event Baru**.
6. Klik **Run Pipeline**.
7. Klik **Build RAG Index**.
8. Buka **Database Proof V2**.
9. Buka **Final Validation V2**.
10. Klik **Backup DuckDB**.

## Endpoint penting

```text
GET  /api/health
GET  /api/db/tables
GET  /api/dashboard/summary
POST /api/events/load
GET  /api/events/summary
GET  /api/events/latest
POST /api/events/reset
POST /api/pipeline/run
GET  /api/pipeline/log
POST /api/rag/build
POST /api/rag/search
GET  /api/audit/log
GET  /api/validation/final
POST /api/backup/create
GET  /api/export/event-log
GET  /api/export/pipeline-log
GET  /api/export/audit-log
```

## Bukti DuckDB

Buka:

```text
http://localhost:8000/api/db/tables
```

Tabel penting yang harus terlihat:

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

## Troubleshooting

### `uvicorn` tidak dikenali

Gunakan:

```bash
python -m uvicorn backend.main:app --reload
```

### ModuleNotFoundError backend

Pastikan terminal berada di folder yang sama dengan `index.html`, bukan di dalam folder `backend`.

### Failed to fetch di frontend

Backend belum hidup. Jalankan:

```bash
python -m uvicorn backend.main:app --reload
```

### Database belum ada

Jalankan:

```bash
python backend/init_db.py
```

### Data CSV belum ada

Jalankan:

```bash
python backend/seed_data.py
```

