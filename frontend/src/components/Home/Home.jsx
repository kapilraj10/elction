import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();


    return (
        <div className="home-hero" aria-labelledby="hero-heading">

            {/* HERO */}
            <header className="hero-container">
                <div className="hero-overlay" aria-hidden="true"></div>

                <main id="main" className="hero-content" role="main" aria-labelledby="hero-heading">
                    <div className="hero-grid">
                        <div className="hero-text">
                            <div className="hero-quote-section" role="note">
                                <p className="hero-quote">"म सल्यान हाँसेको हेर्न चाहन्छु ।"</p>
                                <div className="quote-divider" aria-hidden="true"></div>
                            </div>

                            <div className="hero-name-section">
                                <h1 id="hero-heading" className="hero-name highlighted-name">ललित चन्द</h1>
                                <p className="hero-tagline">सल्यानको समृद्धि, शिक्षित र स्वस्थ समाज निर्माणमा मेरो दायित्व</p>
                            </div>

                            <div className="party-badge rastriya-swatantra" aria-hidden="true">
                                <span className="party-name">राष्ट्रिय स्वतन्त्र पार्टी</span>
                            </div>

                            <div className="hero-cta">
                                <button
                                    type="button"
                                    aria-label="सुझाव पठाउन जानुहोस्"
                                    className="cta-primary"
                                    onClick={() => navigate('/suggestions')}
                                >
                                    सुझाव <span className="cta-arrow" aria-hidden>→</span>
                                </button>

                                <button
                                    type="button"
                                    aria-label="प्रतिबद्धता पढ्न र डाउनलोड गर्न"
                                    className="cta-secondary"
                                    onClick={() => navigate('/commitment')}
                                >
                                    किन मलाई मतदान गर्ने?
                                </button>
                            </div>
                        </div>

                        <aside className="hero-aside" aria-hidden="false">
                            <img src="https://i.postimg.cc/zBqFzqdN/4d7c13e9-0be8-4a43-ae94-538876874319.jpg" alt="ललित चन्द" className="home-candidate-photo" loading="lazy" />
                        </aside>
                    </div>
                </main>

                <div className="hero-decoration" aria-hidden="true">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                </div>
            </header>


            
        </div>
    );
}
