import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LiveChartProps {
  selectedPair: string;
}

export function LiveChart({ selectedPair }: LiveChartProps) {
  const [chartData, setChartData] = useState(() => {
    const data = [];
    let price = 1.0850;
    const now = new Date();
    
    for (let i = 99; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
      const open = price;
      const volatility = 0.001;
      const close = price + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 500000
      });
      
      price = close;
    }
    
    return data;
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('5m');

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        const now = new Date();
        
        const newCandle = {
          timestamp: now,
          open: lastCandle.close,
          high: lastCandle.close + Math.random() * 0.001,
          low: lastCandle.close - Math.random() * 0.001,
          close: lastCandle.close + (Math.random() - 0.5) * 0.002,
          volume: Math.random() * 1000000 + 500000
        };
        
        newData.push(newCandle);
        return newData.slice(-100);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  const calculateTechnicalIndicators = () => {
    const prices = chartData.map(d => d.close);
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;
    
    return {
      sma20,
      sma50,
      trend: sma20 > sma50 ? 'bullish' : 'bearish'
    };
  };

  const indicators = calculateTechnicalIndicators();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>{selectedPair} Chart</span>
        </h3>
        <div className="flex items-center space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4" style={{ height: '400px' }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 mb-2">Live Chart Simulation</div>
            <div className="text-2xl font-bold text-white mb-2">
              {chartData[chartData.length - 1]?.close.toFixed(4)}
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-400">SMA 20: {indicators.sma20.toFixed(4)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-gray-400">SMA 50: {indicators.sma50.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-1 ${
            indicators.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
          }`}>
            {indicators.trend === 'bullish' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium capitalize">{indicators.trend} Trend</span>
          </div>
        </div>
        <div className="text-gray-400">
          Volume: {(chartData[chartData.length - 1]?.volume / 1000000).toFixed(1)}M
        </div>
      </div>
    </div>
  );
}