import React, { useState } from 'react';
import { Plus, Search, X, TrendingUp, DollarSign, Zap } from 'lucide-react';

interface AssetSelectorProps {
  selectedAssets: string[];
  onAssetChange: (assets: string[]) => void;
}

export function AssetSelector({ selectedAssets, onAssetChange }: AssetSelectorProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('forex');

  const assetCategories = {
    forex: {
      name: 'Forex',
      icon: DollarSign,
      assets: [
        'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD',
        'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CHF/JPY', 'CAD/JPY',
        'USD/CHF', 'EUR/CHF', 'GBP/CHF', 'AUD/CHF', 'NZD/CHF', 'CAD/CHF',
        'EUR/AUD', 'GBP/AUD', 'EUR/CAD', 'GBP/CAD', 'EUR/NZD', 'GBP/NZD'
      ]
    },
    metals: {
      name: 'Metals',
      icon: TrendingUp,
      assets: [
        'XAU/USD', 'XAG/USD', 'XPD/USD', 'XPT/USD'
      ]
    },
    stocks: {
      name: 'Stocks',
      icon: TrendingUp,
      assets: [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'BABA', 'V', 'JPM', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'MA', 'DIS',
        'ADBE', 'CRM', 'PYPL', 'INTC', 'CMCSA', 'VZ', 'T', 'PFE', 'KO', 'PEP'
      ]
    },
    crypto: {
      name: 'Crypto',
      icon: Zap,
      assets: [
        'BTC/USD', 'ETH/USD', 'BNB/USD', 'XRP/USD', 'ADA/USD', 'SOL/USD',
        'DOGE/USD', 'DOT/USD', 'AVAX/USD', 'SHIB/USD', 'MATIC/USD', 'LTC/USD',
        'UNI/USD', 'LINK/USD', 'ALGO/USD', 'VET/USD', 'ICP/USD', 'FIL/USD',
        'TRX/USD', 'ETC/USD', 'XLM/USD', 'THETA/USD', 'MANA/USD', 'SAND/USD'
      ]
    }
  };

  const filteredAssets = assetCategories[selectedCategory as keyof typeof assetCategories].assets.filter(
    asset => asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetToggle = (asset: string) => {
    if (selectedAssets.includes(asset)) {
      onAssetChange(selectedAssets.filter(a => a !== asset));
    } else {
      onAssetChange([...selectedAssets, asset]);
    }
  };

  const removeAsset = (asset: string) => {
    onAssetChange(selectedAssets.filter(a => a !== asset));
  };

  return (
    <div className="relative">
      {/* Selected Assets Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedAssets.map((asset) => (
          <div key={asset} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <span>{asset}</span>
            <button
              onClick={() => removeAsset(asset)}
              className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowSelector(true)}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-3 w-3" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Asset Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Select Assets</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Categories */}
              <div className="flex space-x-2">
                {Object.entries(assetCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assets Grid */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => handleAssetToggle(asset)}
                    className={`p-3 rounded-lg border transition-colors text-sm font-medium ${
                      selectedAssets.includes(asset)
                        ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
              {filteredAssets.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400">No assets found</div>
                  <div className="text-sm text-gray-500">Try adjusting your search term</div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {selectedAssets.length} assets selected
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}