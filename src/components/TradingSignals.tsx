import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Zap, Play, Pause, Settings, CheckCircle, Clock } from 'lucide-react';
import { apiService, TradingSignal } from '../services/api';

interface TradingSignalsProps {
  selectedPair: string;
}

interface Signal {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  strategy: string;
  reasoning: string;
  timestamp: Date;
  status: 'active' | 'executed' | 'expired';
  riskReward: number;
  pips: number;
}

export function TradingSignals({ selectedPair }: TradingSignalsProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
  const [autoTradeSettings, setAutoTradeSettings] = useState({
    minConfidence: 75,
    maxRiskPerTrade: 2,
    minRiskReward: 1.5,
    enableSmartMoney: true,
    enableTechnical: true,
    enableNews: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [executedTrades, setExecutedTrades] = useState<any[]>([]);

  // Generate trading signals based on analysis
  const generateSignal = (): Signal => {
    const strategies = [
      'Smart Money Order Block',
      'Liquidity Grab Reversal',
      'EMA Crossover',
      'RSI Divergence',
      'Support/Resistance Break',
      'MACD Signal',
      'Institutional Flow'
    ];

    const currentPrice = 1.0850 + (Math.random() - 0.5) * 0.02;
    const isLong = Math.random() > 0.5;
    const pipsDistance = 20 + Math.random() * 30;
    const riskRewardRatio = 1.5 + Math.random() * 2;

    const entryPrice = currentPrice;
    const stopLoss = isLong ? 
      entryPrice - (pipsDistance / 10000) : 
      entryPrice + (pipsDistance / 10000);
    const takeProfit = isLong ?
      entryPrice + (pipsDistance * riskRewardRatio / 10000) :
      entryPrice - (pipsDistance * riskRewardRatio / 10000);

    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const confidence = 60 + Math.random() * 35;

    const reasonings = {
      'Smart Money Order Block': 'Institutional order block identified with high volume confirmation. Price respected previous demand zone.',
      'Liquidity Grab Reversal': 'Liquidity sweep detected above recent highs. Expecting institutional reversal from this level.',
      'EMA Crossover': 'EMA 20 crossed above EMA 50 with increasing momentum. Trend confirmation signal.',
      'RSI Divergence': 'Bullish divergence detected on RSI while price made lower lows. Reversal expected.',
      'Support/Resistance Break': 'Clean break of key resistance level with volume confirmation. Continuation expected.',
      'MACD Signal': 'MACD line crossed above signal line with positive histogram. Momentum building.',
      'Institutional Flow': 'Large institutional orders detected. Following smart money direction.'
    };

    return {
      id: Date.now().toString() + Math.random(),
      type: isLong ? 'buy' : 'sell',
      pair: selectedPair,
      entryPrice,
      stopLoss,
      takeProfit,
      confidence: Math.round(confidence),
      strategy,
      reasoning: reasonings[strategy as keyof typeof reasonings] || 'Technical analysis signal detected.',
      timestamp: new Date(),
      status: 'active',
      riskReward: riskRewardRatio,
      pips: pipsDistance
    };
  };

  // Auto-execute trades based on settings
  const executeAutoTrade = (signal: Signal) => {
    if (!autoTradeEnabled) return;

    // Check if signal meets auto-trade criteria
    if (signal.confidence < autoTradeSettings.minConfidence) return;
    if (signal.riskReward < autoTradeSettings.minRiskReward) return;

    // Strategy filters
    if (!autoTradeSettings.enableSmartMoney && 
        (signal.strategy.includes('Smart Money') || signal.strategy.includes('Liquidity'))) return;
    if (!autoTradeSettings.enableTechnical && 
        (signal.strategy.includes('EMA') || signal.strategy.includes('RSI') || signal.strategy.includes('MACD'))) return;

    // Simulate trade execution
    const executedTrade = {
      id: signal.id,
      pair: signal.pair,
      type: signal.type,
      entryPrice: signal.entryPrice,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      lotSize: 0.1, // Calculate based on risk settings
      strategy: signal.strategy,
      timestamp: new Date(),
      status: 'executed',
      source: 'auto-trade',
      confidence: signal.confidence,
      riskReward: signal.riskReward
    };

    setExecutedTrades(prev => [executedTrade, ...prev]);
    
    // Update signal status
    setSignals(prev => prev.map(s => 
      s.id === signal.id ? { ...s, status: 'executed' as const } : s
    ));

    // Send trade data to analytics for ML learning
    // This would integrate with the TradeAnalytics component in a real application
    console.log('Trade executed for ML learning:', executedTrade);
  };

  // Generate new signals periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate signal with some probability
      if (Math.random() > 0.7) { // 30% chance every interval
        const newSignal = generateSignal();
        setSignals(prev => {
          const updated = [newSignal, ...prev.slice(0, 9)]; // Keep last 10 signals
          
          // Auto-execute if enabled
          if (autoTradeEnabled) {
            setTimeout(() => executeAutoTrade(newSignal), 1000);
          }
          
          return updated;
        });
      }

      // Expire old signals
      setSignals(prev => prev.map(signal => {
        const ageMinutes = (Date.now() - signal.timestamp.getTime()) / (1000 * 60);
        if (ageMinutes > 30 && signal.status === 'active') {
          return { ...signal, status: 'expired' as const };
        }
        return signal;
      }));
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [selectedPair, autoTradeEnabled, autoTradeSettings]);

  const activeSignals = signals.filter(s => s.status === 'active');
  const recentExecuted = executedTrades.slice(0, 5);

  const handleManualExecute = (signal: Signal) => {
    executeAutoTrade(signal);
  };

  return (
    <div className="space-y-6">
      {/* Trading Signals Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="h-6 w-6" />
            <span>Trading Signals - {selectedPair}</span>
          </h2>
          <div className="flex items-center space-x-4">
            {/* Auto-Trade Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Auto-Trade</span>
              <button
                onClick={() => setAutoTradeEnabled(!autoTradeEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoTradeEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                  autoTradeEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}>
                  {autoTradeEnabled ? (
                    <Play className="h-2 w-2 text-green-600" />
                  ) : (
                    <Pause className="h-2 w-2 text-gray-600" />
                  )}
                </div>
              </button>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-400">Active Signals</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeSignals.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">Executed Today</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{executedTrades.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Avg Confidence</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {activeSignals.length > 0 ? 
                Math.round(activeSignals.reduce((sum, s) => sum + s.confidence, 0) / activeSignals.length) : 0}%
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-400">Avg R:R</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {activeSignals.length > 0 ? 
                (activeSignals.reduce((sum, s) => sum + s.riskReward, 0) / activeSignals.length).toFixed(1) : 0}
            </div>
          </div>
        </div>

        {/* Auto-Trade Status */}
        {autoTradeEnabled && (
          <div className="mt-4 bg-green-600/10 border border-green-600/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium text-sm">
                Auto-Trading Active - Min Confidence: {autoTradeSettings.minConfidence}% | Min R:R: {autoTradeSettings.minRiskReward}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Active Signals */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Active Signals</h3>
          <div className="space-y-4">
            {activeSignals.map((signal) => (
              <div key={signal.id} className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                signal.type === 'buy' ? 'border-green-400' : 'border-red-400'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      signal.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {signal.type === 'buy' ? (
                        <TrendingUp className="h-4 w-4 text-white" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {signal.type.toUpperCase()} {signal.pair}
                      </div>
                      <div className="text-sm text-gray-400">{signal.strategy}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      signal.confidence >= 80 ? 'text-green-400' :
                      signal.confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {signal.confidence}% confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      {signal.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-gray-400">Entry</div>
                    <div className="text-white font-medium">{signal.entryPrice.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Stop Loss</div>
                    <div className="text-red-400 font-medium">{signal.stopLoss.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Take Profit</div>
                    <div className="text-green-400 font-medium">{signal.takeProfit.toFixed(4)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm">
                    <span className="text-gray-400">R:R </span>
                    <span className="text-purple-400 font-medium">1:{signal.riskReward.toFixed(1)}</span>
                    <span className="text-gray-400 ml-3">Pips: </span>
                    <span className="text-blue-400 font-medium">{signal.pips.toFixed(0)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-300 mb-3 bg-gray-600 rounded p-2">
                  {signal.reasoning}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {Math.round((Date.now() - signal.timestamp.getTime()) / (1000 * 60))} min ago
                    </span>
                  </div>
                  <button
                    onClick={() => handleManualExecute(signal)}
                    disabled={autoTradeEnabled}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Execute Trade
                  </button>
                </div>
              </div>
            ))}

            {activeSignals.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">No active signals</div>
                <div className="text-sm text-gray-500">Waiting for trading opportunities...</div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Executions */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Executions</h3>
          <div className="space-y-3">
            {recentExecuted.map((trade) => (
              <div key={trade.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-white font-medium">
                      {trade.type.toUpperCase()} {trade.pair}
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      AUTO
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {trade.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm text-gray-300">{trade.strategy}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Entry: {trade.entryPrice.toFixed(4)} | SL: {trade.stopLoss.toFixed(4)} | TP: {trade.takeProfit.toFixed(4)}
                </div>
              </div>
            ))}

            {recentExecuted.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">No executions yet</div>
                <div className="text-sm text-gray-500">Executed trades will appear here</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-Trade Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Auto-Trade Settings</span>
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Confidence (%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={autoTradeSettings.minConfidence}
                  onChange={(e) => setAutoTradeSettings(prev => ({
                    ...prev,
                    minConfidence: Number(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">
                  Current: {autoTradeSettings.minConfidence}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Risk Per Trade (%)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={autoTradeSettings.maxRiskPerTrade}
                  onChange={(e) => setAutoTradeSettings(prev => ({
                    ...prev,
                    maxRiskPerTrade: Number(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">
                  Current: {autoTradeSettings.maxRiskPerTrade}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Risk:Reward Ratio
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={autoTradeSettings.minRiskReward}
                  onChange={(e) => setAutoTradeSettings(prev => ({
                    ...prev,
                    minRiskReward: Number(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">
                  Current: 1:{autoTradeSettings.minRiskReward}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-medium">Strategy Filters</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Smart Money Signals</span>
                  <button
                    onClick={() => setAutoTradeSettings(prev => ({
                      ...prev,
                      enableSmartMoney: !prev.enableSmartMoney
                    }))}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      autoTradeSettings.enableSmartMoney ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoTradeSettings.enableSmartMoney ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Technical Indicators</span>
                  <button
                    onClick={() => setAutoTradeSettings(prev => ({
                      ...prev,
                      enableTechnical: !prev.enableTechnical
                    }))}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      autoTradeSettings.enableTechnical ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoTradeSettings.enableTechnical ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">News-Based Signals</span>
                  <button
                    onClick={() => setAutoTradeSettings(prev => ({
                      ...prev,
                      enableNews: !prev.enableNews
                    }))}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      autoTradeSettings.enableNews ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoTradeSettings.enableNews ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}