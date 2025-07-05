import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, TrendingUp, TrendingDown, Calendar, DollarSign, Download, Wifi } from 'lucide-react';

export function TradeJournal() {
  const [trades, setTrades] = useState([
    {
      id: 1,
      date: '2024-01-15',
      pair: 'EUR/USD',
      type: 'Buy',
      entry: 1.0850,
      exit: 1.0900,
      lotSize: 0.10,
      profit: 50,
      pips: 50,
      strategy: 'Smart Money Concepts',
      notes: 'Order block respected, clean institutional flow. Liquidity grab followed by reversal.',
      source: 'manual',
      broker: null
    },
    {
      id: 2,
      date: '2024-01-14',
      pair: 'GBP/USD',
      type: 'Sell',
      entry: 1.2700,
      exit: 1.2650,
      lotSize: 0.05,
      profit: 25,
      pips: 50,
      strategy: 'RSI Divergence',
      notes: 'RSI showed bearish divergence. Executed well.',
      source: 'manual',
      broker: null
    },
    {
      id: 3,
      date: '2024-01-13',
      pair: 'USD/JPY',
      type: 'Buy',
      entry: 149.50,
      exit: 149.20,
      lotSize: 0.10,
      profit: -30,
      pips: -30,
      strategy: 'Support & Resistance',
      notes: 'Support level failed. Should have exited earlier.',
      source: 'manual',
      broker: null
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [autoImportEnabled, setAutoImportEnabled] = useState(true);
  const [lastImportTime, setLastImportTime] = useState(new Date());
  const [importStatus, setImportStatus] = useState('connected');
  
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: 'EUR/USD',
    type: 'Buy',
    entry: '',
    exit: '',
    lotSize: '',
    strategy: '',
    notes: ''
  });

  // Available trading strategies including Smart Money
  const tradingStrategies = [
    'Smart Money Concepts',
    'Order Block Trading',
    'Liquidity Grab Strategy',
    'Market Structure Analysis',
    'Institutional Flow Trading',
    'EMA Crossover',
    'RSI Divergence',
    'MACD Signal',
    'Support & Resistance',
    'Fibonacci Retracement',
    'Bollinger Bands',
    'Breakout Strategy',
    'Scalping',
    'Swing Trading',
    'News Trading'
  ];

  // Simulate connected brokers (this would come from BrokerIntegration component in real app)
  const connectedBrokers = [
    { id: 'mt4', name: 'MetaTrader 4', status: 'connected' },
    { id: 'oanda', name: 'OANDA', status: 'connected' }
  ];

  // Auto-import trades from connected brokers
  useEffect(() => {
    if (!autoImportEnabled) return;

    const importInterval = setInterval(() => {
      // Simulate fetching trades from broker APIs
      const simulatedBrokerTrades = [
        {
          id: Date.now() + Math.random(),
          date: new Date().toISOString().split('T')[0],
          pair: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'][Math.floor(Math.random() * 4)],
          type: Math.random() > 0.5 ? 'Buy' : 'Sell',
          entry: 1.0850 + (Math.random() - 0.5) * 0.02,
          exit: 1.0850 + (Math.random() - 0.5) * 0.02,
          lotSize: parseFloat((Math.random() * 0.5 + 0.05).toFixed(2)),
          strategy: tradingStrategies[Math.floor(Math.random() * tradingStrategies.length)],
          notes: 'Automatically imported from broker',
          source: 'broker',
          broker: connectedBrokers[Math.floor(Math.random() * connectedBrokers.length)]?.name || 'MetaTrader 4'
        }
      ];

      // Only add if it's a new trade (simulate checking for new trades)
      if (Math.random() > 0.7) { // 30% chance of new trade
        simulatedBrokerTrades.forEach(brokerTrade => {
          // Calculate profit and pips
          let pips, profit;
          if (brokerTrade.type === 'Buy') {
            pips = (brokerTrade.exit - brokerTrade.entry) * 10000;
            profit = pips * brokerTrade.lotSize;
          } else {
            pips = (brokerTrade.entry - brokerTrade.exit) * 10000;
            profit = pips * brokerTrade.lotSize;
          }

          const completeTrade = {
            ...brokerTrade,
            profit: parseFloat(profit.toFixed(2)),
            pips: parseFloat(pips.toFixed(1))
          };

          setTrades(prev => {
            // Check if trade already exists to avoid duplicates
            const exists = prev.some(t => 
              t.source === 'broker' && 
              t.pair === completeTrade.pair && 
              Math.abs(t.entry - completeTrade.entry) < 0.0001 &&
              t.date === completeTrade.date
            );
            
            if (!exists) {
              setLastImportTime(new Date());
              return [completeTrade, ...prev];
            }
            return prev;
          });
        });
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(importInterval);
  }, [autoImportEnabled, connectedBrokers]);

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : 0;
  const brokerTrades = trades.filter(t => t.source === 'broker').length;
  const manualTrades = trades.filter(t => t.source === 'manual').length;

  const handleAddTrade = () => {
    if (newTrade.entry && newTrade.exit && newTrade.lotSize) {
      const entry = parseFloat(newTrade.entry);
      const exit = parseFloat(newTrade.exit);
      const lotSize = parseFloat(newTrade.lotSize);
      
      let pips, profit;
      if (newTrade.type === 'Buy') {
        pips = (exit - entry) * 10000;
        profit = pips * lotSize;
      } else {
        pips = (entry - exit) * 10000;
        profit = pips * lotSize;
      }

      const trade = {
        id: Date.now(),
        ...newTrade,
        entry,
        exit,
        lotSize,
        profit,
        pips,
        strategy: newTrade.strategy || 'Manual Entry',
        source: 'manual',
        broker: null
      };

      setTrades([trade, ...trades]);
      setNewTrade({
        date: new Date().toISOString().split('T')[0],
        pair: 'EUR/USD',
        type: 'Buy',
        entry: '',
        exit: '',
        lotSize: '',
        strategy: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleManualImport = () => {
    setImportStatus('importing');
    // Simulate manual import process
    setTimeout(() => {
      setImportStatus('connected');
      setLastImportTime(new Date());
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Trades</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{totalTrades}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{winRate}%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${totalProfit.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Broker Trades</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{brokerTrades}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-400">Manual Trades</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{manualTrades}</div>
        </div>
      </div>

      {/* Trade Journal */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Trade Journal</span>
          </h2>
          <div className="flex items-center space-x-4">
            {/* Auto Import Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                importStatus === 'connected' ? 'bg-green-400' : 
                importStatus === 'importing' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-gray-400">
                {importStatus === 'connected' ? 'Auto-Import Active' :
                 importStatus === 'importing' ? 'Importing...' : 'Disconnected'}
              </span>
            </div>
            
            {/* Auto Import Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Auto Import</span>
              <button
                onClick={() => setAutoImportEnabled(!autoImportEnabled)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  autoImportEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  autoImportEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Manual Import Button */}
            <button
              onClick={handleManualImport}
              disabled={importStatus === 'importing'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Import Now</span>
            </button>

            {/* Add Manual Trade Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Trade</span>
            </button>
          </div>
        </div>

        {/* Import Status Info */}
        {autoImportEnabled && (
          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">
                  Connected to {connectedBrokers.length} broker{connectedBrokers.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Last import: {lastImportTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Trades are automatically imported every 15 seconds from connected brokers
            </div>
          </div>
        )}

        {/* Add Trade Form */}
        {showAddForm && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Add New Trade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newTrade.date}
                  onChange={(e) => setNewTrade({...newTrade, date: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pair</label>
                <select
                  value={newTrade.pair}
                  onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                >
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="AUD/USD">AUD/USD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newTrade.type}
                  onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                >
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newTrade.entry}
                  onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newTrade.exit}
                  onChange={(e) => setNewTrade({...newTrade, exit: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lot Size</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTrade.lotSize}
                  onChange={(e) => setNewTrade({...newTrade, lotSize: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                <select
                  value={newTrade.strategy}
                  onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Select a strategy...</option>
                  {tradingStrategies.map((strategy) => (
                    <option key={strategy} value={strategy}>{strategy}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={newTrade.notes}
                  onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  rows={3}
                  placeholder="Trade analysis, lessons learned, etc."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrade}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Trade
              </button>
            </div>
          </div>
        )}

        {/* Trades List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Source</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Date</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Pair</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Type</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Entry</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Exit</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Lot Size</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Pips</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">P&L</th>
                <th className="text-left text-sm font-medium text-gray-300 pb-3">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      {trade.source === 'broker' ? (
                        <>
                          <Download className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-blue-400 font-medium">{trade.broker}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-purple-400 font-medium">Manual</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-300">{trade.date}</td>
                  <td className="py-3 text-sm text-white font-medium">{trade.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'Buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white">{trade.entry.toFixed(4)}</td>
                  <td className="py-3 text-sm text-white">{trade.exit.toFixed(4)}</td>
                  <td className="py-3 text-sm text-white">{trade.lotSize.toFixed(2)}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}