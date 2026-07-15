const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));
const uid = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();


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


function audit(action, detail) {
  if (!state.currentUser) return;
  state.auditLogs.unshift({ id: uid('LOG'), action, detail, role: state.currentRole, user: state.currentUser.name, time: new Date().toLocaleString('id-ID') });
  state.auditLogs = state.auditLogs.slice(0, 200);
  save(storage.audit, state.auditLogs);
}


function initials(name) {
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'U';
}

