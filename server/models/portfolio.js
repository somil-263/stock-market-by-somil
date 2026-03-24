const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const Portfolio = sequelize.define('Portfolio', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stockSymbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    averagePrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{
    timestamps: true
})

module.exports = Portfolio;