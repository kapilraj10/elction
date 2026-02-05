import React, { useEffect, useState } from 'react';
import './Commitment.css';

const Commitment = () => {
  const [progress, setProgress] = useState(0);

  // प्रगति गणना गर्न सुरु र लक्ष्य मिति
  const startDate = new Date('2026-01-01T00:00:00'); // प्रगतिको सुरुवात
  const targetDate = new Date('2026-02-16T23:59:59'); // फागुन ४ (मिति परिवर्तन गर्नुहोस्) अन्त्य

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const totalTime = targetDate - startDate;
      const elapsed = now - startDate;
      const percent = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
      setProgress(percent);
    };

    updateProgress(); // सुरुमा गणना
    const interval = setInterval(updateProgress, 1000); // प्रत्येक सेकेन्ड अपडेट
    return () => clearInterval(interval);
  }, [startDate, targetDate]);

  return (
    <section className="commitment-section">
      <div className="commitment-container">
        <h2 className="commitment-title">हाम्रो प्रतिबद्धताहरू</h2>

        <div className="commitment-card">
          <div className="commitment-header">
            {/* यहाँ फोटो वा आइकन राख्न सकिन्छ */}
          </div>

          <div className="commitment-content">
            <p className="commitment-message">
              <span className="gradient-text">प्रतिबद्धताहरू फागुन ४ पछि प्रकाशित हुनेछन्।</span>
            </p>
          </div>

          <div className="commitment-footer">
            <div className="progress-indicator">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-label">
                प्रगति: {progress.toFixed(2)}%
              </div>
            </div>

            <div className="coming-soon-badge">
              <div className="badge-dot"></div>
              <span className="badge-text">चाँडै उपलब्ध हुनेछ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Commitment;
