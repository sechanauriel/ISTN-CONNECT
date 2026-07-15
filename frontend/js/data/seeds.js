const accounts = {
  Mahasiswa: { username: 'mahasiswa', password: 'mhs123', name: 'Muhammad Sechan Auriel', code: '24360001', role: 'Mahasiswa', avatar: 'MS' },
  Dosen: { username: 'dosen', password: 'dosen123', name: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', code: 'Dosen Pengampu SC-DATA', role: 'Dosen', avatar: 'OB' },
  Administrator: { username: 'admin', password: 'admin123', name: 'Admin Akademik ISTN', code: 'ADM-001', role: 'Administrator', avatar: 'AD' },
  Pimpinan: { username: 'pimpinan', password: 'pimpinan123', name: 'Pimpinan Fakultas', code: 'EXEC-001', role: 'Pimpinan', avatar: 'PF' }
};

const seedStudents = [
  { nim: '24360001', name: 'Muhammad Sechan Auriel', prodi: 'Teknik Informatika', semester: 2, ipk: 3.74, attendance: 92, risk: 'Rendah', status: 'Aktif' },
  { nim: '24350003', name: 'Daven Putra Veronikko', prodi: 'Teknik Informatika', semester: 2, ipk: 3.80, attendance: 90, risk: 'Rendah', status: 'Aktif' },
  { nim: '24350005', name: 'Ahmed Kareem Ramadhan', prodi: 'Teknik Informatika', semester: 2, ipk: 3.68, attendance: 89, risk: 'Rendah', status: 'Aktif' }
];

const seedLecturers = [
  { id: 'D001', name: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', nidn: 'SC-DATA-001', prodi: 'Sistem Informasi', email: 'oni.bibin@istn.ac.id', status: 'Aktif' },
  { id: 'D002', name: 'Ir. ANDI SUPRIANTO, M.Kom.', nidn: '0312048801', prodi: 'Arsitektur', email: 'andi.suprianto@istn.ac.id', status: 'Aktif' },
  { id: 'D003', name: 'MARHAENI, S.Kom., M.Kom.', nidn: '0320119002', prodi: 'Teknik Informatika', email: 'marhaeni@istn.ac.id', status: 'Aktif' },
  { id: 'D004', name: 'B. SUMARDIYONO, ST., M.Kom.', nidn: '0308098803', prodi: 'Teknik Informatika', email: 'b.sumardiyono@istn.ac.id', status: 'Aktif' },
  { id: 'D005', name: 'Dikky Suryadi, S.Kom., M.Kom.', nidn: '0317059104', prodi: 'Teknik Informatika', email: 'dikky.suryadi@istn.ac.id', status: 'Aktif' },
  { id: 'D006', name: 'Moch. Zhuhriansyah Rahman, ST., MT.', nidn: '0307108906', prodi: 'Teknik Informatika', email: 'zhuhriansyah@istn.ac.id', status: 'Aktif' }
];

const seedCourses = [
  { id: 'ai', code: 'AIAR01', title: 'Pengantar Kecerdasan Buatan (A)', program: 'Arsitektur', sks: 3, lecturer: 'Ir. ANDI SUPRIANTO, M.Kom. dan 1 lainnya', day: 'Kamis', start: '08:00', end: '09:30', room: 'A-201', method: 'Case Method', progress: 50, attended: 8, total: 16, health: 75, status: 'Aktif', material: 'Konsep dasar kecerdasan buatan, perkembangan AI, agent, search, reasoning, dan studi kasus akademik' },
  { id: 'algo', code: 'IF-ALG302', title: 'Ilmu Komputer Teoretis & Algoritma Lanjutan (A)', program: 'Teknik Informatika', sks: 3, lecturer: 'MARHAENI, S.Kom., M.Kom. dan 1 lainnya', day: 'Rabu', start: '13:00', end: '16:00', room: 'B-105', method: 'Project Based Learning • Case Method', progress: 93, attended: 15, total: 16, health: 93, status: 'Aktif', material: 'Teori komputasi, struktur algoritma lanjutan, kompleksitas, optimasi, dan pemecahan masalah' },
  { id: 'cloud', code: 'IF-CLD402', title: 'Infrastruktur Cloud dan Sistem Terdistribusi (A)', program: 'Teknik Informatika', sks: 3, lecturer: 'B. SUMARDIYONO, ST., M.Kom. dan 1 lainnya', day: 'Rabu', start: '09:00', end: '12:00', room: 'D-307', method: 'Project Based Learning • Case Method', progress: 12, attended: 2, total: 16, health: 58, status: 'Kritis', material: 'Cloud architecture, container, orchestration, distributed service, dan perancangan sistem terdistribusi' },
  { id: 'osnet', code: 'IF-OSN401', title: 'Sistem Operasi Lanjutan & Arsitektur Jaringan (A)', program: 'Teknik Informatika', sks: 3, lecturer: 'Dikky Suryadi, S.Kom., M.Kom.', day: 'Selasa', start: '13:00', end: '16:00', room: 'C-303', method: 'Project Based Learning • Case Method', progress: 37, attended: 6, total: 16, health: 66, status: 'Perlu Perhatian', material: 'Kernel, concurrency, memory management, arsitektur jaringan, dan protokol komunikasi' },
  { id: 'vision', code: 'IF-DL501', title: 'Pembelajaran Mendalam Terapan untuk Visi Komputer di Awan (A)', program: 'Teknik Informatika', sks: 3, lecturer: 'Moch. Zhuhriansyah Rahman, ST., MT.', day: 'Selasa', start: '09:00', end: '11:10', room: 'Lab AI-1', method: 'Jenis kelas tidak tersedia', progress: 0, attended: 0, total: 16, health: 40, status: 'Belum Aktif', material: 'Deep learning, computer vision, GPU cloud, model deployment, dan evaluasi performa visual model' },
  { id: 'genai', code: 'IF-NLP502', title: 'Pembelajaran Mesin untuk Teks dan AI Generatif (A)', program: 'Teknik Informatika', sks: 3, lecturer: 'B. SUMARDIYONO, ST., M.Kom. dan 1 lainnya', day: 'Senin', start: '13:00', end: '16:00', room: 'Lab Data-2', method: 'Jenis kelas tidak tersedia', progress: 0, attended: 0, total: 16, health: 42, status: 'Belum Aktif', material: 'NLP, transformer, prompt engineering, RAG, generative AI, dan evaluasi model bahasa' },
  { id: 'sbdm', code: 'SBDM01', title: 'Sistem Basis Data Modern dan Arsitektur Data Siap-AI (A)', program: 'Sistem Informasi', sks: 3, lecturer: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', day: 'Senin', start: '09:00', end: '12:00', room: 'A-110', method: 'Jenis kelas tidak tersedia', progress: 0, attended: 0, total: 16, health: 50, status: 'Belum Aktif', material: 'Modern DBMS, data pipeline, RAG, governance, deployment decision, dan arsitektur data siap AI' }
];

const seedTasks = [
  { id: 'T001', courseId: 'sbdm', title: 'Laporan SC-DATA Modul 14', type: 'Laporan', deadline: '24 Juni 2026, 23:59', status: 'Belum dikumpulkan', score: null, instruction: 'Susun blueprint arsitektur data siap AI secara lengkap.' },
  { id: 'T002', courseId: 'ai', title: 'Tugas Studi Kasus AI Agent', type: 'Tugas', deadline: '25 Juni 2026, 23:59', status: 'Belum dikumpulkan', score: null, instruction: 'Analisis agent, environment, action, dan performance measure pada kasus akademik.' },
  { id: 'T003', courseId: 'algo', title: 'Kuis Kompleksitas Algoritma', type: 'Kuis', deadline: '26 Juni 2026, 21:00', status: 'Selesai', score: 88, instruction: 'Kerjakan kuis analisis kompleksitas dan notasi Big-O.' },
  { id: 'T004', courseId: 'cloud', title: 'Desain Arsitektur Sistem Terdistribusi', type: 'Proyek', deadline: '29 Juni 2026, 23:59', status: 'Belum dikumpulkan', score: null, instruction: 'Buat diagram service, database, gateway, dan deployment.' }
];

const seedEvents = [
  { id: 'E001', title: 'Kuliah Sistem Basis Data Modern dan Arsitektur Data Siap-AI', date: '2026-06-22', time: '09:00', type: 'Kuliah' },
  { id: 'E002', title: 'Pengantar Kecerdasan Buatan', date: '2026-06-25', time: '08:00', type: 'Kuliah' },
  { id: 'E003', title: 'Ilmu Komputer Teoretis & Algoritma Lanjutan', date: '2026-06-24', time: '13:00', type: 'Kuliah' },
  { id: 'E004', title: 'Rapat Evaluasi Presensi Kelas', date: '2026-06-25', time: '13:30', type: 'Rapat' }
];

const seedMessages = [
  { id: 'M001', from: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', to: 'Mahasiswa', title: 'Validasi laporan SC-DATA', body: 'Lengkapi modul, bukti pengujian, deployment decision, dan evidence integrasi SIAKAD.', time: '10:20', unread: true },
  { id: 'M002', from: 'Admin Akademik', to: 'Dosen', title: 'Input nilai sementara', body: 'Batas input nilai sementara adalah 28 Juni 2026.', time: '11:45', unread: true },
  { id: 'M003', from: 'Pimpinan Fakultas', to: 'Administrator', title: 'Audit presensi mingguan', body: 'Mohon kirim ringkasan presensi kelas berisiko minggu ini.', time: '13:10', unread: false }
];

const seedDocuments = [
  { id: 'DOC1', title: 'Panduan Akademik ISTN 2026.pdf', type: 'PDF', tags: 'KRS, cuti, nilai, presensi', source: 'Biro Akademik' },
  { id: 'DOC2', title: 'Silabus SC-DATA Minggu 9-16.pdf', type: 'PDF', tags: 'data pipeline, RAG, governance', source: 'Dosen Pengampu' },
  { id: 'DOC3', title: 'SOP Presensi Mahasiswa.pdf', type: 'PDF', tags: 'kehadiran, izin, alfa', source: 'Akademik' },
  { id: 'DOC4', title: 'Template Laporan Capstone.docx', type: 'DOC', tags: 'laporan, modul, validasi', source: 'SC-DATA' },
  { id: 'DOC5', title: 'KRS Semester Genap 2026.xlsx', type: 'XLS', tags: 'krs, jadwal, sks', source: 'SIAKAD' }
];

const storage = {
  students: 'istn-v16-students', lecturers: 'istn-v16-lecturers', courses: 'istn-v16-courses', tasks: 'istn-v16-tasks',
  events: 'istn-v16-events', messages: 'istn-v16-messages', audit: 'istn-v16-audit', grades: 'istn-v16-grades', attendance: 'istn-v16-attendance', settings: 'istn-v16-settings'
};

const navs = {
  Mahasiswa: [
    ['Utama', [['dashboard', '⌂︎', 'Dashboard'], ['classes', '▦︎', 'Kelas & Perkuliahan'], ['course-detail', '◈︎', 'Detail Kelas'], ['krs', 'KRS', 'KRS & Jadwal']]],
    ['Akademik', [['grades', '◎︎', 'Nilai & KHS'], ['attendance', '◉︎', 'Kehadiran'], ['assignments', '✎︎', 'Tugas & Ujian'], ['documents', '▤︎', 'Dokumen Akademik']]],
    ['AI & Komunikasi', [['analytics', '◬︎', 'Analitik Akademik'], ['ai', 'AI', 'Asisten Akademik'], ['rag', '⌕︎', 'Search / RAG'], ['messages', '✉︎', 'Pesan', '2'], ['calendar', '◷︎', 'Kalender']]],
    ['Akun', [['profile', '◎︎', 'Profil Saya'], ['settings', '⚙︎', 'Pengaturan']]]
  ],
  Dosen: [
    ['Utama', [['dashboard', '⌂︎', 'Dashboard Dosen'], ['lecturer-courses', '▦︎', 'Mata Kuliah Saya'], ['course-detail', '◈︎', 'Detail Kelas']]],
    ['Pengajaran', [['lecturer-tasks', '✎︎', 'Beri Tugas'], ['lecturer-submissions', '□︎', 'Pengumpulan Tugas'], ['lecturer-attendance', '◉︎', 'Isi Kehadiran'], ['lecturer-grades', '◎︎', 'Input Nilai'], ['lecturer-students', '☷︎', 'Mahasiswa Bimbingan']]],
    ['AI & Komunikasi', [['analytics', '◬︎', 'Analitik Kelas'], ['ai', 'AI', 'Asisten Dosen'], ['rag', '⌕︎', 'Search / RAG'], ['documents', '▤︎', 'Dokumen'], ['messages', '✉︎', 'Pesan', '3'], ['calendar', '◷︎', 'Kalender']]],
    ['Akun', [['profile', '◎︎', 'Profil'], ['settings', '⚙︎', 'Pengaturan']]]
  ],
  Administrator: [
    ['Utama', [['dashboard', '⌂︎', 'Dashboard Admin'], ['admin-students', '☷︎', 'Master Mahasiswa'], ['admin-lecturers', '◪︎', 'Master Dosen'], ['admin-courses', '▦︎', 'Master Mata Kuliah']]],
    ['Sistem', [['admin-users', 'RB', 'Kelola User & Role'], ['data-pipeline', 'ETL', 'Data Pipeline'], ['audit', 'LOG', 'Audit Log'], ['governance', 'SEC', 'Security & Governance'], ['deployment', 'DEP', 'Deployment']]],
    ['Komunikasi', [['analytics', '◬︎', 'Analitik Sistem'], ['messages', '✉︎', 'Pesan', '5'], ['calendar', '◷︎', 'Kalender'], ['documents', '▤︎', 'Dokumen']]],
    ['Akun', [['profile', '◎︎', 'Profil'], ['settings', '⚙︎', 'Pengaturan']]]
  ],
  Pimpinan: [
    ['Utama', [['dashboard', '⌂︎', 'Dashboard Pimpinan Fakultas'], ['executive-stats', '◬︎', 'Statistik Akademik'], ['executive-grades', '◎︎', 'Rekap Nilai'], ['executive-attendance', '◉︎', 'Rekap Kehadiran']]],
    ['Keputusan', [['risk', '⚠︎', 'Risiko Akademik'], ['compliance', 'SEC', 'Audit & Compliance'], ['deployment', 'DEP', 'Deployment'], ['executive-ai', 'AI', 'Executive AI']]],
    ['Komunikasi', [['messages', '✉︎', 'Pesan', '1'], ['calendar', '◷︎', 'Kalender'], ['documents', '▤︎', 'Dokumen']]],
    ['Akun', [['profile', '◎︎', 'Profil'], ['settings', '⚙︎', 'Pengaturan']]]
  ]
};
