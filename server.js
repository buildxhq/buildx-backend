const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BuildX Backend is Running!');
});

// Authentication Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});


