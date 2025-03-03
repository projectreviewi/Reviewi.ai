const express = require('express');
const Review = require('../models/Review');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', verifyToken, async (req, res) => {
    const { product, sentiment } = req.body;

    if (!product || !sentiment) {
        return res.status(400).json({ msg: 'Product and sentiment are required' });
    }

    try {
        const generatedReview = `Generated AI review for ${product} with a ${sentiment} sentiment.`;

        const newReview = new Review({
            user: req.user.id,
            product,
            reviewText: generatedReview,
            sentiment,
            status: 'pending',
            flagged: false
        });

        await newReview.save();
        res.json({ msg: 'Review generated and saved for approval', review: newReview });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.patch('/customize/:id', verifyToken, async (req, res) => {
    try {
        const { reviewText } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        review.reviewText = reviewText;

        if (reviewText.includes('bad') || reviewText.includes('issue') || reviewText.includes('not helpful')) {
            review.flagged = true;
        }

        await review.save();
        res.json({ msg: 'Review updated', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/approve/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ msg: 'Review not found' });

        review.status = 'approved';
        await review.save();
        res.json({ msg: 'Review approved', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/reject/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ msg: 'Review not found' });

        review.status = 'rejected';
        await review.save();
        res.json({ msg: 'Review rejected', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/user-reviews', verifyToken, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/flagged-reviews', verifyToken, async (req, res) => {
    try {
        const flaggedReviews = await Review.find({ flagged: true });
        res.json(flaggedReviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
