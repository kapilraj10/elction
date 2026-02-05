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

export async function getSinglePost(id) {
    const res = await fetch(BASE ? `${BASE}/api/posts/${id}` : `/api/posts/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || 'Failed to load post');
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

export async function updatePost(id, { title, content, category, date, images }, token) {
    const fd = new FormData();
    if (title) fd.append('title', title);
    if (content) fd.append('content', content);
    if (category) fd.append('category', category);
    if (date) fd.append('date', date);
    if (images && images.length > 0) {
        images.forEach(f => fd.append('images', f));
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(BASE ? `${BASE}/api/posts/update/${id}` : `/api/posts/update/${id}`, {
        method: 'PUT',
        headers,
        body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return json;
}

export async function deletePost(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(BASE ? `${BASE}/api/posts/delete/${id}` : `/api/posts/delete/${id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || 'Failed to delete post');
    }
    return res.json();
}

export default { getPosts, getSinglePost, createPost, updatePost, deletePost };