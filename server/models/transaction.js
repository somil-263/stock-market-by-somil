const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stockSymbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionType: {
        type: DataTypes.ENUM('BUY', 'SELL'),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priceAtTransaction: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Transaction;