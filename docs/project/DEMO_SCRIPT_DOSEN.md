# Demo Script Dosen — SC-DATA POWERFUL V2

1. Tunjukkan frontend tetap menggunakan ISTN Connect.
2. Tunjukkan backend aktif melalui `/api/health`.
3. Login sebagai `admin / admin123`.
4. Buka **SC-DATA Cockpit**.
5. Klik **Load Event Baru** dan jelaskan event masuk ke `event_log`.
6. Klik **Run Pipeline** dan jelaskan 6 CSV divalidasi lalu masuk ke DuckDB.
7. Klik **Build RAG Index** dan jelaskan 4 dokumen akademik dipecah menjadi chunk.
8. Buka **Database Proof V2** untuk melihat row count tabel.
9. Buka **Final Validation V2** untuk melihat checklist otomatis.
10. Klik **Backup DuckDB** sebagai bukti governance/DR plan.

Kalimat presentasi inti:

> Web ini tetap memakai HTML, CSS, dan JavaScript sebagai frontend. Ketika tombol diklik, `app.js` mengirim request API ke FastAPI lokal. Backend membaca CSV atau dokumen, memvalidasi data, lalu menyimpan hasilnya ke DuckDB. Bukti penyimpanan terlihat dari halaman Database Proof dan endpoint `/api/db/tables`.

