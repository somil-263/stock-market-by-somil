import React, { createContext, useState, useEffect } from 'react';
import { fetchPortfolioAPI } from '../services/tradeService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [globalLoading, setGlobalLoading] = useState(true);

  const loadUserData = async () => {
    setGlobalLoading(true);
    try {
      const data = await fetchPortfolioAPI();
      setBalance(data.currentBalance || 0);
      setUsername(data.name || "Pro Trader");
    } catch (error) {
      console.error("Global Store Error:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const updateBalanceLocally = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <UserContext.Provider value={{ balance, username, globalLoading, updateBalanceLocally, refreshData: loadUserData }}>
      {children}
    </UserContext.Provider>
  );
};