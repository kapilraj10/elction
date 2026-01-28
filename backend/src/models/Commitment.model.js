const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Commitment', commitmentSchema);
