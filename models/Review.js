const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: String, required: true },
    reviewText: { type: String, required: true },
    sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'posted', 'auto-posted'], default: 'pending' },
    flagged: { type: Boolean, default: false },
    platforms: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
