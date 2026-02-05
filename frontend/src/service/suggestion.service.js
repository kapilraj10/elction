const BASE = import.meta.env.VITE_API_URL || "";

export const validateSuggestion = (data) => {
    const errors = [];

    // Validate name
    if (!data.name || !data.name.trim()) {
        errors.push("नाम आवश्यक छ");
    }

    // Validate mobile
    if (!data.mobile || !data.mobile.trim()) {
        errors.push("मोबाइल नम्बर आवश्यक छ");
    } else if (!/^[0-9]{10}$/.test(data.mobile.trim())) {
        errors.push("मोबाइल नम्बर १० अंकको हुनुपर्छ");
    }

    // Validate email
    if (!data.email || !data.email.trim()) {
        errors.push("इमेल आवश्यक छ");
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.push("इमेल ठीक छैन");
    }

    // Validate local level
    if (!data.localLevel || !data.localLevel.trim()) {
        errors.push("स्थानिय तह आवश्यक छ");
    }

    // Validate other local level if selected
    if (data.localLevel === "other" && (!data.localLevelOther || !data.localLevelOther.trim())) {
        errors.push("अन्य स्थानीय तह लेख्नुहोस्");
    }

    // Validate ward
    if (!data.ward || !data.ward.trim()) {
        errors.push("वडा आवश्यक छ");
    }

    // Validate problem
    if (!data.problem || !data.problem.trim()) {
        errors.push("समस्या लेख्नुहोस्");
    }

    // Validate policy suggestion
    if (!data.policySuggestion || !data.policySuggestion.trim()) {
        errors.push("नीतिगत सुझाव लेख्नुहोस्");
    }

    return errors.length > 0 ? errors : null;
};

export const postSuggestion = async (data) => {
    const res = await fetch(`${BASE}/api/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const clone = res.clone();
        let errorData;

        try {
            errorData = await res.json();
        } catch {
            try {
                const text = await clone.text();
                errorData = { message: text || "Server error" };
            } catch {
                errorData = { message: `HTTP ${res.status}` };
            }
        }

        const error = new Error(errorData.message || "Server error");
        error.status = res.status;
        error.errors = errorData.errors || [];
        error.body = errorData;
        throw error;
    }

    return res.json();
};
