import React, { useEffect, useState } from 'react'
import './Commitment.css'

const BASE = import.meta.env.VITE_API_URL || '';

const Commitment = () => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommitments = async () => {
      try {
        const url = BASE ? `${BASE}/api/commitments` : '/api/commitments';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Backend returns only published commitments for public
        setCommitments(Array.isArray(data) ? data : (data.items || []));
      } catch (err) {
        console.error('Failed to fetch commitments:', err);
        setError(err.message || 'Failed to load commitments');
      } finally {
        setLoading(false);
      }
    };

    fetchCommitments();
  }, []);

  if (loading) {
    return (
      <div className="commitment-page container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading commitments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commitment-page container">
        <div className="alert alert-danger mt-5" role="alert">
          <h4>Error Loading Commitments</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commitment-page container">
      <header className="commitment-header">
        <h1>मेरो प्रतिबद्धता</h1>
        <p className="subtitle">केश बहादुर बिष्ट — नेपाली कांग्रेस · सल्यान</p>
      </header>

      <section className="commitment-top">
        <img src="/candidate.svg" alt="केश बहादुर बिष्ट" className="candidate-photo" />
        <div className="commitment-profile">
          <h2>एक इमान्दार नेतृत्वका लागि</h2>
          <p>
            म तपाईँसँग प्रतिज्ञा गर्दछु — पारदर्शिता, जवाफदेहिता र दिगो विकासका
            लागि काम गर्नेछु। मेरो प्राथमिकता स्थानीय सेवा र जनताको सीधो फाइदा हो।
          </p>
          <p>
            यो अभिलेखले हाम्रो योजना र प्रतिबद्धतालाई सारांशित गर्दछ; पूर्ण दस्तावेज
            डाउनलोड गर्न तलको बटन प्रयोग गर्नुहोस्।
          </p>
        </div>
      </section>

      {commitments.length === 0 ? (
        <section className="commitment-body">
          <div className="text-center py-5 text-muted">
            <p>प्रतिबद्धताहरू अझै प्रकाशित भएका छैनन्।</p>
          </div>
        </section>
      ) : (
        commitments.map((commitment, index) => (
          <section key={commitment._id || index} className="commitment-body mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title text-primary mb-3">{commitment.title}</h3>

                <div className="commitment-description" style={{ whiteSpace: 'pre-wrap' }}>
                  {commitment.description}
                </div>

                {commitment.pdfUrl && (
                  <div className="commitment-actions mt-4">
                    <a
                      href={commitment.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-primary"
                    >
                      डाउनलोड (PDF)
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  )
}

export default Commitment