import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Bell } from 'lucide-react';

export function SignalAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'buy',
      pair: 'EUR/USD',
      signal: 'EMA Crossover',
      strength: 'Strong',
      time: new Date(Date.now() - 5 * 60 * 1000),
      price: 1.0850
    },
    {
      id: 2,
      type: 'sell',
      pair: 'GBP/USD',
      signal: 'RSI Overbought',
      strength: 'Medium',
      time: new Date(Date.now() - 15 * 60 * 1000),
      price: 1.2674
    },
    {
      id: 3,
      type: 'warning',
      pair: 'USD/JPY',
      signal: 'High Volatility',
      strength: 'High',
      time: new Date(Date.now() - 30 * 60 * 1000),
      price: 149.85
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'warning',
        pair: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'][Math.floor(Math.random() * 4)],
        signal: ['EMA Crossover', 'RSI Signal', 'MACD Divergence', 'Support/Resistance'][Math.floor(Math.random() * 4)],
        strength: ['Strong', 'Medium', 'Weak'][Math.floor(Math.random() * 3)],
        time: new Date(),
        price: 1.0850 + (Math.random() - 0.5) * 0.02
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'border-green-400 bg-green-400/10';
      case 'sell':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-yellow-400 bg-yellow-400/10';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <span>Signal Alerts</span>
      </h3>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="font-medium text-white">{alert.pair}</div>
                  <div className="text-sm text-gray-300">{alert.signal}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${getStrengthColor(alert.strength)}`}>
                  {alert.strength}
                </div>
                <div className="text-xs text-gray-400">
                  {alert.time.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Price: {alert.price.toFixed(4)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            For detailed trading signals and auto-trade features
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
            View Trading Signals
          </button>
        </div>
        </button>
      </div>
    </div>
  );
}