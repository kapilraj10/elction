import React from 'react'
import './Commitment.css'

const Commitment = () => {
  const commitmentHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #0b2130; padding:24px; max-width:800px; margin:0 auto;">
      <h1 style="text-align:center;">केश बहादुर बिष्ट — मेरो प्रतिबद्धता</h1>
      <p>म तपाईँसामु प्रतिज्ञा गर्दछु कि म इमान्दार, पारदर्शी र जवाफदेही नेतृत्वद्वारा सल्यानको समृद्धि र जनकल्याणमा काम गर्नेछु। हरेक योजना तपाईँका आवश्यकता र प्राथमिकतामाथि आधारित हुनेछ।</p>
      <p><strong>मुख्य प्रतिबद्धताहरू:</strong></p>
      <ul>
        <li>स्थानीय पूर्वाधार: सडक, सिँचाइ र पानी व्यवस्था सुधार गर्ने।</li>
        <li>शिक्षा: गुणस्तरीय विद्यालय, शिक्षक प्रशिक्षण र छात्रवृत्ति कार्यक्रम।</li>
        <li>स्वास्थ्य: प्राथमिक स्वास्थ्य केन्द्र सुदृढीकरण र मोबाइल क्लिनिक विस्तार।</li>
        <li>रोजगारी: युवा सीप विकास, साना उद्यम र स्थानीय रोजगारी योजना।</li>
        <li>कृषि: आधुनिक खेती, बजार पहुँच र किसानलाई सिधा सहयोग।</li>
      </ul>
      <p>सबै योजनाहरू पारदर्शी तरिकाले अघि बढाइनेछन् र प्रगतिको विवरण नियमित रूपमा सार्वजनिक गरिनेछ। तपाईँको सुझाव र प्रतिक्रिया मेरो कामको अभिन्न अंग हुनेछ।</p>
      <p style="text-align:center; margin-top:28px;">हामी एकत्रित भएर सल्यानलाई समृद्ध बनाउनेछौं।</p>
    </div>
  `

  const downloadPdf = () => {
    // Open a new window and write printable HTML, user can Save as PDF from print dialog
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>मेरो प्रतिबद्धता - केश बहादुर बिष्ट</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #0b2130; padding: 24px; }
            h1 { text-align: center; }
            ul { margin-left: 1rem; }
          </style>
        </head>
        <body>
          ${commitmentHtml}
        </body>
      </html>
    `)
    printWindow.document.close();
    // Give the window a moment to render before calling print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 300);
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
          <div className="commitment-actions">
            <button className="cta-primary" onClick={downloadPdf}>डाउनलोड (PDF)</button>
          </div>
        </div>
      </section>

      <section className="commitment-body">
        <p>म तपाईँसामु प्रतिज्ञा गर्दछु कि म इमान्दार, पारदर्शी र जवाफदेही नेतृत्वद्वारा सल्यानको समृद्धि र जनकल्याणमा काम गर्नेछु। हरेक योजना तपाईँका आवश्यकता र प्राथमिकतामाथि आधारित हुनेछ।</p>

        <h3>मुख्य प्रतिबद्धताहरू</h3>
        <ul>
          <li>स्थानीय पूर्वाधार: सडक, सिँचाइ र पानी व्यवस्था सुधार गर्ने।</li>
          <li>शिक्षा: गुणस्तरीय विद्यालय, शिक्षक प्रशिक्षण र छात्रवृत्ति कार्यक्रम।</li>
          <li>स्वास्थ्य: प्राथमिक स्वास्थ्य केन्द्र सुदृढीकरण र मोबाइल क्लिनिक विस्तार।</li>
          <li>रोजगारी: युवा सीप विकास, साना उद्यम र स्थानीय रोजगारी योजना।</li>
          <li>कृषि: आधुनिक खेती, बजार पहुँच र किसानलाई सिधा सहयोग।</li>
        </ul>

        <p>सबै योजनाहरू पारदर्शी तरिकाले अघि बढाइनेछन् र प्रगतिको विवरण नियमित रूपमा सार्वजनिक गरिनेछ। तपाईँको सुझाव र प्रतिक्रिया मेरो कामको अभिन्न अंग हुनेछ।</p>

        <div className="commitment-actions">
          <button className="cta-primary" onClick={downloadPdf}>डाउनलोड (PDF)</button>
        </div>
      </section>
    </div>
  )
}

export default Commitment