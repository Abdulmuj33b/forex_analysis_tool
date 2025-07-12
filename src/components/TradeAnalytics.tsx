import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Brain, Target, DollarSign, Calendar, Filter, Download, Eye, Zap } from 'lucide-react';

interface Trade {
  id: string;
  timestamp: Date;
  pair: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pips: number;
  profit: number;
  strategy: string;
  confidence: number;
  riskReward: number;
  duration: number; // in minutes
  source: 'manual' | 'auto' | 'signal';
  marketConditions: {
    volatility: number;
    trend: string;
    volume: string;
    newsImpact: string;
  };
  mlFeatures: {
    rsiEntry: number;
    macdEntry: number;
    emaAlignment: boolean;
    smartMoneyConfirmation: boolean;
    liquidityLevel: string;
  };
}

export function TradeAnalytics() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedPair, setSelectedPair] = useState('all');
  const [showMLInsights, setShowMLInsights] = useState(true);
  const [mlLearningProgress, setMLLearningProgress] = useState({
    totalTrades: 0,
    learningAccuracy: 87.3,
    patternRecognition: 92.1,
    entryOptimization: 78.9,
    riskAssessment: 85.6
  });

  // Generate sample trade data
  useEffect(() => {
    const generateTrades = () => {
      const strategies = [
        'Smart Money Order Block',
        'Liquidity Grab Reversal',
        'EMA Crossover',
        'RSI Divergence',
        'Support/Resistance Break',
        'MACD Signal',
        'Institutional Flow'
      ];

      const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'];
      const sampleTrades: Trade[] = [];

      for (let i = 0; i < 50; i++) {
        const isWin = Math.random() > 0.35; // 65% win rate
        const strategy = strategies[Math.floor(Math.random() * strategies.length)];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const type = Math.random() > 0.5 ? 'buy' : 'sell';
        const entryPrice = 1.0850 + (Math.random() - 0.5) * 0.1;
        const pips = isWin ? 
          (20 + Math.random() * 80) : 
          -(10 + Math.random() * 40);
        const exitPrice = type === 'buy' ? 
          entryPrice + (pips / 10000) : 
          entryPrice - (pips / 10000);
        const lotSize = 0.1 + Math.random() * 0.4;
        const profit = pips * lotSize;
        const duration = 15 + Math.random() * 480; // 15 minutes to 8 hours

        const trade: Trade = {
          id: `trade_${i}`,
          timestamp: new Date(Date.now() - i * 3600000 - Math.random() * 86400000),
          pair,
          type,
          entryPrice,
          exitPrice,
          lotSize: parseFloat(lotSize.toFixed(2)),
          pips: parseFloat(pips.toFixed(1)),
          profit: parseFloat(profit.toFixed(2)),
          strategy,
          confidence: 60 + Math.random() * 35,
          riskReward: 1 + Math.random() * 2,
          duration: Math.round(duration),
          source: Math.random() > 0.7 ? 'auto' : Math.random() > 0.5 ? 'signal' : 'manual',
          marketConditions: {
            volatility: Math.random() * 100,
            trend: ['bullish', 'bearish', 'sideways'][Math.floor(Math.random() * 3)],
            volume: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            newsImpact: ['none', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)]
          },
          mlFeatures: {
            rsiEntry: 30 + Math.random() * 40,
            macdEntry: (Math.random() - 0.5) * 0.002,
            emaAlignment: Math.random() > 0.4,
            smartMoneyConfirmation: Math.random() > 0.3,
            liquidityLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
          }
        };

        sampleTrades.push(trade);
      }

      return sampleTrades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setTrades(generateTrades());
  }, []);

  // Filter trades based on selected criteria
  useEffect(() => {
    let filtered = [...trades];

    if (selectedTimeframe !== 'all') {
      const now = new Date();
      const timeframes = {
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };
      const cutoff = now.getTime() - timeframes[selectedTimeframe as keyof typeof timeframes];
      filtered = filtered.filter(trade => trade.timestamp.getTime() > cutoff);
    }

    if (selectedStrategy !== 'all') {
      filtered = filtered.filter(trade => trade.strategy === selectedStrategy);
    }

    if (selectedPair !== 'all') {
      filtered = filtered.filter(trade => trade.pair === selectedPair);
    }

    setFilteredTrades(filtered);

    // Update ML learning progress based on filtered data
    setMLLearningProgress(prev => ({
      ...prev,
      totalTrades: filtered.length,
      learningAccuracy: Math.min(95, 80 + (filtered.length * 0.1)),
      patternRecognition: Math.min(98, 85 + (filtered.filter(t => t.profit > 0).length * 0.2)),
      entryOptimization: Math.min(90, 70 + (filtered.filter(t => t.source === 'auto').length * 0.3)),
      riskAssessment: Math.min(95, 75 + (filtered.filter(t => t.riskReward > 1.5).length * 0.4))
    }));
  }, [trades, selectedTimeframe, selectedStrategy, selectedPair]);

  // Calculate analytics
  const analytics = {
    totalTrades: filteredTrades.length,
    winningTrades: filteredTrades.filter(t => t.profit > 0).length,
    losingTrades: filteredTrades.filter(t => t.profit < 0).length,
    totalProfit: filteredTrades.reduce((sum, t) => sum + t.profit, 0),
    totalPips: filteredTrades.reduce((sum, t) => sum + t.pips, 0),
    winRate: filteredTrades.length > 0 ? (filteredTrades.filter(t => t.profit > 0).length / filteredTrades.length * 100) : 0,
    avgProfit: filteredTrades.length > 0 ? filteredTrades.reduce((sum, t) => sum + t.profit, 0) / filteredTrades.length : 0,
    avgWin: filteredTrades.filter(t => t.profit > 0).length > 0 ? 
      filteredTrades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / filteredTrades.filter(t => t.profit > 0).length : 0,
    avgLoss: filteredTrades.filter(t => t.profit < 0).length > 0 ? 
      filteredTrades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / filteredTrades.filter(t => t.profit < 0).length : 0,
    profitFactor: 0,
    bestTrade: filteredTrades.length > 0 ? Math.max(...filteredTrades.map(t => t.profit)) : 0,
    worstTrade: filteredTrades.length > 0 ? Math.min(...filteredTrades.map(t => t.profit)) : 0,
    avgDuration: filteredTrades.length > 0 ? filteredTrades.reduce((sum, t) => sum + t.duration, 0) / filteredTrades.length : 0
  };

  analytics.profitFactor = analytics.avgLoss !== 0 ? Math.abs(analytics.avgWin / analytics.avgLoss) : 0;

  // Strategy performance analysis
  const strategyPerformance = filteredTrades.reduce((acc, trade) => {
    if (!acc[trade.strategy]) {
      acc[trade.strategy] = { trades: 0, profit: 0, wins: 0 };
    }
    acc[trade.strategy].trades++;
    acc[trade.strategy].profit += trade.profit;
    if (trade.profit > 0) acc[trade.strategy].wins++;
    return acc;
  }, {} as Record<string, { trades: number; profit: number; wins: number }>);

  // ML Pattern Analysis
  const mlPatterns = {
    bestEntryConditions: {
      rsiRange: '30-70',
      macdSignal: 'Positive Divergence',
      emaAlignment: 'Bullish Stack',
      smartMoney: 'Order Block Confirmation',
      optimalVolatility: '40-60%'
    },
    learningInsights: [
      'RSI entries between 40-60 show 23% higher success rate',
      'Smart Money confirmation increases win rate by 18%',
      'EMA alignment improves average profit by 31%',
      'High volume conditions reduce risk by 15%',
      'News impact correlation: 89% accuracy in predictions'
    ],
    nextOptimizations: [
      'Refine entry timing based on liquidity levels',
      'Improve exit strategies for trending markets',
      'Enhance risk management for high volatility periods',
      'Optimize position sizing based on market conditions'
    ]
  };

  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: '1d', label: 'Last 24h' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const strategies = ['all', ...Array.from(new Set(trades.map(t => t.strategy)))];
  const pairs = ['all', ...Array.from(new Set(trades.map(t => t.pair)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Trade Analytics & ML Learning</span>
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">ML Insights</span>
              <button
                onClick={() => setShowMLInsights(!showMLInsights)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  showMLInsights ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  showMLInsights ? 'translate-x-5' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Timeframe</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              {strategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {strategy === 'all' ? 'All Strategies' : strategy}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency Pair</label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              {pairs.map(pair => (
                <option key={pair} value={pair}>
                  {pair === 'all' ? 'All Pairs' : pair}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Trades</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.totalTrades}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{analytics.winRate.toFixed(1)}%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${analytics.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${analytics.totalProfit.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-400">Profit Factor</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{analytics.profitFactor.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Pips</span>
          </div>
          <div className={`text-2xl font-bold ${analytics.totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analytics.totalPips >= 0 ? '+' : ''}{analytics.totalPips.toFixed(0)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Avg Duration</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(analytics.avgDuration)}m
          </div>
        </div>
      </div>

      {/* ML Learning Progress */}
      {showMLInsights && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Machine Learning Progress</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Learning Accuracy</div>
              <div className="text-2xl font-bold text-blue-400 mb-2">{mlLearningProgress.learningAccuracy.toFixed(1)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${mlLearningProgress.learningAccuracy}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Pattern Recognition</div>
              <div className="text-2xl font-bold text-green-400 mb-2">{mlLearningProgress.patternRecognition.toFixed(1)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${mlLearningProgress.patternRecognition}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Entry Optimization</div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">{mlLearningProgress.entryOptimization.toFixed(1)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${mlLearningProgress.entryOptimization}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Risk Assessment</div>
              <div className="text-2xl font-bold text-purple-400 mb-2">{mlLearningProgress.riskAssessment.toFixed(1)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${mlLearningProgress.riskAssessment}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ML Insights */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Learning Insights</span>
              </h4>
              <div className="space-y-2">
                {mlPatterns.learningInsights.map((insight, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Optimizations */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Next Optimizations</span>
              </h4>
              <div className="space-y-2">
                {mlPatterns.nextOptimizations.map((optimization, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{optimization}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Performance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Strategy</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Trades</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Win Rate</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Total P&L</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Avg P&L</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(strategyPerformance).map(([strategy, data]) => (
                <tr key={strategy} className="border-b border-gray-700">
                  <td className="py-3 text-sm text-white font-medium">{strategy}</td>
                  <td className="py-3 text-sm text-gray-300">{data.trades}</td>
                  <td className="py-3 text-sm">
                    <span className={`font-medium ${
                      (data.wins / data.trades * 100) >= 60 ? 'text-green-400' : 
                      (data.wins / data.trades * 100) >= 40 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {((data.wins / data.trades) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`font-medium ${data.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${data.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`font-medium ${(data.profit / data.trades) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${(data.profit / data.trades).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Time</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Pair</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Type</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Entry</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Exit</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Pips</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">P&L</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Strategy</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.slice(0, 20).map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 text-sm text-gray-300">
                    {trade.timestamp.toLocaleDateString()} {trade.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-sm text-white font-medium">{trade.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white">{trade.entryPrice.toFixed(4)}</td>
                  <td className="py-3 text-sm text-white">{trade.exitPrice.toFixed(4)}</td>
                  <td className={`py-3 text-sm font-medium ${
                    trade.pips >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.pips >= 0 ? '+' : ''}{trade.pips.toFixed(1)}
                  </td>
                  <td className={`py-3 text-sm font-medium ${
                    trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${trade.profit.toFixed(2)}
                  </td>
                  <td className="py-3 text-sm text-gray-300">{trade.strategy}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.source === 'auto' ? 'bg-blue-600 text-white' :
                      trade.source === 'signal' ? 'bg-purple-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {trade.source.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}