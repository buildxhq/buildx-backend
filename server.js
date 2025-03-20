const http = require('http');  // Use raw HTTP to force binding

require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`~M Incoming request: ${req.method} ${req.url}`);
    next();
});

// Load API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: "🔥 BuildX Backend is Live & API is Working! 🔥" });
});

const PORT = process.env.PORT || 5000;

// ✅ Use `http.createServer()` to force binding
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server Running on Port ${PORT}`);
});

// Log when Express actually starts listening
server.on('listening', () => {
    console.log(`✅ Express is now actively listening on http://0.0.0.0:${PORT}`);
});

// Log all network connections
server.on('connection', (socket) => {
    console.log(`~M New connection from: ${socket.remoteAddress}`);
});

// Log any server errors
server.on('error', (err) => {
    console.error('❌ Server Error:', err);
});

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later"
});

app.use(limiter);

const morgan = require('morgan');
app.use(morgan('combined')); // Logs every request
