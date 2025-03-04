require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');
const businessRoutes = require('./routes/business');
const clientsRoutes = require('./routes/clients');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/clients', clientsRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('✅ Reviewi.ai Backend is Running!');
});

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: '❌ No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(403).json({ msg: '❌ Token is not valid' });
    }
};

// Test Protected Route
app.get('/api/protected-route', verifyToken, (req, res) => {
    res.json({ msg: '✅ Access granted to protected route!', user: req.user });
});

// Handle Undefined Routes (404 Error)
app.use((req, res) => {
    res.status(404).json({ error: '❌ API route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
