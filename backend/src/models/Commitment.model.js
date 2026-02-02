const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pdfUrl: { type: String },
    pdfPublicId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Commitment', commitmentSchema);
