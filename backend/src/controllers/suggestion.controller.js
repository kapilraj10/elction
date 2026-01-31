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

        // basic validation: required fields
        if (!localLevel || !ward || !problem || !solution) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // require at least an email or mobile so we can follow up
        if (!email && !mobile) {
            return res.status(400).json({ message: 'Either email or mobile is required' });
        }

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
            // normalize priorities: accept array, comma-separated string, or single value
            priorities: Array.isArray(priorities)
                ? priorities
                : (typeof priorities === 'string' && priorities.includes(','))
                    ? priorities.split(',').map(p => p.trim()).filter(Boolean)
                    : (priorities ? [priorities] : (Array.isArray(priority) ? priority : (priority ? [priority] : []))),
        };

        const s = await Suggestion.create(toSave);
        res.status(201).json(s);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.listSuggestions = async (req, res) => {
    try {
        // Query params: page, limit, search, status, sort
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
