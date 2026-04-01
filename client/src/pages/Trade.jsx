import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

function Trade() {
  const { symbol } = useParams(); // URL se stock ka naam nikalenge
  const navigate = useNavigate();
  
  // TradingView ko format pasand hai: "EXCHANGE:SYMBOL" (jaise "BSE:RELIANCE")
  const chartSymbol = symbol ? `BSE:${symbol.toUpperCase()}` : "BSE:SENSEX";

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      
      {/* 🔙 Top Bar: Back Button & Stock Name */}
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

      {/* 📊 THE TRADINGVIEW CHART (Here is the Magic!) */}
      <div className="flex-1 w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative">
        <AdvancedRealTimeChart
          theme="dark"
          symbol={chartSymbol}
          interval="15" // 15 minute candles
          timezone="Asia/Kolkata"
          style="1" // 1 = Candlestick
          locale="in"
          enable_publishing={false}
          hide_side_toolbar={false} // 👈 YAHI HAI TERA EDIT OPTION! (Trendlines, Fibonacci sab aayega yahan se)
          allow_symbol_change={true}
          calendar={false}
          studies={[
            "Volume@tv-basicstudies", // Niche Volume bars dikhayega
            "RSI@tv-basicstudies"     // RSI Indicator jodne ke liye
          ]}
          autosize // Chart container ke hisaab se fit ho jayega
        />
      </div>

      {/* 💰 BUY / SELL Action Bar (Mobile pe sticky rahega) */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] text-lg">
          BUY {symbol}
        </button>
        <button className="bg-red-600 hover:bg-red-500 text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] text-lg">
          SELL {symbol}
        </button>
      </div>

    </div>
  );
}

export default Trade;