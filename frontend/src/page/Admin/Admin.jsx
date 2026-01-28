import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service';
import './Admin.css';

function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [commitments, setCommitments] = useState([]);
    const [tab, setTab] = useState('suggestions');
    const [newCommitment, setNewCommitment] = useState({ title: '', body: '', published: false });

    const navigate = useNavigate();
    const BASE = import.meta.env.VITE_API_URL || '';

    const authFetch = (path, opts = {}) => {
        const token = authService.getAuth()?.token;
        const headers = { ...(opts.headers || {}) };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        return fetch(`${BASE}${path}`, { ...opts, headers });
    };

    useEffect(() => {
        let mounted = true;
        authService.me()
            .then((u) => {
                if (!mounted) return;
                if (!u || u.role !== 'admin') return navigate('/login');
                setUser(u);
            })
            .catch(() => navigate('/login'))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false };
    }, [navigate]);

    useEffect(() => {
        if (!user) return;
        fetchSuggestions();
        fetchCommitments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    async function fetchSuggestions() {
        try {
            const res = await authFetch('/api/suggestions');
            if (!res.ok) throw await res.json();
            const data = await res.json();
            setSuggestions(data || []);
        } catch (err) {
            console.error('fetchSuggestions', err);
        }
    }

    async function fetchSuggestionDetails(id) {
        try {
            const res = await authFetch(`/api/suggestions/${id}`);
            if (!res.ok) throw await res.json();
            const data = await res.json();
            setSelectedSuggestion(data);
        } catch (err) {
            console.error('fetchSuggestionDetails', err);
        }
    }

    async function fetchCommitments() {
        try {
            const res = await authFetch('/api/commitments');
            if (!res.ok) throw await res.json();
            const data = await res.json();
            setCommitments(data || []);
        } catch (err) {
            console.error('fetchCommitments', err);
        }
    }

    async function updateSuggestion(id, patch) {
        try {
            const res = await authFetch(`/api/suggestions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(patch)
            });
            if (!res.ok) throw await res.json();
            const updated = await res.json();
            setSuggestions(s => s.map(it => (it._id === id ? updated : it)));
            if (selectedSuggestion && selectedSuggestion._id === id) {
                setSelectedSuggestion(updated);
            }
        } catch (err) {
            console.error('updateSuggestion', err);
        }
    }

    async function deleteSuggestion(id) {
        if (!window.confirm('Delete this suggestion?')) return;
        try {
            const res = await authFetch(`/api/suggestions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw await res.json();
            setSuggestions(s => s.filter(x => x._id !== id));
            if (selectedSuggestion && selectedSuggestion._id === id) {
                setSelectedSuggestion(null);
            }
        } catch (err) {
            console.error('deleteSuggestion', err);
        }
    }

    async function saveCommitment(e) {
        e.preventDefault();
        try {
            const res = await authFetch('/api/commitments', {
                method: 'POST',
                body: JSON.stringify(newCommitment)
            });
            if (!res.ok) throw await res.json();
            const created = await res.json();
            setCommitments(c => [created, ...c]);
            setNewCommitment({ title: '', body: '', published: false });
        } catch (err) {
            console.error('saveCommitment', err);
        }
    }

    async function deleteCommitment(id) {
        if (!window.confirm('Delete this commitment?')) return;
        try {
            const res = await authFetch(`/api/commitments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw await res.json();
            setCommitments(c => c.filter(x => x._id !== id));
        } catch (err) {
            console.error('deleteCommitment', err);
        }
    }

    async function toggleCommitmentPublish(commitment) {
        try {
            const updated = { ...commitment, published: !commitment.published };
            const res = await authFetch(`/api/commitments/${commitment._id}`, {
                method: 'PUT',
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw await res.json();
            const data = await res.json();
            setCommitments(arr => arr.map(it => it._id === commitment._id ? data : it));
        } catch (err) {
            console.error('toggleCommitmentPublish', err);
        }
    }

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container admin-panel">
            <header className="admin-top">
                <h1>Admin Panel</h1>
                <p>Welcome, {user?.name}</p>
            </header>

            <nav className="admin-nav">
                <button
                    className={tab === 'suggestions' ? 'active' : ''}
                    onClick={() => setTab('suggestions')}
                >
                    Suggestions
                </button>
                <button
                    className={tab === 'commitments' ? 'active' : ''}
                    onClick={() => setTab('commitments')}
                >
                    Commitments
                </button>
            </nav>

            {tab === 'suggestions' && (
                <section className="admin-layout">
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <h3>Suggestions</h3>
                            <div className="counts">{suggestions.length}</div>
                        </div>

                        <div className="sidebar-controls">
                            <input
                                className="search"
                                placeholder="Search name, email, ward..."
                                onChange={(e) => {
                                    const q = e.target.value.toLowerCase().trim();
                                    if (!q) return fetchSuggestions();
                                    setSuggestions(prev => prev.filter(it =>
                                        (it.name || '').toLowerCase().includes(q) ||
                                        (it.email || '').toLowerCase().includes(q) ||
                                        (it.ward || '').toString().includes(q)
                                    ));
                                }}
                            />
                        </div>

                        <div className="suggestion-list">
                            {suggestions.map((s) => (
                                <button
                                    key={s._id}
                                    className={`suggestion-item ${selectedSuggestion && selectedSuggestion._id === s._id ? 'active' : ''}`}
                                    onClick={() => fetchSuggestionDetails(s._id)}
                                >
                                    <div className="si-top">
                                        <strong>{s.name || 'नाम छैन'}</strong>
                                        <span className={`status-pill status-${s.status}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                    <div className="si-bottom">
                                        <small>{s.email || s.mobile || '-'}</small>
                                        <small className="muted">
                                            {s.localLevel} • वडा {s.ward}
                                        </small>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="main">
                        {selectedSuggestion ? (
                            <div className="suggestion-detail">
                                <header>
                                    <h2>{selectedSuggestion.name || 'नाम उपलब्ध छैन'}</h2>
                                    <div className="meta">
                                        <span>{selectedSuggestion.email || selectedSuggestion.mobile}</span>
                                        {' • '}
                                        <span>{selectedSuggestion.localLevel} • वडा {selectedSuggestion.ward}</span>
                                    </div>
                                </header>

                                <section className="detail-section">
                                    <h4>समस्या</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedSuggestion.problem}</p>
                                </section>

                                <section className="detail-section">
                                    <h4>समाधान</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedSuggestion.solution}</p>
                                </section>

                                <section className="detail-section">
                                    <h4>नीति सुझाव</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedSuggestion.policySuggestion}</p>
                                </section>

                                <section className="detail-section">
                                    <h4>थप विवरण</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedSuggestion.extraSuggestion}</p>
                                </section>

                                <div className="actions">
                                    <button onClick={() => {
                                        const next = selectedSuggestion.status === 'new' ? 'in_progress' :
                                            selectedSuggestion.status === 'in_progress' ? 'resolved' : 'new';
                                        updateSuggestion(selectedSuggestion._id, { status: next });
                                        fetchSuggestionDetails(selectedSuggestion._id);
                                    }}>
                                        Toggle Status
                                    </button>
                                    <button
                                        className="danger"
                                        onClick={() => {
                                            if (window.confirm('Delete suggestion?')) {
                                                deleteSuggestion(selectedSuggestion._id);
                                                setSelectedSuggestion(null);
                                            }
                                        }}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setSelectedSuggestion(null)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty">
                                Select a suggestion from the left to view details.
                            </div>
                        )}
                    </main>
                </section>
            )}

            {tab === 'commitments' && (
                <section className="commitments">
                    <h2>Commitments</h2>
                    <form onSubmit={saveCommitment} className="commitment-form">
                        <input
                            placeholder="Title"
                            value={newCommitment.title}
                            onChange={(e) => setNewCommitment(c => ({ ...c, title: e.target.value }))}
                            required
                        />
                        <textarea
                            placeholder="Body"
                            value={newCommitment.body}
                            onChange={(e) => setNewCommitment(c => ({ ...c, body: e.target.value }))}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={newCommitment.published}
                                onChange={(e) => setNewCommitment(c => ({ ...c, published: e.target.checked }))}
                            />
                            Published
                        </label>
                        <button type="submit">Create</button>
                    </form>

                    <ul className="commitment-list">
                        {commitments.map((c) => (
                            <li key={c._id} className="commitment-item">
                                <strong>{c.title}</strong> {c.published ? '(published)' : '(draft)'}
                                <div style={{ whiteSpace: 'pre-wrap' }}>{c.body}</div>
                                <div style={{ marginTop: 6 }}>
                                    <button onClick={() => toggleCommitmentPublish(c)}>
                                        {c.published ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => deleteCommitment(c._id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default Admin;