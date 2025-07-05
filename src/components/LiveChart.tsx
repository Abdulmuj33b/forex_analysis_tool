import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle, Eye, BarChart3 } from 'lucide-react';

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
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [analysisType, setAnalysisType] = useState('all');

  // Smart Money Analysis
  const [smartMoneyAnalysis, setSmartMoneyAnalysis] = useState({
    orderBlocks: [
      { price: 1.0875, type: 'bullish', strength: 'high', time: '2h ago' },
      { price: 1.0825, type: 'bearish', strength: 'medium', time: '4h ago' }
    ],
    liquidityZones: [
      { price: 1.0890, type: 'buy', volume: 'high' },
      { price: 1.0810, type: 'sell', volume: 'medium' }
    ],
    institutionalFlow: {
      direction: 'bullish',
      strength: 78,
      volume: 'increasing'
    },
    marketStructure: {
      trend: 'bullish',
      phase: 'accumulation',
      nextTarget: 1.0920
    }
  });

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

      // Update smart money analysis periodically
      setSmartMoneyAnalysis(prev => ({
        ...prev,
        institutionalFlow: {
          ...prev.institutionalFlow,
          strength: Math.max(0, Math.min(100, prev.institutionalFlow.strength + (Math.random() - 0.5) * 10))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  const calculateTechnicalIndicators = () => {
    const prices = chartData.map(d => d.close);
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;
    
    // Calculate support and resistance levels
    const highs = chartData.slice(-20).map(d => d.high);
    const lows = chartData.slice(-20).map(d => d.low);
    const resistance = Math.max(...highs);
    const support = Math.min(...lows);
    
    return {
      sma20,
      sma50,
      resistance,
      support,
      trend: sma20 > sma50 ? 'bullish' : 'bearish'
    };
  };

  const indicators = calculateTechnicalIndicators();
  const currentPrice = chartData[chartData.length - 1]?.close || 1.0850;

  const analysisTypes = [
    { id: 'all', label: 'All Analysis', icon: BarChart3 },
    { id: 'smart-money', label: 'Smart Money', icon: Eye },
    { id: 'technical', label: 'Technical', icon: TrendingUp },
    { id: 'levels', label: 'Key Levels', icon: Target }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>{selectedPair} Chart</span>
        </h3>
        <div className="flex items-center space-x-4">
          {/* Analysis Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Analysis</span>
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`w-10 h-5 rounded-full transition-colors ${
                showAnalysis ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                showAnalysis ? 'translate-x-5' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>

          {/* Timeframe Selector */}
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
      </div>

      {/* Analysis Type Selector */}
      {showAnalysis && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {analysisTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setAnalysisType(type.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    analysisType === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart Area with Analysis Overlay */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 relative" style={{ height: '400px' }}>
        {/* Main Chart Display */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 mb-2">Live Chart with Analysis</div>
            <div className="text-2xl font-bold text-white mb-2">
              {currentPrice.toFixed(4)}
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

        {/* Analysis Overlays */}
        {showAnalysis && (
          <div className="absolute inset-4 pointer-events-none">
            {/* Support/Resistance Levels */}
            {(analysisType === 'all' || analysisType === 'levels' || analysisType === 'technical') && (
              <>
                <div className="absolute top-8 left-0 right-0 border-t-2 border-red-400 border-dashed opacity-60">
                  <span className="absolute -top-6 left-2 text-xs text-red-400 bg-gray-900 px-2">
                    Resistance: {indicators.resistance.toFixed(4)}
                  </span>
                </div>
                <div className="absolute bottom-8 left-0 right-0 border-t-2 border-green-400 border-dashed opacity-60">
                  <span className="absolute -bottom-6 left-2 text-xs text-green-400 bg-gray-900 px-2">
                    Support: {indicators.support.toFixed(4)}
                  </span>
                </div>
              </>
            )}

            {/* Smart Money Analysis Overlay */}
            {(analysisType === 'all' || analysisType === 'smart-money') && (
              <>
                {/* Order Blocks */}
                {smartMoneyAnalysis.orderBlocks.map((block, index) => (
                  <div
                    key={index}
                    className={`absolute left-4 w-20 h-6 border-2 ${
                      block.type === 'bullish' ? 'border-green-400 bg-green-400/20' : 'border-red-400 bg-red-400/20'
                    } rounded`}
                    style={{ 
                      top: block.type === 'bullish' ? '60%' : '30%'
                    }}
                  >
                    <span className="absolute -right-24 top-0 text-xs text-white bg-gray-800 px-2 py-1 rounded">
                      {block.type === 'bullish' ? 'Bull' : 'Bear'} OB
                    </span>
                  </div>
                ))}

                {/* Liquidity Zones */}
                {smartMoneyAnalysis.liquidityZones.map((zone, index) => (
                  <div
                    key={index}
                    className="absolute right-4 w-16 h-4 border border-yellow-400 bg-yellow-400/20 rounded"
                    style={{ 
                      top: zone.type === 'buy' ? '40%' : '50%'
                    }}
                  >
                    <span className="absolute -left-16 top-0 text-xs text-yellow-400">
                      Liq
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Analysis Information Panel */}
      {showAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Smart Money Analysis */}
          {(analysisType === 'all' || analysisType === 'smart-money') && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Smart Money Analysis</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Institutional Flow</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      smartMoneyAnalysis.institutionalFlow.direction === 'bullish' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      smartMoneyAnalysis.institutionalFlow.direction === 'bullish' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {smartMoneyAnalysis.institutionalFlow.strength}% {smartMoneyAnalysis.institutionalFlow.direction}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Market Structure</span>
                  <span className="text-blue-400 text-sm font-medium">
                    {smartMoneyAnalysis.marketStructure.phase}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Next Target</span>
                  <span className="text-yellow-400 text-sm font-medium">
                    {smartMoneyAnalysis.marketStructure.nextTarget.toFixed(4)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Order Blocks: {smartMoneyAnalysis.orderBlocks.length} detected
                </div>
              </div>
            </div>
          )}

          {/* Technical Analysis */}
          {(analysisType === 'all' || analysisType === 'technical') && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Technical Analysis</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Trend Direction</span>
                  <div className="flex items-center space-x-1">
                    {indicators.trend === 'bullish' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      indicators.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {indicators.trend}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Key Resistance</span>
                  <span className="text-red-400 text-sm font-medium">
                    {indicators.resistance.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Key Support</span>
                  <span className="text-green-400 text-sm font-medium">
                    {indicators.support.toFixed(4)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Distance to resistance: {((indicators.resistance - currentPrice) * 10000).toFixed(1)} pips
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
          {showAnalysis && (analysisType === 'all' || analysisType === 'smart-money') && (
            <div className="flex items-center space-x-1 text-blue-400">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Smart Money: {smartMoneyAnalysis.institutionalFlow.direction}</span>
            </div>
          )}
        </div>
        <div className="text-gray-400">
          Volume: {(chartData[chartData.length - 1]?.volume / 1000000).toFixed(1)}M
        </div>
      </div>
    </div>
  );
}