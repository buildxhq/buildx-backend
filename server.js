require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`🔥 Server Running on Port ${PORT}`));

