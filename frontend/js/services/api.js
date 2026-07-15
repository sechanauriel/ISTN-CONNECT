/* SC-DATA API + DuckDB INTEGRATION
   Frontend tetap HTML/CSS/JS. Backend lokal: FastAPI + DuckDB.
   ========================================================= */
const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://127.0.0.1:8000/api' : window.location.origin + '/api';

async function apiGet(path) {
  const token = localStorage.getItem('authToken');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return await res.json();
}

async function apiPost(path, body = {}) {
  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return await res.json();
}
