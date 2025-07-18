import React, { useState } from 'react';
import { Link, CheckCircle, AlertCircle, Settings, DollarSign, TrendingUp, Wifi, WifiOff } from 'lucide-react';

export function BrokerIntegration() {
  const [connectedBrokers, setConnectedBrokers] = useState([
    { id: 'mt4', name: 'MetaTrader 4', status: 'connected', balance: 10000, equity: 10250 },
    { id: 'oanda', name: 'OANDA', status: 'connected', balance: 5000, equity: 5120 }
  ]);

  const [availableBrokers] = useState([
    { id: 'mt5', name: 'MetaTrader 5', logo: '📊', supported: true },
    { id: 'ig', name: 'IG Markets', logo: '🏦', supported: true },
    { id: 'fxcm', name: 'FXCM', logo: '💹', supported: true },
    { id: 'pepperstone', name: 'Pepperstone', logo: '🌶️', supported: true },
    { id: 'ic-markets', name: 'IC Markets', logo: '🔷', supported: true },
    { id: 'forex-com', name: 'Forex.com', logo: '💰', supported: true },
    { id: 'etoro', name: 'eToro', logo: '🎯', supported: true },
    { id: 'plus500', name: 'Plus500', logo: '➕', supported: true },
    { id: 'avatrade', name: 'AvaTrade', logo: '🚀', supported: true },
    { id: 'xm', name: 'XM Global', logo: '🌍', supported: true },
    { id: 'hotforex', name: 'HotForex', logo: '🔥', supported: true },
    { id: 'exness', name: 'Exness', logo: '⚡', supported: true },
    { id: 'fbs', name: 'FBS', logo: '💎', supported: true },
    { id: 'tickmill', name: 'Tickmill', logo: '⚙️', supported: true }
  ]);

  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');

  const handleConnect = (brokerId: string) => {
    setSelectedBroker(brokerId);
    setShowConnectionForm(true);
  };

  const handleDisconnect = (brokerId: string) => {
    setConnectedBrokers(prev => prev.filter(broker => broker.id !== brokerId));
  };

  const tradingFeatures = [
    { name: 'One-Click Trading', enabled: true },
    { name: 'Auto Position Sizing', enabled: true },
    { name: 'Risk Management', enabled: true },
    { name: 'Copy Trading', enabled: false },
    { name: 'Algorithmic Trading', enabled: true },
    { name: 'News Trading', enabled: false }
  ];

  return (
    <div className="space-y-6">
      {/* Broker Integration Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Link className="h-6 w-6" />
            <span>Broker Integration</span>
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-400">{connectedBrokers.length} Connected</span>
          </div>
        </div>

        {/* Connected Brokers Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">Total Balance</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${connectedBrokers.reduce((sum, broker) => sum + broker.balance, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Equity</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${connectedBrokers.reduce((sum, broker) => sum + broker.equity, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">Active Connections</span>
            </div>
            <div className="text-2xl font-bold text-white">{connectedBrokers.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Connected Brokers */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Connected Brokers</h3>
          <div className="space-y-4">
            {connectedBrokers.map((broker) => (
              <div key={broker.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {broker.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{broker.name}</div>
                      <div className="flex items-center space-x-1">
                        <Wifi className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">Connected</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(broker.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <WifiOff className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Balance</div>
                    <div className="text-white font-medium">${broker.balance.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Equity</div>
                    <div className="text-white font-medium">${broker.equity.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    Manage Connection
                  </button>
                </div>
              </div>
            ))}
            {connectedBrokers.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">No brokers connected</div>
                <div className="text-sm text-gray-500">Connect your first broker to start trading</div>
              </div>
            )}
          </div>
        </div>

        {/* Available Brokers */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Available Brokers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableBrokers.map((broker) => (
              <div key={broker.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{broker.logo}</div>
                    <div>
                      <div className="font-medium text-white text-sm">{broker.name}</div>
                      <div className="text-xs text-green-400">Supported</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(broker.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Features */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Trading Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tradingFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{feature.name}</span>
                <div className="flex items-center space-x-2">
                  {feature.enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-500" />
                  )}
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {feature.enabled ? 'Active' : 'Coming Soon'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Form Modal */}
      {showConnectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Connect to {availableBrokers.find(b => b.id === selectedBroker)?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {selectedBroker === 'demo' ? 'Demo Account ID' : 'Account ID / Login'}
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder={selectedBroker === 'demo' ? 'Demo account will be created' : 'Enter your account ID'}
                  disabled={selectedBroker === 'demo'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder={selectedBroker === 'demo' ? 'Demo password will be generated' : 'Enter your password'}
                  disabled={selectedBroker === 'demo'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                >
                  <option value="demo">Demo Account</option>
                  <option value="live">Live Account</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConnectionForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add connection logic here
                  setShowConnectionForm(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}