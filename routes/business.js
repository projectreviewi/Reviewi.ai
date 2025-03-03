const express = require('express');
const Review = require('../models/Review');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/reviews', verifyToken, async (req, res) => {
    try {
        const reviews = await Review.find();
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

router.get('/posted-reviews', verifyToken, async (req, res) => {
    try {
        const postedReviews = await Review.find({ status: 'posted' });
        res.json(postedReviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/auto-posted-reviews', verifyToken, async (req, res) => {
    try {
        const autoPostedReviews = await Review.find({ status: 'auto-posted' });
        res.json(autoPostedReviews);
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

router.put('/select-platforms/:id', verifyToken, async (req, res) => {
    try {
        const { platforms } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        review.platforms = platforms;
        await review.save();

        res.json({ msg: 'Platforms updated successfully', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/post-review/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ msg: 'Review not found' });

        if (review.status !== 'approved') {
            return res.status(400).json({ msg: 'Only approved reviews can be posted' });
        }

        review.status = 'posted';
        await review.save();
        res.json({ msg: 'Review posted successfully', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/auto-post/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ msg: 'Review not found' });

        if (review.status !== 'approved') {
            return res.status(400).json({ msg: 'Only approved reviews can be auto-posted' });
        }

        review.status = 'auto-posted';
        await review.save();
        res.json({ msg: 'Review auto-posted successfully', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.delete('/remove-review/:id/:platform', verifyToken, async (req, res) => {
    try {
        const { id, platform } = req.params;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        review.platforms = review.platforms.filter(p => p !== platform);

        await review.save();
        res.json({ msg: `Review removed from ${platform}`, review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
