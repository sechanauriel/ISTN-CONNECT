'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));
const uid = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

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
  { id: 'DOC4', title: 'Template Laporan Capstone.docx', type: 'DOCX', tags: 'laporan, modul, validasi', source: 'SC-DATA' },
  { id: 'DOC5', title: 'KRS Semester Genap 2026.xlsx', type: 'XLSX', tags: 'krs, jadwal, sks', source: 'SIAKAD' }
];

const storage = {
  students: 'istn-v16-students', lecturers: 'istn-v16-lecturers', courses: 'istn-v16-courses', tasks: 'istn-v16-tasks',
  events: 'istn-v16-events', messages: 'istn-v16-messages', audit: 'istn-v16-audit', grades: 'istn-v16-grades', attendance: 'istn-v16-attendance', settings: 'istn-v16-settings'
};

const navs = {
  Mahasiswa: [
    ['Utama', [['dashboard', '⌂', 'Dashboard'], ['classes', '▦', 'Kelas & Perkuliahan'], ['course-detail', '◈', 'Detail Kelas'], ['krs', 'KRS', 'KRS & Jadwal']]],
    ['Akademik', [['grades', '◎', 'Nilai & KHS'], ['attendance', '◉', 'Kehadiran'], ['assignments', '✎', 'Tugas & Ujian'], ['documents', '▤', 'Dokumen Akademik']]],
    ['AI & Komunikasi', [['analytics', '◬', 'Analitik Akademik'], ['ai', 'AI', 'Asisten Akademik'], ['rag', '⌕', 'Search / RAG'], ['messages', '✉', 'Pesan', '2'], ['calendar', '◷', 'Kalender']]],
    ['Akun', [['profile', '◎', 'Profil Saya'], ['settings', '⚙', 'Pengaturan']]]
  ],
  Dosen: [
    ['Utama', [['dashboard', '⌂', 'Dashboard Dosen'], ['lecturer-courses', '▦', 'Mata Kuliah Saya'], ['course-detail', '◈', 'Detail Kelas']]],
    ['Pengajaran', [['lecturer-tasks', '✎', 'Beri Tugas'], ['lecturer-submissions', '□', 'Pengumpulan Tugas'], ['lecturer-attendance', '◉', 'Isi Kehadiran'], ['lecturer-grades', '◎', 'Input Nilai'], ['lecturer-students', '☷', 'Mahasiswa Bimbingan']]],
    ['AI & Komunikasi', [['analytics', '◬', 'Analitik Kelas'], ['ai', 'AI', 'Asisten Dosen'], ['rag', '⌕', 'Search / RAG'], ['documents', '▤', 'Dokumen'], ['messages', '✉', 'Pesan', '3'], ['calendar', '◷', 'Kalender']]],
    ['Akun', [['profile', '◎', 'Profil'], ['settings', '⚙', 'Pengaturan']]]
  ],
  Administrator: [
    ['Utama', [['dashboard', '⌂', 'Dashboard Admin'], ['admin-students', '☷', 'Master Mahasiswa'], ['admin-lecturers', '◪', 'Master Dosen'], ['admin-courses', '▦', 'Master Mata Kuliah']]],
    ['Sistem', [['admin-users', 'RB', 'Kelola User & Role'], ['data-pipeline', 'ETL', 'Data Pipeline'], ['audit', 'LOG', 'Audit Log'], ['governance', 'SEC', 'Security & Governance'], ['deployment', 'DEP', 'Deployment']]],
    ['Komunikasi', [['analytics', '◬', 'Analitik Sistem'], ['messages', '✉', 'Pesan', '5'], ['calendar', '◷', 'Kalender'], ['documents', '▤', 'Dokumen']]],
    ['Akun', [['profile', '◎', 'Profil'], ['settings', '⚙', 'Pengaturan']]]
  ],
  Pimpinan: [
    ['Utama', [['dashboard', '⌂', 'Dashboard Eksekutif'], ['executive-stats', '◬', 'Statistik Akademik'], ['executive-grades', '◎', 'Rekap Nilai'], ['executive-attendance', '◉', 'Rekap Kehadiran']]],
    ['Keputusan', [['risk', '⚠', 'Risiko Akademik'], ['compliance', 'SEC', 'Audit & Compliance'], ['deployment', 'DEP', 'Deployment'], ['executive-ai', 'AI', 'Executive AI']]],
    ['Komunikasi', [['messages', '✉', 'Pesan', '1'], ['calendar', '◷', 'Kalender'], ['documents', '▤', 'Dokumen']]],
    ['Akun', [['profile', '◎', 'Profil'], ['settings', '⚙', 'Pengaturan']]]
  ]
};

const state = {
  currentRole: null,
  currentUser: null,
  currentPage: 'dashboard',
  selectedCourseId: 'sbdm',
  students: [], lecturers: [], courses: [], tasks: [], events: [], messages: [], documents: seedDocuments,
  grades: {}, attendance: {}, auditLogs: [], settings: { theme: 'dark', animation: true, compact: true, notifications: true }
};

const pageMap = {
  dashboard: renderDashboard,
  classes: renderClasses,
  'course-detail': renderCourseDetail,
  krs: renderKrs,
  grades: renderGrades,
  attendance: renderAttendance,
  assignments: renderAssignments,
  documents: renderDocuments,
  analytics: renderAnalytics,
  ai: renderAI,
  rag: renderRAG,
  messages: renderMessages,
  calendar: renderCalendar,
  profile: renderProfile,
  settings: renderSettings,
  'lecturer-courses': renderLecturerCourses,
  'lecturer-tasks': renderLecturerTasks,
  'lecturer-submissions': renderLecturerSubmissions,
  'lecturer-attendance': renderLecturerAttendance,
  'lecturer-grades': renderLecturerGrades,
  'lecturer-students': renderLecturerStudents,
  'admin-students': renderAdminStudents,
  'admin-lecturers': renderAdminLecturers,
  'admin-courses': renderAdminCourses,
  'admin-users': renderAdminUsers,
  'data-pipeline': renderDataPipeline,
  audit: renderAudit,
  governance: renderGovernance,
  deployment: renderDeployment,
  'executive-stats': renderExecutiveStats,
  'executive-grades': renderExecutiveGrades,
  'executive-attendance': renderExecutiveAttendance,
  risk: renderRisk,
  compliance: renderCompliance,
  'executive-ai': renderExecutiveAI
};

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
  } catch (_) {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function persist(name) { save(storage[name], state[name]); }

function initData() {
  state.students = getStored(storage.students, seedStudents);
  state.lecturers = getStored(storage.lecturers, seedLecturers);
  state.courses = getStored(storage.courses, seedCourses);
  state.tasks = getStored(storage.tasks, seedTasks);
  state.events = getStored(storage.events, seedEvents);
  state.messages = getStored(storage.messages, seedMessages);
  state.auditLogs = getStored(storage.audit, []);
  state.grades = getStored(storage.grades, createInitialGrades());
  state.attendance = getStored(storage.attendance, {});
  state.settings = getStored(storage.settings, state.settings);
  applyTheme(state.settings.theme || 'dark');
}

function createInitialGrades() {
  const obj = {};
  seedStudents.forEach((s, idx) => {
    obj[s.nim] = { uts: 78 + (idx % 5) * 3, uas: 80 + (idx % 4) * 4, tugas: 82 + (idx % 6) * 2, final: 84 + (idx % 5) * 2 };
  });
  return obj;
}

function audit(action, detail) {
  if (!state.currentUser) return;
  state.auditLogs.unshift({ id: uid('LOG'), action, detail, role: state.currentRole, user: state.currentUser.name, time: new Date().toLocaleString('id-ID') });
  state.auditLogs = state.auditLogs.slice(0, 200);
  save(storage.audit, state.auditLogs);
}

function resolveLogin(role, username, password) {
  const account = accounts[role];
  if (account && account.username === username && account.password === password) return account;
  if (role === 'Dosen' && ['oni', 'onibibin', 'oni.bibin'].includes(String(username).toLowerCase()) && password === 'oni123') return accounts.Dosen;
  if (role === 'Mahasiswa') {
    const student = state.students.find((s) => s.nim === username && s.nim === password);
    if (student) return { username: student.nim, password: student.nim, name: student.name, code: student.nim, role: 'Mahasiswa', avatar: initials(student.name) };
  }
  return null;
}

function initials(name) {
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'U';
}

function quickCredentials(role) {
  const a = accounts[role];
  $('#roleSelect').value = role;
  $('#username').value = a.username;
  $('#password').value = a.password;
}

function login(role, user) {
  state.currentRole = role;
  state.currentUser = user;
  state.currentPage = 'dashboard';
  $('#loginScreen').classList.add('hidden');
  $('#appShell').classList.remove('hidden');
  audit('Login', `${user.name} sebagai ${role}`);
  renderApp();
}

function logout() {
  audit('Logout', state.currentUser?.name || 'Pengguna');
  state.currentRole = null;
  state.currentUser = null;
  $('#appShell').classList.add('hidden');
  $('#loginScreen').classList.remove('hidden');
  toast('Sesi keluar. Silakan login kembali.');
}

function applyTheme(theme) {
  state.settings.theme = theme;
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('ui-compact', !!state.settings.compact);
  document.body.classList.toggle('motion-off', !state.settings.animation);
  save(storage.settings, state.settings);
}

function toggleTheme() {
  applyTheme(state.settings.theme === 'light' ? 'dark' : 'light');
  toast(`Tema ${state.settings.theme === 'light' ? 'terang' : 'gelap'} aktif.`);
}

function renderApp() {
  renderChrome();
  renderNav();
  renderPage(state.currentPage);
}

function renderChrome() {
  $('#profileAvatar').textContent = state.currentUser.avatar || initials(state.currentUser.name);
  $('#sidebarName').textContent = state.currentUser.name;
  $('#sidebarRole').textContent = `${state.currentRole} • ${state.currentUser.code}`;
  $('#topProfile').innerHTML = `<span>${esc(state.currentUser.name)}</span><small>${esc(state.currentRole)}</small>`;
}

function renderNav() {
  const groups = navs[state.currentRole] || [];
  $('#navList').innerHTML = groups.map(([label, items]) => `
    <div class="menu-group">
      <div class="menu-label">${esc(label)}</div>
      ${items.map(([page, icon, text, badge]) => `
        <button class="nav-item ${page === state.currentPage ? 'active' : ''}" data-page="${page}">
          <span class="nav-icon">${icon}</span><span class="nav-text">${esc(text)}</span>${badge ? `<span class="nav-badge">${badge}</span>` : ''}
        </button>`).join('')}
    </div>`).join('');
}

function renderPage(page) {
  const allowed = flattenNav().some((item) => item.page === page) || pageMap[page];
  state.currentPage = allowed ? page : 'dashboard';
  renderNav();
  const fn = pageMap[state.currentPage] || renderNotFound;
  try {
    fn();
  } catch (err) {
    console.error(err);
    $('#content').innerHTML = pageShell('Terjadi Kendala', 'Halaman gagal dimuat.', `<button class="small-btn" data-page="dashboard">Kembali Dashboard</button>`, `<div class="card empty-state">${esc(err.message)}</div>`);
  }
  enhanceMotion();
  $('#sidebar').classList.remove('open');
}

function flattenNav() {
  return (navs[state.currentRole] || []).flatMap(([_, items]) => items.map(([page, icon, text]) => ({ page, icon, text })));
}

function pageShell(title, desc, actions = '', body = '') {
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div><div class="page-actions">${actions}</div></div><div id="pageBody">${body}</div>`;
}

function renderDashboard() {
  if (state.currentRole === 'Dosen') return renderLecturerDashboard();
  if (state.currentRole === 'Administrator') return renderAdminDashboard();
  if (state.currentRole === 'Pimpinan') return renderExecutiveDashboard();
  return renderStudentDashboard();
}

function renderStudentDashboard() {
  const me = state.students.find((s) => s.nim === state.currentUser.code) || state.students[state.students.length - 1];
  const sks = sum(state.courses.map((c) => c.sks));
  $('#content').innerHTML = pageShell('Dashboard Mahasiswa', 'Ringkasan akademik personal, jadwal, tugas, kehadiran, dan insight AI.', `
    <button class="small-btn" data-page="krs">KRS</button><button class="small-btn" data-page="assignments">Tugas</button><button class="small-btn" data-page="ai">Tanya AI</button>`, `
    <section class="card hero-panel"><div><span class="capsule"><i></i> Academic Health Online</span><h2>Selamat datang, ${esc(me.name)}.</h2><p>Portal ini menggabungkan SIAKAD, kelas digital, dokumen akademik, dan asisten AI. Prioritas hari ini: cek jadwal, selesaikan tugas aktif, dan pertahankan kehadiran minimal 75%.</p><div class="hero-actions"><button class="primary" data-page="assignments">Kerjakan Tugas</button><button class="secondary" data-page="calendar">Lihat Kalender</button></div></div><div class="hero-score"><div class="score-ring"><div><b>${Math.round((me.attendance + me.ipk * 25) / 2)}</b><span>Health</span></div></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('IPK', 'IPK', me.ipk.toFixed(2), 'Naik 0.08')}${metricCard('SKS', 'SKS Diambil', `${sks}`, 'Maksimal 24')}${metricCard('◉', 'Kehadiran', `${me.attendance}%`, statusText(me.attendance))}${metricCard('✎', 'Tugas Aktif', state.tasks.filter((t) => t.status !== 'Selesai').length, 'Perlu dikerjakan')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Tren Performa Semester</h3><p>Simulasi performa mingguan.</p></div></div>${lineChart([72, 78, 81, 84, 88, 91, 93])}</div><div class="card"><div class="card-head"><div><h3>Academic Health Score</h3><p>Komposit nilai, presensi, tugas, dan aktivitas.</p></div></div>${donut(Math.round((me.attendance + me.ipk * 25) / 2), [['Kehadiran', me.attendance], ['Nilai', Math.round(me.ipk * 25)], ['Tugas', 86], ['Aktivitas', 82]])}</div></section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Jadwal Hari Ini</h3><p>Kelas terdekat.</p></div></div>${activityList(state.courses.slice(0,4).map((c) => [`${c.start} • ${c.title}`, `${c.room} • ${c.lecturer}`]))}</div><div class="card"><div class="card-head"><div><h3>Perlu Dikerjakan</h3><p>Tugas dan validasi akademik.</p></div></div>${taskList(state.tasks.filter((t) => t.status !== 'Selesai').slice(0,4))}</div><div class="card"><div class="card-head"><div><h3>Quick Actions</h3><p>Akses cepat mahasiswa.</p></div></div>${quickActions([['KRS','KRS & Jadwal','krs'],['Nilai','KHS & Transkrip','grades'],['Presensi','Kehadiran Saya','attendance'],['AI','Asisten Akademik','ai']])}</div></section>
  `);
}

function renderLecturerDashboard() {
  $('#content').innerHTML = pageShell('Dashboard Dosen', 'Workspace pengajaran untuk tugas, presensi, nilai, monitoring kelas, dan komunikasi mahasiswa.', `
    <button class="small-btn" data-action="open-task-modal">Buat Tugas</button><button class="small-btn" data-page="lecturer-attendance">Isi Presensi</button><button class="small-btn" data-page="lecturer-grades">Input Nilai</button>`, `
    <section class="card hero-panel"><div><span class="capsule"><i></i> Lecturer Control Center</span><h2>Kelola kelas, tugas, presensi, dan nilai dari satu tempat.</h2><p>Dosen bisa memberi tugas, mencatat presensi mahasiswa, input nilai, melihat mahasiswa bimbingan, membuka dokumen, dan menggunakan AI untuk membuat instruksi pembelajaran.</p><div class="hero-actions"><button class="primary" data-action="open-task-modal">Buat Tugas Baru</button><button class="secondary" data-page="lecturer-attendance">Input Presensi</button></div></div><div class="hero-score"><div class="score-ring"><div><b>${state.courses.length}</b><span>Kelas</span></div></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('▦','Kelas Diampu',state.courses.length,'Semester aktif')}${metricCard('✎','Tugas Aktif',state.tasks.length,'Termonitor')}${metricCard('◉','Sesi Presensi',Object.keys(state.attendance).length,'Tersimpan')}${metricCard('◎','Rata-rata Nilai',averageFinal(),'Update lokal')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Performa Kelas Diampu</h3><p>Health score per mata kuliah.</p></div></div>${barChart(state.courses.map((c) => [shortCourse(c.title), c.health]))}</div><div class="card"><div class="card-head"><div><h3>Aksi Pengajaran</h3><p>Fitur utama dosen.</p></div></div>${quickActions([['Tugas','Beri Tugas','lecturer-tasks'],['Presensi','Isi Kehadiran','lecturer-attendance'],['Nilai','Input Nilai','lecturer-grades'],['Bimbingan','Mahasiswa','lecturer-students']])}</div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Mahasiswa Perlu Perhatian</h3><p>Urutan berdasarkan presensi dan IPK.</p></div></div>${studentList(state.students.slice().sort((a,b) => a.attendance - b.attendance).slice(0,5))}</div><div class="card"><div class="card-head"><div><h3>Aktivitas Terbaru</h3><p>Log pengajaran dan update kelas.</p></div></div>${activityList([['Tugas baru','Buat tugas dari tombol Beri Tugas.'],['Presensi','Isi kehadiran setiap pertemuan.'],['Nilai','Input nilai UTS, UAS, tugas, dan final.']])}</div></section>
  `);
}

function renderAdminDashboard() {
  $('#content').innerHTML = pageShell('Dashboard Administrator', 'Control room data akademik, master data, pipeline, RBAC, audit, dan deployment.', `
    <button class="small-btn" data-action="open-student-modal">Tambah Mahasiswa</button><button class="small-btn" data-action="open-course-modal">Tambah MK</button><button class="small-btn" data-action="simulate-pipeline">Run Pipeline</button>`, `
    <section class="card hero-panel"><div><span class="capsule"><i></i> Admin Operations Active</span><h2>Kelola SIAKAD dengan validasi, audit, dan role-based access.</h2><p>Administrator mengelola mahasiswa, dosen, mata kuliah, user, role, pipeline data, audit log, governance, dan kesiapan deployment.</p><div class="hero-actions"><button class="primary" data-action="open-student-modal">Tambah Mahasiswa</button><button class="secondary" data-page="audit">Lihat Audit</button></div></div><div class="hero-score"><div class="score-ring"><div><b>96</b><span>DQ</span></div></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('☷','Mahasiswa',state.students.length,'Master data')}${metricCard('◪','Dosen',state.lecturers.length,'Aktif')}${metricCard('▦','Mata Kuliah',state.courses.length,'Semester aktif')}${metricCard('LOG','Audit Log',state.auditLogs.length,'Tercatat')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Data Quality Pipeline</h3><p>Simulasi validasi enam dataset akademik.</p></div></div>${barChart([['Mahasiswa',99],['Dosen',98],['Mata Kuliah',97],['KRS',94],['Nilai',91],['Presensi',96]])}</div><div class="card"><div class="card-head"><div><h3>Admin Quick Actions</h3><p>CRUD dan sistem.</p></div></div>${quickActions([['Mahasiswa','Tambah/Edit','admin-students'],['Dosen','Master Dosen','admin-lecturers'],['Mata Kuliah','Master MK','admin-courses'],['Pipeline','ETL Data','data-pipeline']])}</div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Audit Aktivitas</h3><p>Aktivitas sistem terbaru.</p></div></div>${auditList(state.auditLogs.slice(0,6))}</div><div class="card"><div class="card-head"><div><h3>RBAC Snapshot</h3><p>Hak akses inti per role.</p></div></div>${rbacSummary()}</div></section>
  `);
}

function renderExecutiveDashboard() {
  const avgIpk = avg(state.students.map((s) => s.ipk)).toFixed(2);
  const avgAttend = Math.round(avg(state.students.map((s) => s.attendance)));
  $('#content').innerHTML = pageShell('Dashboard Eksekutif', 'Monitoring strategis performa akademik, risiko, compliance, dan kesiapan sistem.', `
    <button class="small-btn" data-page="executive-stats">Statistik</button><button class="small-btn" data-page="risk">Risiko</button><button class="small-btn" data-page="compliance">Compliance</button>`, `
    <section class="card hero-panel"><div><span class="capsule"><i></i> Executive Intelligence</span><h2>Campus health berada pada level terkendali.</h2><p>Pimpinan melihat tren IPK, kehadiran, distribusi nilai, risiko akademik, audit compliance, dan deployment readiness tanpa perlu masuk ke proses operasional harian.</p><div class="hero-actions"><button class="primary" data-page="executive-stats">Lihat Statistik</button><button class="secondary" data-page="executive-ai">Executive AI</button></div></div><div class="hero-score"><div class="score-ring"><div><b>91</b><span>Campus</span></div></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('◎','Rata-rata IPK',avgIpk,'Baik')}${metricCard('◉','Rata-rata Hadir',`${avgAttend}%`,statusText(avgAttend))}${metricCard('⚠','Risiko Tinggi',state.students.filter((s) => s.risk === 'Tinggi').length,'Mahasiswa')}${metricCard('SEC','Compliance','94%','Audit safe')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Tren Kinerja Akademik</h3><p>Simulasi semester berjalan.</p></div></div>${lineChart([78, 80, 82, 85, 87, 89, 91])}</div><div class="card"><div class="card-head"><div><h3>Distribusi Risiko</h3><p>Kategori mahasiswa.</p></div></div>${donut(91, [['Rendah', state.students.filter((s) => s.risk === 'Rendah').length * 10], ['Sedang', state.students.filter((s) => s.risk === 'Sedang').length * 10], ['Tinggi', state.students.filter((s) => s.risk === 'Tinggi').length * 10]])}</div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Kelas Perlu Perhatian</h3><p>Berdasarkan health score.</p></div></div>${courseMiniList(state.courses.slice().sort((a,b) => a.health - b.health).slice(0,5))}</div><div class="card"><div class="card-head"><div><h3>Executive Insight</h3><p>Ringkasan keputusan cepat.</p></div></div>${activityList([['Prioritas 1','Pantau mata kuliah dengan health score di bawah 80.'],['Prioritas 2','Dorong penyelesaian tugas aktif sebelum UTS.'],['Prioritas 3','Pertahankan audit log dan backup otomatis.']])}</div></section>
  `);
}

function renderClasses() {
  $('#content').innerHTML = pageShell('Kelas & Perkuliahan', 'Daftar mata kuliah aktif dengan progress, jadwal, dosen, dan health score.', `<button class="small-btn" data-page="krs">Lihat KRS</button><button class="small-btn" data-page="calendar">Kalender</button>`, `
    <section class="grid grid-3">${state.courses.map(courseCard).join('')}</section>
  `);
}

function renderCourseDetail() {
  const course = getSelectedCourse();
  $('#content').innerHTML = pageShell('Detail Kelas', 'Ruang kelas digital dengan ringkasan, materi, tugas, peserta, presensi, dan nilai.', roleDetailActions(), `
    <section class="card hero-panel"><div><span class="capsule">${esc(course.code)}</span><h2>${esc(course.title)}</h2><p>${esc(course.material)}. Dosen: ${esc(course.lecturer)}. Jadwal ${course.day}, ${course.start} - ${course.end} di ${course.room}.</p><div class="hero-actions"><button class="primary" data-page="documents">Materi</button><button class="secondary" data-page="assignments">Tugas</button></div></div><div class="hero-score"><div class="score-ring"><div><b>${course.health}</b><span>Class</span></div></div></div></section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Ringkasan Kelas</h3><p>Progress, presensi, dan kesiapan.</p></div></div>${barList([['Progress Pertemuan', course.progress], ['Kehadiran', Math.round(course.attended/course.total*100)], ['Health Score', course.health], ['Materi Siap', 86]])}</div><div class="card"><div class="card-head"><div><h3>Tugas Kelas</h3><p>Tugas terkait mata kuliah.</p></div></div>${taskList(state.tasks.filter((t) => t.courseId === course.id))}</div><div class="card"><div class="card-head"><div><h3>Peserta Aktif</h3><p>Mahasiswa kelas.</p></div></div>${studentList(state.students.slice(0,5))}</div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Materi Terbaru</h3><p>Dokumen dan bahan ajar.</p></div></div>${docList(seedDocuments.slice(0,4))}</div><div class="card"><div class="card-head"><div><h3>Diskusi dan Aktivitas</h3><p>Update kelas terbaru.</p></div></div>${activityList([['Materi baru diunggah', course.material], ['Diskusi aktif', '3 mahasiswa memberi respons'], ['Presensi terakhir', 'Sesi terakhir sudah tersimpan'], ['AI Insight', 'Kelas berada pada kategori ' + course.status]])}</div></section>
  `);
}

function roleDetailActions() {
  if (state.currentRole === 'Dosen') return `<button class="small-btn" data-action="open-task-modal">Buat Tugas</button><button class="small-btn" data-page="lecturer-attendance">Isi Presensi</button><button class="small-btn" data-page="lecturer-grades">Input Nilai</button>`;
  if (state.currentRole === 'Administrator') return `<button class="small-btn" data-action="open-course-modal">Tambah MK</button><button class="small-btn" data-page="admin-courses">Master MK</button>`;
  return `<button class="small-btn" data-page="documents">Materi</button><button class="small-btn" data-page="messages">Diskusi</button>`;
}

function renderKrs() {
  const sks = sum(state.courses.map((c) => c.sks));
  $('#content').innerHTML = pageShell('KRS & Jadwal', 'Simulasi KRS, validasi beban SKS, dan jadwal mingguan.', `<button class="small-btn" data-action="validate-krs">Validasi KRS</button><button class="small-btn" data-action="download-snapshot">Export Snapshot</button>`, `
    <section class="grid grid-4">${metricCard('SKS','Total SKS',sks,'Maksimal 24')}${metricCard('▦','Mata Kuliah',state.courses.length,'Aktif')}${metricCard('✓','Status KRS','Disetujui','DPA')}${metricCard('!','Bentrok','0','Jadwal aman')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Jadwal Mingguan</h3><p>Compact weekly calendar.</p></div></div><div class="table-wrap">${weeklyCalendar()}</div></div><div class="card"><div class="card-head"><div><h3>Daftar KRS</h3><p>Mata kuliah diambil.</p></div></div>${courseMiniList(state.courses)}</div></section>
  `);
}

function renderGrades() {
  const rows = state.courses.map((c, idx) => ({ code: c.code, title: c.title, sks: c.sks, angka: 82 + (idx % 5) * 3, huruf: ['A','A-','B+','A','B+'][idx % 5] }));
  $('#content').innerHTML = pageShell('Nilai & KHS', 'Ringkasan nilai, IP semester, IPK, KHS, dan transkrip.', `<button class="small-btn" data-action="download-snapshot">Unduh KHS</button>`, `
    <section class="grid grid-4">${metricCard('IP','IP Semester','3.82','Sangat baik')}${metricCard('IPK','IPK','3.88','Stabil')}${metricCard('SKS','SKS Lulus','21','Semester ini')}${metricCard('◎','Dominan Nilai','A-','Kinerja baik')}</section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card span-2"><div class="card-head"><div><h3>Tabel Nilai Semester</h3><p>KHS sementara.</p></div></div>${gradeTable(rows)}</div><div class="card"><div class="card-head"><div><h3>Distribusi Nilai</h3><p>Komposisi nilai huruf.</p></div></div>${donut(88, [['A',40],['A-',30],['B+',20],['B',10]])}</div></section>
  `);
}

function renderAttendance() {
  $('#content').innerHTML = pageShell('Kehadiran Saya', 'Status presensi per mata kuliah dan batas minimum 75%.', `<button class="small-btn" data-action="download-snapshot">Export Presensi</button>`, `
    <section class="grid grid-4">${metricCard('✓','Hadir','92%','Aman')}${metricCard('I','Izin','4%','Normal')}${metricCard('S','Sakit','2%','Tercatat')}${metricCard('A','Alfa','2%','Rendah')}</section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Rekap per Mata Kuliah</h3><p>Progres presensi.</p></div></div>${barList(state.courses.map((c) => [shortCourse(c.title), Math.round(c.attended/c.total*100)]))}</div><div class="card"><div class="card-head"><div><h3>Riwayat Presensi</h3><p>Sesi terbaru.</p></div></div>${attendanceHistory()}</div></section>
  `);
}

function renderAssignments() {
  $('#content').innerHTML = pageShell('Tugas & Ujian', 'Daftar tugas, kuis, ujian, status pengumpulan, dan deadline.', `<button class="small-btn" data-page="ai">Tanya AI</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Tugas Aktif</h3><p>Semua mata kuliah.</p></div></div>${taskTable()}</div><div class="card"><div class="card-head"><div><h3>Deadline Radar</h3><p>Urutan prioritas.</p></div></div>${taskList(state.tasks)}</div></section>
  `);
}

function renderDocuments() {
  $('#content').innerHTML = pageShell('Dokumen Akademik', 'Repositori dokumen akademik, SOP, silabus, template, dan lampiran.', `<button class="small-btn" data-action="upload-doc">Upload Simulasi</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Dokumen Tersedia</h3><p>Pencarian dan preview dokumen.</p></div></div>${docList(state.documents)}</div><div class="card"><div class="card-head"><div><h3>Document Intelligence</h3><p>Ringkasan metadata.</p></div></div>${activityList([['Total dokumen', `${state.documents.length} dokumen akademik`], ['Format', 'PDF, DOCX, XLSX'], ['RAG Ready', 'Metadata dan tag tersedia'], ['Audit', 'Upload dan akses tercatat']])}</div></section>
  `);
}

function renderAnalytics() {
  $('#content').innerHTML = pageShell('Analitik Akademik', 'Grafik performa akademik, presensi, nilai, dan aktivitas sistem.', `<button class="small-btn" data-action="refresh-analytics">Refresh</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Academic Performance Trend</h3><p>Tren mingguan.</p></div></div>${lineChart([72,76,79,81,84,88,91,93])}</div><div class="card"><div class="card-head"><div><h3>Distribusi Status</h3><p>Role dan entitas.</p></div></div>${donut(92, [['Mahasiswa', 50], ['Dosen', 20], ['Admin', 10], ['Pimpinan', 5]])}</div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Audit Heatmap</h3><p>Aktivitas 14 hari x 5 slot.</p></div></div>${heatmap()}</div><div class="card"><div class="card-head"><div><h3>KPI Mata Kuliah</h3><p>Health score.</p></div></div>${barList(state.courses.map((c) => [shortCourse(c.title), c.health]))}</div></section>
  `);
}

function renderAI() {
  const prompts = state.currentRole === 'Dosen' ? ['Buat instruksi tugas untuk kelas SBDM', 'Siapa mahasiswa yang perlu perhatian?', 'Buat rubrik penilaian tugas AI'] : ['Apa prioritas akademik saya?', 'Kapan deadline tugas terdekat?', 'Bagaimana status KRS saya?', 'Apa mata kuliah yang perlu diperhatikan?'];
  $('#content').innerHTML = pageShell('Asisten Akademik AI', 'Chat simulasi berbasis data lokal, role, mata kuliah, tugas, presensi, dan dokumen.', '', `
    <section class="chat-layout"><div class="grid"><div class="card"><div class="card-head"><div><h3>Saran Pertanyaan</h3><p>Quick prompt sesuai role.</p></div></div><div class="quick-actions">${prompts.map((q) => `<button class="quick-action" data-action="ask-ai" data-question="${esc(q)}"><i>AI</i><b>${esc(q)}</b><span>Klik untuk bertanya</span></button>`).join('')}</div></div><div class="card"><div class="card-head"><div><h3>Insight Otomatis</h3><p>Rekomendasi cepat.</p></div></div>${activityList(aiInsights())}</div></div><div class="card chat-window"><div class="card-head"><div><h3>Chat</h3><p>Respons simulasi berbasis role dan data portal.</p></div></div><div id="chatMessages" class="chat-messages"><div class="bubble">Halo ${esc(state.currentRole)}. Saya siap membantu aktivitas akademik Anda.</div></div><div class="chat-input-row"><input id="chatInput" class="form-control" placeholder="Tulis pertanyaan..." /><button class="primary" data-action="send-chat">Kirim</button></div></div></section>
  `);
}

function renderRAG() {
  $('#content').innerHTML = pageShell('Academic Search / RAG', 'Pencarian dokumen akademik dengan jawaban bersumber dan metadata.', `<button class="small-btn" data-action="rag-search">Cari</button>`, `
    <section class="grid grid-3"><div class="card"><div class="card-head"><div><h3>Query</h3><p>Cari di dokumen akademik.</p></div></div><input id="ragInput" class="form-control" value="Apa syarat mengikuti UAS?" /><div class="hero-actions"><button class="primary" data-action="rag-search">Search/RAG</button></div></div><div class="card span-2"><div class="card-head"><div><h3>Hasil Jawaban</h3><p>Jawaban dan sumber.</p></div></div><div id="ragResult">${ragAnswer('Apa syarat mengikuti UAS?')}</div></div></section>
  `);
}

function renderMessages() {
  $('#content').innerHTML = pageShell('Pesan', 'Kotak masuk dan simulasi pengiriman pesan antar role.', `<button class="small-btn" data-action="compose-message">Tulis Pesan</button>`, `
    <section class="grid grid-2"><div class="card"><div class="card-head"><div><h3>Kotak Masuk</h3><p>Pesan role-based.</p></div></div><div class="message-list">${state.messages.map(messageItem).join('')}</div></div><div class="card"><div class="card-head"><div><h3>Kirim Pesan</h3><p>Simulasi pesan lokal.</p></div></div>${messageForm()}</div></section>
  `);
}

function renderCalendar() {
  $('#content').innerHTML = pageShell('Kalender Akademik', 'Agenda kuliah, tugas, rapat, dan kegiatan akademik.', `<button class="small-btn" data-action="add-event-modal">Tambah Agenda</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Agenda Akademik</h3><p>Timeline agenda penting.</p></div></div>${eventTimeline()}</div><div class="card"><div class="card-head"><div><h3>Ringkasan Kalender</h3><p>Jenis kegiatan.</p></div></div>${donut(76, [['Kuliah', 40], ['Tugas', 25], ['Rapat', 20], ['Akademik', 15]])}</div></section>
  `);
}

function renderProfile() {
  const roleText = roleDescription(state.currentRole);
  $('#content').innerHTML = pageShell('Profil', 'Identitas pengguna, role, hak akses, dan ringkasan aktivitas.', `<button class="small-btn" data-action="edit-profile">Edit Profil</button>`, `
    <section class="card"><div class="profile-grid"><div class="avatar" style="width:76px;height:76px;font-size:24px">${esc(state.currentUser.avatar || initials(state.currentUser.name))}</div><div><h2 style="margin:0">${esc(state.currentUser.name)}</h2><p style="color:var(--muted);margin:6px 0 0">${esc(state.currentUser.code)} • ${esc(state.currentRole)}</p><p style="max-width:760px;line-height:1.65;color:var(--muted)">${roleText}</p></div><span class="role-chip">${esc(state.currentRole)}</span></div></section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Hak Akses</h3><p>Menu aktif role.</p></div></div>${activityList(flattenNav().slice(0,8).map((n) => [n.text, `Akses halaman ${n.page}`]))}</div><div class="card"><div class="card-head"><div><h3>Audit Saya</h3><p>Aktivitas terbaru.</p></div></div>${auditList(state.auditLogs.filter((l) => l.user === state.currentUser.name).slice(0,5))}</div><div class="card"><div class="card-head"><div><h3>Pengaturan Cepat</h3><p>Preferensi akun.</p></div></div>${settingsMini()}</div></section>
  `);
}

function renderSettings() {
  $('#content').innerHTML = pageShell('Pengaturan', 'Preferensi tampilan, notifikasi, keamanan, dan data lokal.', `<button class="small-btn" data-action="save-settings">Simpan Pengaturan</button>`, `
    <section class="grid grid-2"><div class="card"><div class="card-head"><div><h3>Preferensi UI</h3><p>Mode visual dan density.</p></div></div>${settingsRow('Mode terang / gelap','Sinkron dengan tombol tema.', state.settings.theme === 'light', 'theme')}${settingsRow('Animasi dashboard','Aktifkan transisi, chart animation, particle.', state.settings.animation, 'animation')}${settingsRow('Compact density','Tampilkan layout padat dan informatif.', state.settings.compact, 'compact')}</div><div class="card"><div class="card-head"><div><h3>Keamanan & Sistem</h3><p>Notifikasi, audit, backup, reset data.</p></div></div>${settingsRow('Notifikasi pesan','Tampilkan badge pesan baru.', state.settings.notifications, 'notifications')}${settingsRow('Audit aktivitas','Catat perubahan data penting.', true, 'audit')}${settingsRow('Auto backup lokal','Simpan state di localStorage.', true, 'backup')}<div class="hero-actions"><button class="secondary" data-action="download-snapshot">Export Snapshot</button><button class="ghost" data-action="reset-data">Reset Data</button></div></div></section>
  `);
}

function renderLecturerCourses() { renderClasses(); }

function renderLecturerTasks() {
  $('#content').innerHTML = pageShell('Beri Tugas', 'Dosen dapat membuat, melihat, dan mengelola tugas mata kuliah.', `<button class="small-btn" data-action="open-task-modal">Buat Tugas</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Daftar Tugas</h3><p>Semua tugas tersimpan di localStorage.</p></div></div>${taskTable(true)}</div><div class="card"><div class="card-head"><div><h3>Ringkasan</h3><p>Status tugas.</p></div></div>${donut(72, [['Belum dikumpulkan', state.tasks.filter((t) => t.status !== 'Selesai').length * 20], ['Selesai', state.tasks.filter((t) => t.status === 'Selesai').length * 20]])}</div></section>
  `);
}

function renderLecturerSubmissions() {
  $('#content').innerHTML = pageShell('Pengumpulan Tugas', 'Monitoring status pengumpulan dan penilaian tugas mahasiswa.', `<button class="small-btn" data-action="download-snapshot">Export Rekap</button>`, `
    <section class="card"><div class="card-head"><div><h3>Rekap Pengumpulan</h3><p>Simulasi pengumpulan per mahasiswa.</p></div></div>${submissionTable()}</section>
  `);
}

function renderLecturerAttendance() {
  $('#content').innerHTML = pageShell('Isi Kehadiran Mahasiswa', 'Dosen mencatat hadir, izin, sakit, atau alfa per mahasiswa dan per kelas.', `<button class="small-btn" data-action="save-attendance">Simpan Presensi</button>`, `
    <section class="grid grid-3"><div class="card"><div class="card-head"><div><h3>Pilih Kelas</h3><p>Presensi per pertemuan.</p></div></div><label class="form-label">Mata Kuliah</label><select id="attendanceCourse" class="form-control">${state.courses.map((c) => `<option value="${c.id}" ${c.id === state.selectedCourseId ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select><label class="form-label" style="margin-top:10px">Tanggal</label><input id="attendanceDate" type="date" class="form-control" value="2026-06-22" /><div class="hero-actions"><button class="primary" data-action="save-attendance">Simpan Presensi</button></div></div><div class="card span-2"><div class="card-head"><div><h3>Daftar Mahasiswa</h3><p>Ubah status lalu simpan.</p></div></div>${attendanceForm()}</div></section>
  `);
}

function renderLecturerGrades() {
  $('#content').innerHTML = pageShell('Input Nilai', 'Dosen mengisi UTS, UAS, tugas, dan nilai akhir mahasiswa.', `<button class="small-btn" data-action="save-grades">Simpan Nilai</button>`, `
    <section class="card"><div class="card-head"><div><h3>Input Nilai Mahasiswa</h3><p>Data disimpan di localStorage.</p></div></div>${gradeInputTable()}</section>
  `);
}

function renderLecturerStudents() {
  $('#content').innerHTML = pageShell('Mahasiswa Bimbingan', 'Monitoring presensi, IPK, dan risiko mahasiswa.', `<button class="small-btn" data-page="messages">Kirim Pesan</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Daftar Mahasiswa</h3><p>Mahasiswa aktif semester berjalan.</p></div></div>${studentTable(false)}</div><div class="card"><div class="card-head"><div><h3>Risiko Akademik</h3><p>Prioritas bimbingan.</p></div></div>${studentList(state.students.slice().sort((a,b) => riskValue(b.risk)-riskValue(a.risk)).slice(0,6))}</div></section>
  `);
}

function renderAdminStudents() {
  $('#content').innerHTML = pageShell('Master Mahasiswa', 'Tambah, edit, hapus, dan monitor data mahasiswa.', `<button class="small-btn" data-action="open-student-modal">Tambah Mahasiswa</button>`, `
    <section class="card"><div class="card-head"><div><h3>Data Mahasiswa</h3><p>${state.students.length} mahasiswa tersimpan.</p></div></div>${studentTable(true)}</section>
  `);
}

function renderAdminLecturers() {
  $('#content').innerHTML = pageShell('Master Dosen', 'Tambah dan kelola data dosen pengampu.', `<button class="small-btn" data-action="open-lecturer-modal">Tambah Dosen</button>`, `
    <section class="card"><div class="card-head"><div><h3>Data Dosen</h3><p>${state.lecturers.length} dosen aktif.</p></div></div>${lecturerTable()}</section>
  `);
}

function renderAdminCourses() {
  $('#content').innerHTML = pageShell('Master Mata Kuliah', 'Tambah, edit, hapus, dan monitor mata kuliah aktif.', `<button class="small-btn" data-action="open-course-modal">Tambah Mata Kuliah</button>`, `
    <section class="card"><div class="card-head"><div><h3>Data Mata Kuliah</h3><p>${state.courses.length} mata kuliah aktif.</p></div></div>${courseTable(true)}</section>
  `);
}

function renderAdminUsers() {
  $('#content').innerHTML = pageShell('Kelola User & Role', 'Simulasi RBAC untuk Mahasiswa, Dosen, Administrator, dan Pimpinan.', `<button class="small-btn" data-action="add-user-modal">Tambah User</button>`, `
    <section class="grid grid-2"><div class="card"><div class="card-head"><div><h3>User Demo</h3><p>Akun pengujian role.</p></div></div>${userTable()}</div><div class="card"><div class="card-head"><div><h3>Access Matrix</h3><p>Hak akses inti.</p></div></div>${accessMatrix()}</div></section>
  `);
}

function renderDataPipeline() {
  $('#content').innerHTML = pageShell('Data Pipeline', 'Ingest, validate, transform, load, dan audit data akademik.', `<button class="small-btn" data-action="simulate-pipeline">Jalankan Pipeline</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Pipeline Builder</h3><p>Simulasi 6 dataset akademik.</p></div></div>${pipelineSteps()}<div id="pipelineResult" style="margin-top:14px">${pipelineResult()}</div></div><div class="card"><div class="card-head"><div><h3>Data Quality Score</h3><p>Status validasi.</p></div></div>${donut(96, [['Success', 96], ['Warning', 4]])}</div></section>
  `);
}

function renderAudit() {
  $('#content').innerHTML = pageShell('Audit Log', 'Seluruh aktivitas penting dicatat otomatis.', `<button class="small-btn" data-action="download-snapshot">Export Audit</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Log Aktivitas</h3><p>${state.auditLogs.length} log terbaru.</p></div></div>${auditTable()}</div><div class="card"><div class="card-head"><div><h3>Audit Heatmap</h3><p>Intensitas aktivitas.</p></div></div>${heatmap()}</div></section>
  `);
}

function renderGovernance() {
  $('#content').innerHTML = pageShell('Security & Governance', 'RBAC, masking, audit, backup, dan compliance checklist.', `<button class="small-btn" data-action="run-compliance">Run Compliance</button>`, `
    <section class="grid grid-3"><div class="card"><div class="card-head"><div><h3>RBAC</h3><p>Role-based access control.</p></div></div>${activityList([['Mahasiswa','Read personal data, submit tugas'],['Dosen','Create tugas, presensi, nilai'],['Administrator','CRUD master data dan sistem'],['Pimpinan','Read executive reports']])}</div><div class="card"><div class="card-head"><div><h3>Checklist</h3><p>Governance readiness.</p></div></div>${barList([['RBAC', 100], ['Audit Log', 96], ['Masking', 88], ['Backup', 92], ['DR Plan', 84]])}</div><div class="card"><div class="card-head"><div><h3>Risk Control</h3><p>Kontrol keamanan.</p></div></div>${activityList([['Data masking','NIM dapat disamarkan pada mode publik.'],['Audit trail','Aksi CRUD tercatat otomatis.'],['Backup','Snapshot JSON tersedia.'],['Least privilege','Menu mengikuti role.']])}</div></section>
  `);
}

function renderDeployment() {
  $('#content').innerHTML = pageShell('Deployment Decision', 'Perbandingan local, cloud, hybrid, dan production readiness.', `<button class="small-btn" data-action="deployment-check">Check Readiness</button>`, `
    <section class="grid grid-4">${deploymentCard('Local Static','Demo offline cepat','Aktif',82)}${deploymentCard('Cloud Static','GitHub Pages / Netlify','Siap',88)}${deploymentCard('Hybrid','Frontend cloud + backend kampus','Direkomendasikan',94)}${deploymentCard('Production','API, DB, SSO, RBAC penuh','Tahap lanjut',76)}</section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Readiness Canvas</h3><p>Aspek teknis.</p></div></div>${barList([['UI/UX', 97], ['Functionality', 94], ['RBAC', 92], ['Audit', 91], ['Backend Ready', 72], ['Security', 85]])}</div><div class="card"><div class="card-head"><div><h3>ADR</h3><p>Architecture decision record.</p></div></div>${activityList([['Keputusan','Gunakan prototipe front-end offline untuk demo akademik.'],['Produksi','Migrasi ke Laravel/Node + PostgreSQL + SSO.'],['Deployment','Hybrid lebih sesuai untuk data kampus.']])}</div></section>
  `);
}

function renderExecutiveStats() { renderAnalytics(); }

function renderExecutiveGrades() {
  $('#content').innerHTML = pageShell('Rekap Nilai', 'Ringkasan distribusi nilai dan performa kelas.', `<button class="small-btn" data-action="download-snapshot">Export Rekap</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Rata-rata Nilai per Kelas</h3><p>Simulasi nilai akhir.</p></div></div>${barChart(state.courses.map((c,i) => [shortCourse(c.title), 80 + (i % 5) * 3]))}</div><div class="card"><div class="card-head"><div><h3>Distribusi Nilai</h3><p>Komposisi nilai huruf.</p></div></div>${donut(86, [['A', 35], ['A-', 30], ['B+', 20], ['B', 10], ['C', 5]])}</div></section>
  `);
}

function renderExecutiveAttendance() {
  $('#content').innerHTML = pageShell('Rekap Kehadiran', 'Monitoring kehadiran kelas dan mahasiswa.', `<button class="small-btn" data-action="download-snapshot">Export Kehadiran</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Kehadiran per Mata Kuliah</h3><p>Target minimal 75%.</p></div></div>${barChart(state.courses.map((c) => [shortCourse(c.title), Math.round(c.attended/c.total*100)]))}</div><div class="card"><div class="card-head"><div><h3>Mahasiswa Presensi Rendah</h3><p>Prioritas intervensi.</p></div></div>${studentList(state.students.slice().sort((a,b) => a.attendance-b.attendance).slice(0,5))}</div></section>
  `);
}

function renderRisk() {
  const low = state.students.filter((s) => s.risk === 'Rendah').length;
  const med = state.students.filter((s) => s.risk === 'Sedang').length;
  const high = state.students.filter((s) => s.risk === 'Tinggi').length;
  $('#content').innerHTML = pageShell('Risiko Akademik', 'Deteksi dini mahasiswa dan kelas yang membutuhkan intervensi.', `<button class="small-btn" data-action="risk-refresh">Refresh Risiko</button>`, `
    <section class="risk-grid"><div class="risk-card"><b>${low}</b><span>Risiko Rendah</span></div><div class="risk-card"><b>${med}</b><span>Risiko Sedang</span></div><div class="risk-card"><b>${high}</b><span>Risiko Tinggi</span></div><div class="risk-card"><b>${state.courses.filter((c) => c.health < 80).length}</b><span>Kelas Perhatian</span></div><div class="risk-card"><b>91</b><span>Campus Score</span></div></section>
    <section class="grid grid-2" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Mahasiswa Berisiko</h3><p>Urutan prioritas.</p></div></div>${studentList(state.students.slice().sort((a,b)=>riskValue(b.risk)-riskValue(a.risk) || a.attendance-b.attendance))}</div><div class="card"><div class="card-head"><div><h3>Strategi Intervensi</h3><p>Rekomendasi pimpinan.</p></div></div>${activityList([['Presensi rendah','Dorong reminder otomatis dan wali akademik.'],['IPK turun','Aktifkan bimbingan dan kelas remedial.'],['Kelas health <80','Evaluasi beban tugas dan metode pengajaran.']])}</div></section>
  `);
}

function renderCompliance() { renderGovernance(); }
function renderExecutiveAI() { renderAI(); }

function renderNotFound() {
  $('#content').innerHTML = pageShell('Halaman Tidak Ditemukan', 'Menu tidak tersedia untuk role aktif.', '', `<div class="card empty-state">Pilih menu lain dari sidebar.</div>`);
}

function metricCard(icon, label, value, trend) {
  return `<article class="card metric-card"><div class="metric-icon">${icon}</div><div><div class="metric-value">${esc(value)}</div><div class="metric-label">${esc(label)}</div><div class="metric-trend">${esc(trend)}</div></div></article>`;
}

function quickActions(items) {
  return `<div class="quick-actions">${items.map(([icon, title, page]) => `<button class="quick-action" data-page="${page}"><i>${icon}</i><b>${esc(title)}</b><span>Buka fitur</span></button>`).join('')}</div>`;
}

function courseCard(course) {
  const percent = Math.round(course.attended / course.total * 100);
  return `<article class="card course-card" data-action="select-course" data-course-id="${course.id}"><div class="card-head"><span class="status ${statusClass(course.health)}">${esc(course.status)}</span><span class="status info">${course.sks} SKS</span></div><h3 class="course-title">${esc(course.title)}</h3><div class="course-program">${esc(course.program)} • ${esc(course.code)}</div><div class="course-meta"><span><b>Dosen:</b> ${esc(course.lecturer)}</span><span><b>Jadwal:</b> ${course.day}, ${course.start} - ${course.end}</span><span><b>Metode:</b> ${esc(course.method)}</span></div><div class="bar-track"><i style="width:${clamp(percent)}%"></i></div><div class="course-footer"><span>Kehadiran ${course.attended}/${course.total}</span><b>${percent}%</b></div></article>`;
}

function courseTable(actions = false) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Kode</th><th>Mata Kuliah</th><th>Dosen</th><th>SKS</th><th>Jadwal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${state.courses.map((c) => `<tr><td>${esc(c.code)}</td><td>${esc(c.title)}</td><td>${esc(c.lecturer)}</td><td>${c.sks}</td><td>${c.day}, ${c.start}</td><td><span class="status ${statusClass(c.health)}">${esc(c.status)}</span></td><td>${actions ? `<button class="small-btn" data-action="edit-course" data-course-id="${c.id}">Edit</button> <button class="small-btn" data-action="delete-course" data-course-id="${c.id}">Hapus</button>` : `<button class="small-btn" data-action="select-course" data-course-id="${c.id}">Detail</button>`}</td></tr>`).join('')}</tbody></table></div>`;
}

function studentTable(actions = false) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>NIM</th><th>Nama</th><th>Prodi</th><th>IPK</th><th>Presensi</th><th>Risiko</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${state.students.map((s) => `<tr><td>${s.nim}</td><td>${esc(s.name)}</td><td>${esc(s.prodi)}</td><td>${Number(s.ipk).toFixed(2)}</td><td>${s.attendance}%</td><td><span class="status ${riskClass(s.risk)}">${s.risk}</span></td><td><span class="status success">${s.status}</span></td><td>${actions ? `<button class="small-btn" data-action="edit-student" data-nim="${s.nim}">Edit</button> <button class="small-btn" data-action="delete-student" data-nim="${s.nim}">Hapus</button>` : `<button class="small-btn" data-page="messages">Pesan</button>`}</td></tr>`).join('')}</tbody></table></div>`;
}

function lecturerTable() {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Nama</th><th>NIDN</th><th>Prodi</th><th>Email</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${state.lecturers.map((d) => `<tr><td>${d.id}</td><td>${esc(d.name)}</td><td>${esc(d.nidn)}</td><td>${esc(d.prodi)}</td><td>${esc(d.email)}</td><td><span class="status success">${d.status}</span></td><td><button class="small-btn" data-action="edit-lecturer" data-id="${d.id}">Edit</button> <button class="small-btn" data-action="delete-lecturer" data-id="${d.id}">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
}

function gradeInputTable() {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>NIM</th><th>Nama</th><th>UTS</th><th>UAS</th><th>Tugas</th><th>Final</th><th>Predikat</th></tr></thead><tbody>${state.students.map((s) => { const g = state.grades[s.nim] || { uts: 0, uas: 0, tugas: 0, final: 0 }; return `<tr><td>${s.nim}</td><td>${esc(s.name)}</td><td><input class="form-control grade-input" data-nim="${s.nim}" data-field="uts" type="number" value="${g.uts}"></td><td><input class="form-control grade-input" data-nim="${s.nim}" data-field="uas" type="number" value="${g.uas}"></td><td><input class="form-control grade-input" data-nim="${s.nim}" data-field="tugas" type="number" value="${g.tugas}"></td><td><input class="form-control grade-input" data-nim="${s.nim}" data-field="final" type="number" value="${g.final}"></td><td><span class="status ${statusClass(g.final)}">${letter(g.final)}</span></td></tr>`; }).join('')}</tbody></table></div>`;
}

function gradeTable(rows) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Kode</th><th>Mata Kuliah</th><th>SKS</th><th>Nilai Angka</th><th>Nilai Huruf</th><th>Status</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.code}</td><td>${esc(r.title)}</td><td>${r.sks}</td><td>${r.angka}</td><td>${r.huruf}</td><td><span class="status success">Lulus</span></td></tr>`).join('')}</tbody></table></div>`;
}

function attendanceForm() {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>NIM</th><th>Nama</th><th>Status</th><th>Catatan</th></tr></thead><tbody>${state.students.map((s) => `<tr><td>${s.nim}</td><td>${esc(s.name)}</td><td><select class="form-control attendance-status" data-nim="${s.nim}"><option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alfa</option></select></td><td><input class="form-control attendance-note" data-nim="${s.nim}" placeholder="Catatan opsional"></td></tr>`).join('')}</tbody></table></div>`;
}

function attendanceHistory() {
  const items = state.courses.slice(0, 6).map((c) => [`${c.title}`, `${c.day}, ${c.start} • Hadir ${Math.round(c.attended/c.total*100)}%`]);
  return activityList(items);
}

function taskTable(lecturerMode = false) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Mata Kuliah</th><th>Tugas</th><th>Tipe</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${state.tasks.map((t) => { const c = state.courses.find((x) => x.id === t.courseId); return `<tr><td>${t.id}</td><td>${esc(c?.code || '-')}</td><td>${esc(t.title)}</td><td>${esc(t.type)}</td><td>${esc(t.deadline)}</td><td><span class="status ${t.status === 'Selesai' ? 'success' : 'warning'}">${esc(t.status)}</span></td><td>${lecturerMode ? `<button class="small-btn" data-action="delete-task" data-id="${t.id}">Hapus</button>` : `<button class="small-btn" data-action="submit-task" data-id="${t.id}">Kumpulkan</button>`}</td></tr>`; }).join('')}</tbody></table></div>`;
}

function submissionTable() {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Mahasiswa</th><th>Tugas</th><th>Status</th><th>Nilai</th><th>Aksi</th></tr></thead><tbody>${state.students.slice(0, 8).map((s, i) => { const t = state.tasks[i % state.tasks.length]; const done = i % 3 !== 0; return `<tr><td>${esc(s.name)}</td><td>${esc(t.title)}</td><td><span class="status ${done ? 'success' : 'warning'}">${done ? 'Terkumpul' : 'Belum'}</span></td><td>${done ? 78 + i * 2 : '-'}</td><td><button class="small-btn" data-page="lecturer-grades">Nilai</button></td></tr>`; }).join('')}</tbody></table></div>`;
}

function userTable() {
  const rows = Object.values(accounts);
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Username</th><th>Nama</th><th>Kode</th><th>Role</th><th>Status</th></tr></thead><tbody>${rows.map((u) => `<tr><td>${u.username}</td><td>${esc(u.name)}</td><td>${esc(u.code)}</td><td>${u.role}</td><td><span class="status success">Aktif</span></td></tr>`).join('')}</tbody></table></div>`;
}

function accessMatrix() {
  const rows = [['Mahasiswa','Read personal, submit tugas, chat AI'],['Dosen','Create tugas, write presensi, input nilai'],['Administrator','CRUD master, RBAC, pipeline, audit'],['Pimpinan','Read executive, compliance, strategic insight']];
  return activityList(rows);
}

function messageForm() {
  return `<form id="messageForm" class="form-grid"><div><label class="form-label">Kepada</label><select name="to" class="form-control"><option>Mahasiswa</option><option>Dosen</option><option>Administrator</option><option>Pimpinan</option></select></div><div><label class="form-label">Judul</label><input name="title" class="form-control" value="Informasi Akademik"></div><div class="full"><label class="form-label">Isi Pesan</label><textarea name="body" class="form-control" rows="6">Mohon cek informasi akademik terbaru di portal.</textarea></div><div class="full form-actions"><button class="secondary" type="reset">Reset</button><button class="primary" type="submit">Kirim Pesan</button></div></form>`;
}

function eventTimeline() {
  return `<div class="activity-list">${state.events.map((e) => `<div class="activity-item"><span class="activity-icon">${e.type.slice(0,2).toUpperCase()}</span><div class="item-body"><b>${esc(e.title)}</b><small>${esc(e.date)} • ${esc(e.time)} • ${esc(e.type)}</small></div><button class="small-btn" data-action="delete-event" data-id="${e.id}">Hapus</button></div>`).join('')}</div>`;
}

function docList(docs) {
  return `<div class="doc-list">${docs.map((d) => `<div class="doc-item"><span class="activity-icon">${esc(d.type)}</span><div class="item-body"><b>${esc(d.title)}</b><small>${esc(d.tags)}<br>Sumber: ${esc(d.source)}</small></div><button class="small-btn" data-action="preview-doc" data-id="${d.id}">Preview</button></div>`).join('')}</div>`;
}

function taskList(tasks) {
  if (!tasks.length) return `<div class="empty-state">Tidak ada tugas.</div>`;
  return `<div class="task-list">${tasks.map((t) => `<div class="task-item"><span class="activity-icon">${esc(t.type.slice(0,2).toUpperCase())}</span><div class="item-body"><b>${esc(t.title)}</b><small>${esc(t.deadline)} • ${esc(t.instruction || '')}</small></div><span class="status ${t.status === 'Selesai' ? 'success' : 'warning'}">${esc(t.status)}</span></div>`).join('')}</div>`;
}

function studentList(students) {
  return `<div class="student-list">${students.map((s) => `<div class="student-item"><span class="activity-icon">${initials(s.name)}</span><div class="item-body"><b>${esc(s.name)}</b><small>${s.nim} • IPK ${Number(s.ipk).toFixed(2)} • Presensi ${s.attendance}%</small></div><span class="status ${riskClass(s.risk)}">${s.risk}</span></div>`).join('')}</div>`;
}

function messageItem(m) {
  return `<div class="message-item"><span class="activity-icon">✉</span><div class="item-body"><b>${esc(m.title)}</b><small>Dari ${esc(m.from)} ke ${esc(m.to)} • ${m.time}<br>${esc(m.body)}</small></div><span class="status ${m.unread ? 'info' : 'neutral'}">${m.unread ? 'Baru' : 'Dibaca'}</span></div>`;
}

function activityList(items) {
  if (!items.length) return `<div class="empty-state">Belum ada aktivitas.</div>`;
  return `<div class="activity-list">${items.map(([title, desc], i) => `<div class="activity-item"><span class="activity-icon">${i + 1}</span><div class="item-body"><b>${esc(title)}</b><small>${esc(desc)}</small></div></div>`).join('')}</div>`;
}

function auditList(logs) {
  if (!logs.length) return `<div class="empty-state">Audit log masih kosong.</div>`;
  return `<div class="activity-list">${logs.map((l) => `<div class="activity-item"><span class="activity-icon">LOG</span><div class="item-body"><b>${esc(l.action)}</b><small>${esc(l.detail)}<br>${esc(l.user)} • ${esc(l.role)} • ${esc(l.time)}</small></div></div>`).join('')}</div>`;
}

function auditTable() {
  if (!state.auditLogs.length) return `<div class="empty-state">Audit log masih kosong. Lakukan aksi seperti tambah mahasiswa atau login role.</div>`;
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Waktu</th><th>User</th><th>Role</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>${state.auditLogs.map((l) => `<tr><td>${esc(l.time)}</td><td>${esc(l.user)}</td><td>${esc(l.role)}</td><td>${esc(l.action)}</td><td>${esc(l.detail)}</td></tr>`).join('')}</tbody></table></div>`;
}

function courseMiniList(courses = state.courses) {
  return `<div class="activity-list">${courses.map((c) => `<button class="activity-item" data-action="select-course" data-course-id="${c.id}" style="width:100%;color:var(--text);text-align:left"><span class="activity-icon">${c.sks}</span><div class="item-body"><b>${esc(c.title)}</b><small>${c.code} • ${c.day}, ${c.start} • ${c.room}</small></div><span class="status ${statusClass(c.health)}">${c.health}</span></button>`).join('')}</div>`;
}

function weeklyCalendar() {
  const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const times = ['07:00','08:00','09:00','10:00','11:00','13:00','14:00','15:00'];
  let html = '<div class="weekly-calendar"><div class="cal-head">Jam</div>' + days.map((d) => `<div class="cal-head">${d}</div>`).join('');
  times.forEach((time) => {
    html += `<div class="cal-time">${time}</div>`;
    days.forEach((day) => {
      const c = state.courses.find((x) => x.day === day && x.start.startsWith(time.slice(0, 2)));
      html += `<div class="cal-cell">${c ? `<div class="cal-block"><b>${esc(shortCourse(c.title))}</b><br>${esc(c.room)}</div>` : ''}</div>`;
    });
  });
  html += '</div>';
  return html;
}

function barChart(items) {
  const max = Math.max(...items.map(([,v]) => Number(v)), 100);
  return `<div class="chart-bars">${items.map(([label, value]) => `<div class="chart-col"><div class="chart-bar" style="height:${Math.max(8, Number(value) / max * 180)}px" title="${esc(label)}: ${value}"></div><div class="chart-label">${esc(label)}</div></div>`).join('')}</div>`;
}

function lineChart(values) {
  const w = 720, h = 210, pad = 24;
  const min = Math.min(...values) - 4, max = Math.max(...values) + 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return `<div class="line-chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(59,226,255,.25)"/><stop offset="1" stop-color="rgba(59,226,255,0)"/></linearGradient></defs><polyline points="${pts}"></polyline></svg></div>`;
}

function donut(score, legends) {
  const safe = clamp(score);
  return `<div class="donut-wrap"><div class="donut" style="background:conic-gradient(var(--green) 0 ${safe}%, rgba(255,255,255,.11) ${safe}% 100%)"><b>${safe}</b></div><div class="legend-list">${legends.map(([name, value]) => `<div class="legend-row"><span>${esc(name)}</span><b>${esc(value)}${typeof value === 'number' ? '%' : ''}</b></div>`).join('')}</div></div>`;
}

function barList(items) {
  return `<div class="activity-list">${items.map(([label, value]) => `<div><div style="display:flex;justify-content:space-between;font-size:11px;margin:9px 0 6px"><b>${esc(label)}</b><span>${value}%</span></div><div class="progress-line"><i style="width:${clamp(value)}%"></i></div></div>`).join('')}</div>`;
}

function heatmap() {
  return `<div class="heatmap">${Array.from({ length: 70 }, (_, i) => `<span class="heat-cell l${(i * 7 + 3) % 5}"></span>`).join('')}</div>`;
}

function gradeInputValue(nim, field) { return state.grades[nim]?.[field] ?? 0; }
function letter(score) { if (score >= 85) return 'A'; if (score >= 80) return 'A-'; if (score >= 75) return 'B+'; if (score >= 70) return 'B'; if (score >= 60) return 'C'; return 'D'; }
function statusText(value) { return value >= 85 ? 'Sangat baik' : value >= 75 ? 'Aman' : 'Perlu perhatian'; }
function statusClass(value) { const n = Number(value); if (Number.isFinite(n)) return n >= 85 ? 'success' : n >= 75 ? 'warning' : 'danger'; return value === 'Aktif' ? 'success' : 'warning'; }
function riskClass(risk) { return risk === 'Rendah' ? 'success' : risk === 'Sedang' ? 'warning' : 'danger'; }
function riskValue(risk) { return { Rendah: 1, Sedang: 2, Tinggi: 3 }[risk] || 0; }
function avg(values) { return values.length ? sum(values) / values.length : 0; }
function sum(values) { return values.reduce((a,b) => a + Number(b || 0), 0); }
function averageFinal() { return Math.round(avg(Object.values(state.grades).map((g) => Number(g.final || 0)))); }
function shortCourse(title) { return title.replace('Pembelajaran Mendalam Terapan untuk ', 'DL ').replace('Sistem Basis Data Modern dan ', '').replace('Ilmu Komputer Teoretis & ', '').replace('Pembelajaran Mesin untuk ', 'ML ').replace('Infrastruktur ', '').replace('Pengantar ', '').slice(0, 20); }
function getSelectedCourse() { return state.courses.find((c) => c.id === state.selectedCourseId) || state.courses[0]; }

function roleDescription(role) {
  return {
    Mahasiswa: 'Mahasiswa berfokus pada KRS, jadwal, kelas, tugas, presensi, nilai, dokumen, pesan, kalender, dan asisten akademik.',
    Dosen: 'Dosen berfokus pada pengajaran, pembuatan tugas, presensi, input nilai, monitoring mahasiswa, dokumen, dan komunikasi kelas.',
    Administrator: 'Administrator mengelola master data, user, role, pipeline, audit, governance, deployment, dan konfigurasi sistem.',
    Pimpinan: 'Pimpinan memantau statistik akademik, rekap nilai, rekap kehadiran, risiko, compliance, deployment, dan insight eksekutif.'
  }[role] || '';
}

function aiInsights() {
  if (state.currentRole === 'Administrator') return [['Data quality', 'Pipeline stabil. Nilai.csv perlu validasi warning.'], ['RBAC', 'Semua menu mengikuti role aktif.'], ['Audit', `${state.auditLogs.length} log tercatat.`]];
  if (state.currentRole === 'Dosen') return [['Presensi', 'Simpan presensi setiap pertemuan dari menu Isi Kehadiran.'], ['Tugas', 'Gunakan rubrik ringkas untuk tugas capstone.'], ['Nilai', 'Input nilai final akan langsung mengubah rekap.']];
  if (state.currentRole === 'Pimpinan') return [['Campus health', 'Skor kampus 91, risiko terkendali.'], ['Intervensi', 'Pantau mahasiswa presensi <75%.'], ['Deployment', 'Hybrid direkomendasikan untuk produksi.']];
  return [['KRS', 'Beban SKS masih aman.'], ['Tugas', `${state.tasks.filter((t) => t.status !== 'Selesai').length} tugas belum selesai.`], ['Kehadiran', 'Pertahankan presensi di atas 75%.']];
}

function rbacSummary() {
  return activityList([['Mahasiswa','Personal academic data, submit tugas, chat AI.'],['Dosen','Kelola kelas, tugas, presensi, nilai.'],['Administrator','CRUD master data, pipeline, audit, governance.'],['Pimpinan','Executive summary, statistik, compliance.']]);
}

function settingsRow(title, desc, on, key) {
  return `<div class="settings-row"><div><b>${esc(title)}</b><small style="display:block;color:var(--muted);margin-top:4px">${esc(desc)}</small></div><button class="toggle ${on ? 'on' : ''}" data-action="toggle-setting" data-setting="${key}"></button></div>`;
}

function settingsMini() {
  return `${settingsRow('Tema terang','Ubah tampilan sistem.', state.settings.theme === 'light', 'theme')}${settingsRow('Animasi','Efek visual aktif.', state.settings.animation, 'animation')}${settingsRow('Compact','Density padat.', state.settings.compact, 'compact')}`;
}

function deploymentCard(title, desc, status, score) {
  return `<article class="card"><span class="status ${score >= 90 ? 'success' : 'info'}">${esc(status)}</span><h3>${esc(title)}</h3><p style="color:var(--muted);font-size:12px;line-height:1.6">${esc(desc)}</p><div class="progress-line"><i style="width:${score}%"></i></div><small style="color:var(--muted)">${score}% readiness</small></article>`;
}

function pipelineSteps() {
  return `<div class="quick-actions">${[['ING','Ingest','Baca CSV'],['VAL','Validasi','Kolom wajib'],['TRF','Transform','Normalisasi'],['LOAD','Load','Simpan data']].map(([icon,title,desc]) => `<div class="quick-action"><i>${icon}</i><b>${title}</b><span>${desc}</span></div>`).join('')}</div>`;
}

function pipelineResult() {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Dataset</th><th>Baris</th><th>Status</th><th>Catatan</th></tr></thead><tbody>${[['mahasiswa.csv', state.students.length, 'Success', 'Valid'], ['dosen.csv', state.lecturers.length, 'Success', 'Valid'], ['mata_kuliah.csv', state.courses.length, 'Success', 'Valid'], ['krs.csv', state.courses.length, 'Success', 'Tidak ada bentrok'], ['nilai.csv', Object.keys(state.grades).length, 'Warning', 'Perlu review nilai kosong'], ['kehadiran.csv', Object.keys(state.attendance).length || 10, 'Success', 'Log presensi siap']].map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status ${r[2] === 'Success' ? 'success' : 'warning'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
}

function ragAnswer(query) {
  return `<div class="activity-list"><div class="activity-item"><span class="activity-icon">AI</span><div class="item-body"><b>Jawaban</b><small>Untuk mengikuti UAS, mahasiswa harus memenuhi syarat akademik seperti terdaftar pada KRS semester aktif, mengikuti perkuliahan sesuai ketentuan presensi, dan menyelesaikan administrasi akademik terkait. Query: ${esc(query)}</small></div></div><div class="activity-item"><span class="activity-icon">SRC</span><div class="item-body"><b>Sumber</b><small>Panduan Akademik ISTN 2026.pdf • SOP Presensi Mahasiswa.pdf</small></div></div></div>`;
}

function openModal(title, desc, body) {
  $('#modalTitle').textContent = title;
  $('#modalDesc').textContent = desc;
  $('#modalBody').innerHTML = body;
  $('#modal').classList.remove('hidden');
}

function closeModal() { $('#modal').classList.add('hidden'); }

function openStudentModal(nim = '') {
  const s = state.students.find((x) => x.nim === nim);
  openModal(s ? 'Edit Mahasiswa' : 'Tambah Mahasiswa', 'Data mahasiswa akan tersimpan di localStorage.', `<form id="studentForm" class="form-grid"><input type="hidden" name="oldNim" value="${s ? s.nim : ''}"><div><label class="form-label">NIM</label><input class="form-control" name="nim" value="${s ? s.nim : ''}" required></div><div><label class="form-label">Nama</label><input class="form-control" name="name" value="${s ? esc(s.name) : ''}" required></div><div><label class="form-label">Prodi</label><input class="form-control" name="prodi" value="${s ? esc(s.prodi) : 'Teknik Informatika'}"></div><div><label class="form-label">Semester</label><input class="form-control" name="semester" type="number" value="${s ? s.semester : 2}"></div><div><label class="form-label">IPK</label><input class="form-control" name="ipk" type="number" step="0.01" value="${s ? s.ipk : 3.50}"></div><div><label class="form-label">Kehadiran</label><input class="form-control" name="attendance" type="number" value="${s ? s.attendance : 85}"></div><div><label class="form-label">Risiko</label><select class="form-control" name="risk"><option ${s?.risk === 'Rendah' ? 'selected' : ''}>Rendah</option><option ${s?.risk === 'Sedang' ? 'selected' : ''}>Sedang</option><option ${s?.risk === 'Tinggi' ? 'selected' : ''}>Tinggi</option></select></div><div><label class="form-label">Status</label><select class="form-control" name="status"><option>Aktif</option><option>Cuti</option><option>Nonaktif</option></select></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan</button></div></form>`);
}

function openCourseModal(id = '') {
  const c = state.courses.find((x) => x.id === id);
  openModal(c ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah', 'Data mata kuliah akan masuk ke KRS dan dashboard.', `<form id="courseForm" class="form-grid"><input type="hidden" name="oldId" value="${c ? c.id : ''}"><div><label class="form-label">Kode MK</label><input class="form-control" name="code" value="${c ? c.code : 'IF-NEW101'}" required></div><div><label class="form-label">SKS</label><input class="form-control" name="sks" type="number" value="${c ? c.sks : 3}"></div><div class="full"><label class="form-label">Nama Mata Kuliah</label><input class="form-control" name="title" value="${c ? esc(c.title) : 'Mata Kuliah Baru (A)'}" required></div><div class="full"><label class="form-label">Dosen</label><input class="form-control" name="lecturer" value="${c ? esc(c.lecturer) : 'Dosen Pengampu'}"></div><div><label class="form-label">Hari</label><select class="form-control" name="day">${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map((d) => `<option ${c?.day === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div><div><label class="form-label">Jam Mulai</label><input class="form-control" name="start" value="${c ? c.start : '10:00'}"></div><div><label class="form-label">Jam Selesai</label><input class="form-control" name="end" value="${c ? c.end : '11:30'}"></div><div><label class="form-label">Ruang</label><input class="form-control" name="room" value="${c ? c.room : 'A-101'}"></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan</button></div></form>`);
}

function openLecturerModal(id = '') {
  const d = state.lecturers.find((x) => x.id === id);
  openModal(d ? 'Edit Dosen' : 'Tambah Dosen', 'Data dosen akan tersimpan di master dosen.', `<form id="lecturerForm" class="form-grid"><input type="hidden" name="oldId" value="${d ? d.id : ''}"><div><label class="form-label">ID</label><input class="form-control" name="id" value="${d ? d.id : uid('D')}"></div><div><label class="form-label">NIDN</label><input class="form-control" name="nidn" value="${d ? d.nidn : '0300000000'}"></div><div class="full"><label class="form-label">Nama Dosen</label><input class="form-control" name="name" value="${d ? esc(d.name) : 'Dosen Baru, M.Kom.'}" required></div><div><label class="form-label">Prodi</label><input class="form-control" name="prodi" value="${d ? esc(d.prodi) : 'Teknik Informatika'}"></div><div><label class="form-label">Email</label><input class="form-control" name="email" value="${d ? esc(d.email) : 'dosenbaru@istn.ac.id'}"></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan</button></div></form>`);
}

function openTaskModal() {
  openModal('Buat Tugas Baru', 'Tugas akan tampil pada menu mahasiswa dan dosen.', `<form id="taskForm" class="form-grid"><div class="full"><label class="form-label">Mata Kuliah</label><select class="form-control" name="courseId">${state.courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></div><div class="full"><label class="form-label">Judul Tugas</label><input class="form-control" name="title" value="Tugas Analisis Akademik"></div><div><label class="form-label">Tipe</label><select class="form-control" name="type"><option>Tugas</option><option>Kuis</option><option>Proyek</option><option>Laporan</option></select></div><div><label class="form-label">Deadline</label><input class="form-control" name="deadline" value="30 Juni 2026, 23:59"></div><div class="full"><label class="form-label">Instruksi</label><textarea class="form-control" name="instruction" rows="5">Kerjakan sesuai format, sertakan analisis, bukti pengujian, dan kesimpulan.</textarea></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan Tugas</button></div></form>`);
}

function openEventModal() {
  openModal('Tambah Agenda Kalender', 'Agenda akan tampil di kalender akademik.', `<form id="eventForm" class="form-grid"><div class="full"><label class="form-label">Agenda</label><input class="form-control" name="title" value="Agenda Akademik Baru"></div><div><label class="form-label">Tanggal</label><input class="form-control" name="date" type="date" value="2026-06-30"></div><div><label class="form-label">Jam</label><input class="form-control" name="time" value="13:00"></div><div><label class="form-label">Jenis</label><select class="form-control" name="type"><option>Kuliah</option><option>Tugas</option><option>Rapat</option><option>Akademik</option></select></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan Agenda</button></div></form>`);
}

function formDataObject(form) { return Object.fromEntries(new FormData(form).entries()); }

function handleFormSubmit(event) {
  event.preventDefault();
  const id = event.target.id;
  const data = formDataObject(event.target);
  if (id === 'studentForm') return saveStudent(data);
  if (id === 'courseForm') return saveCourse(data);
  if (id === 'lecturerForm') return saveLecturer(data);
  if (id === 'taskForm') return saveTask(data);
  if (id === 'messageForm') return saveMessage(data);
  if (id === 'eventForm') return saveEvent(data);
}

function saveStudent(data) {
  const student = { nim: data.nim.trim(), name: data.name.trim(), prodi: data.prodi || 'Teknik Informatika', semester: Number(data.semester || 1), ipk: Number(data.ipk || 0), attendance: Number(data.attendance || 0), risk: data.risk || 'Rendah', status: data.status || 'Aktif' };
  if (data.oldNim) state.students = state.students.map((s) => s.nim === data.oldNim ? student : s);
  else state.students.push(student);
  persist('students');
  audit(data.oldNim ? 'Edit mahasiswa' : 'Tambah mahasiswa', `${student.name} - ${student.nim}`);
  closeModal(); toast('Data mahasiswa tersimpan.'); renderPage('admin-students');
}

function saveCourse(data) {
  const id = data.oldId || uid('MK');
  const course = { id, code: data.code, title: data.title, program: 'Teknik Informatika', sks: Number(data.sks || 3), lecturer: data.lecturer || 'Dosen Pengampu', day: data.day || 'Senin', start: data.start || '10:00', end: data.end || '11:30', room: data.room || 'A-101', method: 'Project Based Learning', progress: 40, attended: 0, total: 14, health: 80, status: 'Aktif', material: 'Materi baru sedang disiapkan' };
  if (data.oldId) state.courses = state.courses.map((c) => c.id === data.oldId ? { ...c, ...course } : c);
  else state.courses.push(course);
  persist('courses');
  audit(data.oldId ? 'Edit mata kuliah' : 'Tambah mata kuliah', course.title);
  closeModal(); toast('Mata kuliah tersimpan.'); renderPage(state.currentRole === 'Administrator' ? 'admin-courses' : 'classes');
}

function saveLecturer(data) {
  const lecturer = { id: data.id || uid('D'), name: data.name, nidn: data.nidn, prodi: data.prodi, email: data.email, status: 'Aktif' };
  if (data.oldId) state.lecturers = state.lecturers.map((d) => d.id === data.oldId ? lecturer : d);
  else state.lecturers.push(lecturer);
  persist('lecturers');
  audit(data.oldId ? 'Edit dosen' : 'Tambah dosen', lecturer.name);
  closeModal(); toast('Data dosen tersimpan.'); renderPage('admin-lecturers');
}

function saveTask(data) {
  const task = { id: uid('T'), courseId: data.courseId, title: data.title, type: data.type, deadline: data.deadline, status: 'Belum dikumpulkan', score: null, instruction: data.instruction };
  state.tasks.unshift(task);
  persist('tasks');
  audit('Tambah tugas', task.title);
  closeModal(); toast('Tugas baru berhasil dibuat.'); renderPage(state.currentRole === 'Dosen' ? 'lecturer-tasks' : 'assignments');
}

function saveMessage(data) {
  state.messages.unshift({ id: uid('M'), from: state.currentUser.name, to: data.to, title: data.title, body: data.body, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), unread: true });
  persist('messages');
  audit('Kirim pesan', `${data.title} ke ${data.to}`);
  toast('Pesan berhasil dikirim.'); renderPage('messages');
}

function saveEvent(data) {
  state.events.unshift({ id: uid('E'), title: data.title, date: data.date, time: data.time, type: data.type });
  persist('events');
  audit('Tambah agenda', data.title);
  closeModal(); toast('Agenda kalender tersimpan.'); renderPage('calendar');
}

function saveAttendance() {
  const courseId = $('#attendanceCourse')?.value || state.selectedCourseId;
  const date = $('#attendanceDate')?.value || new Date().toISOString().slice(0,10);
  const key = `${courseId}_${date}`;
  state.attendance[key] = state.students.map((s) => ({ nim: s.nim, status: $(`.attendance-status[data-nim="${s.nim}"]`)?.value || 'Hadir', note: $(`.attendance-note[data-nim="${s.nim}"]`)?.value || '' }));
  persist('attendance');
  audit('Simpan presensi', `${getCourseTitle(courseId)} • ${date}`);
  toast('Presensi mahasiswa berhasil disimpan.');
}

function saveGrades() {
  $$('.grade-input').forEach((input) => {
    const nim = input.dataset.nim;
    const field = input.dataset.field;
    state.grades[nim] = state.grades[nim] || { uts: 0, uas: 0, tugas: 0, final: 0 };
    state.grades[nim][field] = Number(input.value || 0);
  });
  persist('grades');
  audit('Simpan nilai', 'Input nilai mahasiswa');
  toast('Nilai mahasiswa tersimpan.');
  renderPage('lecturer-grades');
}

function getCourseTitle(id) { return state.courses.find((c) => c.id === id)?.title || id; }

function handleAction(action, target) {
  switch (action) {
    case 'toggle-password': { const input = $('#password'); input.type = input.type === 'password' ? 'text' : 'password'; break; }
    case 'theme': toggleTheme(); break;
    case 'logout': logout(); break;
    case 'close-modal': closeModal(); break;
    case 'open-student-modal': openStudentModal(); break;
    case 'edit-student': openStudentModal(target.dataset.nim); break;
    case 'delete-student': deleteStudent(target.dataset.nim); break;
    case 'open-course-modal': openCourseModal(); break;
    case 'edit-course': openCourseModal(target.dataset.courseId); break;
    case 'delete-course': deleteCourse(target.dataset.courseId); break;
    case 'open-lecturer-modal': openLecturerModal(); break;
    case 'edit-lecturer': openLecturerModal(target.dataset.id); break;
    case 'delete-lecturer': deleteLecturer(target.dataset.id); break;
    case 'open-task-modal': openTaskModal(); break;
    case 'delete-task': deleteTask(target.dataset.id); break;
    case 'add-event-modal': openEventModal(); break;
    case 'delete-event': deleteEvent(target.dataset.id); break;
    case 'save-attendance': saveAttendance(); break;
    case 'save-grades': saveGrades(); break;
    case 'select-course': state.selectedCourseId = target.dataset.courseId; renderPage('course-detail'); break;
    case 'send-chat': sendChat(); break;
    case 'ask-ai': askAI(target.dataset.question); break;
    case 'rag-search': doRagSearch(); break;
    case 'simulate-pipeline': audit('Jalankan pipeline', 'Simulasi ETL akademik'); toast('Pipeline berhasil dijalankan.'); renderPage('data-pipeline'); break;
    case 'validate-krs': audit('Validasi KRS', 'Tidak ada bentrok jadwal'); toast('KRS valid. Tidak ada bentrok jadwal.'); break;
    case 'submit-task': submitTask(target.dataset.id); break;
    case 'compose-message': renderPage('messages'); setTimeout(() => $('#messageForm input[name="title"]')?.focus(), 50); break;
    case 'download-snapshot': downloadSnapshot(); break;
    case 'toggle-setting': toggleSetting(target.dataset.setting); break;
    case 'save-settings': audit('Simpan pengaturan', 'Preferensi pengguna'); toast('Pengaturan disimpan.'); break;
    case 'reset-data': resetData(); break;
    case 'close-command': closeCommand(); break;
    case 'preview-doc': toast('Preview dokumen simulasi berhasil dibuka.'); audit('Preview dokumen', target.dataset.id); break;
    case 'upload-doc': toast('Upload dokumen simulasi aktif.'); audit('Upload dokumen simulasi', 'Dokumen akademik'); break;
    case 'refresh-analytics': toast('Analitik diperbarui.'); audit('Refresh analytics', 'Dashboard analytics'); break;
    case 'run-compliance': toast('Compliance check selesai: 94%.'); audit('Compliance check', 'Security & Governance'); break;
    case 'deployment-check': toast('Deployment readiness: Hybrid direkomendasikan.'); audit('Deployment check', 'Decision canvas'); break;
    case 'risk-refresh': toast('Risiko akademik diperbarui.'); audit('Refresh risiko', 'Risk dashboard'); break;
    case 'edit-profile': toast('Edit profil tersedia sebagai simulasi.'); audit('Edit profil', state.currentUser.name); break;
    case 'add-user-modal': toast('Tambah user tersedia pada versi backend.'); audit('Tambah user simulasi', 'RBAC'); break;
    default: toast('Fitur dipanggil.'); audit('Aksi umum', action || 'unknown');
  }
}

function deleteStudent(nim) {
  const s = state.students.find((x) => x.nim === nim);
  if (!s) return;
  state.students = state.students.filter((x) => x.nim !== nim);
  persist('students');
  audit('Hapus mahasiswa', `${s.name} - ${nim}`);
  toast('Mahasiswa dihapus.'); renderPage('admin-students');
}

function deleteCourse(id) {
  const c = state.courses.find((x) => x.id === id);
  if (!c) return;
  state.courses = state.courses.filter((x) => x.id !== id);
  persist('courses');
  audit('Hapus mata kuliah', c.title);
  toast('Mata kuliah dihapus.'); renderPage('admin-courses');
}

function deleteLecturer(id) {
  const d = state.lecturers.find((x) => x.id === id);
  state.lecturers = state.lecturers.filter((x) => x.id !== id);
  persist('lecturers');
  audit('Hapus dosen', d?.name || id);
  toast('Dosen dihapus.'); renderPage('admin-lecturers');
}

function deleteTask(id) {
  const t = state.tasks.find((x) => x.id === id);
  state.tasks = state.tasks.filter((x) => x.id !== id);
  persist('tasks');
  audit('Hapus tugas', t?.title || id);
  toast('Tugas dihapus.'); renderPage('lecturer-tasks');
}

function deleteEvent(id) {
  const e = state.events.find((x) => x.id === id);
  state.events = state.events.filter((x) => x.id !== id);
  persist('events');
  audit('Hapus agenda', e?.title || id);
  toast('Agenda dihapus.'); renderPage('calendar');
}

function submitTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) task.status = 'Selesai';
  persist('tasks');
  audit('Kumpulkan tugas', task?.title || id);
  toast('Tugas ditandai selesai.'); renderPage('assignments');
}

function sendChat() {
  const input = $('#chatInput');
  if (!input || !input.value.trim()) return;
  askAI(input.value.trim());
  input.value = '';
}

function askAI(question) {
  const box = $('#chatMessages');
  if (!box) { renderPage('ai'); setTimeout(() => askAI(question), 60); return; }
  box.insertAdjacentHTML('beforeend', `<div class="bubble user">${esc(question)}</div><div class="bubble">${esc(aiResponse(question))}</div>`);
  box.scrollTop = box.scrollHeight;
  audit('Chat AI', question);
}

function aiResponse(question) {
  const q = question.toLowerCase();
  if (q.includes('presensi') || q.includes('kehadiran')) return `Rata-rata kehadiran mahasiswa adalah ${Math.round(avg(state.students.map((s) => s.attendance)))}%. Mahasiswa dengan presensi rendah perlu diprioritaskan untuk bimbingan.`;
  if (q.includes('tugas')) return `Terdapat ${state.tasks.length} tugas aktif. Dosen dapat menambah tugas dari menu Beri Tugas. Mahasiswa dapat mengumpulkan tugas dari menu Tugas & Ujian.`;
  if (q.includes('krs')) return `KRS memuat ${state.courses.length} mata kuliah dengan total ${sum(state.courses.map((c) => c.sks))} SKS. Tidak ada bentrok jadwal pada simulasi ini.`;
  if (q.includes('risiko')) return `Jumlah mahasiswa risiko tinggi: ${state.students.filter((s) => s.risk === 'Tinggi').length}. Fokus pada presensi di bawah 75% dan IPK di bawah 3.30.`;
  return `Berdasarkan role ${state.currentRole}, prioritas Anda adalah ${roleDescription(state.currentRole)}`;
}

function doRagSearch() {
  const query = $('#ragInput')?.value || '';
  $('#ragResult').innerHTML = ragAnswer(query);
  audit('Search/RAG', query);
  toast('Search/RAG selesai.');
}

function toggleSetting(key) {
  if (key === 'theme') {
    toggleTheme();
    return;
  }
  state.settings[key] = !state.settings[key];
  document.body.classList.toggle('ui-compact', !!state.settings.compact);
  document.body.classList.toggle('motion-off', !state.settings.animation);
  save(storage.settings, state.settings);
  toast('Pengaturan diperbarui.');
  renderPage('settings');
}

function downloadSnapshot() {
  const data = { generatedAt: new Date().toISOString(), role: state.currentRole, user: state.currentUser, students: state.students, lecturers: state.lecturers, courses: state.courses, tasks: state.tasks, events: state.events, auditLogs: state.auditLogs };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `istn-one-portal-snapshot-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  audit('Export snapshot', 'JSON local data');
  toast('Snapshot JSON dibuat.');
}

function resetData() {
  Object.values(storage).forEach((key) => localStorage.removeItem(key));
  initData();
  audit('Reset data', 'Kembali ke seed default');
  toast('Data lokal direset.');
  renderApp();
}


function enhanceMotion() {
  const content = $('#content');
  if (!content) return;
  document.body.classList.toggle('ui-compact', !!state.settings.compact);
  document.body.classList.toggle('motion-off', !state.settings.animation);
  if (!state.settings.animation) return;

  content.classList.remove('page-enter');
  void content.offsetWidth;
  content.classList.add('page-enter');

  const revealSelectors = '#content .card, #content .quick-action, #content .activity-item, #content .message-item, #content .doc-item, #content .task-item, #content .student-item, #content .data-table tbody tr, #content .risk-card, #content .course-card, #content .settings-row';
  $$(revealSelectors).forEach((el, index) => {
    el.classList.add('reveal-motion');
    el.style.setProperty('--delay', `${Math.min(index * 32, 520)}ms`);
  });
  animateNumericText();
  animateProgressBars();
  animateHeatmap();
}

function animateNumericText() {
  $$('#content .metric-value, #content .donut b, #content .risk-card b, #content .score-ring b').forEach((el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const target = Number(match[1]);
    if (!Number.isFinite(target) || target > 10000) return;
    const suffix = match[2] || '';
    const decimals = (match[1].split('.')[1] || '').length;
    const startAt = performance.now();
    const duration = 620 + Math.min(360, target * 4);
    el.classList.add('counting');
    function step(now) {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else { el.textContent = raw; el.classList.remove('counting'); }
    }
    requestAnimationFrame(step);
  });
}

function animateProgressBars() {
  $$('#content .bar-track i, #content .progress-line i').forEach((bar, index) => {
    const target = bar.style.width || '100%';
    bar.style.width = '0%';
    bar.style.transitionDelay = `${Math.min(index * 25, 350)}ms`;
    requestAnimationFrame(() => { bar.style.width = target; });
  });
}

function animateHeatmap() {
  $$('#content .heat-cell').forEach((cell, index) => cell.style.animationDelay = `${Math.min(index * 10, 700)}ms`);
}

function openCommand() {
  const dialog = $('#commandDialog');
  if (!dialog.open) dialog.showModal();
  $('#commandInput').value = '';
  renderCommandResults('');
  setTimeout(() => $('#commandInput').focus(), 60);
}

function closeCommand() { if ($('#commandDialog').open) $('#commandDialog').close(); }

function commandItems() {
  const menu = flattenNav().map((n) => ({ type: 'Menu', icon: n.icon, label: n.text, desc: `Buka ${n.page}`, page: n.page }));
  const students = state.students.map((s) => ({ type: 'Mahasiswa', icon: initials(s.name), label: `${s.name} - ${s.nim}`, desc: `${s.prodi} • IPK ${s.ipk}`, page: state.currentRole === 'Administrator' ? 'admin-students' : state.currentRole === 'Dosen' ? 'lecturer-students' : 'profile' }));
  const courses = state.courses.map((c) => ({ type: 'Mata Kuliah', icon: 'MK', label: c.title, desc: `${c.code} • ${c.lecturer}`, page: 'course-detail', courseId: c.id }));
  return [...menu, ...students, ...courses];
}

function renderCommandResults(query) {
  const q = query.toLowerCase();
  const items = commandItems().filter((item) => `${item.label} ${item.desc} ${item.type}`.toLowerCase().includes(q)).slice(0, 14);
  $('#commandResults').innerHTML = items.map((item) => `<button class="command-result" data-page="${item.page}" ${item.courseId ? `data-course-id="${item.courseId}" data-action="select-course"` : ''}><span>${esc(item.icon)}</span><div><b>${esc(item.label)}</b><small style="display:block;color:var(--muted)">${esc(item.type)} • ${esc(item.desc)}</small></div></button>`).join('') || '<div class="empty-state">Tidak ada hasil.</div>';
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => el.classList.remove('show'), 2400);
}

function attachEvents() {
  $('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const role = $('#roleSelect').value;
    const user = resolveLogin(role, $('#username').value.trim(), $('#password').value.trim());
    if (!user) return toast('Login gagal. Periksa role, username, dan password.');
    login(role, user);
  });

  $('#roleSelect').addEventListener('change', (event) => quickCredentials(event.target.value));

  document.addEventListener('click', (event) => {
    const quick = event.target.closest('[data-quick-role]');
    if (quick) {
      const role = quick.dataset.quickRole;
      quickCredentials(role);
      const account = accounts[role];
      login(role, account);
      return;
    }

    const pageTarget = event.target.closest('[data-page]');
    const actionTarget = event.target.closest('[data-action]');

    if (actionTarget) {
      event.preventDefault();
      const action = actionTarget.dataset.action;
      if (action === 'select-course') closeCommand();
      handleAction(action, actionTarget);
      return;
    }

    if (pageTarget) {
      event.preventDefault();
      closeCommand();
      renderPage(pageTarget.dataset.page);
    }
  });

  document.addEventListener('submit', handleFormSubmit);
  $('#commandLauncher').addEventListener('click', openCommand);
  $('#commandInput').addEventListener('input', (event) => renderCommandResults(event.target.value));
  $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommand(); }
    if (event.key === 'Escape') { closeModal(); closeCommand(); }
  });
}

function initParticles() {
  const canvas = $('#particleCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = Array.from({ length: Math.min(85, Math.floor(w / 18)) }, () => ({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35, r: Math.random()*1.8 + .4 }));
  }
  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(59,226,255,.45)';
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      for (let j=i+1;j<particles.length;j++) {
        const q = particles[j]; const dx = p.x-q.x; const dy = p.y-q.y; const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 92) { ctx.strokeStyle = `rgba(59,226,255,${(1-d/92)*.12})`; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize); draw();
}

function boot() {
  initData();
  attachEvents();
  initParticles();
  quickCredentials('Mahasiswa');
  window.ISTN_PORTAL_READY = true;
}

boot();


/* =========================================================
   ISTN CONNECT V14 SIAKAD QUANTUM — SYSTEM OVERRIDES
   ========================================================= */
function renderPage(page) {
  state.currentPage = page;
  const fn = pageMap[page] || renderNotFound;
  try {
    fn();
  } catch (err) {
    console.error(err);
    $('#content').innerHTML = pageShell('Terjadi Kendala', 'Halaman gagal dimuat, tetapi sistem tetap stabil.', `<button class="small-btn" data-page="dashboard">Kembali Dashboard</button>`, `<div class="card empty-state"><b>Error:</b> ${esc(err.message)}</div>`);
  }
  const content = $('#content');
  if (content) {
    content.classList.remove('page-enter');
    void content.offsetWidth;
    content.classList.add('page-enter','v14-loaded');
  }
  enhanceMotion();
  $('#sidebar')?.classList.remove('open');
  $$('.nav-item').forEach((btn) => btn.classList.toggle('active', btn.dataset.page === page));
}

function renderStudentDashboard() {
  const me = state.students.find((s) => s.nim === state.currentUser.code) || state.students[state.students.length - 1];
  const sks = sum(state.courses.map((c) => c.sks));
  const health = Math.round((me.attendance * .42) + (me.ipk * 25 * .38) + 86 * .20);
  $('#content').innerHTML = pageShell('Dashboard Mahasiswa Quantum', 'Satu layar compact untuk KRS, jadwal, tugas, presensi, nilai, dokumen, pesan, dan AI akademik.', `
    <button class="small-btn" data-page="krs">KRS</button><button class="small-btn" data-page="assignments">Tugas</button><button class="small-btn" data-page="messages">Pesan</button><button class="small-btn" data-page="ai">Tanya AI</button>`, `
    <section class="card hero-panel reveal-motion"><div><span class="capsule"><i></i> <span class="v14-live-dot">Student OS Active</span></span><h2>${esc(me.name)}, fokus akademik Anda hari ini sudah dipetakan.</h2><p>Sistem membaca status KRS, jadwal, tugas aktif, presensi, nilai, dokumen, pesan, dan rekomendasi AI. Semua fitur inti dapat dibuka dari dashboard tanpa pindah alur kerja yang panjang.</p><div class="v14-chip-row"><span class="v14-chip">${me.nim}</span><span class="v14-chip">${me.prodi}</span><span class="v14-chip">Semester ${me.semester}</span><span class="v14-chip">Status ${me.status}</span><span class="v14-chip">Risiko ${me.risk}</span></div>${v14CommandStrip([['KRS Aktif','Validasi jadwal & SKS','krs'],['Kelas','Masuk ruang kuliah','classes'],['Nilai','Lihat KHS','grades'],['AI','Tanya akademik','ai']])}</div><div class="v14-hero-right"><div class="v14-mini-orbit"><div class="v14-orbit-core">${health}</div><span class="v14-orbit-chip">KRS ${sks} SKS</span><span class="v14-orbit-chip">IPK ${me.ipk.toFixed(2)}</span><span class="v14-orbit-chip">Presensi ${me.attendance}%</span><span class="v14-orbit-chip">Tugas ${state.tasks.length}</span></div><div class="v14-insight-card"><b>AI Priority</b><small>Kerjakan ${state.tasks.filter(t => t.status !== 'Selesai').length} tugas aktif, cek jadwal ${state.courses[0]?.day || 'Senin'}, dan pertahankan presensi di atas 75%.</small></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('IPK','IPK Aktif',me.ipk.toFixed(2),'Indeks stabil')}${metricCard('SKS','Beban SKS',sks,'Maksimal 24')}${metricCard('◉','Kehadiran',`${me.attendance}%`,statusText(me.attendance))}${metricCard('✎','Tugas Belum Selesai',state.tasks.filter(t=>t.status!=='Selesai').length,'Deadline aktif')}</section>
    <section class="v14-cockpit"><div class="grid"><div class="card"><div class="card-head"><div><h3>Academic Performance Live</h3><p>Tren performa personal dan prediksi stabilitas semester.</p></div><span class="status success">Realtime</span></div>${lineChart([74,78,80,83,86,89,91,94])}</div><div class="grid grid-2"><div class="card"><div class="card-head"><div><h3>Jadwal Prioritas</h3><p>Kelas terdekat.</p></div></div>${activityList(state.courses.slice(0,4).map((c) => [`${c.day}, ${c.start} • ${shortCourse(c.title)}`, `${c.room} • ${c.lecturer}`]))}</div><div class="card"><div class="card-head"><div><h3>Deadline Radar</h3><p>Tugas yang perlu diurus.</p></div></div>${taskList(state.tasks.slice(0,4))}</div></div></div><div class="grid"><div class="card"><div class="card-head"><div><h3>Academic Health Engine</h3><p>Komposit presensi, nilai, KRS, dan aktivitas.</p></div></div>${donut(health, [['Presensi', me.attendance], ['Nilai', Math.round(me.ipk*25)], ['KRS', 92], ['Aktivitas', 87]])}</div><div class="card"><div class="card-head"><div><h3>Quick Access Matrix</h3><p>Fitur mahasiswa.</p></div></div>${quickActions([['Presensi','Rekap kehadiran','attendance'],['KHS','Nilai semester','grades'],['Dokumen','SOP & Silabus','documents'],['Kalender','Agenda akademik','calendar']])}</div></div></section>
    <section class="v14-panel-grid"><div class="card v14-span-4"><div class="card-head"><div><h3>Learning Flow</h3><p>Kelas aktif semester ini.</p></div></div>${courseMiniList(state.courses.slice(0,5))}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Pesan & Notifikasi</h3><p>Komunikasi akademik.</p></div></div>${activityList(state.messages.slice(0,4).map(m => [m.title, `${m.from} • ${m.time}`]))}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Personal AI Insight</h3><p>Saran operasional.</p></div></div>${v14AIBox('Mahasiswa', `Anda berada pada kategori ${me.risk}. Sistem menyarankan menjaga ritme tugas mingguan, presensi stabil, dan memeriksa dokumen akademik sebelum UAS.`)}</div></section>
  `);
}

function renderLecturerDashboard() {
  const avgAttend = Math.round(avg(state.students.map(s => s.attendance)));
  $('#content').innerHTML = pageShell('Dashboard Dosen Quantum', 'Workspace dosen untuk pengajaran, tugas, presensi, nilai, mahasiswa bimbingan, pesan, dan AI pembelajaran.', `
    <button class="small-btn" data-action="open-task-modal">Buat Tugas</button><button class="small-btn" data-page="lecturer-attendance">Isi Presensi</button><button class="small-btn" data-page="lecturer-grades">Input Nilai</button><button class="small-btn" data-page="messages">Pesan</button>`, `
    <section class="card hero-panel reveal-motion"><div><span class="capsule"><i></i> <span class="v14-live-dot">Lecturer Command Active</span></span><h2>Ruang kendali pengajaran untuk tugas, presensi, nilai, dan interaksi kelas.</h2><p>Dosen dapat membuat tugas, menghapus tugas, mengisi presensi mahasiswa, menyimpan nilai, melihat pengumpulan, memantau mahasiswa berisiko, membuka dokumen, dan berkomunikasi dari satu sistem.</p>${v14CommandStrip([['Buat Tugas','Tambah tugas kelas','lecturer-tasks'],['Presensi','Isi kehadiran','lecturer-attendance'],['Nilai','Input nilai','lecturer-grades'],['Mahasiswa','Bimbingan & risiko','lecturer-students']])}</div><div class="v14-hero-right"><div class="v14-mini-orbit"><div class="v14-orbit-core">${state.courses.length}</div><span class="v14-orbit-chip">Kelas Aktif</span><span class="v14-orbit-chip">Presensi ${avgAttend}%</span><span class="v14-orbit-chip">Tugas ${state.tasks.length}</span><span class="v14-orbit-chip">Nilai ${averageFinal()}</span></div><div class="v14-insight-card"><b>Teaching Alert</b><small>${state.students.filter(s=>s.attendance<80).length} mahasiswa perlu perhatian presensi. Prioritaskan tindak lanjut sebelum UTS/UAS.</small></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('▦','Kelas Diampu',state.courses.length,'Semester aktif')}${metricCard('☷','Mahasiswa',state.students.length,'Peserta aktif')}${metricCard('✎','Tugas Diberikan',state.tasks.length,'Terkelola')}${metricCard('◎','Rata-rata Nilai',averageFinal(),'Tersimpan')}</section>
    <section class="v14-panel-grid"><div class="card v14-span-8"><div class="card-head"><div><h3>Course Health Analytics</h3><p>Skor kesehatan kelas berdasarkan presensi, progress, dan tugas.</p></div></div>${barChart(state.courses.map(c => [shortCourse(c.title), c.health]))}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Teaching Action Panel</h3><p>Aksi utama dosen.</p></div></div>${quickActions([['Tugas','Beri tugas baru','lecturer-tasks'],['Pengumpulan','Cek submission','lecturer-submissions'],['Presensi','Isi kehadiran','lecturer-attendance'],['Nilai','Simpan nilai','lecturer-grades']])}</div><div class="card v14-span-5"><div class="card-head"><div><h3>Mahasiswa Risiko</h3><p>Presensi dan IPK perlu dipantau.</p></div></div>${studentList(state.students.slice().sort((a,b)=>a.attendance-b.attendance).slice(0,6))}</div><div class="card v14-span-3"><div class="card-head"><div><h3>Class Radar</h3><p>Indikator cepat.</p></div></div>${v14Radar([['Presensi',avgAttend],['Nilai',Number(averageFinal())],['Tugas',88],['Diskusi',76]])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>AI Teaching Assistant</h3><p>Rancangan instruksi dan rubrik.</p></div></div>${v14AIBox('Dosen', 'Gunakan AI untuk menyusun instruksi tugas, rubrik penilaian, ringkasan kelas, dan pesan tindak lanjut kepada mahasiswa dengan risiko tinggi.')}</div></section>
  `);
}

function renderAdminDashboard() {
  $('#content').innerHTML = pageShell('Dashboard Administrator Quantum', 'Control room untuk master data, user-role, pipeline, audit log, governance, deployment, dan konsistensi data akademik.', `
    <button class="small-btn" data-action="open-student-modal">Tambah Mahasiswa</button><button class="small-btn" data-action="open-lecturer-modal">Tambah Dosen</button><button class="small-btn" data-action="open-course-modal">Tambah MK</button><button class="small-btn" data-action="simulate-pipeline">Run Pipeline</button>`, `
    <section class="card hero-panel reveal-motion"><div><span class="capsule"><i></i> <span class="v14-live-dot">Admin Operations Online</span></span><h2>SIAKAD operations layer siap mengelola master data dan audit secara penuh.</h2><p>Administrator dapat menambah, mengedit, menghapus mahasiswa, dosen, mata kuliah, mengelola user-role, menjalankan pipeline, memeriksa audit, membuka governance, dan mengecek deployment readiness.</p>${v14CommandStrip([['Mahasiswa','Tambah/Edit/Hapus','admin-students'],['Dosen','Master dosen','admin-lecturers'],['Mata Kuliah','Master MK','admin-courses'],['Pipeline','ETL & audit','data-pipeline']])}</div><div class="v14-hero-right"><div class="v14-mini-orbit"><div class="v14-orbit-core">98</div><span class="v14-orbit-chip">DQ Score</span><span class="v14-orbit-chip">RBAC Aktif</span><span class="v14-orbit-chip">Audit ${state.auditLogs.length}</span><span class="v14-orbit-chip">Backup Lokal</span></div><div class="v14-insight-card"><b>Admin Signal</b><small>Seluruh fitur master data dan sistem tersedia. Setiap perubahan penting masuk audit log lokal.</small></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('☷','Mahasiswa',state.students.length,'CRUD aktif')}${metricCard('◪','Dosen',state.lecturers.length,'CRUD aktif')}${metricCard('▦','Mata Kuliah',state.courses.length,'CRUD aktif')}${metricCard('LOG','Audit Log',state.auditLogs.length,'Tercatat')}</section>
    <section class="v14-panel-grid"><div class="card v14-span-7"><div class="card-head"><div><h3>Data Quality Pipeline</h3><p>Ingest, validate, transform, load, dan audit.</p></div><button class="small-btn" data-action="simulate-pipeline">Run</button></div>${v14Pipeline()}</div><div class="card v14-span-5"><div class="card-head"><div><h3>Data Quality Score</h3><p>Skor kualitas setiap domain.</p></div></div>${barChart([['Mahasiswa',99],['Dosen',98],['MK',97],['KRS',96],['Nilai',93],['Presensi',95]])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>RBAC Matrix</h3><p>Hak akses inti.</p></div></div>${rbacSummary()}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Audit Stream</h3><p>Aktivitas terbaru.</p></div></div>${auditList(state.auditLogs.slice(0,6))}</div><div class="card v14-span-4"><div class="card-head"><div><h3>System Coverage</h3><p>Kelengkapan modul.</p></div></div>${v14FeatureMap([['SIAKAD','KRS, nilai, presensi'],['LMS','kelas, tugas, materi'],['AI/RAG','asisten & search'],['Governance','audit, RBAC, backup']])}</div></section>
  `);
}

function renderExecutiveDashboard() {
  const avgIpk = avg(state.students.map(s=>s.ipk)).toFixed(2);
  const avgAttend = Math.round(avg(state.students.map(s=>s.attendance)));
  const riskHigh = state.students.filter(s => s.risk === 'Tinggi').length;
  $('#content').innerHTML = pageShell('Dashboard Eksekutif Quantum', 'Executive intelligence untuk performa kampus, risiko akademik, compliance, audit, dan keputusan strategis.', `
    <button class="small-btn" data-page="executive-stats">Statistik</button><button class="small-btn" data-page="risk">Risiko</button><button class="small-btn" data-page="compliance">Compliance</button><button class="small-btn" data-page="executive-ai">Executive AI</button>`, `
    <section class="card hero-panel reveal-motion"><div><span class="capsule"><i></i> <span class="v14-live-dot">Executive Intelligence Online</span></span><h2>Campus health terkendali, tetapi presensi dan risiko akademik tetap perlu dimonitor.</h2><p>Pimpinan melihat data strategis tanpa mengubah data operasional harian. Fokus utama: rata-rata IPK, kehadiran, distribusi risiko, compliance, audit, dan kesiapan deployment.</p>${v14CommandStrip([['Statistik','Tren akademik','executive-stats'],['Rekap Nilai','Distribusi nilai','executive-grades'],['Kehadiran','Rekap presensi','executive-attendance'],['Risiko','Mahasiswa rawan','risk']])}</div><div class="v14-hero-right"><div class="v14-mini-orbit"><div class="v14-orbit-core">91</div><span class="v14-orbit-chip">Campus Health</span><span class="v14-orbit-chip">IPK ${avgIpk}</span><span class="v14-orbit-chip">Presensi ${avgAttend}%</span><span class="v14-orbit-chip">Risiko ${riskHigh}</span></div><div class="v14-insight-card"><b>Decision Signal</b><small>Prioritaskan intervensi pada kelas dengan presensi di bawah 80% dan mahasiswa risiko tinggi.</small></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('IPK','Rata-rata IPK',avgIpk,'Kampus')}${metricCard('◉','Rata-rata Hadir',`${avgAttend}%`,'Semua kelas')}${metricCard('⚠','Risiko Tinggi',riskHigh,'Mahasiswa')}${metricCard('SEC','Compliance','94%','Terkendali')}</section>
    <section class="v14-panel-grid"><div class="card v14-span-8"><div class="card-head"><div><h3>Strategic Academic Trend</h3><p>Indeks gabungan performa akademik mingguan.</p></div></div>${lineChart([76,79,81,84,86,88,90,91])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Executive Radar</h3><p>Indikator keputusan.</p></div></div>${v14Radar([['IPK',Math.round(avgIpk*25)],['Presensi',avgAttend],['Compliance',94],['Deployment',88],['Risk Control',82]])}</div><div class="card v14-span-5"><div class="card-head"><div><h3>Operational Flow</h3><p>Lapisan sistem akademik.</p></div></div>${v14Flow()}</div><div class="card v14-span-3"><div class="card-head"><div><h3>Distribusi Risiko</h3><p>Kondisi mahasiswa.</p></div></div>${donut(86,[['Rendah',state.students.filter(s=>s.risk==='Rendah').length*10],['Sedang',state.students.filter(s=>s.risk==='Sedang').length*10],['Tinggi',riskHigh*10]])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Executive AI</h3><p>Rekomendasi pimpinan.</p></div></div>${v14AIBox('Pimpinan', 'Sistem merekomendasikan monitoring mingguan presensi, validasi nilai sementara, dan audit pipeline sebelum periode UAS.')}</div></section>
  `);
}

function renderAnalytics() {
  $('#content').innerHTML = pageShell('Analitik Akademik Quantum', 'Pusat grafik compact untuk performa, presensi, nilai, audit, data quality, dan health score.', `<button class="small-btn" data-action="refresh-analytics">Refresh Analytics</button><button class="small-btn" data-action="download-snapshot">Export Snapshot</button>`, `
    <section class="grid grid-4">${metricCard('◬','Academic Index','91','Naik')}${metricCard('DQ','Data Quality','97%','Valid')}${metricCard('SEC','Compliance','94%','Aman')}${metricCard('AI','AI Insight','Aktif','RAG ready')}</section>
    <section class="v14-panel-grid"><div class="card v14-span-8"><div class="card-head"><div><h3>Academic Performance Trend</h3><p>Tren indeks akademik 8 titik.</p></div></div>${lineChart([72,76,79,81,84,88,91,94])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Health Composition</h3><p>Komposisi indikator.</p></div></div>${donut(92, [['KRS', 90], ['Nilai', 88], ['Presensi', 92], ['Audit', 95]])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Audit Heatmap</h3><p>Aktivitas sistem.</p></div></div>${heatmap()}</div><div class="card v14-span-4"><div class="card-head"><div><h3>KPI Mata Kuliah</h3><p>Health per MK.</p></div></div>${barList(state.courses.map(c=>[shortCourse(c.title),c.health]))}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Data Domain Score</h3><p>Kualitas domain.</p></div></div>${v14Radar([['Master',98],['KRS',96],['Nilai',93],['Presensi',95],['Dokumen',91]])}</div></section>
  `);
}

function v14CommandStrip(items) {
  return `<div class="v14-command-strip">${items.map(([title, desc, page]) => `<button data-page="${esc(page)}"><b>${esc(title)}</b><small>${esc(desc)}</small></button>`).join('')}</div>`;
}
function v14AIBox(role, text) {
  return `<div class="v14-ai-box"><span class="capsule"><i></i> AI ${esc(role)}</span><p>${esc(text)}</p><div class="hero-actions"><button class="primary" data-page="ai">Buka Asisten AI</button><button class="secondary" data-page="rag">Search/RAG</button></div></div>`;
}
function v14Radar(items) {
  return `<div class="v14-radar">${items.map(([label,val]) => `<div class="v14-radar-row"><b>${esc(label)}</b><div class="bar-track"><i style="width:${clamp(val)}%"></i></div><span>${esc(val)}%</span></div>`).join('')}</div>`;
}
function v14Pipeline() {
  const steps = [['01','Ingest','CSV akademik dibaca dan dicatat'],['02','Validate','Kolom wajib, missing value, dan PK dicek'],['03','Transform','Normalisasi teks dan tipe data'],['04','Load','Data bersih masuk storage lokal'],['05','Audit','Semua aksi masuk log sistem']];
  return `<div class="v14-pipeline">${steps.map(([n,t,d]) => `<div class="v14-step"><i>${n}</i><div><b>${esc(t)}</b><small>${esc(d)}</small></div><span class="status success">PASS</span></div>`).join('')}</div>`;
}
function v14Flow() {
  return `<div class="v14-flow"><div><em>01</em><b>Akses</b><small>Login role-based dan session pengguna.</small></div><div><em>02</em><b>Akademik</b><small>KRS, jadwal, nilai, presensi, tugas.</small></div><div><em>03</em><b>Operasi</b><small>Master data, pipeline, audit log.</small></div><div><em>04</em><b>Analitik</b><small>Grafik, KPI, risiko, compliance.</small></div><div><em>05</em><b>AI</b><small>Asisten, RAG, insight keputusan.</small></div></div>`;
}
function v14FeatureMap(items) {
  return `<div class="v14-feature-map">${items.map(([t,d]) => `<div><b>${esc(t)}</b><small>${esc(d)}</small></div>`).join('')}</div>`;
}

try {
  document.title = 'ISTN Connect V16 All Accounts Elite';
  const brandSmall = document.querySelector('.side-brand small');
  if (brandSmall) brandSmall.textContent = 'V16 All Accounts Elite';
} catch (_) {}


/* =========================================================
   ISTN CONNECT V16 ALL ACCOUNTS ELITE — ACCOUNT OVERRIDES
   ========================================================= */
function normalized(value) {
  return String(value ?? '').trim().toLowerCase();
}

const lecturerLoginMap = [
  { id: 'D001', aliases: ['dosen','oni','onibibin','oni.bibin','d001','sc-data-001'], password: 'oni123' },
  { id: 'D002', aliases: ['andi','andi.suprianto','d002','0312048801'], password: 'andi123' },
  { id: 'D003', aliases: ['marhaeni','d003','0320119002'], password: 'marhaeni123' },
  { id: 'D004', aliases: ['sumardiyono','b.sumardiyono','d004','0308098803'], password: 'sumardiyono123' },
  { id: 'D005', aliases: ['dikky','dikky.suryadi','d005','0317059104'], password: 'dikky123' },
  { id: 'D006', aliases: ['zhuhriansyah','moch.zhuhriansyah','d006','0307108906'], password: 'zhuhriansyah123' }
];

function lecturerLoginById(id) {
  return lecturerLoginMap.find((item) => item.id === id) || null;
}

function lecturerPrimaryUsername(id) {
  const item = lecturerLoginById(id);
  return item ? item.aliases[0] : normalized(id);
}

function lecturerPassword(id) {
  const item = lecturerLoginById(id);
  return item ? item.password : `${normalized(id)}123`;
}

function accountFromStudent(student) {
  return {
    username: student.nim,
    password: student.nim,
    name: student.name,
    code: student.nim,
    role: 'Mahasiswa',
    avatar: initials(student.name),
    studentId: student.nim,
    prodi: student.prodi,
    status: student.status
  };
}

function accountFromLecturer(lecturer) {
  return {
    username: lecturerPrimaryUsername(lecturer.id),
    password: lecturerPassword(lecturer.id),
    name: lecturer.name,
    code: lecturer.nidn,
    role: 'Dosen',
    avatar: initials(lecturer.name),
    lecturerId: lecturer.id,
    lecturerName: lecturer.name,
    prodi: lecturer.prodi,
    email: lecturer.email,
    status: lecturer.status
  };
}

function allStudentAccounts() {
  return state.students.map(accountFromStudent);
}

function allLecturerAccounts() {
  return state.lecturers.map(accountFromLecturer);
}

function resolveLogin(role, username, password) {
  const u = normalized(username);
  const p = String(password ?? '').trim();
  const base = accounts[role];

  if (role === 'Mahasiswa') {
    if (base && base.username === username && base.password === password) return base;
    const student = state.students.find((s) => normalized(s.nim) === u && String(s.nim) === p);
    if (student) return accountFromStudent(student);
  }

  if (role === 'Dosen') {
    if (base && base.username === username && base.password === password) return accountFromLecturer(state.lecturers.find((l) => l.id === 'D001') || seedLecturers[0]);
    const found = state.lecturers.find((lecturer) => {
      const login = lecturerLoginById(lecturer.id);
      const aliases = login ? login.aliases : [normalized(lecturer.id), normalized(lecturer.nidn), normalized(lecturer.name).replace(/[^a-z0-9]+/g, '.')];
      const validPasswords = [lecturerPassword(lecturer.id), String(lecturer.nidn), normalized(lecturer.id)];
      return aliases.map(normalized).includes(u) && validPasswords.includes(p);
    });
    if (found) return accountFromLecturer(found);
  }

  if (role === 'Administrator' || role === 'Pimpinan') {
    if (base && base.username === username && base.password === password) return base;
  }
  return null;
}

function quickCredentials(role) {
  $('#roleSelect').value = role;
  if (role === 'Mahasiswa') { $('#username').value = '24360001'; $('#password').value = '24360001'; return; }
  if (role === 'Dosen') { $('#username').value = 'oni'; $('#password').value = 'oni123'; return; }
  const a = accounts[role];
  $('#username').value = a.username;
  $('#password').value = a.password;
}

function lecturerOwnCourses() {
  if (state.currentRole !== 'Dosen') return state.courses;
  const lecturer = state.lecturers.find((l) => l.id === state.currentUser?.lecturerId);
  if (!lecturer) return state.courses;
  const name = lecturer.name;
  const shortName = name.split(',')[0];
  const owned = state.courses.filter((course) => course.lecturer.includes(name) || course.lecturer.includes(shortName));
  return owned.length ? owned : state.courses;
}

function lecturerOwnTasks() {
  const ids = new Set(lecturerOwnCourses().map((c) => c.id));
  return state.tasks.filter((task) => ids.has(task.courseId));
}

function renderLecturerDashboard() {
  const ownedCourses = lecturerOwnCourses();
  const ownedTasks = lecturerOwnTasks();
  const avgAttend = Math.round(avg(state.students.map(s => s.attendance)));
  const lecturerName = state.currentUser?.name || 'Dosen';
  $('#content').innerHTML = pageShell('Dashboard Dosen Quantum', `Workspace dosen untuk ${esc(lecturerName)}.`, `
    <button class="small-btn" data-action="open-task-modal">Buat Tugas</button><button class="small-btn" data-page="lecturer-attendance">Isi Presensi</button><button class="small-btn" data-page="lecturer-grades">Input Nilai</button><button class="small-btn" data-page="messages">Pesan</button>`, `
    <section class="card hero-panel reveal-motion"><div><span class="capsule"><i></i> <span class="v14-live-dot">Lecturer Account Active</span></span><h2>${esc(lecturerName)}</h2><p>Akun dosen ini menampilkan nama, NIDN/kode, kelas yang diampu, tugas, presensi, nilai, mahasiswa, pesan, dan profil sesuai akun login masing-masing.</p><div class="v14-chip-row"><span class="v14-chip">${esc(state.currentUser.code)}</span><span class="v14-chip">${esc(state.currentUser.prodi || 'Teknik Informatika')}</span><span class="v14-chip">${ownedCourses.length} kelas diampu</span><span class="v14-chip">${ownedTasks.length} tugas aktif</span></div>${v14CommandStrip([['Buat Tugas','Tambah tugas kelas','lecturer-tasks'],['Presensi','Isi kehadiran','lecturer-attendance'],['Nilai','Input nilai','lecturer-grades'],['Mahasiswa','Bimbingan & risiko','lecturer-students']])}</div><div class="v14-hero-right"><div class="v14-mini-orbit"><div class="v14-orbit-core">${ownedCourses.length}</div><span class="v14-orbit-chip">Kelas Aktif</span><span class="v14-orbit-chip">Presensi ${avgAttend}%</span><span class="v14-orbit-chip">Tugas ${ownedTasks.length}</span><span class="v14-orbit-chip">Nilai ${averageFinal()}</span></div><div class="v14-insight-card"><b>Teaching Alert</b><small>${state.students.filter(s=>s.attendance<80).length} mahasiswa perlu perhatian presensi. Semua aksi dosen tersimpan dalam audit log lokal.</small></div></div></section>
    <section class="grid grid-4" style="margin-top:14px">${metricCard('▦','Kelas Diampu',ownedCourses.length,'Akun aktif')}${metricCard('☷','Mahasiswa',state.students.length,'Peserta aktif')}${metricCard('✎','Tugas Diberikan',ownedTasks.length,'Terkelola')}${metricCard('◎','Rata-rata Nilai',averageFinal(),'Tersimpan')}</section>
    <section class="v14-panel-grid"><div class="card v14-span-8"><div class="card-head"><div><h3>Course Health Analytics</h3><p>Skor kesehatan kelas yang diampu akun ini.</p></div></div>${ownedCourses.length ? barChart(ownedCourses.map(c => [shortCourse(c.title), c.health])) : emptyState('Belum ada kelas diampu.')}</div><div class="card v14-span-4"><div class="card-head"><div><h3>Teaching Action Panel</h3><p>Aksi utama dosen.</p></div></div>${quickActions([['Tugas','Beri tugas baru','lecturer-tasks'],['Pengumpulan','Cek submission','lecturer-submissions'],['Presensi','Isi kehadiran','lecturer-attendance'],['Nilai','Simpan nilai','lecturer-grades']])}</div><div class="card v14-span-5"><div class="card-head"><div><h3>Mahasiswa Risiko</h3><p>Presensi dan IPK perlu dipantau.</p></div></div>${studentList(state.students.slice().sort((a,b)=>a.attendance-b.attendance).slice(0,6))}</div><div class="card v14-span-3"><div class="card-head"><div><h3>Class Radar</h3><p>Indikator cepat.</p></div></div>${v14Radar([['Presensi',avgAttend],['Nilai',Number(averageFinal())],['Tugas',88],['Diskusi',76]])}</div><div class="card v14-span-4"><div class="card-head"><div><h3>AI Teaching Assistant</h3><p>Rancangan instruksi dan rubrik.</p></div></div>${v14AIBox('Dosen', 'Gunakan AI untuk menyusun instruksi tugas, rubrik penilaian, ringkasan kelas, dan pesan tindak lanjut kepada mahasiswa dengan risiko tinggi.')}</div></section>
  `);
}

function renderLecturerCourses() {
  const ownedCourses = lecturerOwnCourses();
  $('#content').innerHTML = pageShell('Mata Kuliah Saya', 'Daftar kelas sesuai akun dosen yang login.', `<button class="small-btn" data-action="open-task-modal">Buat Tugas</button><button class="small-btn" data-page="lecturer-attendance">Isi Presensi</button>`, `
    <section class="grid grid-3">${ownedCourses.map(courseCard).join('') || emptyState('Belum ada mata kuliah untuk akun dosen ini.')}</section>
  `);
}

function renderLecturerTasks() {
  const ownedTasks = lecturerOwnTasks();
  $('#content').innerHTML = pageShell('Beri Tugas', 'Dosen dapat membuat, melihat, dan mengelola tugas mata kuliah yang diampu.', `<button class="small-btn" data-action="open-task-modal">Buat Tugas</button>`, `
    <section class="grid grid-3"><div class="card span-2"><div class="card-head"><div><h3>Daftar Tugas</h3><p>Tugas sesuai kelas yang diampu.</p></div></div>${taskTable(true, ownedTasks)}</div><div class="card"><div class="card-head"><div><h3>Ringkasan</h3><p>Status tugas.</p></div></div>${donut(72, [['Belum dikumpulkan', ownedTasks.filter((t) => t.status !== 'Selesai').length * 20], ['Selesai', ownedTasks.filter((t) => t.status === 'Selesai').length * 20]])}</div></section>
  `);
}

function renderLecturerAttendance() {
  const courses = lecturerOwnCourses();
  $('#content').innerHTML = pageShell('Isi Kehadiran Mahasiswa', 'Dosen mencatat hadir, izin, sakit, atau alfa per mahasiswa dan per kelas.', `<button class="small-btn" data-action="save-attendance">Simpan Presensi</button>`, `
    <section class="grid grid-3"><div class="card"><div class="card-head"><div><h3>Pilih Kelas</h3><p>Presensi per pertemuan.</p></div></div><label class="form-label">Mata Kuliah</label><select id="attendanceCourse" class="form-control">${courses.map((c) => `<option value="${c.id}" ${c.id === state.selectedCourseId ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select><label class="form-label" style="margin-top:10px">Tanggal</label><input id="attendanceDate" type="date" class="form-control" value="2026-06-22" /><div class="hero-actions"><button class="primary" data-action="save-attendance">Simpan Presensi</button></div></div><div class="card span-2"><div class="card-head"><div><h3>Daftar Mahasiswa</h3><p>Ubah status lalu simpan.</p></div></div>${attendanceForm()}</div></section>
  `);
}

function taskTable(lecturerMode = false, rows = state.tasks) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Mata Kuliah</th><th>Tugas</th><th>Tipe</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows.map((t) => { const c = state.courses.find((x) => x.id === t.courseId); return `<tr><td>${t.id}</td><td>${esc(c?.code || '-')}</td><td>${esc(t.title)}</td><td>${esc(t.type)}</td><td>${esc(t.deadline)}</td><td><span class="status ${t.status === 'Selesai' ? 'success' : 'warning'}">${esc(t.status)}</span></td><td>${lecturerMode ? `<button class="small-btn" data-action="delete-task" data-id="${t.id}">Hapus</button>` : `<button class="small-btn" data-action="submit-task" data-id="${t.id}">Kumpulkan</button>`}</td></tr>`; }).join('')}</tbody></table></div>`;
}

function openTaskModal() {
  const courses = state.currentRole === 'Dosen' ? lecturerOwnCourses() : state.courses;
  openModal('Buat Tugas Baru', 'Tugas akan tampil pada menu mahasiswa dan dosen.', `<form id="taskForm" class="form-grid"><div class="full"><label class="form-label">Mata Kuliah</label><select class="form-control" name="courseId">${courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></div><div class="full"><label class="form-label">Judul Tugas</label><input class="form-control" name="title" value="Tugas Analisis Akademik"></div><div><label class="form-label">Tipe</label><select class="form-control" name="type"><option>Tugas</option><option>Kuis</option><option>Proyek</option><option>Laporan</option></select></div><div><label class="form-label">Deadline</label><input class="form-control" name="deadline" value="30 Juni 2026, 23:59"></div><div class="full"><label class="form-label">Instruksi</label><textarea class="form-control" name="instruction" rows="5">Kerjakan sesuai format, sertakan analisis, bukti pengujian, dan kesimpulan.</textarea></div><div class="full form-actions"><button class="secondary" type="button" data-action="close-modal">Batal</button><button class="primary" type="submit">Simpan Tugas</button></div></form>`);
}

function userTable() {
  const rows = [
    ...allStudentAccounts().map((u) => ({...u, category: 'Mahasiswa'})),
    ...allLecturerAccounts().map((u) => ({...u, category: 'Dosen'})),
    accounts.Administrator,
    accounts.Pimpinan
  ];
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Username</th><th>Password</th><th>Nama</th><th>Kode</th><th>Role</th><th>Status</th></tr></thead><tbody>${rows.map((u) => `<tr><td>${esc(u.username)}</td><td><code>${esc(u.password)}</code></td><td>${esc(u.name)}</td><td>${esc(u.code)}</td><td>${esc(u.role)}</td><td><span class="status success">Aktif</span></td></tr>`).join('')}</tbody></table></div>`;
}

function renderAdminUsers() {
  $('#content').innerHTML = pageShell('Kelola User & Role', 'Seluruh akun mahasiswa dan dosen sudah dibuat. Mahasiswa memakai NIM, dosen memakai username personal.', `<button class="small-btn" data-action="download-snapshot">Export Akun</button>`, `
    <section class="grid grid-2"><div class="card"><div class="card-head"><div><h3>Semua Akun Login</h3><p>${state.students.length} mahasiswa, ${state.lecturers.length} dosen, admin, dan pimpinan.</p></div></div>${userTable()}</div><div class="card"><div class="card-head"><div><h3>Access Matrix</h3><p>Hak akses inti.</p></div></div>${accessMatrix()}<div style="margin-top:14px" class="empty-state"><b>Aturan login:</b><br>Mahasiswa: username=NIM, password=NIM.<br>Dosen: username personal, password personal. Contoh: oni/oni123, andi/andi123, marhaeni/marhaeni123.</div></div></section>
  `);
}

function buildCommandItems() {
  const menu = flattenNav().map((n) => ({ type: 'Menu', icon: n.icon, label: n.text, desc: `Buka ${n.text}`, page: n.page }));
  const students = state.students.map((s) => ({ type: 'Mahasiswa', icon: 'MHS', label: s.name, desc: `${s.nim} • ${s.prodi}`, page: state.currentRole === 'Administrator' ? 'admin-students' : 'lecturer-students' }));
  const lecturers = state.lecturers.map((d) => ({ type: 'Dosen', icon: 'DSN', label: d.name, desc: `${lecturerPrimaryUsername(d.id)} / ${lecturerPassword(d.id)} • ${d.nidn}`, page: state.currentRole === 'Administrator' ? 'admin-lecturers' : 'profile' }));
  const courses = state.courses.map((c) => ({ type: 'Mata Kuliah', icon: 'MK', label: c.title, desc: `${c.code} • ${c.lecturer}`, page: 'course-detail', courseId: c.id }));
  return [...menu, ...students, ...lecturers, ...courses];
}

function renderProfile() {
  const roleText = roleDescription(state.currentRole);
  const loginInfo = state.currentRole === 'Mahasiswa' ? `Username ${esc(state.currentUser.username)} • Password awal ${esc(state.currentUser.password)}` : state.currentRole === 'Dosen' ? `Username ${esc(state.currentUser.username)} • Password ${esc(state.currentUser.password)}` : `Username ${esc(state.currentUser.username)}`;
  $('#content').innerHTML = pageShell('Profil', 'Identitas akun, role, hak akses, dan ringkasan aktivitas.', `<button class="small-btn" data-action="edit-profile">Edit Profil</button>`, `
    <section class="card"><div class="profile-grid"><div class="avatar" style="width:76px;height:76px;font-size:24px">${esc(state.currentUser.avatar || initials(state.currentUser.name))}</div><div><h2 style="margin:0">${esc(state.currentUser.name)}</h2><p style="color:var(--muted);margin:6px 0 0">${esc(state.currentUser.code)} • ${esc(state.currentRole)}</p><p style="color:var(--muted);margin:6px 0 0">${loginInfo}</p><p style="max-width:760px;line-height:1.65;color:var(--muted)">${roleText}</p></div><span class="role-chip">${esc(state.currentRole)}</span></div></section>
    <section class="grid grid-3" style="margin-top:14px"><div class="card"><div class="card-head"><div><h3>Hak Akses</h3><p>Menu aktif role.</p></div></div>${activityList(flattenNav().slice(0,8).map((n) => [n.text, `Akses halaman ${n.page}`]))}</div><div class="card"><div class="card-head"><div><h3>Audit Saya</h3><p>Aktivitas terbaru.</p></div></div>${auditList(state.auditLogs.filter((l) => l.user === state.currentUser.name).slice(0,5))}</div><div class="card"><div class="card-head"><div><h3>Pengaturan Cepat</h3><p>Preferensi akun.</p></div></div>${settingsMini()}</div></section>
  `);
}

try {
  document.title = 'ISTN Connect V.01';
  const brandSmall = document.querySelector('.side-brand small');
  if (brandSmall) brandSmall.textContent = 'V.01 BETA';
  const badge = document.querySelector('.login-copy .capsule');
  if (badge) badge.innerHTML = '<i></i> V.01 BETA';
} catch (_) {}

