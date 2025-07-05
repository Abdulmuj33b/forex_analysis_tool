import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketOverviewProps {
  selectedPair: string;
}

export function MarketOverview({ selectedPair }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState({
    price: 1.0850,
    change: 0.0025,
    changePercent: 0.23,
    high: 1.0875,
    low: 1.0820,
    volume: 125000000,
    spread: 0.0002
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 0.002,
        change: prev.change + (Math.random() - 0.5) * 0.0005,
        changePercent: prev.changePercent + (Math.random() - 0.5) * 0.1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const majorPairs = [
    { pair: 'EUR/USD', price: 1.0850, change: 0.0025, changePercent: 0.23 },
    { pair: 'GBP/USD', price: 1.2674, change: -0.0015, changePercent: -0.12 },
    { pair: 'USD/JPY', price: 149.85, change: 0.45, changePercent: 0.30 },
    { pair: 'AUD/USD', price: 0.6521, change: 0.0008, changePercent: 0.12 },
    { pair: 'USD/CAD', price: 1.3712, change: -0.0023, changePercent: -0.17 },
    { pair: 'NZD/USD', price: 0.5987, change: 0.0012, changePercent: 0.20 }
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Selected Pair Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">{selectedPair} Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {marketData.price.toFixed(4)}
            </div>
            <div className={`text-sm flex items-center justify-center space-x-1 ${
              marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {getTrendIcon(marketData.change)}
              <span>{marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(4)}</span>
              <span>({marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400 mb-1">
              {marketData.high.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400">24h High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-400 mb-1">
              {marketData.low.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400">24h Low</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400 mb-1">
              {(marketData.volume / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-gray-400">Volume</div>
          </div>
        </div>
      </div>

      {/* Major Pairs */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Major Currency Pairs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {majorPairs.map((pair) => (
            <div key={pair.pair} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{pair.pair}</div>
                  <div className="text-xl font-bold text-white">{pair.price.toFixed(4)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm flex items-center space-x-1 ${
                    pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {getTrendIcon(pair.change)}
                    <span>{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(4)}</span>
                  </div>
                  <div className={`text-xs ${
                    pair.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}