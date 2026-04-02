const { sequelize } = require('../config/db');
const User = require('../models/user');
const Stock = require('../models/stock');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const axios = require('axios');

const executeBuy = async (userId, symbol, quantity, currentPrice) => {
    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        const totalCost = quantity * currentPrice;

        if (totalCost > user.balance) throw new Error("Insufficient balance");
        
        user.balance -= totalCost;
        await user.save({transaction: t});

        const portfolioItem = await Portfolio.findOne({
            where: {userId, stockSymbol: symbol.toUpperCase()},
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (portfolioItem) {
            const oldCost = portfolioItem.quantity * portfolioItem.averagePrice;
            portfolioItem.quantity += quantity;
            portfolioItem.averagePrice = (oldCost + totalCost) / portfolioItem.quantity;
            await portfolioItem.save({transaction: t});
        } else {
            await Portfolio.create({
                userId,
                stockSymbol: symbol.toUpperCase(),
                quantity,
                averagePrice: currentPrice
            }, {transaction: t});
        }

        await Transaction.create({
            userId,
            stockSymbol: symbol.toUpperCase(),
            transactionType: "BUY",
            quantity,
            priceAtTransaction: currentPrice,
            totalAmount: totalCost
        }, {transaction: t});
        
        await t.commit();
        return {
            message: "Stock Bought Successfully",
            remainingBalance: user.balance
        };
    } catch(error) {
        await t.rollback();
        throw error;
    }
};

const executeSell = async (userId, symbol, quantityToSell, currentPrice) => {
    const t = await sequelize.transaction(); 

    try {
        const user = await User.findByPk(userId, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        
        const stock = await Portfolio.findOne({ 
            where: { userId, stockSymbol: symbol.toUpperCase() },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!stock) throw new Error("Stock not found in portfolio");
        
        const sellQty = parseFloat(quantityToSell);
        const stockQty = parseFloat(stock.quantity);
        const price = parseFloat(currentPrice);

        if (stockQty < sellQty) throw new Error("Insufficient stock quantity");

        const totalSaleAmount = price * sellQty;
        const currentBalance = parseFloat(user.balance);
        
        user.balance = currentBalance + totalSaleAmount;
        user.changed('balance', true); 
        await user.save({ transaction: t });

        stock.quantity = stockQty - sellQty;
        
        if (stock.quantity <= 0) {
            await stock.destroy({ transaction: t });
        } else {
            await stock.save({ transaction: t });
        }

        await Transaction.create({
            userId,
            stockSymbol: symbol.toUpperCase(),
            transactionType: 'SELL',
            quantity: sellQty,
            priceAtTransaction: price,
            totalAmount: totalSaleAmount
        }, { transaction: t });

        await t.commit();
        return { 
            message: "Stock successfully sold!", 
            newBalance: user.balance, 
            saleAmount: totalSaleAmount 
        };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const executePortfolio = async (userId) => {
    const portfolio = await Portfolio.findAll({
        where: {userId}, 
        attributes: ['stockSymbol', 'quantity', 'averagePrice', 'updatedAt']
    });
    return portfolio;
};

const executeTransactionHistory = async (userId) => {
    const transactions = await Transaction.findAll({
        where: {userId}, 
        order: [['createdAt', 'DESC']]
    });
    return transactions;
};

module.exports = { executeBuy, executeSell, executePortfolio, executeTransactionHistory };