const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Stock = sequelize.define('Stock', {
    symbol:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    currentPrice:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{
    timestamps: true
})

module.exports = Stock;