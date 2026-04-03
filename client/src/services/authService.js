import axios from 'axios';

const API_URL = 'https://empire-trading-backend.onrender.com/api/auth'; 

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Something went wrong';
    }
};

const verifyOTP = async (verifyData) => {
    try {
        const response = await axios.post(`${API_URL}/verify`, verifyData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Invalid OTP. Please try again.';
    }
};

const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginData);
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || 'Invalid email or password';
    }
};

const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error sending reset email';
    }
};

const resetPassword = async (resetData) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, resetData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error resetting password';
    }
};

export { registerUser, verifyOTP, loginUser, requestPasswordReset, resetPassword };
