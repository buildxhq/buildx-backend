const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const aiRoutes = require('./routes/ai');
const stripeRoutes = require('./routes/stripe');
const uploadRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const aiLogRoutes = require('./routes/ai-log');
const notificationRoutes = require('./routes/notifications');
const activityRoutes = require('./routes/activity');
const flagRoutes = require('./routes/flags');
const messageRoutes = require('./routes/messages');

const app = express();
app.set('trust proxy', 1); // ✅ Fixes "X-Forwarded-For" proxy error

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: ["http://localhost:3000", "https://www.buildxbid.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
console.log("✅ CORS is enabled for:", ["http://localhost:3000", "https://www.buildxbid.com"]);

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Apply rate limiting before defining routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

// ✅ Apply logging before routes
app.use(morgan('combined'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`~M Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Load API routes AFTER middleware is applied
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai-log', aiLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: " M-% BuildX Backend is Live & API is Working!  M-%" });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(` M-% Server Running on Port ${PORT}`);
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

// ✅ Handle Uncaught Errors to Prevent Crashes
process.on('uncaughtException', (err) => {
  console.error(' M-% Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

