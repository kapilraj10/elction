const Commitment = require('../models/Commitment.model');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

exports.createCommitment = async (req, res) => {
    try {
        const payload = { ...req.body, createdBy: req.user && req.user._id };

        // handle uploaded pdf in req.file (multer memory storage)
        if (req.file && req.file.buffer) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'raw', folder: 'commitments' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            payload.pdfUrl = uploadResult.secure_url;
            payload.pdfPublicId = uploadResult.public_id;
        }

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
        const payload = { ...req.body };

        // if new file uploaded, remove previous then upload
        if (req.file && req.file.buffer) {
            const existing = await Commitment.findById(req.params.id);
            if (existing && existing.pdfPublicId) {
                try { await cloudinary.uploader.destroy(existing.pdfPublicId, { resource_type: 'raw' }); } catch (e) { /* ignore */ }
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'raw', folder: 'commitments' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            payload.pdfUrl = uploadResult.secure_url;
            payload.pdfPublicId = uploadResult.public_id;
        }

        const c = await Commitment.findByIdAndUpdate(req.params.id, payload, { new: true });
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
        if (c.pdfPublicId) {
            try { await cloudinary.uploader.destroy(c.pdfPublicId, { resource_type: 'raw' }); } catch (e) { /* ignore */ }
        }
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
