import { useState, useEffect, useRef } from 'react';

const useBinanceTicker = (symbolsToTrack) => {
  const [data, setData] = useState({});
  const ws = useRef(null);

  useEffect(() => {
    if (!symbolsToTrack || symbolsToTrack.length === 0) return;

    ws.current = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
    
    let lastUpdateTime = Date.now();

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const updates = {};

      parsed.forEach(ticker => {
        if (symbolsToTrack.includes(ticker.s)) {
          updates[ticker.s] = {
            price: parseFloat(ticker.c),
            change: parseFloat(ticker.P)
          };
        }
      });

      if (Object.keys(updates).length > 0 && Date.now() - lastUpdateTime > 100) {
        setData(prev => {
          const nextState = { ...prev };
          Object.keys(updates).forEach(sym => {
            nextState[sym] = {
              ...updates[sym],
              prev: prev[sym]?.price || updates[sym].price
            };
          });
          return nextState;
        });
        lastUpdateTime = Date.now();
      }
    };

    return () => ws.current && ws.current.close();
  }, [symbolsToTrack]);

  return data;
};

export default useBinanceTicker;