import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export function EconomicCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const events = [
    {
      time: '08:30',
      currency: 'USD',
      event: 'Non-Farm Payrolls',
      impact: 'High',
      forecast: '180K',
      previous: '150K',
      actual: null
    },
    {
      time: '10:00',
      currency: 'EUR',
      event: 'ECB Interest Rate Decision',
      impact: 'High',
      forecast: '4.50%',
      previous: '4.50%',
      actual: null
    },
    {
      time: '12:30',
      currency: 'GBP',
      event: 'GDP Growth Rate',
      impact: 'Medium',
      forecast: '0.2%',
      previous: '0.1%',
      actual: '0.3%'
    },
    {
      time: '14:00',
      currency: 'USD',
      event: 'Unemployment Rate',
      impact: 'Medium',
      forecast: '3.7%',
      previous: '3.8%',
      actual: null
    },
    {
      time: '15:30',
      currency: 'CAD',
      event: 'Core CPI',
      impact: 'Medium',
      forecast: '3.2%',
      previous: '3.4%',
      actual: null
    },
    {
      time: '16:00',
      currency: 'JPY',
      event: 'Bank of Japan Meeting',
      impact: 'High',
      forecast: '-0.10%',
      previous: '-0.10%',
      actual: null
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-yellow-600 text-white';
      case 'Low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Medium':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCurrencyFlag = (currency: string) => {
    const flags = {
      USD: '🇺🇸',
      EUR: '🇪🇺',
      GBP: '🇬🇧',
      JPY: '🇯🇵',
      CAD: '🇨🇦',
      AUD: '🇦🇺',
      CHF: '🇨🇭',
      NZD: '🇳🇿'
    };
    return flags[currency as keyof typeof flags] || '🏳️';
  };

  const upcomingEvents = events.filter(event => event.actual === null);
  const completedEvents = events.filter(event => event.actual !== null);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Economic Calendar</span>
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>High Impact</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Medium Impact</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Low Impact</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Events Today</div>
                <div className="text-2xl font-bold text-white">{events.length}</div>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">High Impact</div>
                <div className="text-2xl font-bold text-red-400">
                  {events.filter(e => e.impact === 'High').length}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-green-400">
                  {completedEvents.length}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-300">{event.time}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                      <span className="text-sm font-medium text-gray-300">{event.currency}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getImpactColor(event.impact)}`}>
                      {getImpactIcon(event.impact)}
                      <span>{event.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-gray-400">
                      Forecast: <span className="text-white font-medium">{event.forecast}</span>
                    </div>
                    <div className="text-gray-400">
                      Previous: <span className="text-white font-medium">{event.previous}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-white font-medium">{event.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Events */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Completed Events</h3>
          <div className="space-y-3">
            {completedEvents.map((event, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-300">{event.time}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                      <span className="text-sm font-medium text-gray-300">{event.currency}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getImpactColor(event.impact)}`}>
                      {getImpactIcon(event.impact)}
                      <span>{event.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-gray-400">
                      Actual: <span className="text-green-400 font-medium">{event.actual}</span>
                    </div>
                    <div className="text-gray-400">
                      Forecast: <span className="text-white font-medium">{event.forecast}</span>
                    </div>
                    <div className="text-gray-400">
                      Previous: <span className="text-white font-medium">{event.previous}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-white font-medium">{event.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}