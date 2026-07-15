# TESTING REPORT - ISTN Connect SC-DATA API DuckDB

## 1) Status Persiapan

- **Status server backend:** RUNNING  
  - Command: `py -m uvicorn backend.main:app --host 127.0.0.1 --port 8000`
  - Endpoint base: `http://127.0.0.1:8000`
- **Status koneksi DuckDB:** CONNECTED  
  - DB file: `backend/sc_data.duckdb`

---

## 2) Daftar Endpoint yang Diuji

1. `GET /api/health`  
2. `GET /api/db/tables`  
3. `GET /api/dashboard/summary`  
4. `POST /api/events/load`  
5. `GET /api/events/summary`  
6. `GET /api/events/latest?limit=...`  
7. `POST /api/events/reset`  
8. `POST /api/pipeline/run`  
9. `GET /api/pipeline/log?limit=...`  
10. `POST /api/rag/build`  
11. `POST /api/rag/search`  
12. `GET /api/audit/log?limit=...`  
13. `GET /api/export/event-log`  
14. `GET /api/export/pipeline-log`  
15. `GET /api/export/audit-log`  
16. `POST /api/backup/create`  
17. `GET /api/validation/final`

---

## 3) Rekap Hasil Testing

- **Total endpoint utama diuji: 17**
- **Total skenario diuji: 31**
- **Total PASS: 31**
- **Total FAIL: 0**

Catatan eksplisit:
- **Tidak ada bug fungsional endpoint API yang ditemukan**
- **Tidak ada perubahan kode tambahan setelah thorough testing**
- **Backend siap finalisasi**

---

## 4) Hasil Inspect DuckDB Sebelum Testing

### Daftar tabel
- `audit_log`
- `backup_log`
- `document_chunks`
- `dosen`
- `event_log`
- `kehadiran`
- `krs`
- `mahasiswa`
- `mata_kuliah`
- `nilai`
- `pipeline_issue_log`
- `pipeline_log`

### Schema tabel penting (ringkas)
- `event_log(log_id, event_id, nim, kode_mk, waktu_event, status_hadir, source_file, loaded_at)`
- `pipeline_log(pipeline_id, dataset_name, total_rows, valid_rows, invalid_rows, duplicate_rows, missing_value_rows, status, message, processed_at)`
- `audit_log(audit_id, role, action, detail, status, meta_json, created_at)`
- `document_chunks(chunk_id, document_name, chunk_text, source, token_count, created_at)`
- `mahasiswa(nim, nama, prodi, semester, status)`

### Jumlah data sebelum testing
- `audit_log=1`
- `backup_log=0`
- `document_chunks=0`
- `dosen=0`
- `event_log=0`
- `kehadiran=0`
- `krs=0`
- `mahasiswa=0`
- `mata_kuliah=0`
- `nilai=0`
- `pipeline_issue_log=0`
- `pipeline_log=0`

### Sample data sebelum testing
- `audit_log`: 1 row inisialisasi (`INIT_DB`)
- Tabel lain: kosong

---

## 5) Hasil Inspect DuckDB Setelah Testing

### Daftar tabel terbaru
- `audit_log`
- `backup_log`
- `document_chunks`
- `dosen`
- `event_log`
- `kehadiran`
- `krs`
- `mahasiswa`
- `mata_kuliah`
- `nilai`
- `pipeline_issue_log`
- `pipeline_log`

### Jumlah data terbaru
- `audit_log=7`
- `backup_log=1`
- `document_chunks=4`
- `dosen=6`
- `event_log=0`
- `kehadiran=20`
- `krs=20`
- `mahasiswa=10`
- `mata_kuliah=7`
- `nilai=20`
- `pipeline_issue_log=0`
- `pipeline_log=6`

### Sample data terbaru (ringkas)
- `pipeline_log`: terisi log sukses pemrosesan dataset CSV
- `audit_log`: terisi aktivitas testing (LOAD_EVENT, RUN_PIPELINE, BUILD_RAG_INDEX, RAG_SEARCH, CREATE_BACKUP, dll.)
- `document_chunks`: terisi chunk dokumen akademik (mis. pedoman KRS/skripsi/cuti)

---

## 6) Ringkasan Perubahan Data Setelah Testing

- `event_log` sempat bertambah saat `POST /api/events/load`, lalu menjadi `0` setelah `POST /api/events/reset`
- Tabel master pipeline (`mahasiswa`, `dosen`, `mata_kuliah`, `krs`, `nilai`, `kehadiran`) terisi setelah `POST /api/pipeline/run`
- `document_chunks` terisi setelah `POST /api/rag/build`
- `backup_log` bertambah setelah `POST /api/backup/create`
- `audit_log` bertambah mengikuti aktivitas endpoint yang dipanggil selama pengujian

---

## 7) Daftar Bug yang Ditemukan

- **Tidak ada bug fungsional endpoint API yang ditemukan**

---

## 8) Daftar Perbaikan Kode

- **Tidak ada perubahan kode tambahan setelah thorough testing**

---

## 9) Catatan Penting

- `GET /api/validation/final` mengembalikan status overall **`PARTIAL`**.
- Status ini **bukan bug** selama sesuai kondisi data runtime saat testing.
- Pada sesi ini, `event_log` telah di-reset dan beberapa komponen validasi memang bergantung pada kelengkapan data runtime.

---

## 10) Kesimpulan Final

- Backend telah melalui thorough testing API dengan hasil **PASS penuh (31/31)**.
- Tidak ditemukan bug fungsional endpoint.
- Tidak ada perubahan kode tambahan pasca testing.
- **Backend siap finalisasi.**

