import React, { useState, useEffect } from 'react';
import { fetchPassbookAPI } from '../services/tradeService';

function History() {
  const [orders, setOrders] = useState([]);
  const [totalTxn, setTotalTxn] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPassbook = async () => {
      try {
        const data = await fetchPassbookAPI();
        setOrders(data.history); 
        setTotalTxn(data.totalTransaction);
      } catch (error) {
        console.error("Error fetching passbook:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPassbook();
  }, []);

  if (loading) {
    return <div className="text-center text-slate-400 mt-20 font-bold animate-pulse">Fetching your Passbook... 📖</div>;
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-white">My Passbook</h1>
        <div className="text-right">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Orders</p>
            <p className="text-lg font-bold text-indigo-400">{totalTxn}</p>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center bg-slate-900 rounded-xl p-8 border border-slate-800">
          <p className="text-slate-400">No past transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isBuy = order.transactionType === 'BUY';
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return (
              <div key={order.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isBuy ? 'B' : 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-lg">{order.stockSymbol}</h4>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <p className="text-slate-300 font-medium text-sm">
                    {order.quantity} Qty @ ₹{Number(order.priceAtTransaction).toLocaleString('en-IN')}
                  </p>
                  <p className={`font-bold text-lg ${isBuy ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isBuy ? '-' : '+'}₹{Number(order.totalAmount).toLocaleString('en-IN')}
                  </p>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default History;