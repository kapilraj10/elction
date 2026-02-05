import React, { useState, useRef } from "react";
import "../../App.css";
import "./Suggestion.css";
import locations from "../../data/locations.json";
import { toast } from "react-hot-toast";
import { validateSuggestion, postSuggestion } from "../../service/suggestion.service";

const priorityOptions = [
  "सडक",
  "विद्युत तथा सञ्चार",
  "स्वास्थ्य",
  "शिक्षा",
  "कृषि",
  "खानेपानी/सिंचाइ",
  "पर्यटन/खेलकूद",
  "उद्योग/रोजगारी",
];

const emptyData = {
  name: "",
  email: "",

  localLevel: "",
  localLevelOther: "",
  ward: "",
  street: "",
  address: "",
  mobile: "",
  problem: "",
  solution: "",
  priority: [],
  policySuggestion: "",

  extraSuggestion: "",
};

const STORAGE_KEY = "salyan_suggestions_v1";

const Suggestion = () => {
  const [formData, setFormData] = useState({ ...emptyData });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if changing localLevel, reset ward to avoid mismatch
    if (name === "localLevel") {
      setFormData((s) => ({ ...s, [name]: value, ward: "", localLevelOther: s.localLevelOther }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((s) => {
      const prev = Array.isArray(s.priority) ? s.priority : [];
      const updated = checked ? [...prev, value] : prev.filter((i) => i !== value);
      return { ...s, priority: updated };
    });
  };

  const saveToLocal = (data) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return true;
    } catch (err) {
      console.error("localStorage save failed", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // Validate using service
    const validationErrors = validateSuggestion(formData);
    if (validationErrors) {
      validationErrors.forEach((error) => {
        toast.error(error);
      });
      setSaving(false);
      return;
    }

    try {
      await postSuggestion(formData);
      toast.success("धन्यवाद! तपाईंको सुझाव सुरक्षित भयो।");
      setStatus({ type: "success", message: "धन्यवाद! तपाईंको सुझाव सुरक्षित भयो।" });
      setFormData({ ...emptyData });
      if (formRef.current) formRef.current.reset();
    } catch (err) {
      console.error("postSuggestion failed", err);

      // Check if server returned validation errors
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        err.errors.forEach((error) => {
          toast.error(error);
        });
        setStatus({ type: "error", message: "कृपया त्रुटिहरू ठीक गर्नुहोस्।" });
      } else if (err.body && err.body.invalid) {
        toast.error("Invalid priorities: " + JSON.stringify(err.body.invalid));
        setStatus({ type: "error", message: "Invalid priorities provided." });
      } else {
        // Network or server error - fallback to localStorage
        const fallback = saveToLocal(formData);
        if (fallback) {
          toast.success("इंटरनेट नभए स्थानीय रूपमा सुरक्षित गरियो — पछि सिङ्क गरिनेछ।");
          setStatus({
            type: "success",
            message: "इंटरनेट नभए स्थानीय रूपमा सुरक्षित गरियो — पछि सिङ्क गरिनेछ।",
          });
          setFormData({ ...emptyData });
          if (formRef.current) formRef.current.reset();
        } else {
          const msg = err.message || "सेभ गर्दा समस्या आयो — कृपया पुन: प्रयास गर्नुहोस्।";
          toast.error(msg);
          setStatus({ type: "error", message: msg });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="suggestion-page container">
      <div className="suggestion-card">
        <header className="suggestion-header">
          <h1> मतदाताका सुझाव</h1>
          <p className="subtitle">सल्यानका योजनाहरूमा तपाईंको आवाज महत्त्वपूर्ण छ — कृपया आफ्नो प्रतिक्रिया साझा गर्नुहोस्।</p>
        </header>

        {status && (
          <div className={`notice ${status.type === "success" ? "notice-success" : "notice-error"}`} role="status">
            {status.message}
          </div>
        )}



        <form ref={formRef} className="suggestion-form" onSubmit={handleSubmit}>
          <div className="row two-cols">
            <label>
              पूरा नाम *
              <input name="name" value={formData.name} onChange={handleChange} required />
            </label>

            <label>
              मोबाइल नम्बर *
              <input name="mobile" value={formData.mobile} onChange={handleChange} required />
            </label>

            <label>
              इमेल
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@gmail.com" required />
            </label>
          </div>

          <fieldset className="address-field">
            <legend>ठेगाना (पालिका/गाउँपालिका, वडा, सडक/टोल)</legend>

            <label>
              स्थानिय तह *
              <select name="localLevel" value={formData.localLevel} onChange={handleChange} required>
                <option value="">-- स्थानिय तह छान्नुहोस् --</option>
                {locations.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
                <option value="other">अन्य (टाइप गर्नुहोस्)</option>
              </select>
            </label>

            {formData.localLevel === 'other' && (
              <label>
                अन्य स्थानीय तह
                <input name="localLevelOther" value={formData.localLevelOther} onChange={handleChange} />
              </label>
            )}

            <label>
              वडा नं. *
              <select name="ward" value={formData.ward} onChange={handleChange} required>
                <option value="">-- वडा छान्नुहोस् --</option>
                {(() => {
                  const loc = locations.find((l) => l.name === formData.localLevel);
                  const count = loc ? Number(loc.wards) : 14;
                  return Array.from({ length: count }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={String(w)}>{`वडा ${w}`}</option>
                  ));
                })()}
              </select>
            </label>

            <label>
              सडक/टोल
              <input name="street" value={formData.street} onChange={handleChange} placeholder="सडक वा टोल नाम" />
            </label>

            <label>
              (यदि चाहनुहुन्छ) ठुलो ठेगाना विवरण
              <input name="address" value={formData.address} onChange={handleChange} placeholder="पूरा ठेगाना (वैकल्पिक)" />
            </label>
          </fieldset>

          <label>
            तपाईंको क्षेत्रमा मुख्य समस्या के छ? *
            <textarea name="problem" value={formData.problem} onChange={handleChange} required />
          </label>

          <label>
            समाधानका लागि सुझाव
            <textarea name="solution" value={formData.solution} onChange={handleChange} required />
          </label>

          <fieldset className="priority-field">
            <legend>विकास प्राथमिकता (एक वा बढी)</legend>
            <div className="checkbox-grid">
              {priorityOptions.map((item) => (
                <label key={item} className="checkbox-inline">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.priority.includes(item)}
                    onChange={handleCheckbox}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            नीतिगत सुधारका सुझाव *
            <textarea name="policySuggestion" value={formData.policySuggestion} onChange={handleChange} required />
          </label>



          <label>
            थप सुझाव
            <textarea name="extraSuggestion" value={formData.extraSuggestion} onChange={handleChange} required />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "सेभ हुँदैछ…" : " प्रतिक्रिया पठाउनुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Suggestion;