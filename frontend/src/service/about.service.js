const BASE = import.meta.env.VITE_API_URL || '';

export async function getAllAbout() {
    const res = await fetch(BASE ? `${BASE}/api/about/all` : '/api/about/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || 'Failed to load about data');
    }
    return res.json();
}

export async function getSingleAbout(id) {
    const res = await fetch(BASE ? `${BASE}/api/about/${id}` : `/api/about/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || 'Failed to load about data');
    }
    return res.json();
}

export async function createAbout({ vision, priorities, coverTitle, coverDescription, coverImage }, token) {
    const fd = new FormData();
    if (vision) fd.append('vision', vision);
    if (priorities) fd.append('priorities', JSON.stringify(priorities));
    if (coverTitle) fd.append('coverTitle', coverTitle);
    if (coverDescription) fd.append('coverDescription', coverDescription);
    if (coverImage) fd.append('coverImage', coverImage);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(BASE ? `${BASE}/api/about/create` : '/api/about/create', {
        method: 'POST',
        headers,
        body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return json;
}

export async function updateAbout(id, { vision, priorities, coverTitle, coverDescription, coverImage }, token) {
    const fd = new FormData();
    if (vision) fd.append('vision', vision);
    if (priorities) fd.append('priorities', JSON.stringify(priorities));
    if (coverTitle) fd.append('coverTitle', coverTitle);
    if (coverDescription) fd.append('coverDescription', coverDescription);
    if (coverImage) fd.append('coverImage', coverImage);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(BASE ? `${BASE}/api/about/update/${id}` : `/api/about/update/${id}`, {
        method: 'PUT',
        headers,
        body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return json;
}

export async function deleteAbout(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(BASE ? `${BASE}/api/about/delete/${id}` : `/api/about/delete/${id}`, {
        method: 'DELETE',
        headers,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return json;
}
