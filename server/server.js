require('dotenv').config();
const express = require('express');

const { connectDB, sequelize } = require('./config/db');

const user = require('./models/user');
const stock = require('./models/stock');
const portfolio = require('./models/portfolio');
const transaction = require('./models/transaction');

user.hasMany(portfolio, {foreignKey: 'userID'});
portfolio.belongsTo(user, {foreignKey: 'userID'});
user.hasMany(transaction, {foreignKey: 'userId'});
transaction.belongsTo(user, {foreignKey: 'userId'});

const app = express();
connectDB();

app.use(express.json());

sequelize.sync({alter: true})
.then(() => console.log("Database synced successfully"))
.catch((err) => console.log("Error syncing database", err));

const PORT = process.env.PORT || 3000;

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/trade', require('./routes/tradeRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World!, I am somil');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});