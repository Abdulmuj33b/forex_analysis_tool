import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface TechnicalIndicatorsProps {
  selectedPair: string;
}

export function TechnicalIndicators({ selectedPair }: TechnicalIndicatorsProps) {
  const [indicators, setIndicators] = useState({
    rsi: 65.4,
    macd: {
      value: 0.0012,
      signal: 0.0008,
      histogram: 0.0004
    },
    ema20: 1.0845,
    ema50: 1.0835,
    bollingerBands: {
      upper: 1.0875,
      middle: 1.0850,
      lower: 1.0825
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => ({
        ...prev,
        rsi: Math.max(0, Math.min(100, prev.rsi + (Math.random() - 0.5) * 5)),
        macd: {
          ...prev.macd,
          value: prev.macd.value + (Math.random() - 0.5) * 0.0005,
          signal: prev.macd.signal + (Math.random() - 0.5) * 0.0003,
          histogram: prev.macd.histogram + (Math.random() - 0.5) * 0.0002
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRSIColor = (value: number) => {
    if (value > 70) return 'text-red-400';
    if (value < 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getMACDColor = (value: number) => {
    return value > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
        <BarChart3 className="h-5 w-5" />
        <span>Technical Indicators</span>
      </h3>

      <div className="space-y-4">
        {/* RSI */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">RSI (14)</span>
            <span className={`text-sm font-bold ${getRSIColor(indicators.rsi)}`}>
              {indicators.rsi.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                indicators.rsi > 70 ? 'bg-red-400' : 
                indicators.rsi < 30 ? 'bg-green-400' : 'bg-yellow-400'
              }`}
              style={{ width: `${indicators.rsi}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Oversold (30)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        {/* MACD */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">MACD (12, 26, 9)</span>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">MACD Line</span>
              <span className={`text-xs font-medium ${getMACDColor(indicators.macd.value)}`}>
                {indicators.macd.value.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Signal Line</span>
              <span className={`text-xs font-medium ${getMACDColor(indicators.macd.signal)}`}>
                {indicators.macd.signal.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Histogram</span>
              <span className={`text-xs font-medium ${getMACDColor(indicators.macd.histogram)}`}>
                {indicators.macd.histogram.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Moving Averages</span>
            <div className="flex items-center space-x-1">
              {indicators.ema20 > indicators.ema50 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-xs font-medium ${
                indicators.ema20 > indicators.ema50 ? 'text-green-400' : 'text-red-400'
              }`}>
                {indicators.ema20 > indicators.ema50 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">EMA 20</span>
              <span className="text-xs font-medium text-blue-400">
                {indicators.ema20.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">EMA 50</span>
              <span className="text-xs font-medium text-orange-400">
                {indicators.ema50.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Bollinger Bands</span>
            <span className="text-xs text-gray-400">(20, 2)</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Upper Band</span>
              <span className="text-xs font-medium text-red-400">
                {indicators.bollingerBands.upper.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Middle Band</span>
              <span className="text-xs font-medium text-yellow-400">
                {indicators.bollingerBands.middle.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Lower Band</span>
              <span className="text-xs font-medium text-green-400">
                {indicators.bollingerBands.lower.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}