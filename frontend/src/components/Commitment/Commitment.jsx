import React, { useEffect, useState } from 'react'
import './Commitment.css'

const BASE = import.meta.env.VITE_API_URL || '';

const Commitment = () => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);

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
        <p className="subtitle">ललित चन्द —राष्ट्रिय स्वतन्त्र पार्टी · सल्यान</p>
      </header>

      <section className="commitment-top">
        <img src="https://i.postimg.cc/zBqFzqdN/4d7c13e9-0be8-4a43-ae94-538876874319.jpg" alt="ललित चन्द" className="candidate-photo" />
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
                  <div className="mt-4">
                    {viewingPdf === commitment._id ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">PDF दस्तावेज</h5>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setViewingPdf(null)}
                            >
                              बन्द गर्नुहोस्
                            </button>
                            <a
                              href={commitment.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              नयाँ ट्याबमा खोल्नुहोस्
                            </a>
                            <a
                              href={commitment.pdfUrl}
                              download
                              className="btn btn-sm btn-primary"
                            >
                              डाउनलोड गर्नुहोस्
                            </a>
                          </div>
                        </div>
                        <div className="pdf-viewer-container" style={{
                          width: '100%',
                          height: '600px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <iframe
                            src={commitment.pdfUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title={`PDF: ${commitment.title}`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="commitment-actions">
                        <button
                          className="cta-primary me-2"
                          onClick={() => setViewingPdf(commitment._id)}
                        >
                           PDF हेर्नुहोस्
                        </button>
                        <a
                          href={commitment.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          डाउनलोड (PDF)
                        </a>
                      </div>
                    )}
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