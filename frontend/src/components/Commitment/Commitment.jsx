import React, { useEffect, useState } from "react";
import "./Commitment.css";

const BASE = import.meta.env.VITE_API_URL || "";

const Commitment = () => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommitments = async () => {
      try {
        const url = BASE ? `${BASE}/api/commitments` : "/api/commitments";
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Server Error: ${res.status}`);
        }

        const data = await res.json();
        setCommitments(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error("Failed to fetch commitments:", err);
        setError(err.message || "Failed to load commitments");
      } finally {
        setLoading(false);
      }
    };

    fetchCommitments();
  }, []);

  if (loading) {
    return (
      <div className="commitment-page container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading commitments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commitment-page container">
        <div className="alert alert-danger mt-5">
          <h4>Error Loading Commitments</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commitment-page container">
      <header className="commitment-header text-center mb-4">
        <h1>मेरो प्रतिबद्धता</h1>
        <p className="subtitle">
          ललित चन्द — राष्ट्रिय स्वतन्त्र पार्टी · सल्यान
        </p>
      </header>

      <section className="commitment-top d-flex flex-wrap align-items-center justify-content-center gap-4 mb-5">
        <img
          src="https://i.postimg.cc/zBqFzqdN/4d7c13e9-0be8-4a43-ae94-538876874319.jpg"
          alt="ललित चन्द"
          className="candidate-photo rounded shadow"
        />
        <div className="commitment-profile text-center">
          <h2>एक इमान्दार नेतृत्वका लागि</h2>
          <p>
            म तपाईँसँग प्रतिज्ञा गर्दछु — पारदर्शिता, जवाफदेहिता र दिगो विकासका
            लागि काम गर्नेछु। मेरो प्राथमिकता स्थानीय सेवा र जनताको सीधो फाइदा हो।
          </p>
          <p>
            यो अभिलेखले हाम्रो योजना र प्रतिबद्धतालाई सारांशित गर्दछ. पूर्ण
            दस्तावेज डाउनलोड गर्न तलको बटन प्रयोग गर्नुहोस्।
          </p>
        </div>

        {commitments.length === 0 ? (
          <div className="text-center text-muted py-5 w-100">
            <p>प्रतिबद्धताहरू अझै प्रकाशित भएका छैनन्।</p>
          </div>
        ) : (
          commitments.map((commitment) => (
            <div key={commitment._id} className="w-100 d-flex justify-content-center">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  {commitment.pdfUrl && (
                    <div className="commitment-actions">
                      <a
                        href={commitment.pdfUrl}
                        download
                        className="btn btn-primary btn-lg"
                      >
                        डाउनलोड प्रतिबद्धता (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Commitment;
