const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, data) {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw json;
    return json;
}

export async function login(credentials) {
    return request('/api/auth/login', credentials);
}

export async function register(payload) {
    return request('/api/auth/register', payload);
}

export function saveAuth(token, user) {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function getAuth() {
    return { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || 'null') };
}

export default { login, register, saveAuth, clearAuth, getAuth };
