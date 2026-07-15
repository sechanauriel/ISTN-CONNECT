from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
import json

import pandas as pd

try:
    from .db import PROJECT_ROOT
except ImportError:  # allow direct execution
    import sys
    sys.path.append(str(Path(__file__).resolve().parent.parent))
    from backend.db import PROJECT_ROOT

DATA_DIR = PROJECT_ROOT / "data" / "csv"
DOCS_DIR = PROJECT_ROOT / "docs" / "rag"
ASSETS_DIR = PROJECT_ROOT / "frontend" / "assets"


def write_csv(path: Path, rows: list[dict], overwrite: bool = False) -> None:
    if overwrite or not path.exists():
        pd.DataFrame(rows).to_csv(path, index=False)
        print(f"Dibuat/diperbarui: {path.relative_to(PROJECT_ROOT)}")
    else:
        print(f"Sudah ada: {path.relative_to(PROJECT_ROOT)}")


def write_text(path: Path, text: str, overwrite: bool = False) -> None:
    if overwrite or not path.exists():
        path.write_text(text.strip() + "\n", encoding="utf-8")
        print(f"Dibuat/diperbarui: {path.relative_to(PROJECT_ROOT)}")
    else:
        print(f"Sudah ada: {path.relative_to(PROJECT_ROOT)}")


def load_students_from_json() -> list[dict]:
    source = PROJECT_ROOT / "data" / "json" / "students.json"
    if not source.exists():
        return []
    try:
        data = json.loads(source.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


def load_courses_from_json() -> list[str]:
    source = PROJECT_ROOT / "data" / "json" / "courses.json"
    if not source.exists():
        return []
    try:
        data = json.loads(source.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


def grade_from_score(score: float) -> str:
    if score >= 85: return "A"
    if score >= 80: return "A-"
    if score >= 75: return "B+"
    if score >= 70: return "B"
    if score >= 65: return "C+"
    if score >= 60: return "C"
    return "D"


def seed_data(overwrite: bool = False) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    json_students = load_students_from_json()
    if json_students:
        mahasiswa = [
            {
                "nim": s.get("nim", f"202600{i:02d}"),
                "nama": s.get("name", f"Mahasiswa {i}"),
                "prodi": "Teknik Informatika",
                "semester": 2,
                "status": "aktif",
            }
            for i, s in enumerate(json_students, start=1)
        ]
    else:
        mahasiswa = [
            {"nim": f"202600{i:02d}", "nama": f"Mahasiswa {i}", "prodi": "Teknik Informatika", "semester": 2, "status": "aktif"}
            for i in range(1, 11)
        ]

    dosen = [
        {"nidn": "SC-DATA-001", "nama": "Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.", "prodi": "Sistem Informasi", "email": "oni.bibin@istn.ac.id", "status": "aktif"},
        {"nidn": "0312048801", "nama": "Ir. ANDI SUPRIANTO, M.Kom.", "prodi": "Arsitektur", "email": "andi.suprianto@istn.ac.id", "status": "aktif"},
        {"nidn": "0320119002", "nama": "MARHAENI, S.Kom., M.Kom.", "prodi": "Teknik Informatika", "email": "marhaeni@istn.ac.id", "status": "aktif"},
        {"nidn": "0308098803", "nama": "B. SUMARDIYONO, ST., M.Kom.", "prodi": "Teknik Informatika", "email": "b.sumardiyono@istn.ac.id", "status": "aktif"},
        {"nidn": "0317059104", "nama": "Dikky Suryadi, S.Kom., M.Kom.", "prodi": "Teknik Informatika", "email": "dikky.suryadi@istn.ac.id", "status": "aktif"},
        {"nidn": "0307108906", "nama": "Moch. Zhuhriansyah Rahman, ST., MT.", "prodi": "Teknik Informatika", "email": "zhuhriansyah@istn.ac.id", "status": "aktif"},
    ]

    course_names = load_courses_from_json() or [
        "Pengantar Kecerdasan Buatan (A)",
        "Ilmu Komputer Teoretis & Algoritma Lanjutan (A)",
        "Infrastruktur Cloud dan Sistem Terdistribusi (A)",
        "Sistem Operasi Lanjutan & Arsitektur Jaringan (A)",
        "Pembelajaran Mendalam Terapan untuk Visi Komputer di Awan (A)",
        "Pembelajaran Mesin untuk Teks dan AI Generatif (A)",
        "Sistem Basis Data Modern dan Arsitektur Data Siap-AI (A)",
    ]
    codes = ["AIAR01", "IF-ALG302", "IF-CLD402", "IF-OSN401", "IF-DL501", "IF-NLP502", "SBDM01"]
    mata_kuliah = [
        {"kode_mk": codes[i], "nama_mk": course_names[i], "sks": 3, "prodi": "Teknik Informatika" if i else "Arsitektur", "semester": 2}
        for i in range(len(codes))
    ]

    krs = []
    nilai = []
    kehadiran = []
    events = []
    start = datetime(2026, 6, 1, 8, 0, 0)
    status_cycle = ["hadir", "hadir", "hadir", "izin", "sakit", "alfa"]

    for i, mhs in enumerate(mahasiswa, start=1):
        for j, mk in enumerate(mata_kuliah[:3], start=1):
            krs.append({
                "krs_id": f"KRS-{mhs['nim']}-{mk['kode_mk']}",
                "nim": mhs["nim"],
                "kode_mk": mk["kode_mk"],
                "tahun_ajaran": "2025/2026",
                "semester_akademik": "Genap",
                "status": "disetujui",
            })
            tugas = 75 + ((i + j) % 20)
            uts = 70 + ((i * 2 + j) % 25)
            uas = 72 + ((i * 3 + j) % 25)
            akhir = round(tugas * 0.3 + uts * 0.3 + uas * 0.4, 2)
            nilai.append({
                "nilai_id": f"NIL-{mhs['nim']}-{mk['kode_mk']}",
                "nim": mhs["nim"],
                "kode_mk": mk["kode_mk"],
                "tugas": tugas,
                "uts": uts,
                "uas": uas,
                "nilai_akhir": akhir,
                "grade": grade_from_score(akhir),
            })
            status = status_cycle[(i + j) % len(status_cycle)]
            kehadiran.append({
                "hadir_id": f"HDR-{mhs['nim']}-{mk['kode_mk']}",
                "nim": mhs["nim"],
                "kode_mk": mk["kode_mk"],
                "tanggal": (start + timedelta(days=j * 2)).date().isoformat(),
                "status_hadir": status,
                "keterangan": "seed presensi akademik",
            })

    event_id = 1
    for day in range(6):
        for idx, mhs in enumerate(mahasiswa[:6], start=1):
            mk = mata_kuliah[(idx + day) % len(mata_kuliah)]
            events.append({
                "event_id": f"EVT-{event_id:04d}",
                "nim": mhs["nim"],
                "kode_mk": mk["kode_mk"],
                "waktu_event": (start + timedelta(days=day, minutes=idx * 7)).isoformat(sep=" "),
                "status_hadir": status_cycle[(event_id + idx) % len(status_cycle)],
            })
            event_id += 1

    write_csv(DATA_DIR / "mahasiswa.csv", mahasiswa, overwrite)
    write_csv(DATA_DIR / "dosen.csv", dosen, overwrite)
    write_csv(DATA_DIR / "mata_kuliah.csv", mata_kuliah, overwrite)
    write_csv(DATA_DIR / "krs.csv", krs, overwrite)
    write_csv(DATA_DIR / "nilai.csv", nilai, overwrite)
    write_csv(DATA_DIR / "kehadiran.csv", kehadiran, overwrite)
    write_csv(DATA_DIR / "kehadiran_event.csv", events, overwrite)

    write_text(DOCS_DIR / "pedoman_krs.txt", """
Pedoman KRS ISTN: Mahasiswa mengisi KRS pada periode yang ditetapkan. Jumlah SKS mengikuti IPS/IPK dan persetujuan dosen wali. KRS disetujui setelah mahasiswa memastikan jadwal tidak bentrok dan memenuhi prasyarat mata kuliah. Perubahan KRS hanya dapat dilakukan selama masa batal tambah.
""", overwrite)
    write_text(DOCS_DIR / "pedoman_skripsi.txt", """
Pedoman Skripsi: Mahasiswa dapat mengajukan proposal setelah memenuhi syarat akademik, lulus mata kuliah metodologi, dan memperoleh dosen pembimbing. Dokumen proposal harus memuat latar belakang, rumusan masalah, metode, jadwal penelitian, dan daftar pustaka.
""", overwrite)
    write_text(DOCS_DIR / "aturan_cuti_akademik.txt", """
Aturan Cuti Akademik: Cuti akademik diajukan sebelum semester berjalan melalui bagian akademik. Mahasiswa wajib mengisi formulir, menyertakan alasan, dan mendapatkan persetujuan program studi. Masa cuti tidak dihitung sebagai masa studi aktif sesuai ketentuan akademik.
""", overwrite)
    write_text(DOCS_DIR / "sop_perkuliahan.txt", """
SOP Perkuliahan: Dosen membuka kelas sesuai jadwal, melakukan presensi, menyampaikan materi, dan mencatat aktivitas pembelajaran. Mahasiswa wajib hadir tepat waktu. Status presensi terdiri dari hadir, izin, sakit, dan alfa. Rekap presensi digunakan untuk evaluasi akademik.
""", overwrite)
    print("Seed data SC-DATA selesai.")


if __name__ == "__main__":
    seed_data(overwrite=False)
