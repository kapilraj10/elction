import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    // navigation handled via react-router; remove unused scroll helper

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
                                <h1 id="hero-heading" className="hero-name">केश बहादुर बिष्ट</h1>
                                <p className="hero-tagline">सल्यानको समृद्धि, शिक्षित र स्वस्थ समाज निर्माणमा मेरो दायित्व</p>
                            </div>

                            <div className="party-badge" aria-hidden="true">
                                <span className="party-icon" aria-hidden="true">🌳</span>
                                <span className="party-name">नेपाली कांग्रेस</span>
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
                            <img src="/candidate.svg" alt="केश बहादुर बिष्ट" className="home-candidate-photo" loading="lazy" />
                        </aside>
                    </div>
                </main>

                <div className="hero-decoration" aria-hidden="true">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                </div>
            </header>


            <footer className="site-footer" role="contentinfo">
                <div className="container">
                    <p>© {new Date().getFullYear()} केश बहादुर बिष्ट — नेपाली कांग्रेस · सल्यान</p>
                </div>
            </footer>
        </div>
    );
}
