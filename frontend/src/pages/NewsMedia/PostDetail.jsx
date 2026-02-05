import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../../service/post.service.js';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        postService.getSinglePost(id)
            .then(data => {
                if (!active) return;
                setPost(data);
            })
            .catch(err => setError(err.message || 'Failed to load post'))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [id]);

    if (loading) {
        return (
            <div className="post-detail-container">
                <div className="loading-state">
                    <p>लोड भइरहेछ…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="post-detail-container">
                <div className="error-state">
                    <p className="text-danger">{error}</p>
                    <button className="back-btn" onClick={() => navigate('/news-media')}>
                        ← फिर्ता जानुहोस्
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="post-detail-container">
                <div className="error-state">
                    <p>पोस्ट भेटिएन।</p>
                    <button className="back-btn" onClick={() => navigate('/news-media')}>
                        ← फिर्ता जानुहोस्
                    </button>
                </div>
            </div>
        );
    }

    const primaryImage = (post.images && post.images.find(i => i.isPrimary)) || post.images?.[0];
    const otherImages = post.images?.filter(i => !i.isPrimary) || [];

    return (
        <div className="post-detail-container">
            <button className="back-btn-top" onClick={() => navigate('/news-media')}>
                ← समाचार पृष्ठमा फर्कनुहोस्
            </button>

            <article className="post-detail-article">
                <div className="post-detail-header">
                    <div className="post-meta">
                        <span className="post-category-badge">{post.category || 'समाचार'}</span>
                        <span className="post-date">{post.date}</span>
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                </div>

                {primaryImage && (
                    <div className="post-primary-image">
                        <img src={primaryImage.url} alt={post.title} />
                    </div>
                )}

                <div className="post-content">
                    <div className="post-text">
                        {post.content.split('\n').map((paragraph, idx) => (
                            paragraph.trim() && <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {otherImages.length > 0 && (
                    <div className="post-gallery">
                        <h3 className="gallery-title">थप तस्बिरहरू</h3>
                        <div className="gallery-grid">
                            {otherImages.map((img, idx) => (
                                <div key={idx} className="gallery-item">
                                    <img src={img.url} alt={`${post.title} - ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="post-footer">
                    <button className="back-btn-bottom" onClick={() => navigate('/news-media')}>
                        ← समाचार पृष्ठमा फर्कनुहोस्
                    </button>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;
