require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow URL-encoded data
app.use((req, res, next) => {
    console.log(`🔍 Incoming request: ${req.method} ${req.url}`);
    next();
});

// Load API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: "BuildX Backend is Live & API is Working!" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🔥 Server Running on Port ${PORT}`);
});

// Log when the server actually starts listening
server.on('listening', () => {
    console.log(`✅ Express is now actively listening on http://0.0.0.0:${PORT}`);
});

// Log any server errors
server.on('error', (err) => {
    console.error('❌ Server Error:', err);
});

