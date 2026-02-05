import React, { useState } from 'react';
import './NewsMedia.css';

const NewsMedia = () => {
    const [newsItems] = useState([
        {
            id: 1,
            title: 'सल्यानमा विकास परियोजनाहरूको सुरुवात',
            date: 'फागुन २, २०८२',
            category: 'विकास',
            image: 'https://via.placeholder.com/400x250?text=News+1',
            excerpt: 'सल्यान जिल्लामा नयाँ विकास परियोजनाहरूको सुरुवात भएको छ। यी परियोजनाहरूले स्थानीय समुदायलाई प्रत्यक्ष फाइदा पुर्‍याउने अपेक्षा गरिएको छ।'
        },
        {
            id: 2,
            title: 'शिक्षा क्षेत्रमा सुधारका लागि नयाँ योजना',
            date: 'माघ २८, २०८२',
            category: 'शिक्षा',
            image: 'https://via.placeholder.com/400x250?text=News+2',
            excerpt: 'सल्यानको शिक्षा क्षेत्रमा गुणस्तरीय सुधार ल्याउन नयाँ योजनाहरू घोषणा गरिएको छ।'
        },
        {
            id: 3,
            title: 'स्वास्थ्य सेवा विस्तार कार्यक्रम',
            date: 'माघ २५, २०८२',
            category: 'स्वास्थ्य',
            image: 'https://via.placeholder.com/400x250?text=News+3',
            excerpt: 'सल्यानमा स्वास्थ्य सेवा विस्तार गर्न आधुनिक स्वास्थ्य केन्द्रहरू स्थापना गरिने।'
        },
        {
            id: 4,
            title: 'कृषि क्षेत्रमा नयाँ प्रविधिको प्रयोग',
            date: 'माघ २०, २०८२',
            category: 'कृषि',
            image: 'https://via.placeholder.com/400x250?text=News+4',
            excerpt: 'किसानहरूलाई आधुनिक कृषि प्रविधिको तालिम प्रदान गरिने कार्यक्रम सुरु भएको छ।'
        },
        {
            id: 5,
            title: 'युवा रोजगारी कार्यक्रमको शुभारम्भ',
            date: 'माघ १५, २०८२',
            category: 'रोजगारी',
            image: 'https://via.placeholder.com/400x250?text=News+5',
            excerpt: 'सल्यानका युवाहरूलाई रोजगारीको अवसर प्रदान गर्न विशेष कार्यक्रम सञ्चालनमा आएको छ।'
        },
        {
            id: 6,
            title: 'पूर्वाधार विकास परियोजनाहरू',
            date: 'माघ १०, २०८२',
            category: 'पूर्वाधार',
            image: 'https://via.placeholder.com/400x250?text=News+6',
            excerpt: 'सल्यानमा सडक, पुल र अन्य पूर्वाधार विकासका परियोजनाहरू तीव्र गतिमा अगाडि बढेका छन्।'
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState('सबै');

    const categories = ['सबै', 'विकास', 'शिक्षा', 'स्वास्थ्य', 'कृषि', 'रोजगारी', 'पूर्वाधार'];

    const filteredNews = selectedCategory === 'सबै'
        ? newsItems
        : newsItems.filter(item => item.category === selectedCategory);

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
                    {filteredNews.map((news) => (
                        <article key={news.id} className="news-card">
                            <div className="news-image-wrapper">
                                <img src={news.image} alt={news.title} className="news-image" />
                                <span className="news-category-badge">{news.category}</span>
                            </div>
                            <div className="news-card-content">
                                <p className="news-date">{news.date}</p>
                                <h3 className="news-card-title">{news.title}</h3>
                                <p className="news-excerpt">{news.excerpt}</p>
                                <button className="read-more-btn">थप पढ्नुहोस् →</button>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="no-news">
                        <p>यस श्रेणीमा कुनै समाचार भेटिएन।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsMedia;
