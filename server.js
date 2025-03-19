require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth'); // Make sure this exists
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');

const app = express();
app.use(express.json());

// Load API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: "🔥 BuildX Backend is Live & API is Working! 🔥" });
});


app.listen(PORT, '0.0.0.0', () => console.log(`🔥 Server Running on Port ${PORT}`));

