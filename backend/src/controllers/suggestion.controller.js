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
            priorities: Array.isArray(priorities) ? priorities : (Array.isArray(priority) ? priority : (priority ? [priority] : [])),
        };

        const s = await Suggestion.create(toSave);
        res.status(201).json(s);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.listSuggestions = async (req, res) => {
    try {
        const items = await Suggestion.find().sort({ createdAt: -1 });
        res.json(items);
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
