# Arsitektur & Alur Kerja Lengkap Sistem SC-DATA

Dokumen ini memuat paparan komprehensif mengenai **Arsitektur Tingkat Tinggi**, **Alur Kerja (Flows)**, **Logika Bisnis**, serta **Skema Data** dari sistem perguruan tinggi terintegrasi SC-DATA.

---

## 🏗️ 1. Arsitektur Komponen Utama (3-Tier Terperinci)

Sistem dibangun menggunakan filosofi *Edge/Local-First* di mana seluruh antarmuka, API, dan database dapat berjalan luring tanpa latensi jaringan eksternal (Internet). Tujuannya adalah menghadirkan sistem "Zero-Latency UI".

```mermaid
flowchart TD

    subgraph CLIENT [Layer Presentasi - Frontend Klien]
        direction TB
        Browser["Web Browser (Chrome, Firefox)"]:::client
        HTML["Struktur Tampilan (HTML5 + Vanilla CSS)"]:::client
        JS["Client Logic (Vanilla JS) - Router & State"]:::client
        Browser --> HTML
        Browser --> JS
    end

    subgraph BACKEND [Layer Aplikasi - Backend Server]
        direction TB
        FastAPI["API Gateway (FastAPI Python)"]:::api
        Auth["Middleware Autentikasi (Base64)"]:::api
        RBAC["RBAC Guard (Dependency Injection)"]:::api
        Controllers["Controllers & Logika Bisnis"]:::api
        
        FastAPI --> Auth
        Auth --> RBAC
        RBAC --> Controllers
    end

    subgraph STORAGE [Layer Penyimpanan Data]
        direction TB
        DuckDB[("DuckDB (In-Memory/File)")]:::db
        RawCSV["Berkas CSV Mentah"]:::db
        DocsTXT["Kumpulan Dokumen TXT"]:::db
    end

    %% Relasi
    JS -->|HTTP REST / JSON Data| FastAPI
    FastAPI -->|JSON Response| JS
    Controllers -->|Read / Write| RawCSV
    Controllers -->|SQL Queries / Ingestion| DuckDB
    Controllers -->|Ekstrak Teks| DocsTXT

    %% Styling Layer
    classDef client fill:#1e1e2e,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4
    classDef api fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4
    classDef db fill:#181825,stroke:#f9e2af,stroke-width:2px,color:#cdd6f4
```

### Penjelasan Lapisan Teknologi:
1. **Frontend Layer**: Sepenuhnya dibangun dengan statis (`index.html` dan Javascript lokal) agar antarmuka instan terbuka. Tidak ada server-side rendering (SSR). Semua navigasi menu diatur lewat DOM manipulation menggunakan Javascript *vanilla*.
2. **API Layer**: Dibangun di atas **FastAPI**, sebuah kerangka kerja berbasis *Asynchronous Python*. Semua permintaan HTTP dari klien masuk ke sini. Tersedia middleware CORS dan autentikasi token (Base64 `Role:Username`).
3. **Data Layer**: Alih-alih MySQL/PostgreSQL biasa, arsitektur ini menggunakan **DuckDB** yang dikenal kencang untuk pemrosesan kolom logikal (OLAP). File tersimpan dalam bentuk file `.duckdb` yang bisa di-backup secara instan.

---

## 🔄 2. Alur Interaksi Klien-Server (Request Flow)

Bagaimana sebuah interaksi pengguna dari klik tombol hingga data kembali? Di bawah adalah urutan (*sequence*) sistematisnya.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend (JS)
    participant API as FastAPI Gateway
    participant Guard as RBAC & Auth Guard
    participant DB as DuckDB

    User->>Frontend: Membuka Menu Dashboard
    Frontend->>API: HTTP GET/POST Request (Bearer Token)
    API->>Guard: Verifikasi Token & Hak Akses
    
    alt Token Tidak Valid / Role Ditolak
        Guard-->>API: 401 Unauthorized / 403 Forbidden
        API-->>Frontend: Error Response
        Frontend-->>User: Muncul Notifikasi Error
    else Token Valid
        Guard->>API: Akses Diizinkan
        API->>DB: Eksekusi Query SQL
        DB-->>API: Hasil Query
        API->>DB: Rekam Aktivitas ke audit_log
        API-->>Frontend: HTTP 200 OK (JSON Payload)
        Frontend->>Frontend: Render Ulang Komponen DOM
        Frontend-->>User: Menampilkan Tampilan Baru
    end
```

---

## 🛠️ 3. Alur Rekayasa Data / ETL Pipeline (Data Engineering Flow)

Fitur unggulan di backend adalah **Data Pipeline** (ETL) otomatis. Berbeda dengan sekadar memasukkan data, SC-DATA memvalidasi baris data terlebih dulu, dan **menolak** data yang cacat tanpa membuat aplikasinya hancur.

```mermaid
flowchart TD

    Start(["Admin Klik Run Pipeline"]) --> ReadCSV
    
    subgraph EXTRACTION
        ReadCSV["Membaca 6 Berkas CSV"]:::process
    end

    subgraph TRANSFORMATION_VALIDATION
        ReadCSV --> CekKolom{"Cek Kolom Wajib"}:::decision
        CekKolom -->|Kurang| BatalDataset["Batalkan Seluruh Dataset"]:::process
        CekKolom -->|Lengkap| Normalisasi["Normalisasi String & Tipe Data"]:::process
        
        Normalisasi --> Validasi["Validasi Per Baris (PK, Kosong)"]:::process
    end

    subgraph LOADING_QUARANTINE
        Validasi --> SplitData{"Pemisahan Baris"}:::decision
        
        SplitData -->|Baris Cacat/Error| LogIssue["Catat ke pipeline_issue_log"]:::process
        SplitData -->|Baris Valid| ReplaceTable["Timpa Data Lama di Tabel"]:::process
    end

    LogIssue --> CatatSummary
    ReplaceTable --> CatatSummary
    BatalDataset --> CatatSummary
    
    CatatSummary["Catat Metrik Keseluruhan"]:::storage
    CatatSummary --> Finish(["Selesai"])

    %% Styling
    classDef process fill:#f9e2af,stroke:#f2cdcd,stroke-width:2px,color:#181825
    classDef storage fill:#89dceb,stroke:#89b4fa,stroke-width:2px,color:#181825
    classDef decision fill:#f38ba8,stroke:#fab387,stroke-width:2px,color:#181825
```

**Alur Detail Pipeline:**
1. **Extraction (E)**: Sistem mengimpor file `mahasiswa.csv`, `dosen.csv`, dan kawan-kawan dari folder `data/csv`.
2. **Transformation (T)**: Membuang spasi kosong yang tidak perlu, menyamakan kapitalisasi (lowercase), lalu mengevaluasi formula (seperti mengalkulasi Nilai Akhir dari persentase Tugas + UTS + UAS otomatis).
3. **Validation & Karantina**: Jika ada NIM ganda, atau nilai kosong, baris tersebut ditolak dan di-*log* penyebabnya ke `pipeline_issue_log`. Baris lainnya yang sehat tetap lolos.
4. **Load (L)**: Baris sehat di-*insert* massal (Batch Insert) ke tabel DuckDB.

---

## 🧠 4. Alur Mesin Pencari Semantik / AI RAG (Retrieval-Augmented Generation)

Aplikasi memiliki asisten *Smart Search* tanpa API internet seperti OpenAI. Menggunakan algoritma **TF-IDF** (Term Frequency - Inverse Document Frequency) yang ditulis manual secara asali (native).

```mermaid
flowchart LR
    subgraph BUILD [Tahap Pembangunan Indeks]
        Docs["Dokumen Teks"] --> Chunker["Chunker (Potong per 90 kata)"]
        Chunker --> DBChunk[("Tabel document_chunks")]
    end

    subgraph SEARCH [Tahap Pencarian]
        User["Pencarian User"] --> Clean["Pembersihan Kata Kunci"]
        Clean --> Math["Kalkulasi TF-IDF Dinamis"]
        DBChunk --> Math
        Math --> Rank["Urutkan Relevansi (Top 5)"]
        Rank --> Output["Gabung Hasil (Answer)"]
    end
```

**Bagaimana ini bekerja:**
- Saat pencarian dilakukan, backend membagi kata kunci (query). 
- Ia menghitung seberapa sering setiap kata muncul dalam suatu *chunk* (Term Frequency), dan mengimbanginya dengan *Inverse Document Frequency* (mendiskon bobot kata-kata umum seperti "dan", "yang").
- *Chunk* dengan skor matematis tertinggi akan dikembalikan ke pengguna sebagai informasi paling relevan.

---

## 🗄️ 5. Skema Relasi Database Terperinci (Detailed ERD)

Skema database dipecah menjadi dua bagian utama agar lebih mudah dipahami: **Skema Akademik** (Tabel Master & Transaksi) dan **Skema Operasional** (Pencatatan Pipeline & Audit).

### A. Skema Akademik Inti
Menyimpan entitas master (Mahasiswa, Dosen, Mata Kuliah) serta interaksi akademiknya seperti Nilai, Kehadiran, dan KRS.

```mermaid
erDiagram
    %% Tabel Master
    MAHASISWA {
        string nim PK
        string nama
        string prodi
        int semester
        string status
    }
    
    DOSEN {
        string nidn PK
        string nama
        string prodi
        string email
        string status
    }
    
    MATA_KULIAH {
        string kode_mk PK
        string nama_mk
        int sks
        string prodi
        int semester
    }
    
    %% Tabel Transaksi
    KEHADIRAN {
        string hadir_id PK
        string nim FK
        string kode_mk FK
        date tanggal
        string status_hadir
    }
    
    NILAI {
        string nilai_id PK
        string nim FK
        string kode_mk FK
        float tugas
        float uts
        float uas
        float nilai_akhir
        string grade
    }
    
    KRS {
        string krs_id PK
        string nim FK
        string kode_mk FK
        string tahun_ajaran
        string semester_akademik
    }
    
    %% Relasi Logika
    MAHASISWA ||--o{ KRS : "mengambil"
    MAHASISWA ||--o{ KEHADIRAN : "mencatat"
    MAHASISWA ||--o{ NILAI : "memperoleh"
    
    DOSEN ||--o{ MATA_KULIAH : "mengampu"
    MATA_KULIAH ||--o{ KRS : "terdaftar_di"
    MATA_KULIAH ||--o{ NILAI : "diujikan"
    MATA_KULIAH ||--o{ KEHADIRAN : "digelar"
```

### B. Skema Operasional & Pipeline Log (Black-Box System)
Tabel-tabel ini tidak memiliki relasi langsung dengan tabel akademik karena berfungsi sebagai **Audit Trail** dan **Karantina ETL** berkinerja tinggi.

```mermaid
erDiagram
    PIPELINE_LOG {
        string pipeline_id PK
        string dataset_name
        int total_rows
        int invalid_rows
        string status
    }
    
    PIPELINE_ISSUE_LOG {
        string issue_id PK
        string pipeline_id FK
        int row_number
        string issue_type
    }
    
    EVENT_LOG {
        string log_id PK
        string event_id
        string nim
        timestamp waktu_event
        string status_hadir 
    }
    
    AUDIT_LOG {
        string audit_id PK
        timestamp created_at
        string role
        string action
        string detail
        string status
    }
    
    %% Relasi Operasional
    PIPELINE_LOG ||--o{ PIPELINE_ISSUE_LOG : "mencatat_anomali"
```

> [!NOTE]
> Pemisahan skema operasional dan akademik ini sangat disengaja. Jika data akademik di-reset (*Truncate*), data pada Audit Log dan Event Log tetap dipertahankan untuk kebutuhan forensik dan keamanan sistem (Standard Enterprise).
