import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export function RiskCalculator() {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [entryPrice, setEntryPrice] = useState(1.0850);
  const [stopLoss, setStopLoss] = useState(1.0800);
  const [targetPrice, setTargetPrice] = useState(1.0900);
  const [pipValue, setPipValue] = useState(1);
  const [results, setResults] = useState({
    riskAmount: 0,
    pipsAtRisk: 0,
    lotSize: 0,
    potentialProfit: 0,
    riskRewardRatio: 0
  });

  useEffect(() => {
    const riskAmount = (accountBalance * riskPercentage) / 100;
    const pipsAtRisk = Math.abs(entryPrice - stopLoss) * 10000;
    const lotSize = pipsAtRisk > 0 ? riskAmount / (pipsAtRisk * pipValue) : 0;
    const potentialProfit = Math.abs(targetPrice - entryPrice) * 10000 * pipValue * lotSize;
    const riskRewardRatio = riskAmount > 0 ? potentialProfit / riskAmount : 0;

    setResults({
      riskAmount,
      pipsAtRisk,
      lotSize,
      potentialProfit,
      riskRewardRatio
    });
  }, [accountBalance, riskPercentage, entryPrice, stopLoss, targetPrice, pipValue]);

  const presetRiskLevels = [
    { label: 'Conservative', value: 1, color: 'bg-green-600' },
    { label: 'Moderate', value: 2, color: 'bg-blue-600' },
    { label: 'Aggressive', value: 3, color: 'bg-yellow-600' },
    { label: 'High Risk', value: 5, color: 'bg-red-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center space-x-2">
          <Calculator className="h-6 w-6" />
          <span>Risk Management Calculator</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-white">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Balance ($)
                  </label>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {presetRiskLevels.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setRiskPercentage(preset.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-colors ${
                          riskPercentage === preset.value ? preset.color : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      >
                        {preset.label} ({preset.value}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-white">Trade Setup</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Price
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pip Value ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pipValue}
                    onChange={(e) => setPipValue(Number(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-white flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Calculation Results</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Risk Amount</span>
                  <span className="text-xl font-bold text-red-400">
                    ${results.riskAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Pips at Risk</span>
                  <span className="text-lg font-semibold text-white">
                    {results.pipsAtRisk.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Lot Size</span>
                  <span className="text-lg font-semibold text-blue-400">
                    {results.lotSize.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Potential Profit</span>
                  <span className="text-xl font-bold text-green-400">
                    ${results.potentialProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Risk/Reward Ratio</span>
                  <span className={`text-lg font-semibold ${
                    results.riskRewardRatio >= 2 ? 'text-green-400' : 
                    results.riskRewardRatio >= 1 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    1:{results.riskRewardRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trade Analysis</span>
              </h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border-l-4 ${
                  results.riskRewardRatio >= 2 ? 'border-green-400 bg-green-400/10' :
                  results.riskRewardRatio >= 1 ? 'border-yellow-400 bg-yellow-400/10' :
                  'border-red-400 bg-red-400/10'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      {results.riskRewardRatio >= 2 ? 'Excellent' :
                       results.riskRewardRatio >= 1 ? 'Good' : 'Poor'} Risk/Reward
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {results.riskRewardRatio >= 2 ? 'This trade offers excellent risk/reward potential.' :
                     results.riskRewardRatio >= 1 ? 'This trade has acceptable risk/reward.' :
                     'Consider adjusting your stop loss or target price.'}
                  </p>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>• Maximum recommended lot size: {results.lotSize.toFixed(2)}</p>
                  <p>• Risk per pip: ${(results.riskAmount / results.pipsAtRisk).toFixed(2)}</p>
                  <p>• Account risk: {riskPercentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}