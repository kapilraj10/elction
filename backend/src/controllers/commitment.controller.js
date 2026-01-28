const Commitment = require('../models/Commitment.model');

exports.createCommitment = async (req, res) => {
    try {
        const payload = { ...req.body, createdBy: req.user && req.user._id };
        const c = await Commitment.create(payload);
        res.status(201).json(c);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.listCommitments = async (req, res) => {
    try {
        // public: only published unless admin requested
        if (req.user && req.user.role === 'admin') {
            const items = await Commitment.find().sort({ order: 1 });
            return res.json(items);
        }
        const items = await Commitment.find({ published: true }).sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCommitment = async (req, res) => {
    try {
        const c = await Commitment.findById(req.params.id);
        if (!c) return res.status(404).json({ message: 'Not found' });
        res.json(c);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCommitment = async (req, res) => {
    try {
        const c = await Commitment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!c) return res.status(404).json({ message: 'Not found' });
        res.json(c);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCommitment = async (req, res) => {
    try {
        const c = await Commitment.findByIdAndDelete(req.params.id);
        if (!c) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
