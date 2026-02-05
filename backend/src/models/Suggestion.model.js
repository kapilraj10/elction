const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return typeof v === 'string' && /^[0-9()+\s-]{7,20}$/.test(v);
                },
                message: props => `${props.value} is not a valid mobile number`
            }
        },

        localLevel: {
            type: String,
            required: true,
        },

        localLevelOther: {
            type: String,
        },

        ward: {
            type: String,
        },

        street: {
            type: String,
        },

        address: {
            type: String,
        },

        problem: {
            type: String,
            required: true,
        },

        solution: {
            type: String,
        },

        policySuggestion: {
            type: String,
        },

        extraSuggestion: {
            type: String,
        },

        priorities: [
            {
                type: String,
                enum: [
                    'सडक',
                    'विद्युत तथा सञ्चार',
                    'स्वास्थ्य',
                    'शिक्षा',
                    'कृषि',
                    'खानेपानी/सिंचाइ',
                    'पर्यटन/खेलकूद',
                    'उद्योग/रोजगारी'
                ]
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
