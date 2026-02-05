import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../../service/post.service.js';
import './NewsMedia.css';

const NewsMedia = () => {
    const navigate = useNavigate();
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('सबै');
    const categories = useMemo(() => {
        const uniq = Array.from(new Set(newsItems.map(n => n.category).filter(Boolean)));
        return ['सबै', ...uniq];
    }, [newsItems]);

    const filteredNews = selectedCategory === 'सबै'
        ? newsItems
        : newsItems.filter(item => item.category === selectedCategory);

    useEffect(() => {
        let active = true;
        postService.getPosts()
            .then(data => {
                if (!active) return;
                const mapped = (Array.isArray(data) ? data : []).map(p => ({
                    id: p._id,
                    title: p.title,
                    date: p.date,
                    category: p.category || 'समाचार',
                    image: (p.images && p.images.find(i => i.isPrimary)?.url) || (p.images?.[0]?.url) || '',
                    excerpt: p.content?.slice(0, 160) + (p.content && p.content.length > 160 ? '…' : ''),
                }));
                setNewsItems(mapped);
            })
            .catch(err => setError(err.message || 'Failed to load'))
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, []);

    return (
        <div className="news-media-container">
            <div className="news-hero">
                <h1 className="news-title">समाचार र मिडिया</h1>
                <p className="news-subtitle">सल्यानको विकास र प्रगतिका समाचारहरू</p>
            </div>

            <div className="news-content">
                <div className="category-filter">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="news-grid">
                    {loading && (
                        <div className="no-news"><p>लोड भइरहेछ…</p></div>
                    )}
                    {error && (
                        <div className="no-news"><p className="text-danger">{error}</p></div>
                    )}
                    {!loading && !error && filteredNews.map((news) => (
                        <article key={news.id} className="news-card">
                            <div className="news-image-wrapper">
                                <img src={news.image} alt={news.title} className="news-image" />
                                <span className="news-category-badge">{news.category}</span>
                            </div>
                            <div className="news-card-content">
                                <p className="news-date">{news.date}</p>
                                <h3 className="news-card-title">{news.title}</h3>
                                <p className="news-excerpt">{news.excerpt}</p>
                                <button
                                    className="read-more-btn"
                                    onClick={() => navigate(`/news/${news.id}`)}
                                >
                                    थप पढ्नुहोस् →
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {!loading && !error && filteredNews.length === 0 && (
                    <div className="no-news">
                        <p>यस श्रेणीमा कुनै समाचार भेटिएन।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsMedia;