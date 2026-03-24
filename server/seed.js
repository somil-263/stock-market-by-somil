const {sequelize} = require('./config/db');
const stock = require('./models/stock');

const seedMarket = async () => {
    try{
        await sequelize.authenticate();

        const initialStock = [
            { symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 2950.50 },
            { symbol: 'TATAMOTORS', name: 'Tata Motors', currentPrice: 1050.25 },
            { symbol: 'ZOMATO', name: 'Zomato Ltd', currentPrice: 180.10 },
            { symbol: 'HDFCBANK', name: 'HDFC Bank', currentPrice: 1440.00 },
            { symbol: 'JIOFIN', name: 'Jio Financial Services', currentPrice: 350.75 }
        ]

        await stock.bulkCreate(initialStock, { ignoreDuplicates: true });
        console.log("Database seeded successfully");
        process.exit();
    }catch(error){
        console.log("Error seeding market", error);
        process.exit(1);
    }
}

seedMarket();