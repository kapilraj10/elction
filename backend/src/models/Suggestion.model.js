const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    localLevel: { type: String },
    localLevelOther: { type: String },
    ward: { type: String },
    street: { type: String },
    address: { type: String },
    problem: { type: String },
    solution: { type: String },
    policySuggestion: { type: String },
    youthProgram: { type: String },
    expectation: { type: String },
    fiveYearPlan: { type: String },
    extraSuggestion: { type: String },
    priorities: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
