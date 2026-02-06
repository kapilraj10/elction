import React, { useState, useEffect } from 'react';
import * as aboutService from '../../service/about.service';
import './AboutAdmin.css';

const AboutAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        vision: '',
        coverTitle: '',
        coverDescription: '',
        priorities: []
    });

    const [coverImage, setCoverImage] = useState(null);
    const [newPriority, setNewPriority] = useState({ title: '', description: '', icon: '' });

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await aboutService.getAllAbout();
            setItems(result.success ? result.data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = {
                vision: form.vision,
                coverTitle: form.coverTitle,
                coverDescription: form.coverDescription,
                priorities: form.priorities,
                coverImage: coverImage
            };

            if (editingId) {
                await aboutService.updateAbout(editingId, data, token);
            } else {
                await aboutService.createAbout(data, token);
            }

            setShowForm(false);
            setEditingId(null);
            resetForm();
            load();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setForm({
            vision: item.vision || '',
            coverTitle: item.coverTitle || '',
            coverDescription: item.coverDescription || '',
            priorities: item.priorities || []
        });
        setEditingId(item._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('के तपाईं यो About entry मेटाउन निश्चित हुनुहुन्छ?')) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await aboutService.deleteAbout(id, token);
            load();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setForm({
            vision: '',
            coverTitle: '',
            coverDescription: '',
            priorities: []
        });
        setCoverImage(null);
        setNewPriority({ title: '', description: '', icon: '' });
    };

    const addPriority = () => {
        if (newPriority.title && newPriority.description) {
            setForm(prev => ({
                ...prev,
                priorities: [...prev.priorities, { ...newPriority }]
            }));
            setNewPriority({ title: '', description: '', icon: '' });
        }
    };

    const removePriority = (index) => {
        setForm(prev => ({
            ...prev,
            priorities: prev.priorities.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="about-admin-container">
            <div className="about-admin-header">
                <h1>About Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Create New'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {showForm && (
                <div className="about-form-card">
                    <h2>{editingId ? 'Edit About' : 'Create New About'}</h2>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Cover Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.coverTitle}
                                onChange={(e) => setForm({ ...form, coverTitle: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Cover Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.coverDescription}
                                onChange={(e) => setForm({ ...form, coverDescription: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Vision</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={form.vision}
                                onChange={(e) => setForm({ ...form, vision: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </div>

                        <div className="form-group">
                            <label>Priorities</label>
                            <div className="priorities-builder">
                                <div className="priority-input-row">
                                    <input
                                        type="text"
                                        placeholder="Icon (emoji)"
                                        value={newPriority.icon}
                                        onChange={(e) => setNewPriority({ ...newPriority, icon: e.target.value })}
                                        className="form-control priority-icon-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newPriority.title}
                                        onChange={(e) => setNewPriority({ ...newPriority, title: e.target.value })}
                                        className="form-control"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={newPriority.description}
                                        onChange={(e) => setNewPriority({ ...newPriority, description: e.target.value })}
                                        className="form-control"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={addPriority}
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="priorities-list">
                                    {form.priorities.map((priority, index) => (
                                        <div key={index} className="priority-item">
                                            <span className="priority-icon">{priority.icon}</span>
                                            <span className="priority-title">{priority.title}</span>
                                            <span className="priority-desc">{priority.description}</span>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removePriority(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="about-admin-table">
                <h2>Existing About Entries</h2>
                {loading && <p>Loading...</p>}
                {items.length === 0 && !loading && <p>No entries found.</p>}

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Cover Title</th>
                                <th>Vision</th>
                                <th>Priorities</th>
                                <th>Cover Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.coverTitle}</td>
                                    <td>{item.vision?.substring(0, 50)}...</td>
                                    <td>{item.priorities?.length || 0} items</td>
                                    <td>
                                        {item.coverImage && (
                                            <img
                                                src={item.coverImage}
                                                alt="Cover"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AboutAdmin;
