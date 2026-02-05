const Suggestion = require('../models/Suggestion.model');

exports.createSuggestion = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            localLevel,
            localLevelOther,
            ward,
            street,
            address,
            problem,
            solution,
            policySuggestion,
            youthProgram,
            expectation,
            fiveYearPlan,
            extraSuggestion,
            priority,
            priorities,
        } = req.body;
        const errors = [];
        const emailRegex = /\S+@\S+\.\S+/;
        const mobileRegex = /^[0-9()+\s-]{7,20}$/;

        if (!name || !name.toString().trim()) errors.push('Name is required');
        if (!mobile || !mobileRegex.test(mobile)) errors.push('Valid mobile number is required');
        if (email && !emailRegex.test(email)) errors.push('Email is invalid');
        if (!localLevel || !localLevel.toString().trim()) errors.push('localLevel is required');
        if (!problem || !problem.toString().trim()) errors.push('Problem description is required');

        if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

        const toSave = {
            name,
            email,
            mobile,
            localLevel,
            localLevelOther,
            ward,
            street,
            address,
            problem,
            solution,
            policySuggestion,
            youthProgram,
            expectation,
            fiveYearPlan,
            extraSuggestion,
            priorities: Array.isArray(priorities)
                ? priorities
                : (typeof priorities === 'string' && priorities.includes(','))
                    ? priorities.split(',').map(p => p.trim()).filter(Boolean)
                    : (priorities ? [priorities] : (Array.isArray(priority) ? priority : (priority ? [priority] : []))),
        };
        if (toSave.priorities && toSave.priorities.length) {
            const allowed = ['सडक', 'विद्युत तथा सञ्चार', 'स्वास्थ्य', 'शिक्षा', 'कृषि', 'खानेपानी/सिंचाइ', 'पर्यटन/खेलकूद', 'उद्योग/रोजगारी'];
            const invalid = toSave.priorities.filter(p => !allowed.includes(p));
            if (invalid.length) return res.status(400).json({ message: 'Invalid priorities', invalid });
        }

        const s = await Suggestion.create(toSave);
        res.status(201).json(s);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.listSuggestions = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 20, 1);
        const search = req.query.search ? req.query.search.trim() : null;
        const sort = req.query.sort || '-createdAt';

        const filter = {};
        if (search) {
            const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [
                { name: re },
                { email: re },
                { mobile: re },
                { problem: re },
                { solution: re },
                { localLevel: re },
            ];
        }

        const total = await Suggestion.countDocuments(filter);
        const items = await Suggestion.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.json({ items, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSuggestion = async (req, res) => {
    try {
        const s = await Suggestion.findById(req.params.id);
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json(s);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSuggestion = async (req, res) => {
    try {
        const { email, mobile, priorities } = req.body;
        const errors = [];
        const emailRegex = /\S+@\S+\.\S+/;
        const mobileRegex = /^[0-9()+\s-]{7,20}$/;
        if (email && !emailRegex.test(email)) errors.push('Email is invalid');
        if (mobile && !mobileRegex.test(mobile)) errors.push('Mobile is invalid');
        if (priorities) {
            const allowed = ['सडक', 'विद्युत तथा सञ्चार', 'स्वास्थ्य', 'शिक्षा', 'कृषि', 'खानेपानी/सिंचाइ', 'पर्यटन/खेलकूद', 'उद्योग/रोजगारी'];
            const arr = Array.isArray(priorities) ? priorities : (typeof priorities === 'string' ? priorities.split(',').map(p => p.trim()) : [priorities]);
            const invalid = arr.filter(p => !allowed.includes(p));
            if (invalid.length) errors.push('Invalid priorities: ' + invalid.join(', '));
        }
        if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

        const s = await Suggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json(s);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteSuggestion = async (req, res) => {
    try {
        const s = await Suggestion.findByIdAndDelete(req.params.id);
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
