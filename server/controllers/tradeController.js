const User = require('../models/user');

const tradeService = require('../services/tradeService');

const buyStock = async (req, res) => {
    try{
        const {symbol, quantity} = req.body;
        const userId = req.user.id;

        if(quantity <= 0) return res.status(400).json({message: "Quantity must be greater than 0"})

        const result = await tradeService.executeBuy(userId, symbol, quantity);

        res.status(200).json(result)
    }
    catch(error){
        res.status(500).json({message: "Internal server error", details: error.message});
    }
}

const sellStock = async (req, res) => {
    try{
        const {symbol, quantity} = req.body;
        if(quantity <= 0){
            return res.status(400).json({message: "Quantity must be greater than 0"});
        }
        const userId = req.user.id;

        const result = await tradeService.executeSell(userId, symbol, quantity);

        res.status(200).json(result);
    }
    catch(error){
        res.status(500).json({message: "Internal server error", details: error.message});
    }
}

const getPortfolio = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        const result = await tradeService.executePortfolio(userId);
        

        res.status(200).json({
            message: "My Portfolio",
            currentBalance: user.balance,
            totalUniqueStocks: result.length,
            portfolio: result
        })
    }
    catch(error){
        res.status(500).json({message: "Internal server error", details: error.message});
    }
}

const getPassbook = async (req, res) => {
    try{
        const userId = req.user.id;
        
        const history = await tradeService.executeTransactionHistory(userId);
        
        res.status(200).json({
            message: "Passbook",
            totalTransaction: history.length,
            history: history
        })
    }
    catch(error){
        res.status(500).json({message: "Internal server error", details: error.message})
    }
}


module.exports = {
    buyStock,
    sellStock,
    getPortfolio,
    getPassbook
}