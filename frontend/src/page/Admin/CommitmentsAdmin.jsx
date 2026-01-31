import React, { useEffect, useState } from 'react';
import authService from '../../service/auth.service';
import './CommitmentsAdmin.css';

const BASE = import.meta.env.VITE_API_URL || '';

const CommitmentsAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', order: 0, published: false });
    const [file, setFile] = useState(null);

    const getHeaders = () => {
        const { token } = authService.getAuth() || {};
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;
    };

    const fetchCommitments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(BASE ? `${BASE}/api/commitments` : '/api/commitments', { headers: getHeaders() });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : (data.items || []));
        } catch (err) {
            setError(err.message || 'Failed to load');
        } finally { setLoading(false); }
    };

    useEffect(() => {
        // run once on mount
        fetchCommitments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetForm = () => {
        setForm({ title: '', description: '', order: 0, published: false });
        setFile(null);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('order', String(form.order));
            fd.append('published', form.published ? 'true' : 'false');
            if (file) fd.append('pdf', file, file.name);

            const { token } = authService.getAuth() || {};
            const res = await fetch(BASE ? `${BASE}/api/commitments` : '/api/commitments', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: fd
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await fetchCommitments();
            resetForm();
            setShowForm(false);
        } catch (err) {
            alert('Create failed: ' + (err.message || err));
        }
    };

    const handleTogglePublish = async (id, current) => {
        try {
            const { token } = authService.getAuth() || {};
            const res = await fetch((BASE ? `${BASE}/api/commitments/` : '/api/commitments/') + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ published: !current })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await fetchCommitments();
        } catch (err) {
            alert('Update failed: ' + (err.message || err));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this commitment?')) return;
        try {
            const { token } = authService.getAuth() || {};
            const res = await fetch((BASE ? `${BASE}/api/commitments/` : '/api/commitments/') + id, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await fetchCommitments();
        } catch (err) {
            alert('Delete failed: ' + (err.message || err));
        }
    };

    return (
        <div className="commitments-admin p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Commitments</h3>
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={fetchCommitments}>Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Close' : 'New Commitment'}</button>
                </div>
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Order</label>
                                    <input type="number" className="form-control" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
                                </div>
                                <div className="col-md-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input className="form-check-input" id="publishedCheck" type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                                        <label className="form-check-label" htmlFor="publishedCheck">Published</label>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-end">
                                    <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" type="submit">Create</button>
                                <button type="button" className="btn btn-secondary" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : error ? (
                        <div className="p-4 text-danger">{error}</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Order</th>
                                        <th>PDF</th>
                                        <th>Published</th>
                                        <th style={{ width: 220 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it._id}>
                                            <td>{it.title}</td>
                                            <td>{it.order ?? '-'}</td>
                                            <td>{it.pdfUrl ? (<a href={it.pdfUrl} target="_blank" rel="noreferrer">Download</a>) : '-'}</td>
                                            <td>{it.published ? 'Yes' : 'No'}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleTogglePublish(it._id, it.published)}>{it.published ? 'Unpublish' : 'Publish'}</button>
                                                    <a className="btn btn-sm btn-outline-secondary" href={it.pdfUrl || '#'} target="_blank" rel="noreferrer">View</a>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(it._id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {items.length === 0 && <div className="p-4 text-center text-muted">No commitments found.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommitmentsAdmin;
