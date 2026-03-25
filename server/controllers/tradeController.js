const {sequelize} = require('../config/db');
const User = require('../models/user');
const Stock = require('../models/stock');
const portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');

const buyStock = async (req, res) => {
    const t = await sequelize.transaction();

    try{
        const {symbol, quantity} = req.body;
        const userId = req.user.id;

        const stock = await Stock.findOne({where: {symbol: symbol.toUpperCase()}});
        if(!stock){
            return res.status(404).json({message: "Stock not found"});
        }

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const totalCost = stock.currentPrice * quantity;
        if(user.balance < totalCost){
            return res.status(400).json({message: "Insufficient balance"});
        }

        user.balance -= totalCost;
        await user.save({transaction: t});

        let portfolioItem = await portfolio.findOne({where: {userId, stockSymbol: stock.symbol}, transaction: t});
        if(portfolioItem){
            const oldMoney = portfolioItem.quantity * portfolioItem.averagePrice;
            const newTotalValue = oldMoney + totalCost;

            portfolioItem.quantity += quantity;
            portfolioItem.averagePrice = newTotalValue / portfolioItem.quantity;
            await portfolioItem.save({transaction: t});
        }
        else{
            await portfolio.create({
                userId,
                stockSymbol: stock.symbol,
                quantity,
                averagePrice: stock.currentPrice
            }, {transaction: t});
        }

        await Transaction.create({
            userId,
            stockSymbol: stock.symbol,
            transactionType: 'BUY',
            quantity,
            priceAtTransaction: stock.currentPrice,
            totalAmount: totalCost
        }, { transaction: t });

        await t.commit();
        res.status(200).json({message: "Stock bought successfully", remainingBalance: user.balance});
    }
    catch(error){
        await t.rollback();
        res.status(500).json({message: "Internal server error", details: error.message});
    }
}

const getPortfolio = async (req, res) => {
    try{
        const userId = req.user.id;

        const myPortfolio = await portfolio.findAll({where: {userId: userId}, attributes: ['stockSymbol', 'quantity', 'averagePrice', 'updatedAt']});
        
        const user = await User.findByPk(userId);

        res.status(200).json({
            message: "My Portfolio",
            currentBalance: user.balance,
            totalUniqueStocks: myPortfolio.length,
            portfolio: myPortfolio
        })
    }
    catch(error){
        res.status(500).json({message: "Internal server error", details: error.message});
    }
}

module.exports = {
    buyStock,
    getPortfolio
}