import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { buyStockAPI, sellStockAPI } from '../services/tradeService';
import { useLocation } from 'react-router-dom';

function Trade() {
  const location = useLocation();
  const { symbol } = useParams();
  const navigate = useNavigate();

  const chartSymbol = symbol ? `BSE:${symbol.toUpperCase()}` : "BSE:SENSEX";
  const currentPrice = location.state?.price || 1400.50;

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (qty <= 0) {
      alert("Please choose atleast 1 quantity");
      return;
    }

    setLoading(true);
    try {
      const result = await buyStockAPI(symbol, qty, currentPrice);
      alert(`🎉 Success! ${result.message}\nRemaining Balance: ₹${result.remainingBalance}`);

      navigate('/app/portfolio');
    } catch (error) {
      alert(`🚨 Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (qty <= 0) return alert("At least 1 quantity is required");

    setLoading(true);
    try {
      const result = await sellStockAPI(symbol, qty, currentPrice);
      alert(`💸 Success! ${result.message}\nNew Balance: ₹${result.remainingBalance}`);
      navigate('/app/portfolio');
    } catch (error) {
      alert(`🚨 Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{symbol || "SENSEX"}</h1>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Market
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative">
        <AdvancedRealTimeChart
          theme="dark"
          symbol={chartSymbol}
          interval="15"
          timezone="Asia/Kolkata"
          style="1"
          locale="in"
          enable_publishing={false}
          hide_side_toolbar={false}
          allow_symbol_change={true}
          calendar={false}
          studies={[
            "Volume@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]}
          autosize
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">

        <div className="flex items-center bg-slate-800 rounded-xl px-4 py-2 border border-slate-700 w-full sm:w-1/3 justify-between">
          <span className="text-slate-400 font-medium text-sm">Qty</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="bg-transparent text-white font-bold text-xl w-20 text-right focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full sm:w-2/3">
          <button
            onClick={handleBuy}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : `BUY ${symbol}`}
          </button>
          <button
            onClick={handleSell}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : `SELL ${symbol}`}
          </button>
        </div>
      </div>

    </div>
  );
}

export default Trade;