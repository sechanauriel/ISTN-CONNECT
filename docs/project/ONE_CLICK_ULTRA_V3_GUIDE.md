# ONE CLICK ULTRA V3 — Panduan Demo Cepat

## Cara tercepat

Double click:

```text
START_ONE_CLICK.bat
```

Tunggu sampai muncul tulisan `ONE CLICK SELESAI`.

Browser akan membuka:

1. Database Proof
2. Final Validation
3. Web Portal

## Bukti yang harus terlihat

Di Database Proof, tabel berikut harus memiliki rows:

- `event_log`
- `pipeline_log`
- `audit_log`
- `document_chunks`
- `mahasiswa`
- `dosen`
- `mata_kuliah`
- `krs`
- `nilai`
- `kehadiran`

## Jika ingin reset dari awal

Double click:

```text
RESET_DATABASE_AND_START.bat
```

## Jika backend masih nyala dan ingin ditutup

Double click:

```text
STOP_BACKEND.bat
```

## Catatan penting

Versi ini tidak menggunakan API key, tidak memakai layanan eksternal, dan tidak memakai Streamlit.
Frontend tetap HTML/CSS/JS. Backend lokal memakai FastAPI. Database lokal memakai DuckDB.
