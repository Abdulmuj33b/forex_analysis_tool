import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { LiveChart } from './components/LiveChart';
import { TechnicalIndicators } from './components/TechnicalIndicators';
import { RiskCalculator } from './components/RiskCalculator';
import { TradeJournal } from './components/TradeJournal';
import { EconomicCalendar } from './components/EconomicCalendar';
import { SignalAlerts } from './components/SignalAlerts';
import { MarketOverview } from './components/MarketOverview';
import { AILearning } from './components/AILearning';
import { BrokerIntegration } from './components/BrokerIntegration';
import { AssetSelector } from './components/AssetSelector';
import { TradingSignals } from './components/TradingSignals';
import { TradeAnalytics } from './components/TradeAnalytics';

function App() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssets, setSelectedAssets] = useState(['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD']);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardLayout 
        selectedPair={selectedPair}
        setSelectedPair={setSelectedPair}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Watchlist</h3>
              <AssetSelector 
                selectedAssets={selectedAssets}
                onAssetChange={setSelectedAssets}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Active Pair</label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                >
                  {selectedAssets.map((asset) => (
                    <option key={asset} value={asset}>{asset}</option>
                  ))}
                </select>
              </div>
            </div>
            <MarketOverview selectedPair={selectedPair} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <LiveChart selectedPair={selectedPair} />
              </div>
              <div className="space-y-6">
                <TechnicalIndicators selectedPair={selectedPair} />
                <SignalAlerts />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'signals' && <TradingSignals selectedPair={selectedPair} />}
        {activeTab === 'calculator' && <RiskCalculator />}
        {activeTab === 'journal' && <TradeJournal />}
        {activeTab === 'calendar' && <EconomicCalendar />}
        {activeTab === 'ai-learning' && <AILearning />}
        {activeTab === 'broker-integration' && <BrokerIntegration />}
        {activeTab === 'trade-analytics' && <TradeAnalytics />}
      </DashboardLayout>
    </div>
  );
}

export default App;