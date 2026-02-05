import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-hero">
                <h1 className="about-title">हाम्रो बारेमा</h1>
                <p className="about-subtitle">सल्यानको समृद्धिको लागि प्रतिबद्ध</p>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <div className="section-content">
                        <div className="profile-section">
                            <img
                                src="https://i.postimg.cc/zBqFzqdN/4d7c13e9-0be8-4a43-ae94-538876874319.jpg"
                                alt="ललित चन्द"
                                className="profile-image"
                            />
                            <div className="profile-info">
                                <h2>ललित चन्द</h2>
                                <p className="designation">राष्ट्रिय स्वतन्त्र पार्टी</p>
                                <p className="constituency">सल्यान निर्वाचन क्षेत्र</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="section-title">हाम्रो दृष्टिकोण</h2>
                    <div className="section-content">
                        <p>
                            म सल्यान हाँसेको हेर्न चाहन्छु। सल्यानको समृद्धि, शिक्षित र स्वस्थ समाज निर्माणमा मेरो पूर्ण दायित्व छ।
                        </p>
                        <p>
                            नागरिकहरूको सुझाव र सहयोगमा आधारित भएर सल्यानलाई विकासको नयाँ उचाइमा पुर्‍याउने हाम्रो संकल्प छ।
                        </p>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="section-title">हाम्रा प्राथमिकताहरू</h2>
                    <div className="priorities-grid">
                        <div className="priority-card">
                            <div className="priority-icon">🎓</div>
                            <h3>शिक्षा</h3>
                            <p>गुणस्तरीय शिक्षाको पहुँच सबैलाई</p>
                        </div>
                        <div className="priority-card">
                            <div className="priority-icon">🏥</div>
                            <h3>स्वास्थ्य</h3>
                            <p>आधुनिक स्वास्थ्य सेवा र सुविधा</p>
                        </div>
                        <div className="priority-card">
                            <div className="priority-icon">🏗️</div>
                            <h3>पूर्वाधार विकास</h3>
                            <p>सडक, पुल र आधारभूत संरचना</p>
                        </div>
                        <div className="priority-card">
                            <div className="priority-icon">🌾</div>
                            <h3>कृषि विकास</h3>
                            <p>आधुनिक कृषि र किसानको समृद्धि</p>
                        </div>
                        <div className="priority-card">
                            <div className="priority-icon">💼</div>
                            <h3>रोजगारी</h3>
                            <p>युवाहरूका लागि रोजगारी सिर्जना</p>
                        </div>
                        <div className="priority-card">
                            <div className="priority-icon">⚖️</div>
                            <h3>सुशासन</h3>
                            <p>पारदर्शी र जवाफदेही प्रशासन</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="section-title">सम्पर्कमा रहनुहोस्</h2>
                    <div className="section-content">
                        <p>
                            तपाईंका सुझाव र विचारहरू हामीलाई अत्यन्त महत्वपूर्ण छन्। हामीसँग सम्पर्कमा रहनुहोस् र सल्यानको विकासमा आफ्नो योगदान दिनुहोस्।
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
