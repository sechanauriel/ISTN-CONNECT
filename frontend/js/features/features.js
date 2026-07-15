/**
 * ISTN CONNECT — FEATURES EXTENSION
 * =====================================================
 * 17 Fitur Baru Website Akademik
 * File ini dipasang setelah app.js agar dapat mengakses
 * semua fungsi, state, dan helpers yang sudah ada.
 *
 * Strategi override:
 * - handleAction: menggunakan window.handleNewFeatureAction()
 *   yang dipanggil dari event listener capture di document
 * - handleFormSubmit: sama, intercept di capture phase
 * =====================================================
 */

(function () {
  'use strict';

  /* ── Seed Data Baru ────────────────────────────── */

  const seedAnnouncements = [
    { id: 'ANN001', title: 'Jadwal UTS Semester Genap 2026', body: 'UTS akan dilaksanakan pada 14–20 Juli 2026. Pastikan KRS Anda sudah final dan kartu ujian sudah dicetak melalui portal.', category: 'Akademik', date: '2026-06-28', priority: 'Tinggi', author: 'Biro Akademik' },
    { id: 'ANN002', title: 'Batas Akhir Input Nilai Sementara', body: 'Seluruh dosen wajib menginput nilai sementara UTS paling lambat 25 Juli 2026 melalui menu Input Nilai di portal.', category: 'Akademik', date: '2026-06-25', priority: 'Tinggi', author: 'Wakil Dekan Akademik' },
    { id: 'ANN003', title: 'Pendaftaran Beasiswa Prestasi 2026', body: 'Pendaftaran beasiswa prestasi akademik tahun 2026 dibuka mulai 1 Juli 2026. Syarat: IPK ≥ 3.5, presensi ≥ 85%. Daftar melalui menu Beasiswa di portal.', category: 'Beasiswa', date: '2026-06-24', priority: 'Sedang', author: 'Bagian Kemahasiswaan' },
    { id: 'ANN004', title: 'Libur Idul Adha — Kampus Tutup', body: 'Kampus ISTN akan libur pada 6–7 Juni 2026 dalam rangka Hari Raya Idul Adha 1447 H. Perkuliahan dan layanan akademik ditiadakan.', category: 'Informasi', date: '2026-06-03', priority: 'Rendah', author: 'Rektorat ISTN' },
    { id: 'ANN005', title: 'PKL Semester Ganjil 2026 — Pendaftaran Dibuka', body: 'Mahasiswa semester 5 ke atas dapat mendaftarkan PKL mulai 10 Juli 2026. Pastikan telah memiliki perusahaan/instansi yang akan menerima PKL.', category: 'PKL', date: '2026-06-20', priority: 'Sedang', author: 'Koordinator PKL' },
    { id: 'ANN006', title: 'Seminar Nasional Teknologi Informasi 2026', body: 'ISTN menyelenggarakan Seminar Nasional TI pada 5 Agustus 2026. Mahasiswa dapat mendaftar sebagai peserta melalui form yang tersedia di portal.', category: 'Kegiatan', date: '2026-06-18', priority: 'Rendah', author: 'Himpunan Mahasiswa TI' },
  ];

  const seedExamSchedule = [
    { id: 'EX001', courseCode: 'AIAR01', courseTitle: 'Pengantar Kecerdasan Buatan (A)', type: 'UTS', date: '2026-07-15', start: '08:00', end: '10:00', room: 'G-201', supervisor: 'Ir. ANDI SUPRIANTO, M.Kom.', sks: 3 },
    { id: 'EX002', courseCode: 'IF-ALG302', courseTitle: 'Ilmu Komputer Teoretis & Algoritma Lanjutan (A)', type: 'UTS', date: '2026-07-16', start: '13:00', end: '15:00', room: 'G-301', supervisor: 'MARHAENI, S.Kom., M.Kom.', sks: 3 },
    { id: 'EX003', courseCode: 'IF-CLD402', courseTitle: 'Infrastruktur Cloud dan Sistem Terdistribusi (A)', type: 'UTS', date: '2026-07-17', start: '09:00', end: '11:00', room: 'Lab-D1', supervisor: 'B. SUMARDIYONO, ST., M.Kom.', sks: 3 },
    { id: 'EX004', courseCode: 'IF-OSN401', courseTitle: 'Sistem Operasi Lanjutan & Arsitektur Jaringan (A)', type: 'UTS', date: '2026-07-18', start: '13:00', end: '15:00', room: 'G-105', supervisor: 'Dikky Suryadi, S.Kom., M.Kom.', sks: 3 },
    { id: 'EX005', courseCode: 'IF-DL501', courseTitle: 'Pembelajaran Mendalam Terapan untuk Visi Komputer (A)', type: 'UTS', date: '2026-07-19', start: '09:00', end: '11:00', room: 'Lab AI-1', supervisor: 'Moch. Zhuhriansyah Rahman, ST., MT.', sks: 3 },
    { id: 'EX006', courseCode: 'IF-NLP502', courseTitle: 'Pembelajaran Mesin untuk Teks dan AI Generatif (A)', type: 'UTS', date: '2026-07-20', start: '13:00', end: '15:00', room: 'Lab Data-2', supervisor: 'B. SUMARDIYONO, ST., M.Kom.', sks: 3 },
    { id: 'EX007', courseCode: 'SBDM01', courseTitle: 'Sistem Basis Data Modern dan Arsitektur Data Siap-AI (A)', type: 'UTS', date: '2026-07-21', start: '09:00', end: '11:00', room: 'A-110', supervisor: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', sks: 3 },
  ];

  const seedPayments = [
    { id: 'PAY001', type: 'UKT', semester: 'Genap 2025/2026', amount: 4500000, dueDate: '2026-02-20', status: 'Lunas', paidDate: '2026-02-15', method: 'Transfer Bank BNI' },
    { id: 'PAY002', type: 'UKT', semester: 'Ganjil 2025/2026', amount: 4500000, dueDate: '2025-09-20', status: 'Lunas', paidDate: '2025-09-10', method: 'Transfer Bank BNI' },
    { id: 'PAY003', type: 'UKT', semester: 'Genap 2024/2025', amount: 4200000, dueDate: '2025-02-20', status: 'Lunas', paidDate: '2025-02-18', method: 'Kartu Debit' },
    { id: 'PAY004', type: 'Wisuda', semester: 'Genap 2025/2026', amount: 1500000, dueDate: '2026-08-01', status: 'Belum Lunas', paidDate: null, method: null },
  ];

  const seedLibraryBooks = [
    { id: 'LIB001', title: 'Kecerdasan Buatan: Pendekatan Modern', author: 'Stuart Russell, Peter Norvig', isbn: '978-0-13-468599-1', category: 'Informatika', stock: 3, available: 2, year: 2020 },
    { id: 'LIB002', title: 'Database System Concepts', author: 'Abraham Silberschatz, Henry F. Korth', isbn: '978-0-07-352332-3', category: 'Basis Data', stock: 4, available: 3, year: 2019 },
    { id: 'LIB003', title: 'Deep Learning', author: 'Ian Goodfellow, Yoshua Bengio', isbn: '978-0-26-203561-3', category: 'Machine Learning', stock: 2, available: 0, year: 2016 },
    { id: 'LIB004', title: 'Clean Code: A Handbook', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', category: 'Rekayasa Perangkat Lunak', stock: 5, available: 4, year: 2008 },
    { id: 'LIB005', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0-13-212695-3', category: 'Jaringan', stock: 3, available: 1, year: 2021 },
    { id: 'LIB006', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen et al.', isbn: '978-0-26-204630-5', category: 'Algoritma', stock: 2, available: 2, year: 2022 },
  ];

  const seedInternships = [
    { id: 'PKL001', company: 'PT Pertamina Persero Tbk', position: 'Junior Data Analyst', student: '24360001', studentName: 'Muhammad Sechan Auriel', supervisor: 'D001', startDate: '2026-07-01', endDate: '2026-09-30', status: 'Menunggu Persetujuan', score: null, report: null },
    { id: 'PKL002', company: 'PT Astra International Tbk', position: 'Software Engineering Intern', student: '24350003', studentName: 'Daven Putra Veronikko', supervisor: 'D003', startDate: '2026-07-15', endDate: '2026-10-15', status: 'Disetujui', score: null, report: 'Laporan PKL Minggu 1-4.pdf' },
    { id: 'PKL003', company: 'PT HM Sampoerna Tbk', position: 'Backend Developer Intern', student: '224350005', studentName: 'Ahmed Kareem Ramadhan', supervisor: 'D004', startDate: '2026-06-01', endDate: '2026-08-31', status: 'Berjalan', score: null, report: 'Laporan PKL Minggu 1-8.pdf' },
  ];

  const seedTheses = [
    { id: 'TA001', nim: '24360001', title: 'Implementasi RAG (Retrieval-Augmented Generation) untuk Sistem Informasi Akademik Kampus Berbasis DuckDB', supervisor1: 'Oni Bibin Bintoro, Ing., Dipl.-Sci., MBA, MBI.', supervisor2: 'MARHAENI, S.Kom., M.Kom.', status: 'Pengajuan Judul', stage: 1, submitted: '2026-06-20', defense: null, score: null },
    { id: 'TA002', nim: '24360006', title: 'Pengembangan Aplikasi Mobile Monitoring Kehadiran Mahasiswa Berbasis QR Code dan AI', supervisor1: 'Dikky Suryadi, S.Kom., M.Kom.', supervisor2: 'B. SUMARDIYONO, ST., M.Kom.', status: 'Bimbingan Aktif', stage: 2, submitted: '2026-05-10', defense: null, score: null },
    { id: 'TA003', nim: '24360002', title: 'Analisis Sentimen Ulasan Mahasiswa terhadap Kualitas Pembelajaran Menggunakan BERT', supervisor1: 'Moch. Zhuhriansyah Rahman, ST., MT.', supervisor2: 'Dikky Suryadi, S.Kom., M.Kom.', status: 'Siap Sidang', stage: 3, submitted: '2026-04-05', defense: '2026-07-10', score: null },
  ];

  const seedScholarships = [
    { id: 'SCH001', name: 'Beasiswa Prestasi Akademik ISTN 2026', provider: 'Yayasan ISTN', amount: 4500000, requirement: 'IPK ≥ 3.5, Presensi ≥ 85%, Semester 2-7', deadline: '2026-07-31', status: 'Buka', quota: 10 },
    { id: 'SCH002', name: 'KIP Kuliah (Kartu Indonesia Pintar)', provider: 'Kemdikbud', amount: 7000000, requirement: 'Mahasiswa tidak mampu, IPK ≥ 2.75', deadline: '2026-07-15', status: 'Buka', quota: 25 },
    { id: 'SCH003', name: 'Beasiswa Bank BNI IT Scholarship', provider: 'Bank BNI', amount: 5000000, requirement: 'Prodi TI/SI, IPK ≥ 3.3, Tidak sedang menerima beasiswa lain', deadline: '2026-06-30', status: 'Tutup', quota: 5 },
    { id: 'SCH004', name: 'Beasiswa Tanoto Foundation', provider: 'Tanoto Foundation', requirement: 'IPK ≥ 3.0, aktif berorganisasi, keluarga tidak mampu', amount: 6000000, deadline: '2026-08-20', status: 'Buka', quota: 8 },
  ];

  const seedForumThreads = [
    { id: 'FRM001', courseId: 'sbdm', title: 'Pertanyaan tentang DuckDB vs PostgreSQL', body: 'Pak dosen, saya ingin bertanya — kapan sebaiknya kita memilih DuckDB dibandingkan PostgreSQL dalam konteks analitik data?', author: 'Muhammad Sechan Auriel', authorRole: 'Mahasiswa', date: '2026-06-28 10:15', replies: 3, likes: 7 },
    { id: 'FRM002', courseId: 'algo', title: 'Implementasi Dynamic Programming untuk soal UTS', body: 'Untuk soal UTS kemarin nomor 4, apakah boleh menggunakan DP bottom-up? Saya bingung memilih antara top-down dan bottom-up.', author: 'Daven Putra Veronikko', authorRole: 'Mahasiswa', date: '2026-06-27 14:30', replies: 5, likes: 12 },
    { id: 'FRM003', courseId: 'cloud', title: 'Error saat deploy container di AWS', body: 'Saya mendapatkan error "Container exited with code 1" saat mencoba deploy di AWS ECS. Sudah coba beberapa konfigurasi tapi masih gagal.', author: 'Ahmed Kareem Ramadhan', authorRole: 'Mahasiswa', date: '2026-06-26 09:45', replies: 2, likes: 4 },
  ];

  const seedHelpdesk = [
    { id: 'TKT001', subject: 'Nilai UTS tidak muncul di portal', category: 'Akademik', priority: 'Tinggi', status: 'Selesai', submitter: 'Muhammad Sechan Auriel', role: 'Mahasiswa', date: '2026-06-20', resolvedDate: '2026-06-22', response: 'Nilai sudah diinput oleh dosen. Silakan cek kembali di menu Nilai & KHS.' },
    { id: 'TKT002', subject: 'Tidak bisa login ke portal setelah reset password', category: 'Teknis', priority: 'Tinggi', status: 'Proses', submitter: 'Daven Putra Veronikko', role: 'Mahasiswa', date: '2026-06-25', resolvedDate: null, response: 'Tim teknis sedang menyelidiki. Estimasi selesai 2x24 jam.' },
    { id: 'TKT003', subject: 'Permintaan surat keterangan aktif untuk beasiswa', category: 'Administrasi', priority: 'Sedang', status: 'Menunggu', submitter: 'Ahmed Kareem Ramadhan', role: 'Mahasiswa', date: '2026-06-27', resolvedDate: null, response: null },
  ];

  const seedOrganizations = [
    { id: 'ORG001', name: 'Himpunan Mahasiswa Teknik Informatika', type: 'Himpunan', description: 'Organisasi resmi mahasiswa Prodi Teknik Informatika ISTN', members: 45, events: 12, advisor: 'Dikky Suryadi, S.Kom., M.Kom.', status: 'Aktif' },
    { id: 'ORG002', name: 'Himpunan Mahasiswa Sistem Informasi', type: 'Himpunan', description: 'Organisasi resmi mahasiswa Prodi Sistem Informasi ISTN', members: 28, events: 8, advisor: 'MARHAENI, S.Kom., M.Kom.', status: 'Aktif' },
    { id: 'ORG003', name: 'UKM Basket ISTN', type: 'UKM', description: 'Unit kegiatan mahasiswa bidang Basket', members: 60, events: 15, advisor: 'B. SUMARDIYONO, ST., M.Kom.', status: 'Aktif' },
    { id: 'ORG004', name: 'UKM Hoki ISTN', type: 'UKM', description: 'Unit kegiatan mahasiswa bidang Hoki', members: 120, events: 5, advisor: 'Ir. ANDI SUPRIANTO, M.Kom.', status: 'Aktif' },
    { id: 'ORG005', name: 'UKM Dayung ISTN', type: 'UKM', description: 'Unit kegiatan mahasiswa bidang Dayung', members: 80, events: 20, advisor: 'Moch. Zhuhriansyah Rahman, ST., MT.', status: 'Aktif' },
  ];

  const seedAlumni = [
    { id: 'ALM001', name: 'Budi Santoso Pratama', nim: '20360001', year: 2024, prodi: 'Teknik Informatika', company: 'Tokopedia (GoTo)', position: 'Software Engineer', gpa: 3.72, city: 'Jakarta', linkedIn: '#' },
    { id: 'ALM002', name: 'Siti Rahayu Utami', nim: '20360002', year: 2024, prodi: 'Teknik Informatika', company: 'Gojek', position: 'Data Analyst', gpa: 3.85, city: 'Jakarta', linkedIn: '#' },
    { id: 'ALM003', name: 'Ahmad Fauzi Ramadan', nim: '19360001', year: 2023, prodi: 'Teknik Informatika', company: 'Kemenkominfo', position: 'Analis Sistem Informasi', gpa: 3.61, city: 'Jakarta', linkedIn: '#' },
    { id: 'ALM004', name: 'Dewi Kartika Sari', nim: '19360002', year: 2023, prodi: 'Sistem Informasi', company: 'Bank Mandiri (IT)', position: 'IT Business Analyst', gpa: 3.78, city: 'Jakarta', linkedIn: '#' },
    { id: 'ALM005', name: 'Rizky Maulana Putra', nim: '21360003', year: 2025, prodi: 'Teknik Informatika', company: 'Freelance & Startup', position: 'Full Stack Developer', gpa: 3.55, city: 'Bandung', linkedIn: '#' },
  ];

  const storageNew = {
    announcements: 'istn-v16-announcements',
    examSchedule: 'istn-v16-exam-schedule',
    payments: 'istn-v16-payments',
    library: 'istn-v16-library',
    internships: 'istn-v16-internships',
    theses: 'istn-v16-theses',
    scholarships: 'istn-v16-scholarships',
    forum: 'istn-v16-forum',
    helpdesk: 'istn-v16-helpdesk',
    organizations: 'istn-v16-organizations',
    alumni: 'istn-v16-alumni',
    notifications: 'istn-v16-notifications',
    qrSessions: 'istn-v16-qr-sessions',
  };

  /* ── Init State Baru ──────────────────────────── */
  function initNewFeatures() {
    state.announcements = getStored(storageNew.announcements, seedAnnouncements);
    state.examSchedule  = getStored(storageNew.examSchedule,  seedExamSchedule);
    state.payments      = getStored(storageNew.payments,      seedPayments);
    state.library       = getStored(storageNew.library,       seedLibraryBooks);
    state.internships   = getStored(storageNew.internships,   seedInternships);
    state.theses        = getStored(storageNew.theses,        seedTheses);
    state.scholarships  = getStored(storageNew.scholarships,  seedScholarships);
    state.forum         = getStored(storageNew.forum,         seedForumThreads);
    state.helpdesk      = getStored(storageNew.helpdesk,      seedHelpdesk);
    state.organizations = getStored(storageNew.organizations, seedOrganizations);
    state.alumni        = getStored(storageNew.alumni,        seedAlumni);
    state.notifications = getStored(storageNew.notifications, buildInitialNotifications());
    state.qrSessions    = getStored(storageNew.qrSessions,    []);
  }

  function buildInitialNotifications() {
    return [
      { id: 'NTF001', title: 'Pengumuman Jadwal UTS', body: 'Jadwal UTS Semester Genap 2026 telah dipublikasikan.', type: 'info', read: false, date: '2026-06-28 10:00' },
      { id: 'NTF002', title: 'Deadline Tugas Laporan SC-DATA', body: 'Tugas Laporan SC-DATA Modul 14 jatuh tempo besok, 24 Juni 2026.', type: 'warning', read: false, date: '2026-06-23 08:00' },
      { id: 'NTF003', title: 'Nilai Kuis Diterima', body: 'Nilai Kuis Kompleksitas Algoritma telah diinput. Nilai Anda: 88.', type: 'success', read: true, date: '2026-06-26 16:30' },
      { id: 'NTF004', title: 'Beasiswa Prestasi Dibuka', body: 'Pendaftaran Beasiswa Prestasi Akademik ISTN 2026 telah dibuka.', type: 'info', read: false, date: '2026-06-24 09:00' },
    ];
  }

  /* ── Navigasi Tambahan per Role ───────────────── */
  function extendNavs() {
    const newMenuMahasiswa = [
      ['Fitur Akademik Lanjutan', [
        ['announcements', '📣', 'Pengumuman'],
        ['exam-schedule', '📋', 'Jadwal Ujian'],
        ['exam-card', '🪪', 'Kartu Ujian'],
        ['surat-keterangan', '📄', 'Surat Keterangan'],
        ['payment', '💳', 'Pembayaran SPP/UKT'],
        ['ipk-chart', '📈', 'Grafik Perkembangan IPK'],
      ]],
      ['Kampus & Karir', [
        ['library', '📚', 'Perpustakaan Digital'],
        ['internship', '🏢', 'PKL / Magang'],
        ['thesis', '🎓', 'Skripsi / Tugas Akhir'],
        ['scholarship', '🏅', 'Beasiswa'],
        ['organization', '🤝', 'Organisasi / UKM'],
        ['forum', '💬', 'Forum Diskusi'],
      ]],
      ['Bantuan', [
        ['notifications', '🔔', 'Notifikasi'],
        ['helpdesk', '🎧', 'Helpdesk / Bantuan'],
      ]],
    ];
    const newMenuDosen = [
      ['Fitur Lanjutan', [
        ['announcements', '📣', 'Pengumuman'],
        ['exam-schedule', '📋', 'Jadwal Ujian'],
        ['qr-attendance', '📷', 'Absensi QR Code'],
        ['forum', '💬', 'Forum Diskusi'],
        ['internship', '🏢', 'PKL Bimbingan'],
        ['helpdesk', '🎧', 'Helpdesk'],
        ['notifications', '🔔', 'Notifikasi'],
      ]],
    ];
    const newMenuAdmin = [
      ['Layanan Akademik', [
        ['announcements', '📣', 'Kelola Pengumuman'],
        ['payment', '💳', 'Kelola Pembayaran'],
        ['scholarship', '🏅', 'Kelola Beasiswa'],
        ['internship', '🏢', 'Kelola PKL'],
        ['thesis', '🎓', 'Kelola Skripsi'],
        ['library', '📚', 'Kelola Perpustakaan'],
        ['helpdesk', '🎧', 'Kelola Helpdesk'],
        ['alumni', '🌐', 'Data Alumni'],
        ['notifications', '🔔', 'Notifikasi'],
      ]],
    ];
    const newMenuPimpinan = [
      ['Informasi Strategis', [
        ['announcements', '📣', 'Pengumuman'],
        ['alumni', '🌐', 'Alumni & Tracer Study'],
        ['scholarship', '🏅', 'Rekap Beasiswa'],
        ['notifications', '🔔', 'Notifikasi'],
      ]],
    ];

    navs.Mahasiswa.push(...newMenuMahasiswa);
    navs.Dosen.push(...newMenuDosen);
    navs.Administrator.push(...newMenuAdmin);
    navs.Pimpinan.push(...newMenuPimpinan);
  }

  /* ── Daftarkan pageMap Baru ───────────────────── */
  function registerPages() {
    Object.assign(pageMap, {
      'announcements':    renderAnnouncements,
      'exam-schedule':    renderExamSchedule,
      'exam-card':        renderExamCard,
      'surat-keterangan': renderSuratKeterangan,
      'payment':          renderPayment,
      'library':          renderLibrary,
      'internship':       renderInternship,
      'thesis':           renderThesis,
      'scholarship':      renderScholarship,
      'forum':            renderForum,
      'helpdesk':         renderHelpdesk,
      'notifications':    renderNotifications,
      'qr-attendance':    renderQRAttendance,
      'organization':     renderOrganization,
      'alumni':           renderAlumni,
      'ipk-chart':        renderIPKChart,
    });

    // Override profil & dashboard untuk Mahasiswa
    const oldRenderProfile = pageMap['profile'];
    if (oldRenderProfile) {
      pageMap['profile'] = function() {
        oldRenderProfile();
        if (state.currentRole === 'Mahasiswa') {
          const btn = document.querySelector('button[data-action="edit-profile"]');
          if (btn) btn.insertAdjacentHTML('afterend', ` <button class="primary small-btn" data-action="show-my-qr">QR KTM</button>`);
        }
      };
    }
    const oldRenderDashboard = pageMap['dashboard'];
    if (oldRenderDashboard) {
      pageMap['dashboard'] = function() {
        oldRenderDashboard();
        if (state.currentRole === 'Mahasiswa') {
          const actions = document.querySelector('.hero-actions');
          if (actions) actions.insertAdjacentHTML('beforeend', `<button class="ghost" data-action="show-my-qr" style="color:var(--text)">Tampilkan QR KTM</button>`);
        }
      };
    }
  }

  /* ═══════════════════════════════════════════════
     RENDER FUNCTIONS — 17 FITUR BARU
  ═══════════════════════════════════════════════ */

  /* 1. PENGUMUMAN & BERITA */
  function renderAnnouncements() {
    const unread = state.announcements.length;
    const isAdmin = state.currentRole === 'Administrator';
    const priorityClass = (p) => p === 'Tinggi' ? 'danger' : p === 'Sedang' ? 'warning' : 'info';

    $('#content').innerHTML = pageShell(
      'Pengumuman Akademik',
      'Informasi resmi kampus, jadwal penting, dan berita akademik terkini.',
      `${isAdmin ? '<button class="small-btn" data-action="new-announcement">+ Buat Pengumuman</button>' : ''}<button class="small-btn" data-action="mark-all-read">Tandai Semua Dibaca</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('📣', 'Total Pengumuman', unread, 'Aktif')}
        ${newMetricCard('🔴', 'Prioritas Tinggi', state.announcements.filter(a => a.priority === 'Tinggi').length, 'Perlu diperhatikan')}
        ${newMetricCard('📚', 'Kategori Akademik', state.announcements.filter(a => a.category === 'Akademik').length, 'Info akademik')}
        ${newMetricCard('📅', 'Pengumuman Bulan Ini', state.announcements.filter(a => a.date >= '2026-06-01').length, 'Juni 2026')}
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card span-2">
          <div class="card-head"><div><h3>Daftar Pengumuman</h3><p>Diurutkan dari terbaru.</p></div></div>
          <div class="activity-list">
            ${state.announcements.map(a => `
              <div class="activity-item" style="flex-direction:column;align-items:flex-start;gap:8px">
                <div style="display:flex;width:100%;justify-content:space-between;align-items:flex-start;gap:10px">
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                      <span class="status ${priorityClass(a.priority)}">${esc(a.priority)}</span>
                      <span class="status neutral">${esc(a.category)}</span>
                      <small style="color:var(--muted)">${esc(a.date)}</small>
                    </div>
                    <b style="font-size:13px">${esc(a.title)}</b>
                    <small style="display:block;margin-top:6px;color:var(--muted);line-height:1.65">${esc(a.body)}</small>
                    <small style="display:block;margin-top:6px;color:var(--muted)">Oleh: ${esc(a.author)}</small>
                  </div>
                  ${isAdmin ? `<button class="small-btn" data-action="delete-announcement" data-id="${a.id}">Hapus</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Kategori</h3><p>Distribusi pengumuman.</p></div></div>
          ${donut(80, [
            ['Akademik', state.announcements.filter(a => a.category === 'Akademik').length * 15],
            ['Beasiswa', state.announcements.filter(a => a.category === 'Beasiswa').length * 15],
            ['PKL', state.announcements.filter(a => a.category === 'PKL').length * 15],
            ['Kegiatan', state.announcements.filter(a => a.category === 'Kegiatan').length * 15],
            ['Informasi', state.announcements.filter(a => a.category === 'Informasi').length * 15],
          ])}
        </div>
      </section>`
    );
  }

  /* 2. JADWAL UJIAN */
  function renderExamSchedule() {
    const me = state.students.find(s => s.nim === state.currentUser?.code) || state.students[0];
    $('#content').innerHTML = pageShell(
      'Jadwal Ujian UTS/UAS',
      'Jadwal, ruang, pengawas, dan ketentuan ujian semester genap 2025/2026.',
      `<button class="small-btn" data-action="print-exam-schedule">Cetak Jadwal</button><button class="small-btn" data-page="exam-card">Kartu Ujian</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('📋', 'Total Ujian', state.examSchedule.length, 'Semester ini')}
        ${newMetricCard('📅', 'Tanggal Mulai', '15 Jul 2026', 'UTS dimulai')}
        ${newMetricCard('📅', 'Tanggal Selesai', '21 Jul 2026', 'UTS berakhir')}
        ${newMetricCard('✅', 'Status KRS', 'Disetujui', 'Siap ujian')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>Jadwal Ujian Tengah Semester (UTS)</h3><p>Semester Genap 2025/2026 — Periode 15–21 Juli 2026</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Kode MK</th><th>Mata Kuliah</th><th>Jenis</th><th>Tanggal</th><th>Jam</th><th>Ruang</th><th>Pengawas</th><th>SKS</th></tr></thead>
            <tbody>
              ${state.examSchedule.map(e => `
                <tr>
                  <td>${esc(e.courseCode)}</td>
                  <td style="max-width:260px;white-space:normal">${esc(e.courseTitle)}</td>
                  <td><span class="status info">${esc(e.type)}</span></td>
                  <td>${esc(e.date)}</td>
                  <td>${esc(e.start)} – ${esc(e.end)}</td>
                  <td><b>${esc(e.room)}</b></td>
                  <td style="font-size:10px">${esc(e.supervisor)}</td>
                  <td>${e.sks}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
      <section class="grid grid-2" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>Ketentuan Ujian</h3><p>Harap diperhatikan sebelum ujian.</p></div></div>
          ${activityList([
            ['Kartu Ujian', 'Wajib dibawa dan ditunjukkan kepada pengawas'],
            ['Tata Tertib', 'Hadir 15 menit sebelum ujian dimulai'],
            ['Identitas', 'Bawa KTM dan kartu ujian yang sudah dicetak'],
            ['Alat Tulis', 'Pena biru/hitam, penggaris, kalkulator (jika diizinkan)'],
            ['Dilarang', 'Membawa HP, buku, dan catatan ke dalam ruang ujian'],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Status Kelayakan Ujian</h3><p>Persyaratan mengikuti UTS.</p></div></div>
          ${barList([
            ['Presensi Minimal (75%)', me ? me.attendance : 90],
            ['KRS Tervalidasi', 100],
            ['Tidak Ada Tunggakan', 100],
            ['Tugas Aktif Selesai', 72],
            ['Kartu Ujian Dicetak', 100],
          ])}
        </div>
      </section>`
    );
  }

  /* 3. KARTU UJIAN DIGITAL */
  function renderExamCard() {
    const me = state.students.find(s => s.nim === state.currentUser?.code) || state.students[0];
    const user = state.currentUser;
    const now = new Date().toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' });

    $('#content').innerHTML = pageShell(
      'Kartu Ujian Digital',
      'Kartu ujian resmi untuk UTS/UAS Semester Genap 2025/2026. Cetak dan bawa saat ujian.',
      `<button class="small-btn primary" data-action="print-exam-card">🖨️ Cetak Kartu Ujian</button>`,
      `
      <div id="examCardPrint" style="max-width:780px;margin:0 auto">
        <div class="card" style="border:2px solid var(--cyan);position:relative">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:14px">
              <img src="assets/istn-logo.jpg" alt="Logo ISTN" loading="lazy" style="width:60px;height:60px;border-radius:12px;object-fit:cover">
              <div>
                <h3 style="margin:0;font-size:16px">INSTITUT SAINS DAN TEKNOLOGI NASIONAL</h3>
                <p style="margin:4px 0 0;color:var(--muted);font-size:11px">Jl. Moh. Kahfi II No.3, Jagakarsa, Jakarta Selatan 12620</p>
                <p style="margin:2px 0 0;color:var(--muted);font-size:11px">Telp. (021) 788-43093 | www.istn.ac.id</p>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;font-weight:900;color:var(--cyan);text-transform:uppercase;letter-spacing:1px">Kartu Ujian Resmi</div>
              <div style="font-size:10px;color:var(--muted);margin-top:4px">Semester Genap 2025/2026</div>
              <div style="font-size:10px;color:var(--muted)">Dicetak: ${now}</div>
            </div>
          </div>

          <div class="grid grid-2" style="margin-bottom:14px">
            <div>
              <div style="display:grid;gap:8px">
                ${[
                  ['NIM', me?.nim || user?.code || '-'],
                  ['Nama', me?.name || user?.name || '-'],
                  ['Program Studi', me?.prodi || 'Teknik Informatika'],
                  ['Semester', me?.semester || 2],
                  ['Status', me?.status || 'Aktif'],
                  ['IPK', me ? Number(me.ipk).toFixed(2) : '-'],
                ].map(([k,v]) => `
                  <div style="display:flex;gap:10px;font-size:12px">
                    <span style="width:110px;color:var(--muted);font-weight:700">${k}</span>
                    <span>: <b>${esc(String(v))}</b></span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed var(--line);border-radius:12px;padding:18px;gap:6px">
              <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:grid;place-items:center;font-size:28px;font-weight:900;color:white">
                ${me ? initials(me.name) : (user?.avatar || 'AA')}
              </div>
              <small style="color:var(--muted);font-size:10px">Foto Mahasiswa</small>
            </div>
          </div>

          <div style="border-top:1px solid var(--line);padding-top:14px;margin-bottom:14px">
            <h4 style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Daftar Mata Ujian UTS — ${state.examSchedule.length} Mata Kuliah</h4>
            <div class="table-wrap">
              <table class="data-table" style="font-size:10.5px">
                <thead><tr><th>No</th><th>Kode</th><th>Mata Kuliah</th><th>Tanggal</th><th>Jam</th><th>Ruang</th><th>SKS</th><th>Paraf</th></tr></thead>
                <tbody>
                  ${state.examSchedule.map((e, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${esc(e.courseCode)}</td>
                      <td style="max-width:220px;white-space:normal">${esc(e.courseTitle)}</td>
                      <td>${esc(e.date)}</td>
                      <td>${esc(e.start)}</td>
                      <td>${esc(e.room)}</td>
                      <td>${e.sks}</td>
                      <td style="width:60px;border:1px solid var(--line);height:28px"></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;border-top:1px solid var(--line);padding-top:14px">
            ${['Dosen Pembimbing Akademik', 'Wakil Dekan Akademik', 'Mahasiswa yang Bersangkutan'].map(label => `
              <div style="text-align:center;font-size:11px">
                <div style="border-bottom:1px solid var(--line);height:60px;margin-bottom:8px"></div>
                <p style="color:var(--muted);margin:0">${label}</p>
              </div>
            `).join('')}
          </div>

          <div style="text-align:center;margin-top:14px;padding:10px;background:rgba(59,226,255,.08);border-radius:10px">
            <small style="color:var(--muted);font-size:10px">⚠ Kartu ini hanya berlaku jika telah disahkan oleh Dosen Pembimbing Akademik. Harap cetak dan bawa saat ujian berlangsung.</small>
          </div>
        </div>
      </div>`
    );
  }

  /* 4. SURAT KETERANGAN AKTIF */
  function renderSuratKeterangan() {
    const me = state.students.find(s => s.nim === state.currentUser?.code) || state.students[0];
    const user = state.currentUser;
    const now = new Date().toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' });
    const hash = Array.from(me?.nim || user?.code || '000').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const nomorSurat = `AKD/SKT/${new Date().getMonth()+1}/${new Date().getFullYear()}/${String((hash % 900) + 100).padStart(3, '0')}`;

    $('#content').innerHTML = pageShell(
      'Surat Keterangan Aktif',
      'Generate surat keterangan mahasiswa aktif secara otomatis. Berlaku untuk keperluan beasiswa, magang, dan administrasi.',
      `<button class="small-btn primary" data-action="print-surat">🖨️ Cetak Surat</button>`,
      `
      <section class="grid grid-3" style="margin-bottom:14px">
        ${newMetricCard('📄', 'Jenis Surat', 'Keterangan Aktif', 'Resmi')}
        ${newMetricCard('🔢', 'No. Surat', nomorSurat.split('/').slice(-1)[0], 'Auto-generated')}
        ${newMetricCard('📅', 'Berlaku s.d.', 'Akhir Semester', 'Genap 2025/2026')}
      </section>
      <div id="suratPrint" style="max-width:680px;margin:0 auto">
        <div class="card" style="font-family:'Times New Roman',serif;line-height:1.8;padding:28px">
          <div style="text-align:center;border-bottom:3px double var(--line);padding-bottom:16px;margin-bottom:20px">
            <div style="display:flex;justify-content:center;align-items:center;gap:18px;margin-bottom:12px">
              <img src="assets/istn-logo.jpg" alt="Logo ISTN" loading="lazy" style="width:70px;height:70px;border-radius:10px;object-fit:cover">
              <div>
                <div style="font-size:16px;font-weight:900;text-transform:uppercase;letter-spacing:1px">INSTITUT SAINS DAN TEKNOLOGI NASIONAL</div>
                <div style="font-size:11px;color:var(--muted);margin-top:4px">FAKULTAS TEKNOLOGI INDUSTRI</div>
                <div style="font-size:10px;color:var(--muted)">Jl. Moh. Kahfi II No.3, Jagakarsa, Jakarta Selatan 12620</div>
                <div style="font-size:10px;color:var(--muted)">Telp: (021) 788-43093 | www.istn.ac.id</div>
              </div>
            </div>
            <div style="font-size:14px;font-weight:900;text-transform:uppercase;margin-top:10px;letter-spacing:2px">Surat Keterangan Mahasiswa Aktif</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">Nomor: ${esc(nomorSurat)}</div>
          </div>

          <p style="margin:0 0 20px;font-size:13px">Yang bertanda tangan di bawah ini, Wakil Dekan Bidang Akademik Institut Sains dan Teknologi Nasional, menerangkan bahwa:</p>

          <div style="background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:20px">
            ${[
              ['Nama', me?.name || user?.name || '-'],
              ['NIM', me?.nim || user?.code || '-'],
              ['Program Studi', me?.prodi || 'Teknik Informatika'],
              ['Fakultas', 'Teknologi Industri'],
              ['Semester', `${me?.semester || 2} (Dua)`],
              ['Status', 'Mahasiswa Aktif'],
              ['IPK Terakhir', me ? Number(me.ipk).toFixed(2) : '-'],
            ].map(([k,v]) => `
              <div style="display:flex;gap:12px;padding:6px 0;font-size:12px;border-bottom:1px dashed var(--line)">
                <span style="width:140px;font-weight:700">${k}</span>
                <span>: <b>${esc(String(v))}</b></span>
              </div>
            `).join('')}
          </div>

          <p style="font-size:13px;margin-bottom:20px">adalah benar merupakan mahasiswa aktif terdaftar di Institut Sains dan Teknologi Nasional pada Semester Genap Tahun Akademik 2025/2026.</p>
          <p style="font-size:13px;margin-bottom:28px">Surat keterangan ini dibuat untuk keperluan <b>[sesuai kebutuhan]</b> dan berlaku sampai dengan akhir semester berjalan. Jika diperlukan informasi lebih lanjut, harap menghubungi Biro Administrasi Akademik ISTN.</p>

          <div style="display:flex;justify-content:flex-end;margin-top:28px">
            <div style="text-align:center;font-size:12px;width:240px">
              <p style="margin:0">Jakarta, ${now}</p>
              <p style="margin:4px 0 0;color:var(--muted)">Wakil Dekan Bidang Akademik,</p>
              <div style="height:70px;border-bottom:1px solid var(--line);margin:16px 0"></div>
              <p style="margin:0;font-weight:900">Dr. [Nama Pejabat], M.T.</p>
              <p style="margin:2px 0 0;color:var(--muted);font-size:10px">NIDN: XXXX-XXXX-XX</p>
            </div>
          </div>
        </div>
      </div>`
    );
  }

  /* 5. PEMBAYARAN SPP/UKT */
  function renderPayment() {
    const total = state.payments.reduce((a, p) => a + p.amount, 0);
    const lunas = state.payments.filter(p => p.status === 'Lunas').reduce((a, p) => a + p.amount, 0);
    const tunggakan = state.payments.filter(p => p.status !== 'Lunas').reduce((a, p) => a + p.amount, 0);
    const fmtRp = n => 'Rp ' + Number(n).toLocaleString('id-ID');
    const isAdmin = state.currentRole === 'Administrator';

    $('#content').innerHTML = pageShell(
      'Pembayaran SPP / UKT',
      'Riwayat dan status pembayaran uang kuliah tunggal (UKT) per semester.',
      `${isAdmin ? '<button class="small-btn" data-action="add-payment">+ Tambah Tagihan</button>' : ''}<button class="small-btn" data-action="download-payment-history">Export Riwayat</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('💰', 'Total Tagihan', fmtRp(total), 'Semua semester')}
        ${newMetricCard('✅', 'Total Lunas', fmtRp(lunas), 'Sudah terbayar')}
        ${newMetricCard('⚠️', 'Tunggakan', fmtRp(tunggakan), tunggakan > 0 ? 'Segera bayar' : 'Bersih')}
        ${newMetricCard('📊', 'Status Umum', tunggakan > 0 ? 'Ada Tunggakan' : 'Lunas Semua', tunggakan > 0 ? 'Perlu tindakan' : 'Aman')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>Riwayat Pembayaran</h3><p>Detail per semester dan metode pembayaran.</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No</th><th>Jenis</th><th>Semester</th><th>Jumlah</th><th>Jatuh Tempo</th><th>Status</th><th>Tanggal Bayar</th><th>Metode</th><th>Aksi</th></tr></thead>
            <tbody>
              ${state.payments.map((p, i) => `
                <tr>
                  <td>${i+1}</td>
                  <td><b>${esc(p.type)}</b></td>
                  <td>${esc(p.semester)}</td>
                  <td><b>${fmtRp(p.amount)}</b></td>
                  <td>${esc(p.dueDate)}</td>
                  <td><span class="status ${p.status === 'Lunas' ? 'success' : 'danger'}">${esc(p.status)}</span></td>
                  <td>${p.paidDate ? esc(p.paidDate) : '<span style="color:var(--muted)">—</span>'}</td>
                  <td>${p.method ? esc(p.method) : '<span style="color:var(--muted)">—</span>'}</td>
                  <td>${p.status !== 'Lunas' ? `<button class="small-btn" data-action="pay-now" data-id="${p.id}">Bayar</button>` : '<span style="color:var(--green);font-size:11px">✓ Lunas</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
      <section class="grid grid-2" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>Cara Pembayaran</h3><p>Metode yang tersedia.</p></div></div>
          ${activityList([
            ['Transfer Bank BNI', 'Rekening: 1234567890 a.n. Yayasan ISTN'],
            ['Transfer Bank BRI/Mandiri', 'Tersedia kode virtual account per mahasiswa'],
            ['Kartu Debit/Kredit', 'Via payment gateway di portal atau loket'],
            ['Tunai di Kasir', 'Loket Keuangan Gedung Rektorat lt.1, Senin–Jumat 08:00–14:00'],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Informasi Penting</h3><p>Ketentuan pembayaran UKT.</p></div></div>
          ${activityList([
            ['Batas Pembayaran', 'Maksimal 20 hari setelah awal semester'],
            ['Denda Keterlambatan', 'Rp 50.000/hari setelah jatuh tempo'],
            ['Pengajuan Cicilan', 'Submit permohonan ke Bagian Keuangan'],
            ['Bukti Pembayaran', 'Simpan bukti transfer minimal 3 tahun'],
            ['Konfirmasi Pembayaran', 'Kirim bukti ke keuangan@istn.ac.id'],
          ])}
        </div>
      </section>`
    );
  }

  /* 6. PERPUSTAKAAN DIGITAL */
  function renderLibrary() {
    const available = state.library.filter(b => b.available > 0).length;
    const unavailable = state.library.filter(b => b.available === 0).length;

    $('#content').innerHTML = pageShell(
      'Perpustakaan Digital',
      'Katalog buku, cek ketersediaan, dan riwayat peminjaman koleksi perpustakaan ISTN.',
      `<button class="small-btn" data-action="search-library">Cari Buku</button><button class="small-btn" data-action="my-loans">Pinjaman Saya</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('📚', 'Total Koleksi', state.library.length, 'Buku tersedia')}
        ${newMetricCard('✅', 'Tersedia', available, 'Bisa dipinjam')}
        ${newMetricCard('🔴', 'Dipinjam', unavailable, 'Tidak tersedia')}
        ${newMetricCard('📖', 'E-Book', 12, 'Digital access')}
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card span-2">
          <div class="card-head">
            <div><h3>Katalog Buku</h3><p>Koleksi buku ilmu komputer dan teknologi.</p></div>
            <input class="form-control" placeholder="Cari judul, penulis, ISBN..." style="max-width:260px;height:36px;padding:8px 12px;font-size:11px">
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Judul</th><th>Penulis</th><th>Kategori</th><th>Tahun</th><th>Stok</th><th>Tersedia</th><th>Aksi</th></tr></thead>
              <tbody>
                ${state.library.map(b => `
                  <tr>
                    <td style="max-width:200px;white-space:normal"><b>${esc(b.title)}</b><br><small style="color:var(--muted)">${esc(b.isbn)}</small></td>
                    <td style="font-size:11px">${esc(b.author)}</td>
                    <td><span class="status info" style="font-size:9px">${esc(b.category)}</span></td>
                    <td>${b.year}</td>
                    <td>${b.stock}</td>
                    <td><span class="status ${b.available > 0 ? 'success' : 'danger'}">${b.available > 0 ? b.available + ' buku' : 'Habis'}</span></td>
                    <td>${b.available > 0 ? `<button class="small-btn" data-action="borrow-book" data-id="${b.id}">Pinjam</button>` : `<button class="small-btn" data-action="reserve-book" data-id="${b.id}">Reservasi</button>`}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="grid" style="gap:14px">
          <div class="card">
            <div class="card-head"><div><h3>E-Book & Jurnal</h3><p>Akses digital.</p></div></div>
            ${activityList([
              ['IEEE Xplore', 'Akses jurnal teknik dan TI'],
              ['Springer Link', 'Buku teks dan prosiding'],
              ['ScienceDirect', 'Jurnal sains terapan'],
              ['Google Scholar', 'Literatur akademik gratis'],
            ])}
          </div>
          <div class="card">
            <div class="card-head"><div><h3>Koleksi per Kategori</h3><p>Distribusi buku.</p></div></div>
            ${barList([
              ['Informatika', 30],
              ['Basis Data', 20],
              ['Jaringan', 15],
              ['Machine Learning', 20],
              ['RPL', 15],
            ])}
          </div>
        </div>
      </section>`
    );
  }

  /* 7. PKL / MAGANG */
  function renderInternship() {
    const isAdmin = ['Administrator', 'Dosen'].includes(state.currentRole);
    const myPkl = state.internships.find(p => p.student === state.currentUser?.code);

    $('#content').innerHTML = pageShell(
      'PKL / Magang',
      'Pengajuan, monitoring, dan penilaian praktik kerja lapangan.',
      `${!isAdmin && !myPkl ? '<button class="small-btn primary" data-action="apply-internship">Daftar PKL</button>' : ''}<button class="small-btn" data-action="download-pkl-guide">Panduan PKL</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🏢', 'Total PKL', state.internships.length, 'Semester ini')}
        ${newMetricCard('✅', 'Disetujui', state.internships.filter(p => p.status === 'Disetujui').length, 'Berjalan')}
        ${newMetricCard('⏳', 'Menunggu', state.internships.filter(p => p.status === 'Menunggu Persetujuan').length, 'Review dosen')}
        ${newMetricCard('🔄', 'Aktif Berjalan', state.internships.filter(p => p.status === 'Berjalan').length, 'On-site')}
      </section>
      ${!isAdmin && myPkl ? `
      <section class="card" style="margin-top:14px;border-color:rgba(59,226,255,.35)">
        <div class="card-head"><div><h3>Status PKL Saya</h3><p>Monitoring real-time pengajuan PKL.</p></div></div>
        <div class="grid grid-3">
          ${newMetricCard('🏢', 'Perusahaan', myPkl.company, myPkl.position)}
          ${newMetricCard('📅', 'Periode', myPkl.startDate, `s.d. ${myPkl.endDate}`)}
          ${newMetricCard('📊', 'Status', myPkl.status, myPkl.score ? `Nilai: ${myPkl.score}` : 'Belum dinilai')}
        </div>
        ${barList([
          ['Progress PKL', myPkl.status === 'Berjalan' ? 45 : myPkl.status === 'Disetujui' ? 20 : 5],
          ['Laporan', myPkl.report ? 80 : 0],
          ['Penilaian', myPkl.score ? 100 : 0],
        ])}
      </section>` : ''}
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>${isAdmin ? 'Semua Data PKL Mahasiswa' : 'Daftar PKL Aktif'}</h3><p>Status pengajuan dan monitoring.</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Mahasiswa</th><th>Perusahaan</th><th>Posisi</th><th>Dosen Pembimbing</th><th>Periode</th><th>Status</th><th>Laporan</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead>
            <tbody>
              ${state.internships.map(p => {
                const dosen = state.lecturers.find(d => d.id === p.supervisor);
                return `
                  <tr>
                    <td><b>${esc(p.studentName)}</b><br><small style="color:var(--muted)">${esc(p.student)}</small></td>
                    <td>${esc(p.company)}</td>
                    <td style="font-size:11px">${esc(p.position)}</td>
                    <td style="font-size:11px">${esc(dosen?.name || p.supervisor)}</td>
                    <td style="font-size:10px">${esc(p.startDate)}<br>${esc(p.endDate)}</td>
                    <td><span class="status ${p.status === 'Disetujui' || p.status === 'Berjalan' ? 'success' : p.status === 'Menunggu Persetujuan' ? 'warning' : 'info'}">${esc(p.status)}</span></td>
                    <td>${p.report ? `<span style="color:var(--green);font-size:11px">✓ ${esc(p.report)}</span>` : '<span style="color:var(--muted)">Belum upload</span>'}</td>
                    ${isAdmin ? `<td><button class="small-btn" data-action="approve-pkl" data-id="${p.id}">Setujui</button></td>` : ''}
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>`
    );
  }

  /* 8. SKRIPSI / TUGAS AKHIR */
  function renderThesis() {
    const isAdmin = ['Administrator', 'Dosen'].includes(state.currentRole);
    const myThesis = state.theses.find(t => t.nim === state.currentUser?.code);
    const stageLabel = ['', 'Pengajuan Judul', 'Bimbingan Aktif', 'Siap Sidang', 'Selesai'];
    const stageClass = ['', 'warning', 'info', 'success', 'success'];

    $('#content').innerHTML = pageShell(
      'Skripsi / Tugas Akhir',
      'Pengajuan judul, monitoring bimbingan, upload laporan, dan status sidang.',
      `${!isAdmin && !myThesis ? '<button class="small-btn primary" data-action="apply-thesis">Ajukan Judul TA</button>' : ''}<button class="small-btn" data-action="download-thesis-template">Template Laporan</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🎓', 'Total TA', state.theses.length, 'Terdaftar')}
        ${newMetricCard('📝', 'Pengajuan Judul', state.theses.filter(t => t.stage === 1).length, 'Menunggu')}
        ${newMetricCard('📖', 'Bimbingan Aktif', state.theses.filter(t => t.stage === 2).length, 'Berjalan')}
        ${newMetricCard('🏆', 'Siap Sidang', state.theses.filter(t => t.stage === 3).length, 'Terjadwal')}
      </section>
      ${myThesis ? `
      <section class="card" style="margin-top:14px;border-color:rgba(59,226,255,.35)">
        <div class="card-head"><div><h3>Progres Skripsi Saya</h3><p>Status real-time tugas akhir.</p></div></div>
        <div style="margin-bottom:16px">
          <div style="display:flex;gap:0">
            ${[1,2,3,4].map(s => `
              <div style="flex:1;text-align:center;position:relative">
                <div style="width:36px;height:36px;border-radius:50%;background:${myThesis.stage >= s ? 'linear-gradient(135deg,var(--blue),var(--cyan))' : 'rgba(255,255,255,.1)'};display:grid;place-items:center;margin:0 auto;font-weight:900;font-size:12px;color:white">${s}</div>
                <div style="font-size:10px;margin-top:6px;color:${myThesis.stage >= s ? 'var(--text)' : 'var(--muted)'}">${stageLabel[s]}</div>
                ${s < 4 ? `<div style="position:absolute;top:18px;left:50%;width:100%;height:2px;background:${myThesis.stage > s ? 'var(--cyan)' : 'rgba(255,255,255,.1)'};z-index:-1"></div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        <b style="font-size:13px">Judul: ${esc(myThesis.title)}</b>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;font-size:12px">
          <div><span style="color:var(--muted)">Pembimbing 1:</span> ${esc(myThesis.supervisor1)}</div>
          <div><span style="color:var(--muted)">Pembimbing 2:</span> ${esc(myThesis.supervisor2)}</div>
          <div><span style="color:var(--muted)">Pengajuan:</span> ${esc(myThesis.submitted)}</div>
          <div><span style="color:var(--muted)">Jadwal Sidang:</span> ${myThesis.defense || 'Belum dijadwalkan'}</div>
        </div>
      </section>` : ''}
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>Daftar Tugas Akhir Aktif</h3><p>Monitoring progress per mahasiswa.</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>NIM</th><th>Judul</th><th>Pembimbing</th><th>Tahap</th><th>Status</th><th>Sidang</th></tr></thead>
            <tbody>
              ${state.theses.map(t => `
                <tr>
                  <td>${esc(t.nim)}</td>
                  <td style="max-width:260px;white-space:normal;font-size:11px">${esc(t.title)}</td>
                  <td style="font-size:10px">${esc(t.supervisor1)}</td>
                  <td><div style="width:80px;background:rgba(255,255,255,.1);border-radius:99px;height:6px"><div style="width:${t.stage * 25}%;background:linear-gradient(90deg,var(--blue),var(--cyan));height:100%;border-radius:99px"></div></div><small style="color:var(--muted)">${t.stage}/4</small></td>
                  <td><span class="status ${stageClass[t.stage]}">${esc(t.status)}</span></td>
                  <td style="font-size:11px">${t.defense || '<span style="color:var(--muted)">—</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>`
    );
  }

  /* 9. BEASISWA */
  function renderScholarship() {
    const open = state.scholarships.filter(s => s.status === 'Buka').length;

    $('#content').innerHTML = pageShell(
      'Beasiswa',
      'Informasi beasiswa, persyaratan, dan pengajuan dari berbagai sumber.',
      `<button class="small-btn" data-action="my-scholarships">Beasiswa Saya</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🏅', 'Total Beasiswa', state.scholarships.length, 'Tersedia')}
        ${newMetricCard('✅', 'Sedang Buka', open, 'Bisa didaftar')}
        ${newMetricCard('👥', 'Total Kuota', state.scholarships.reduce((a,s) => a + s.quota, 0), 'Penerima')}
        ${newMetricCard('📊', 'IPK Kamu', '3.88', 'Eligible sebagian besar')}
      </section>
      <section class="grid grid-2" style="margin-top:14px">
        ${state.scholarships.map(s => `
          <div class="card" style="${s.status === 'Buka' ? 'border-color:rgba(32,211,148,.35)' : ''}">
            <div class="card-head">
              <div>
                <span class="status ${s.status === 'Buka' ? 'success' : 'neutral'}">${esc(s.status)}</span>
                <h3 style="margin:8px 0 4px">${esc(s.name)}</h3>
                <p style="margin:0;color:var(--muted)">Penyelenggara: ${esc(s.provider)}</p>
              </div>
            </div>
            <div style="display:grid;gap:6px;font-size:12px;margin-bottom:12px">
              <div style="display:flex;gap:8px"><span style="color:var(--muted);width:110px">Nilai Beasiswa:</span><b style="color:var(--green)">Rp ${Number(s.amount).toLocaleString('id-ID')}/semester</b></div>
              <div style="display:flex;gap:8px"><span style="color:var(--muted);width:110px">Persyaratan:</span><span>${esc(s.requirement)}</span></div>
              <div style="display:flex;gap:8px"><span style="color:var(--muted);width:110px">Deadline:</span><b>${esc(s.deadline)}</b></div>
              <div style="display:flex;gap:8px"><span style="color:var(--muted);width:110px">Kuota:</span><span>${s.quota} mahasiswa</span></div>
            </div>
            ${s.status === 'Buka' ?
              `<button class="primary full" style="font-size:12px" data-action="apply-scholarship" data-id="${s.id}">Daftar Beasiswa Ini</button>` :
              `<button class="secondary full" style="font-size:12px" disabled>Pendaftaran Ditutup</button>`
            }
          </div>
        `).join('')}
      </section>`
    );
  }

  /* 10. FORUM DISKUSI */
  function renderForum() {
    const courseOptions = state.courses.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('');

    $('#content').innerHTML = pageShell(
      'Forum Diskusi Kelas',
      'Tanya jawab, diskusi akademik, dan kolaborasi antar mahasiswa dan dosen.',
      `<button class="small-btn primary" data-action="new-thread">+ Buat Thread</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('💬', 'Total Thread', state.forum.length, 'Diskusi aktif')}
        ${newMetricCard('💬', 'Total Balasan', state.forum.reduce((a,t) => a + t.replies, 0), 'Interaksi')}
        ${newMetricCard('👍', 'Total Likes', state.forum.reduce((a,t) => a + t.likes, 0), 'Apresiasi')}
        ${newMetricCard('📚', 'Mata Kuliah', [...new Set(state.forum.map(t => t.courseId))].length, 'Dengan diskusi')}
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card span-2">
          <div class="card-head">
            <div><h3>Thread Terbaru</h3><p>Diurutkan dari terbaru.</p></div>
            <select class="form-control" style="max-width:200px;height:36px;font-size:11px" id="forumFilter">
              <option value="">Semua Mata Kuliah</option>
              ${courseOptions}
            </select>
          </div>
          <div class="activity-list">
            ${state.forum.map(t => {
              const course = state.courses.find(c => c.id === t.courseId);
              return `
                <div class="activity-item" style="flex-direction:column;align-items:flex-start;gap:8px">
                  <div style="display:flex;width:100%;justify-content:space-between;align-items:flex-start;gap:10px">
                    <div style="flex:1">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                        <span class="status info" style="font-size:9px">${esc(course?.code || t.courseId)}</span>
                        <span class="status ${t.authorRole === 'Dosen' ? 'warning' : 'neutral'}" style="font-size:9px">${esc(t.authorRole)}</span>
                        <small style="color:var(--muted)">${esc(t.date)}</small>
                      </div>
                      <b style="font-size:13px">${esc(t.title)}</b>
                      <small style="display:block;margin-top:6px;color:var(--muted);line-height:1.6">${esc(t.body)}</small>
                      <div style="display:flex;gap:14px;margin-top:8px;font-size:11px;color:var(--muted)">
                        <span>👤 ${esc(t.author)}</span>
                        <span>💬 ${t.replies} balasan</span>
                        <span>👍 ${t.likes} suka</span>
                      </div>
                    </div>
                    <button class="small-btn" data-action="open-thread" data-id="${t.id}">Buka</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="grid" style="gap:14px">
          <div class="card">
            <div class="card-head"><div><h3>Diskusi Paling Aktif</h3><p>Berdasarkan balasan.</p></div></div>
            ${activityList(state.forum.slice().sort((a,b) => b.replies - a.replies).slice(0,3).map(t => [t.title.slice(0,35) + '...', `${t.replies} balasan · ${t.likes} suka`]))}
          </div>
          <div class="card">
            <div class="card-head"><div><h3>Panduan Forum</h3><p>Etika diskusi akademik.</p></div></div>
            ${activityList([
              ['Hormati sesama', 'Gunakan bahasa sopan dan akademik'],
              ['Relevan', 'Topik harus sesuai mata kuliah'],
              ['Sumber', 'Sertakan referensi jika mengutip'],
              ['No spam', 'Satu topik per thread, tidak berulang'],
            ])}
          </div>
        </div>
      </section>`
    );
  }

  /* 11. HELPDESK / TIKET */
  function renderHelpdesk() {
    const isAdmin = state.currentRole === 'Administrator';
    const myTickets = isAdmin ? state.helpdesk : state.helpdesk.filter(t => t.submitter === (state.currentUser?.name || ''));
    const displayTickets = isAdmin ? state.helpdesk : myTickets.concat(state.helpdesk.filter(t => t.submitter !== state.currentUser?.name).slice(0,2));

    const statusClass = s => s === 'Selesai' ? 'success' : s === 'Proses' ? 'info' : 'warning';

    $('#content').innerHTML = pageShell(
      'Helpdesk & Bantuan',
      'Pengajuan tiket bantuan, pengaduan teknis, dan layanan administrasi akademik.',
      `<button class="small-btn primary" data-action="new-ticket">+ Buat Tiket Baru</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🎧', 'Total Tiket', state.helpdesk.length, 'Semua tiket')}
        ${newMetricCard('✅', 'Selesai', state.helpdesk.filter(t => t.status === 'Selesai').length, 'Terselesaikan')}
        ${newMetricCard('🔄', 'Sedang Proses', state.helpdesk.filter(t => t.status === 'Proses').length, 'Dalam penanganan')}
        ${newMetricCard('⏳', 'Menunggu', state.helpdesk.filter(t => t.status === 'Menunggu').length, 'Antrian')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>${isAdmin ? 'Semua Tiket Masuk' : 'Tiket Bantuan'}</h3><p>Status penanganan setiap tiket.</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No</th><th>Subjek</th><th>Kategori</th><th>Prioritas</th><th>Pengaju</th><th>Tanggal</th><th>Status</th><th>Respons</th></tr></thead>
            <tbody>
              ${state.helpdesk.map((t, i) => `
                <tr>
                  <td>${esc(t.id)}</td>
                  <td style="max-width:200px;white-space:normal"><b>${esc(t.subject)}</b></td>
                  <td><span class="status info" style="font-size:9px">${esc(t.category)}</span></td>
                  <td><span class="status ${t.priority === 'Tinggi' ? 'danger' : 'warning'}">${esc(t.priority)}</span></td>
                  <td style="font-size:11px">${esc(t.submitter)}<br><small style="color:var(--muted)">${esc(t.role)}</small></td>
                  <td style="font-size:11px">${esc(t.date)}</td>
                  <td><span class="status ${statusClass(t.status)}">${esc(t.status)}</span></td>
                  <td style="max-width:200px;white-space:normal;font-size:11px;color:var(--muted)">${t.response ? esc(t.response) : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
      <section class="grid grid-2" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>Buat Tiket Baru</h3><p>Isi form pengaduan atau pertanyaan.</p></div></div>
          <form id="ticketForm" class="form-grid">
            <div class="full"><label class="form-label">Subjek / Masalah</label><input class="form-control" name="subject" placeholder="Contoh: Nilai tidak muncul di portal"></div>
            <div><label class="form-label">Kategori</label><select class="form-control" name="category"><option>Akademik</option><option>Teknis</option><option>Administrasi</option><option>Keuangan</option><option>Lainnya</option></select></div>
            <div><label class="form-label">Prioritas</label><select class="form-control" name="priority"><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select></div>
            <div class="full"><label class="form-label">Deskripsi Detail</label><textarea class="form-control" name="body" rows="4" placeholder="Jelaskan masalah secara detail..."></textarea></div>
            <div class="full form-actions"><button class="primary" type="submit">Kirim Tiket</button></div>
          </form>
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Kontak Langsung</h3><p>Channel bantuan lainnya.</p></div></div>
          ${activityList([
            ['Email Akademik', 'akademik@istn.ac.id — Jam kerja 08:00–16:00'],
            ['WhatsApp', '+62-812-XXXX-XXXX — Admin akademik'],
            ['Loket BAAK', 'Gedung Rektorat lt.1 — Senin–Jumat 08:00–15:00'],
            ['Live Chat', 'Tersedia di portal saat jam kerja'],
            ['Darurat', 'security@istn.ac.id — 24 jam'],
          ])}
        </div>
      </section>`
    );
  }

  /* 12. NOTIFIKASI */
  function renderNotifications() {
    const unread = state.notifications.filter(n => !n.read).length;
    const typeIcon = t => ({ success: '✅', warning: '⚠️', info: 'ℹ️', danger: '🔴' }[t] || '🔔');
    const typeClass = t => ({ success: 'success', warning: 'warning', info: 'info', danger: 'danger' }[t] || 'neutral');

    $('#content').innerHTML = pageShell(
      'Notifikasi',
      'Notifikasi sistem, pengingat deadline, dan update akademik real-time.',
      `<button class="small-btn" data-action="mark-notif-all-read">Tandai Semua Dibaca</button><button class="small-btn" data-action="clear-notif">Hapus Semua</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🔔', 'Total Notifikasi', state.notifications.length, 'Semua')}
        ${newMetricCard('🔴', 'Belum Dibaca', unread, 'Perlu perhatian')}
        ${newMetricCard('✅', 'Sudah Dibaca', state.notifications.filter(n => n.read).length, 'Selesai')}
        ${newMetricCard('📅', 'Hari Ini', 2, 'Notifikasi baru')}
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card span-2">
          <div class="card-head"><div><h3>Semua Notifikasi</h3><p>Diurutkan dari terbaru.</p></div></div>
          <div class="activity-list">
            ${state.notifications.map(n => `
              <div class="activity-item" style="opacity:${n.read ? 0.65 : 1}">
                <span class="activity-icon" style="font-size:16px"><span class="icon-glyph">${typeIcon(n.type)}</span></span>
                <div class="item-body">
                  <div style="display:flex;align-items:center;gap:8px">
                    <b>${esc(n.title)}</b>
                    ${!n.read ? '<span class="status info" style="font-size:9px">Baru</span>' : ''}
                  </div>
                  <small>${esc(n.body)}</small>
                  <small style="color:var(--muted)">${esc(n.date)}</small>
                </div>
                <button class="small-btn" data-action="mark-notif-read" data-id="${n.id}" style="flex-shrink:0">${n.read ? 'Dibaca' : 'Tandai'}</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="grid" style="gap:14px">
          <div class="card">
            <div class="card-head"><div><h3>Jenis Notifikasi</h3><p>Distribusi.</p></div></div>
            ${donut(75, [
              ['Info', state.notifications.filter(n => n.type === 'info').length * 20],
              ['Warning', state.notifications.filter(n => n.type === 'warning').length * 20],
              ['Sukses', state.notifications.filter(n => n.type === 'success').length * 20],
            ])}
          </div>
          <div class="card">
            <div class="card-head"><div><h3>Pengaturan Notifikasi</h3><p>Preferensi pemberitahuan.</p></div></div>
            ${settingsRow('Notifikasi Deadline', 'Pengingat tugas jatuh tempo.', true, 'notifications')}
            ${settingsRow('Notifikasi Nilai', 'Update nilai dan KHS.', true, 'notifications')}
            ${settingsRow('Notifikasi Pengumuman', 'Info resmi kampus.', true, 'notifications')}
          </div>
        </div>
      </section>`
    );
  }

  /* 13. ABSENSI QR CODE */
  function renderQRAttendance() {
    const isDosen = state.currentRole === 'Dosen';
    const sessionId = uid('QRS');
    const now = new Date().toLocaleString('id-ID');

    $('#content').innerHTML = pageShell(
      'Absensi QR Code',
      isDosen ? 'Generate QR Code untuk presensi mahasiswa secara digital dan anti-titip.' : 'Scan QR Code yang ditampilkan dosen untuk mencatat kehadiran Anda.',
      isDosen ? `<button class="small-btn primary" data-action="generate-qr">Generate QR Baru</button><button class="small-btn" data-action="save-attendance">Simpan Presensi</button>` : `<button class="small-btn primary" data-action="scan-qr">Scan QR Code</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('📷', 'Sesi QR', state.qrSessions.length + 1, 'Sesi ini')}
        ${newMetricCard('✅', 'Hadir', isDosen ? state.students.length - 2 : 1, 'Terdeteksi')}
        ${newMetricCard('❌', 'Belum Absen', isDosen ? 2 : 0, 'Mahasiswa')}
        ${newMetricCard('📅', 'Waktu', now.slice(0,10), 'Hari ini')}
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>${isDosen ? 'QR Code Sesi' : 'Scan QR Code'}</h3><p>${isDosen ? 'Tampilkan ke mahasiswa.' : 'Arahkan kamera ke QR dosen.'}</p></div></div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:24px 0">
            ${isDosen ? `
              <div id="qrDisplay" style="width:200px;height:200px;background:white;border-radius:18px;display:grid;place-items:center;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,.2)">
                <div style="display:grid;grid-template-columns:repeat(10,1fr);gap:2px;width:100%;height:100%">
                  ${Array.from({length:100}, (_,i) => `<div style="background:${(i*7+3)%5 < 3 ? '#06172e' : 'transparent'};border-radius:1px"></div>`).join('')}
                </div>
              </div>
              <div style="text-align:center">
                <b style="font-size:14px">Kode: ${sessionId.slice(-6)}</b>
                <small style="display:block;color:var(--muted);margin-top:4px">Berlaku 5 menit • ${now}</small>
              </div>
              <button class="primary" data-action="generate-qr" style="font-size:12px">🔄 Refresh QR Code</button>
            ` : `
              <div style="width:200px;height:200px;border:2px dashed var(--cyan);border-radius:18px;display:grid;place-items:center;text-align:center;padding:24px">
                <div>
                  <div style="font-size:48px;margin-bottom:12px">📷</div>
                  <p style="color:var(--muted);font-size:12px;margin:0">Kamera akan aktif saat tombol Scan ditekan</p>
                </div>
              </div>
              <button class="primary" data-action="scan-qr" style="font-size:12px">📷 Aktifkan Kamera & Scan</button>
              <div style="text-align:center">
                <small style="color:var(--muted)">Atau masukkan kode manual:</small>
                <div style="display:flex;gap:8px;margin-top:8px">
                  <input class="form-control" id="qrManualCode" placeholder="Kode QR..." style="height:36px;font-size:12px">
                  <button class="secondary" data-action="submit-qr-code" style="font-size:12px;white-space:nowrap">Kirim</button>
                </div>
              </div>
            `}
          </div>
        </div>
        <div class="card span-2">
          <div class="card-head"><div><h3>${isDosen ? 'Status Kehadiran Mahasiswa' : 'Riwayat Presensi QR'}</h3><p>${isDosen ? 'Real-time dari sesi QR aktif.' : 'Presensi yang sudah tercatat.'}</p></div></div>
          ${isDosen ? `
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>NIM</th><th>Nama</th><th>Waktu Scan</th><th>Status</th><th>Verifikasi</th></tr></thead>
                <tbody>
                  ${state.students.map((s, i) => `
                    <tr>
                      <td>${s.nim}</td>
                      <td>${esc(s.name)}</td>
                      <td style="color:var(--muted)">${i < state.students.length - 2 ? now : '—'}</td>
                      <td><span class="status ${i < state.students.length - 2 ? 'success' : 'warning'}">${i < state.students.length - 2 ? 'Hadir' : 'Belum'}</span></td>
                      <td>${i < state.students.length - 2 ? '<span style="color:var(--green)">✓ Valid</span>' : '<span style="color:var(--muted)">—</span>'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : activityList([
            ['Algoritma Lanjutan', `Hadir • ${now.slice(0,10)} 13:05`],
            ['Sistem Basis Data Modern', `Hadir • 2026-06-22 09:15`],
            ['Kecerdasan Buatan', `Hadir • 2026-06-19 08:10`],
          ])}
        </div>
      </section>`
    );
  }

  /* 14. ORGANISASI / UKM */
  function renderOrganization() {
    $('#content').innerHTML = pageShell(
      'Organisasi & UKM',
      'Daftar organisasi mahasiswa, UKM, dan kegiatan kampus ISTN.',
      `<button class="small-btn" data-action="my-orgs">Organisasi Saya</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🤝', 'Total Organisasi', state.organizations.length, 'Aktif')}
        ${newMetricCard('👥', 'Total Anggota', state.organizations.reduce((a,o) => a + o.members, 0), 'Terdaftar')}
        ${newMetricCard('📅', 'Total Kegiatan', state.organizations.reduce((a,o) => a + o.events, 0), 'Tahun ini')}
        ${newMetricCard('🏆', 'UKM Aktif', state.organizations.filter(o => o.type === 'UKM').length, 'Unit kegiatan')}
      </section>
      <section class="grid grid-2" style="margin-top:14px">
        ${state.organizations.map(o => `
          <div class="card">
            <div class="card-head">
              <div>
                <span class="status info" style="font-size:9px">${esc(o.type)}</span>
                <h3 style="margin:8px 0 4px;font-size:14px">${esc(o.name)}</h3>
                <p style="margin:0;color:var(--muted);font-size:11px">${esc(o.description)}</p>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 0;font-size:11px">
              <div style="text-align:center;background:rgba(255,255,255,.05);border-radius:10px;padding:8px">
                <b style="font-size:18px">${o.members}</b><br><span style="color:var(--muted)">Anggota</span>
              </div>
              <div style="text-align:center;background:rgba(255,255,255,.05);border-radius:10px;padding:8px">
                <b style="font-size:18px">${o.events}</b><br><span style="color:var(--muted)">Kegiatan</span>
              </div>
              <div style="text-align:center;background:rgba(255,255,255,.05);border-radius:10px;padding:8px">
                <span class="status ${o.status === 'Aktif' ? 'success' : 'warning'}" style="font-size:9px">${esc(o.status)}</span>
              </div>
            </div>
            <small style="color:var(--muted)">Pembina: ${esc(o.advisor)}</small>
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="secondary" style="font-size:11px;flex:1" data-action="view-org" data-id="${o.id}">Lihat Detail</button>
              <button class="primary" style="font-size:11px;flex:1" data-action="join-org" data-id="${o.id}">Bergabung</button>
            </div>
          </div>
        `).join('')}
      </section>`
    );
  }

  /* 15. ALUMNI & TRACER STUDY */
  function renderAlumni() {
    const avgIPK = (state.alumni.reduce((a,x) => a + x.gpa, 0) / state.alumni.length).toFixed(2);

    $('#content').innerHTML = pageShell(
      'Alumni & Tracer Study',
      'Data lulusan, karir alumni, dan survei tracer study untuk kebutuhan akreditasi.',
      `<button class="small-btn" data-action="tracer-study">Isi Tracer Study</button><button class="small-btn" data-action="download-alumni">Export Data</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('🌐', 'Total Alumni', state.alumni.length, 'Terdata')}
        ${newMetricCard('💼', 'Bekerja', state.alumni.filter(a => a.company).length, 'Industri/pemerintah')}
        ${newMetricCard('📊', 'Rata-rata IPK', avgIPK, 'Alumni aktif')}
        ${newMetricCard('🏙️', 'Kota Domisili', [...new Set(state.alumni.map(a => a.city))].length, 'Tersebar')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>Data Alumni Teknik Informatika</h3><p>Lulusan yang terdata dalam sistem tracer study.</p></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>NIM</th><th>Nama</th><th>Angkatan</th><th>IPK</th><th>Perusahaan</th><th>Posisi</th><th>Kota</th><th>LinkedIn</th></tr></thead>
            <tbody>
              ${state.alumni.map(a => `
                <tr>
                  <td>${esc(a.nim)}</td>
                  <td><b>${esc(a.name)}</b></td>
                  <td>${a.year}</td>
                  <td>${Number(a.gpa).toFixed(2)}</td>
                  <td>${esc(a.company)}</td>
                  <td style="font-size:11px">${esc(a.position)}</td>
                  <td>${esc(a.city)}</td>
                  <td><a href="${a.linkedIn}" target="_blank" style="color:var(--cyan);font-size:11px">Profil</a></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>Distribusi Karir</h3><p>Sektor pekerjaan alumni.</p></div></div>
          ${donut(88, [
            ['Teknologi / IT', 40],
            ['Pemerintahan', 20],
            ['Keuangan / Bank', 20],
            ['Startup / Freelance', 15],
            ['Lainnya', 5],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Statistik Tracer Study</h3><p>Hasil survei tahunan.</p></div></div>
          ${barList([
            ['Bekerja sesuai bidang', 78],
            ['Kepuasan karir', 82],
            ['Relevansi kurikulum', 74],
            ['Softskill teraplikasi', 88],
            ['Gaji di atas UMR', 72],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Isi Tracer Study</h3><p>Bantu kampus meningkatkan kualitas.</p></div></div>
          <form class="form-grid" style="gap:10px">
            <div class="full"><label class="form-label">Pekerjaan Saat Ini</label><input class="form-control" placeholder="Software Engineer" style="height:36px"></div>
            <div class="full"><label class="form-label">Perusahaan / Instansi</label><input class="form-control" placeholder="Nama perusahaan" style="height:36px"></div>
            <div><label class="form-label">Tahun Lulus</label><input class="form-control" type="number" value="2024" style="height:36px"></div>
            <div><label class="form-label">Waktu Tunggu Kerja</label><select class="form-control" style="height:36px"><option>< 3 bulan</option><option>3-6 bulan</option><option>> 6 bulan</option></select></div>
            <div class="full form-actions"><button class="primary" style="font-size:12px">Submit Tracer Study</button></div>
          </form>
        </div>
      </section>`
    );
  }

  /* 16. GRAFIK PERKEMBANGAN IPK */
  function renderIPKChart() {
    const me = state.students.find(s => s.nim === state.currentUser?.code) || state.students[0];
    const semesterData = [2.95, 3.20, 3.41, 3.62, 3.75, 3.82, 3.88];
    const maxIPK = 4.0;

    $('#content').innerHTML = pageShell(
      'Grafik Perkembangan IPK',
      'Visualisasi tren indeks prestasi kumulatif (IPK) per semester.',
      `<button class="small-btn" data-action="download-ipk-chart">Export Grafik</button>`,
      `
      <section class="grid grid-4">
        ${newMetricCard('📈', 'IPK Saat Ini', me?.ipk.toFixed(2) || '3.88', 'Semester 4')}
        ${newMetricCard('⬆️', 'Kenaikan', '+0.06', 'vs Semester lalu')}
        ${newMetricCard('🏆', 'IPK Tertinggi', '3.88', 'Semester 4')}
        ${newMetricCard('🎯', 'Target IPK', '3.90', 'Semester 5')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h3>Grafik IPK per Semester</h3><p>Tren kumulatif selama studi.</p></div></div>
        ${lineChart(semesterData)}
        <div style="display:flex;justify-content:space-between;padding:0 12px;margin-top:8px">
          ${['Smt 1','Smt 2','Smt 3','Smt 4','Smt 5','Smt 6','Smt 7'].map((l,i) => `
            <div style="text-align:center;font-size:10px">
              <div style="color:var(--muted)">${l}</div>
              <div style="font-weight:900;color:${semesterData[i] >= 3.5 ? 'var(--green)' : 'var(--orange)'}">${semesterData[i].toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="grid grid-3" style="margin-top:14px">
        <div class="card">
          <div class="card-head"><div><h3>Komposisi Nilai per Semester</h3><p>Semester aktif (4).</p></div></div>
          ${donut(Math.round(me?.ipk * 25) || 97, [
            ['A / A- (Sangat Baik)', 70],
            ['B+ / B (Baik)', 20],
            ['C / D (Cukup)', 10],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Analisis Performa</h3><p>Insight AI berdasarkan IPK.</p></div></div>
          ${activityList([
            ['Tren Positif', 'IPK terus meningkat sejak semester 1'],
            ['Peringkat', 'Masuk top 20% mahasiswa angkatan'],
            ['Kekuatan', 'Nilai A dominan di matakuliah inti'],
            ['Area Perbaikan', 'Tingkatkan kehadiran untuk nilai partisipasi'],
            ['Prediksi', 'IPK semester 5 diproyeksikan 3.90–3.95'],
          ])}
        </div>
        <div class="card">
          <div class="card-head"><div><h3>Perbandingan</h3><p>IPK vs rata-rata angkatan.</p></div></div>
          ${barList([
            [`IPK Kamu (${me?.ipk.toFixed(2) || '3.88'})`, Math.round((me?.ipk || 3.88) * 25)],
            [`Rata-rata Angkatan (3.60)`, 90],
            [`IPK Tertinggi (3.91)`, Math.round(3.91 * 25)],
            [`IPK Minimum Beasiswa (3.50)`, 87],
            [`Target Wisuda (3.85)`, Math.round(3.85 * 25)],
          ])}
        </div>
      </section>`
    );
  }

  /* ── Helper: Metric Card Versi Baru (dengan emoji) */
  function newMetricCard(icon, label, value, trend) {
    return `<article class="card metric-card"><div class="metric-icon" style="font-size:20px"><span class="icon-glyph">${icon}</span></div><div><div class="metric-value">${esc(String(value))}</div><div class="metric-label">${esc(label)}</div><div class="metric-trend">${esc(trend)}</div></div></article>`;
  }

  /* ── Extend handleAction untuk fitur baru ────── */
  function extendHandleAction() {
    const oldHandleAction = handleAction; // ambil referensi chain terbaru
    handleAction = function (action, target) {
      switch (action) {
        // Pengumuman
        case 'new-announcement':
          openModal('Buat Pengumuman Baru', 'Pengumuman akan tampil di semua role.', `<form id="announcementForm" class="form-grid"><div class="full"><label class="form-label">Judul</label><input class="form-control" name="title" value="Pengumuman Akademik Baru" required></div><div><label class="form-label">Kategori</label><select class="form-control" name="category"><option>Akademik</option><option>Beasiswa</option><option>PKL</option><option>Kegiatan</option><option>Informasi</option></select></div><div><label class="form-label">Prioritas</label><select class="form-control" name="priority"><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select></div><div class="full"><label class="form-label">Isi Pengumuman</label><textarea class="form-control" name="body" rows="5" required>Isi pengumuman di sini...</textarea></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan</button></div></form>`);
          break;
        case 'delete-announcement': {
          const id = target?.dataset?.id;
          state.announcements = state.announcements.filter(a => a.id !== id);
          save(storageNew.announcements, state.announcements);
          audit('Hapus pengumuman', id);
          toast('Pengumuman dihapus.'); renderPage('announcements'); break;
        }
        case 'mark-all-read':
          state.notifications.forEach(n => n.read = true);
          save(storageNew.notifications, state.notifications);
          toast('Semua notifikasi ditandai dibaca.'); renderPage('announcements'); break;

        // Ujian & Kartu
        case 'print-exam-schedule':
        case 'print-exam-card':
        case 'print-surat':
          audit('Cetak dokumen', action);
          toast('Membuka dialog cetak...');
          setTimeout(() => window.print(), 100);
          break;

        // Pembayaran
        case 'pay-now': {
          const pid = target?.dataset?.id;
          const payment = state.payments.find(p => p.id === pid);
          if (payment) {
            payment.status = 'Lunas';
            payment.paidDate = new Date().toISOString().slice(0,10);
            payment.method = 'Transfer Bank (Simulasi)';
            save(storageNew.payments, state.payments);
            audit('Bayar UKT', `${payment.type} - ${payment.semester}`);
            toast('Pembayaran berhasil dikonfirmasi (simulasi).');
            renderPage('payment');
          }
          break;
        }
        case 'download-payment-history':
          downloadFeatureSnapshot('riwayat-pembayaran', state.payments); break;

        // Perpustakaan
        case 'borrow-book': {
          const bid = target?.dataset?.id;
          const book = state.library.find(b => b.id === bid);
          if (book && book.available > 0) {
            book.available--;
            save(storageNew.library, state.library);
            audit('Pinjam buku', book.title);
            toast(`Buku "${book.title}" berhasil dipinjam. Kembalikan dalam 14 hari.`);
            renderPage('library');
          }
          break;
        }
        case 'reserve-book': {
          const bid = target?.dataset?.id;
          const book = state.library.find(b => b.id === bid);
          audit('Reservasi buku', book?.title || bid);
          toast(`Reservasi "${book?.title}" berhasil. Kami akan notifikasi jika buku tersedia.`);
          break;
        }

        // PKL
        case 'apply-internship':
          openModal('Daftar PKL / Magang', 'Isi data perusahaan dan periode PKL.', `<form id="pklForm" class="form-grid"><div class="full"><label class="form-label">Nama Perusahaan / Instansi</label><input class="form-control" name="company" placeholder="PT. Nama Perusahaan" required></div><div><label class="form-label">Posisi / Jabatan</label><input class="form-control" name="position" placeholder="Software Engineer Intern" required></div><div><label class="form-label">Dosen Pembimbing</label><select class="form-control" name="supervisor">${state.lecturers.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></div><div><label class="form-label">Tanggal Mulai</label><input class="form-control" type="date" name="startDate" value="2026-07-01"></div><div><label class="form-label">Tanggal Selesai</label><input class="form-control" type="date" name="endDate" value="2026-09-30"></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Ajukan PKL</button></div></form>`);
          break;
        case 'approve-pkl': {
          const pid = target?.dataset?.id;
          const pkl = state.internships.find(p => p.id === pid);
          if (pkl) { pkl.status = 'Disetujui'; save(storageNew.internships, state.internships); audit('Setujui PKL', pkl.studentName); toast('PKL disetujui.'); renderPage('internship'); }
          break;
        }

        // Skripsi
        case 'apply-thesis':
          openModal('Ajukan Judul Skripsi / TA', 'Pengajuan akan diverifikasi oleh koordinator TA.', `<form id="thesisForm" class="form-grid"><div class="full"><label class="form-label">Judul Penelitian</label><input class="form-control" name="title" placeholder="Judul skripsi yang diusulkan..." required></div><div><label class="form-label">Dosen Pembimbing 1</label><select class="form-control" name="supervisor1">${state.lecturers.map(d => `<option>${esc(d.name)}</option>`).join('')}</select></div><div><label class="form-label">Dosen Pembimbing 2</label><select class="form-control" name="supervisor2">${state.lecturers.map(d => `<option>${esc(d.name)}</option>`).join('')}</select></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Ajukan Judul</button></div></form>`);
          break;

        // Beasiswa
        case 'apply-scholarship': {
          const sid = target?.dataset?.id;
          const sch = state.scholarships.find(s => s.id === sid);
          if (sch && sch.status === 'Buka') {
            audit('Daftar beasiswa', sch.name);
            toast(`Pendaftaran beasiswa "${sch.name}" berhasil! Tim akan menghubungi via email.`);
          }
          break;
        }
        case 'my-scholarships':
          toast('Data beasiswa yang sudah didaftar akan tampil di sini.'); break;

        // Forum
        case 'new-thread':
          openModal('Buat Thread Diskusi', 'Tambah topik diskusi untuk kelas.', `<form id="threadForm" class="form-grid"><div class="full"><label class="form-label">Mata Kuliah</label><select class="form-control" name="courseId">${state.courses.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></div><div class="full"><label class="form-label">Judul Thread</label><input class="form-control" name="title" placeholder="Judul pertanyaan atau diskusi..." required></div><div class="full"><label class="form-label">Isi Diskusi</label><textarea class="form-control" name="body" rows="5" placeholder="Jelaskan pertanyaan atau topik diskusi..." required></textarea></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Posting Thread</button></div></form>`);
          break;
        case 'open-thread':
          toast('Preview thread akan tersedia pada versi penuh.'); break;

        // Helpdesk
        case 'new-ticket':
          toast('Gunakan form Buat Tiket Baru di bawah halaman Helpdesk.'); renderPage('helpdesk'); break;

        // Notifikasi
        case 'mark-notif-read': {
          const nid = target?.dataset?.id;
          const notif = state.notifications.find(n => n.id === nid);
          if (notif) { notif.read = true; save(storageNew.notifications, state.notifications); renderPage('notifications'); }
          break;
        }
        case 'mark-notif-all-read':
          state.notifications.forEach(n => n.read = true);
          save(storageNew.notifications, state.notifications);
          toast('Semua notifikasi ditandai dibaca.'); renderPage('notifications'); break;
        case 'clear-notif':
          state.notifications = [];
          save(storageNew.notifications, state.notifications);
          toast('Semua notifikasi dihapus.'); renderPage('notifications'); break;
        case 'add-notif': {
          const n = { id: uid('NTF'), title: 'Notifikasi Baru', body: 'Ada update akademik dari portal.', type: 'info', read: false, date: new Date().toLocaleString('id-ID') };
          state.notifications.unshift(n);
          save(storageNew.notifications, state.notifications);
          renderPage('notifications'); break;
        }

        // QR Attendance
        case 'generate-qr':
          audit('Generate QR presensi', state.selectedCourseId);
          toast('QR Code baru berhasil digenerate. Tampilkan ke mahasiswa.');
          renderPage('qr-attendance'); break;
        case 'scan-qr':
          toast('Fitur kamera memerlukan HTTPS. Gunakan mode kode manual untuk demo.'); break;
        case 'submit-qr-code': {
          const code = $('#qrManualCode')?.value;
          if (code) { audit('Scan QR absensi', code); toast('Kehadiran berhasil dicatat via QR Code!'); }
          else toast('Masukkan kode QR terlebih dahulu.');
          break;
        }

        // Organisasi
        case 'join-org': {
          const oid = target?.dataset?.id;
          const org = state.organizations.find(o => o.id === oid);
          if (org) { audit('Bergabung organisasi', org.name); toast(`Permohonan bergabung ke ${org.name} berhasil dikirim!`); }
          break;
        }
        case 'view-org':
          toast('Detail halaman organisasi akan tersedia di versi penuh.'); break;
        case 'my-orgs':
          toast('Organisasi yang kamu ikuti akan muncul di sini.'); break;

        // Alumni
        case 'tracer-study':
          toast('Terima kasih telah mengisi tracer study! Data Anda sangat berharga untuk akreditasi.'); audit('Isi tracer study', state.currentUser?.name); break;
        case 'download-alumni':
          downloadFeatureSnapshot('data-alumni', state.alumni); break;

        // QR KTM Mahasiswa
        case 'show-my-qr': {
          const nim = state.currentUser?.code || 'N/A';
          const name = state.currentUser?.name || 'Mahasiswa';
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(nim)}`;
          
          openModal('KTM Digital (QR Code)', 'Tunjukkan QR Code ini kepada Dosen, Pengawas Ujian, atau Petugas Perpustakaan untuk proses scan otomatis.', `
            <div style="text-align: center; padding: 20px;">
              <img src="${qrUrl}" alt="QR Code ${nim}" style="width: 250px; height: 250px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'250\\' height=\\'250\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23eee\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\'>No Image</text></svg>'">
              <h3>${esc(name)}</h3>
              <p style="font-size: 18px; font-weight: 600; color: var(--primary); letter-spacing: 2px;">${esc(nim)}</p>
              <p style="color: var(--muted); margin-top: 10px;">Gunakan untuk presensi atau layanan akademik lainnya.</p>
            </div>
            <div class="full form-actions" style="margin-top:20px;">
              <button class="primary full" type="button" data-action="close-modal">Tutup</button>
            </div>
          `);
          audit('Buka QR KTM', nim);
          break;
        }

        // IPK Chart
        case 'download-ipk-chart':
          audit('Export grafik IPK', state.currentUser?.name);
          toast('Grafik IPK sedang diekspor...'); break;

        // PKL Guide & Template
        case 'download-pkl-guide':
        case 'download-thesis-template':
          audit('Download template', action);
          toast('File template sedang diunduh (simulasi).'); break;

        // Fallback
        default: return oldHandleAction(action, target);
      }
    };
  }

  /* ── Extend Form Submit untuk fitur baru ─────── */
  function extendFormSubmit() {
    // handleFormSubmit adalah function declaration di app.js, jadi
    // kita intercept lewat event listener capture phase — jalankan sebelum listener di app.js
    document.addEventListener('submit', function featureFormHandler(event) {
      const id = event.target.id;
      if (!['announcementForm','pklForm','thesisForm','threadForm','ticketForm'].includes(id)) return;
      event.preventDefault();
      event.stopImmediatePropagation(); // cegah app.js handleFormSubmit jalan
      const data = formDataObject(event.target);

      if (id === 'announcementForm') {
        const ann = { id: uid('ANN'), title: data.title, body: data.body, category: data.category, priority: data.priority, date: new Date().toISOString().slice(0,10), author: state.currentUser?.name || 'Admin' };
        state.announcements.unshift(ann);
        save(storageNew.announcements, state.announcements);
        audit('Buat pengumuman', ann.title);
        closeModal(); toast('Pengumuman berhasil dibuat.'); renderPage('announcements');
        return;
      }
      if (id === 'pklForm') {
        const pkl = { id: uid('PKL'), company: data.company, position: data.position, student: state.currentUser?.code, studentName: state.currentUser?.name, supervisor: data.supervisor, startDate: data.startDate, endDate: data.endDate, status: 'Menunggu Persetujuan', score: null, report: null };
        state.internships.unshift(pkl);
        save(storageNew.internships, state.internships);
        audit('Daftar PKL', pkl.company);
        closeModal(); toast('Pengajuan PKL berhasil dikirim.'); renderPage('internship');
        return;
      }
      if (id === 'thesisForm') {
        const thesis = { id: uid('TA'), nim: state.currentUser?.code, title: data.title, supervisor1: data.supervisor1, supervisor2: data.supervisor2, status: 'Pengajuan Judul', stage: 1, submitted: new Date().toISOString().slice(0,10), defense: null, score: null };
        state.theses.unshift(thesis);
        save(storageNew.theses, state.theses);
        audit('Ajukan judul TA', thesis.title);
        closeModal(); toast('Judul skripsi berhasil diajukan.'); renderPage('thesis');
        return;
      }
      if (id === 'threadForm') {
        const thread = { id: uid('FRM'), courseId: data.courseId, title: data.title, body: data.body, author: state.currentUser?.name, authorRole: state.currentRole, date: new Date().toLocaleString('id-ID'), replies: 0, likes: 0 };
        state.forum.unshift(thread);
        save(storageNew.forum, state.forum);
        audit('Buat thread forum', thread.title);
        closeModal(); toast('Thread diskusi berhasil diposting!'); renderPage('forum');
        return;
      }
      if (id === 'ticketForm') {
        const ticket = { id: uid('TKT'), subject: data.subject, category: data.category, priority: data.priority, status: 'Menunggu', submitter: state.currentUser?.name, role: state.currentRole, date: new Date().toISOString().slice(0,10), resolvedDate: null, response: null };
        state.helpdesk.unshift(ticket);
        save(storageNew.helpdesk, state.helpdesk);
        audit('Buat tiket helpdesk', ticket.subject);
        toast('Tiket bantuan berhasil dikirim. Tim akan merespons dalam 1x24 jam.'); renderPage('helpdesk');
        return;
      }

      // Jika tidak ada match, biarkan app.js handleFormSubmit menangani
    }, true); // capture=true agar berjalan lebih dulu
  }

  /* ── Utility: download snapshot data fitur baru */
  function downloadFeatureSnapshot(name, data) {
    const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `istn-${name}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    audit('Export data', name);
    toast(`Data ${name} berhasil diunduh.`);
  }

  /* ── Inisialisasi semua ekstensi ──────────────── */
  function initFeatures() {
    initNewFeatures();
    extendNavs();
    registerPages();
    extendHandleAction(); // chain handleAction variable
    extendFormSubmit();   // capture phase event listener

    // Tambah notifikasi otomatis saat login
    const unreadCount = (state.notifications || []).filter(n => !n.read).length;
    if (unreadCount > 0) {
      setTimeout(() => toast(`🔔 Kamu memiliki ${unreadCount} notifikasi baru. Cek menu Notifikasi.`), 2000);
    }

    // Re-render app jika sudah login agar navs baru tampil
    if (state.currentRole && state.currentUser) {
      renderApp();
    }
  }

  /* ── Tunggu app.js selesai load lalu init ─────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatures);
  } else {
    // Gunakan setTimeout agar app.js selesai dulu
    setTimeout(initFeatures, 0);
  }

})();

