const express = require('express');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const fileRoutes = require('./routes/files');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/files', fileRoutes);

app.listen(PORT, '0.0.0.0', () => console.log(`🔥 Server Running on Port ${PORT}`));
