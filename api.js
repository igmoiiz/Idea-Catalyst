const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Routes
const authRoutes = require('./api/src/routes/auth.routes');
const ideaRoutes = require('./api/src/routes/idea.routes');
const personaRoutes = require('./api/src/routes/persona.routes');
const marketplaceRoutes = require('./api/src/routes/marketplace.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB (cached connection for serverless)
let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = connection;
    return connection;
}

// Connect on first request
app.use(async (req, res, next) => {
    try {
        if (!cachedDb) {
            await connectToDatabase();
        }
        next();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        next(error);
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic route
app.get('/api', (req, res) => {
    res.json({ message: 'IdeaCatalyst API is running' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
