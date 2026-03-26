const { sequelize } = require('../config/db');
const User = require('../models/user');
const Stock = require('../models/stock');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');

const executeBuy = async (userId, symbol, quantity) => {
    const t = await sequelize.transaction();

    try{
        const stock = await Stock.findOne({where: {symbol: symbol.toUpperCase()}});
        if(!stock) throw new Error("Stock not found");

        const user = await User.findByPk(userId, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        const totalCost = quantity * stock.currentPrice;

        if(totalCost > user.balance) throw new Error("Insufficient balance");
        
        user.balance -= totalCost;
        await user.save({transaction: t});

        const portfolioItem = await Portfolio.findOne({
            where: {userId, stockSymbol: stock.symbol},
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if(portfolioItem){
            const oldCost = portfolioItem.quantity * portfolioItem.averagePrice;
            portfolioItem.quantity += quantity;
            portfolioItem.averagePrice = (oldCost + totalCost) / portfolioItem.quantity;
            await portfolioItem.save({transaction: t});
        }
        else{
            await Portfolio.create({
                userId,
                stockSymbol: stock.symbol,
                quantity,
                averagePrice: stock.currentPrice
            }, {transaction: t});
        }

        await Transaction.create({
            userId,
            stockSymbol: stock.symbol,
            transactionType: "BUY",
            quantity,
            priceAtTransaction: stock.currentPrice,
            totalAmount: totalCost
        }, {transaction: t});
        
        await t.commit();
        return {
            message: "Stock Bought Successfully",
            remainingBalance: user.balance
        }
    }
    catch(error){
        t.rollback();
        throw error;
    }
}

const executeSell = async (userId, symbol, quantity) => {
    const t = await sequelize.transaction();

    try{
        const stock = await Stock.findOne({where: {symbol: symbol.toUpperCase()}});
        if(!stock) throw new Error("Stock not found");

        const user = await User.findByPk(userId, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if(!user) throw new Error("User not found");

        if(quantity <= 0) throw new Error("Invalid quantity");

        const PortfolioItem = await Portfolio.findOne({
            where: {userId, stockSymbol: stock.symbol},
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if(!PortfolioItem) throw new Error("Stock not found in portfolio");
        
        if(PortfolioItem.quantity < quantity) throw new Error("Insufficient quantity");

        const totalAmount = quantity * stock.currentPrice;

        user.balance += totalAmount;
        await user.save({transaction: t});

        PortfolioItem.quantity -= quantity;
        if(PortfolioItem.quantity === 0){
            await PortfolioItem.destroy({transaction: t});
        }
        else{
            await PortfolioItem.save({transaction: t});
        }

        await Transaction.create({
            userId,
            stockSymbol: stock.symbol,
            transactionType: "SELL",
            quantity,
            priceAtTransaction: stock.currentPrice,
            totalAmount: totalAmount
        }, {transaction: t});
        
        await t.commit();
        return {
            message: "Stock Sold Successfully",
            remainingBalance: user.balance
        }
    }
    catch(error){
        t.rollback();
        throw error;
    }
}

const executePortfolio = async (userId) => {
    const portfolio = await Portfolio.findAll({where: {userId}, attributes: ['stockSymbol', 'quantity', 'averagePrice', 'updatedAt']});
    return portfolio;
}

const executeTransactionHistory = async (userId) => {
    const transactions = await Transaction.findAll({where: {userId}, order: [['createdAt', 'DESC']]});
    return transactions;
}

module.exports = { executeBuy, executeSell, executePortfolio, executeTransactionHistory };