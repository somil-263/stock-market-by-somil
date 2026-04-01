import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trade';

const buyStockAPI = async (symbol, quantity, price) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post(`${API_URL}/buy`, 
            { symbol, quantity: Number(quantity), currentPrice: Number(price) },
            { headers: { Authorization: `Bearer ${token}` } } 
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Trade failed due to server error';
    }
};

const sellStockAPI = async (symbol, quantity, price) => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.post(`${API_URL}/sell`, 
            { symbol, quantity: Number(quantity), currentPrice: Number(price) },
            { headers: { Authorization: `Bearer ${token}` } } 
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Sell failed due to server error';
    }
};

const fetchPortfolioAPI = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL}/portfolio`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || 'Portfolio load nahi ho paya';
    }
};

const fetchPassbookAPI = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL}/passbook`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Passbook load nahi ho payi';
    }
};

export { buyStockAPI, sellStockAPI, fetchPortfolioAPI, fetchPassbookAPI };