import React, { useState, useEffect } from 'react';
import './About.css';
import * as aboutService from '../../service/about.service';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAboutData();
    }, []);

    const loadAboutData = async () => {
        try {
            setLoading(true);
            const result = await aboutService.getAllAbout();
            // Get the first/latest about entry
            if (result.success && result.data && result.data.length > 0) {
                setAboutData(result.data[0]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="about-container">
                <div className="about-hero">
                    <h1 className="about-title">लोड हुँदैछ...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="about-container">
                <div className="about-hero">
                    <h1 className="about-title">त्रुटि</h1>
                    <p className="about-subtitle">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="about-container">
            <div className="about-hero">
                <h1 className="about-title">{aboutData?.coverTitle || 'हाम्रो बारेमा'}</h1>
                <p className="about-subtitle">{aboutData?.coverDescription || 'सल्यानको समृद्धिको लागि प्रतिबद्ध'}</p>
            </div>

            <div className="about-content">
                {aboutData?.coverImage && (
                    <section className="about-section">
                        <div className="section-content">
                            <div className="profile-section">
                                <img
                                    src={aboutData.coverImage}
                                    alt="प्रोफाइल"
                                    className="profile-image"
                                />
                                <div className="profile-info">
                                    <h2>नाम : ललित कुमार चन्द</h2>
                                    <p className="designation">जन्मस्थान: बागचौर नगरपालिका वडा नं ८, सल्यान</p>
                                    <p className="constituency">जन्ममिति: २०४० श्रावण १५</p>
                                    <div className="bio">
                                        <p><strong>योग्यता:</strong> सिभिल इन्जिनियरिङमा डिप्लोमा; ग्रामीण विकास र समाजशास्त्रमा स्नातक; समाजशास्त्रमा स्नातकोत्तर अध्ययनरत।</p>
                                        <p><strong>अनुभव:</strong> राष्ट्रिय तथा अन्तर्राष्ट्रिय संघसंस्थाहरू (German Technical Cooperation, SWITCH development cooperation, ILO, UNOPS लगायत) मा करिब १८ वर्ष डेभलपमेन्ट सेक्टरमा कार्य अनुभव।</p>
                                        <p><strong>राजनीतिक अनुभव:</strong> विद्यार्थी जीवनमा अनेरास्ववियुको क्रान्तिकारी केन्द्रीय सचिवालयमा भूमिका; २०७९ पश्चात् राष्ट्रिय स्वतन्त्र पार्टीमा जोडिएको; सल्यान जिल्लाको संयोजक र हाल कर्णाली प्रदेशको महामन्त्री (विगत १६ महिना) भएर पार्टी विस्तार तथा संगठन निर्माणमा सक्रिय।</p>
                                        <p><strong>उद्देश्य:</strong> आउँदै गरेको प्रतिनिधि सभाको निर्वाचनमा सल्यान जिल्लाबाट संघीय सांसद (प्रतिनिधि सभा सदस्य) को प्रत्यक्ष उम्मेदवार।</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {aboutData?.vision && (
                    <section className="about-section">
                        <h2 className="section-title">हाम्रो दृष्टिकोण</h2>
                        <div className="section-content">
                            <p>{aboutData.vision}</p>
                        </div>
                    </section>
                )}

                {aboutData?.priorities && aboutData.priorities.length > 0 && (
                    <section className="about-section">
                        <h2 className="section-title">हाम्रा प्राथमिकताहरू</h2>
                        <div className="priorities-grid">
                            {aboutData.priorities.map((priority, index) => (
                                <div className="priority-card" key={index}>
                                    <div className="priority-icon">{priority.icon}</div>
                                    <h3>{priority.title}</h3>
                                    <p>{priority.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="about-section">
                    <h2 className="section-title">सम्पर्कमा रहनुहोस्</h2>
                    <div className="section-content">
                        <p>
                            तपाईंका सुझाव र विचारहरू हामीलाई अत्यन्त महत्वपूर्ण छन्। हामीसँग सम्पर्कमा रहनुहोस् र सल्यानको विकासमा आफ्नो योगदान दिनुहोस्।
                        </p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="bi bi-envelope-fill"></i>
                                </div>
                                <div className="contact-details">
                                    <strong>इमेल:</strong>
                                    <a href="mailto:chand_lalit2007@yahoo.com">chanda_lalit2007@yahoo.com</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="bi bi-telephone-fill"></i>
                                </div>
                                <div className="contact-details">
                                    <strong>फोन:</strong>
                                    <a href="tel:+9779858031221">+977 9858031221</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;