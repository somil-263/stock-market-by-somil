require('dotenv').config();
const express = require('express');

const { connectDB, sequelize } = require('./config/db');
const user = require('./models/user');

const app = express();
connectDB();

app.use(express.json());

sequelize.sync({alter: true})
.then(() => console.log("Database synced successfully"))
.catch((err) => console.log("Error syncing database", err));

const PORT = process.env.PORT || 3000;

app.use('/api/auth', require('./routes/authRoute'));
app.get('/', (req, res) => {
    res.send('Hello World!, I am somil');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});