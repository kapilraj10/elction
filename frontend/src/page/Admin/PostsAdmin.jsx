import React, { useEffect, useState } from 'react';
import postService from '../../service/post.service.js';
import authService from '../../service/auth.service.js';

const PostsAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
            if (editingId) {
                // Update existing post
                await postService.updatePost(editingId, {
                    title: form.title,
                    content: form.content,
                    category: form.category,
                    date: form.date,
                    images,
                }, token);
            } else {
                // Create new post
                await postService.createPost({
                    title: form.title,
                    content: form.content,
                    category: form.category,
                    date: form.date,
                    images,
                }, token);
            }
            setForm({ title: '', content: '', category: '', date: '' });
            setImages([]);
            setEditingId(null);
            setShowForm(false);
            await load();
        } catch (e) {
            alert((editingId ? 'Update' : 'Create') + ' failed: ' + (e.message || e));
        }
    };

    const handleEdit = (post) => {
        setEditingId(post._id);
        setForm({
            title: post.title,
            content: post.content,
            category: post.category || '',
            date: post.date || '',
        });
        setImages([]);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const { token } = authService.getAuth() || {};
            await postService.deletePost(id, token);
            await load();
        } catch (e) {
            alert('Delete failed: ' + (e.message || e));
        }
    };

    const handleCancel = () => {
        setForm({ title: '', content: '', category: '', date: '' });
        setImages([]);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Posts</h3>
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={load}>Refresh</button>
                    <button className="btn btn-primary" onClick={() => { setEditingId(null); setShowForm(s => !s); }}>
                        {showForm ? 'Close' : 'New Post'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title mb-3">{editingId ? 'Edit Post' : 'Create New Post'}</h5>
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
                                    <div className="w-100">
                                        <label className="form-label">{editingId ? 'New Images (optional)' : 'Images'}</label>
                                        <input type="file" className="form-control" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" type="submit">
                                    {editingId ? 'Update Post' : 'Create Post'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
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
                                        <th style={{ width: 200 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.title}</td>
                                            <td>{p.category}</td>
                                            <td>{p.date}</td>
                                            <td>{(p.images && p.images.find(i => i.isPrimary)?.url) ? (
                                                <img src={p.images.find(i => i.isPrimary)?.url} alt="primary" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : '-'}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(p)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(p._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
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
