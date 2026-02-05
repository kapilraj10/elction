const BASE = import.meta.env.VITE_API_URL || '';

export async function getPosts() {
    const res = await fetch(BASE ? `${BASE}/api/posts/all` : '/api/posts/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || 'Failed to load posts');
    }
    return res.json();
}

export async function createPost({ title, content, category, date, images }, token) {
    const fd = new FormData();
    if (title) fd.append('title', title);
    if (content) fd.append('content', content);
    if (category) fd.append('category', category);
    if (date) fd.append('date', date);
    (images || []).forEach(f => fd.append('images', f));

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(BASE ? `${BASE}/api/posts/create` : '/api/posts/create', {
        method: 'POST',
        headers,
        body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return json;
}

export default { getPosts, createPost };