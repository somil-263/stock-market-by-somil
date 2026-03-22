require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!, I am somil');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});