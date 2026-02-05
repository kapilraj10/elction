import React, { useEffect, useState } from 'react';
import postService from '../../service/post.service.js';
import authService from '../../service/auth.service.js';

const PostsAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', category: '', date: '' });
    const [images, setImages] = useState([]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await postService.getPosts();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || 'Failed to load');
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { token } = authService.getAuth() || {};
            await postService.createPost({
                title: form.title,
                content: form.content,
                category: form.category,
                date: form.date,
                images,
            }, token);
            setForm({ title: '', content: '', category: '', date: '' });
            setImages([]);
            setShowForm(false);
            await load();
        } catch (e) {
            alert('Create failed: ' + (e.message || e));
        }
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Posts</h3>
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={load}>Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Close' : 'New Post'}</button>
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
                                <label className="form-label">Content</label>
                                <textarea className="form-control" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} required />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label className="form-label">Category</label>
                                    <input className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Date</label>
                                    <input type="text" className="form-control" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="मिति" />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" type="submit">Create</button>
                                <button type="button" className="btn btn-secondary" onClick={() => { setForm({ title: '', content: '', category: '', date: '' }); setImages([]); setShowForm(false); }}>Cancel</button>
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
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Primary Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.title}</td>
                                            <td>{p.category}</td>
                                            <td>{p.date}</td>
                                            <td>{(p.images && p.images.find(i => i.isPrimary)?.url) ? (
                                                <img src={p.images.find(i => i.isPrimary)?.url} alt="primary" style={{ width: 80, height: 50, objectFit: 'cover' }} />
                                            ) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {items.length === 0 && <div className="p-4 text-center text-muted">No posts found.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostsAdmin;
