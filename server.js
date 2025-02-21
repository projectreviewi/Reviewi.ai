require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB Connected'))
   .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);

app.get('/', (req, res) => {
    res.send('Reviewi.ai Backend is Running!');
});

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Token is not valid' });
    }
};

app.get('/api/protected-route', verifyToken, (req, res) => {
    res.json({ msg: 'Access granted to protected route!', user: req.user });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying another port...`);
        setTimeout(() => {
            app.listen(PORT + 1);
        }, 1000);
    } else {
        console.error('Server error:', err);
    }
});
