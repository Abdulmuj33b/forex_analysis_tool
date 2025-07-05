import React, { useState } from 'react';
import { TrendingUp, Calculator, BookOpen, Calendar, BarChart3, Settings, Bell, Brain, Link, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardLayout({ 
  children, 
  selectedPair, 
  setSelectedPair, 
  activeTab, 
  setActiveTab 
}: DashboardLayoutProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5,
    soundAlerts: false,
    emailAlerts: true,
    riskWarnings: true
  });

  const notifications = [
    {
      id: 1,
      type: 'signal',
      title: 'Buy Signal - EUR/USD',
      message: 'EMA crossover detected with 82% confidence',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'alert',
      title: 'High Volatility Warning',
      message: 'GBP/USD showing increased volatility',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'news',
      title: 'Economic Data Release',
      message: 'US Non-Farm Payrolls in 30 minutes',
      time: '1 hour ago',
      read: true
    }
  ];

  const currencyPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'];
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'calculator', label: 'Risk Calculator', icon: Calculator },
    { id: 'journal', label: 'Trade Journal', icon: BookOpen },
    { id: 'calendar', label: 'Economic Calendar', icon: Calendar },
    { id: 'ai-learning', label: 'AI Learning', icon: Brain },
    { id: 'broker-integration', label: 'Broker Integration', icon: Link },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Forex Analyzer Pro</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </button>
              
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none text-sm md:text-base"
              >
                {currencyPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
              <div className="text-xs md:text-sm text-gray-400 hidden sm:block">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors relative"
                >
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs md:text-sm text-gray-400 hidden sm:block">Market Open</span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden mt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Theme Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">Appearance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Theme</span>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-400 focus:outline-none"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">Data & Updates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto Refresh</span>
                      <button
                        onClick={() => handleSettingChange('autoRefresh', !settings.autoRefresh)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Refresh Interval (seconds)</span>
                      <select
                        value={settings.refreshInterval}
                        onChange={(e) => handleSettingChange('refreshInterval', Number(e.target.value))}
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-400 focus:outline-none"
                        disabled={!settings.autoRefresh}
                      >
                        <option value={1}>1s</option>
                        <option value={5}>5s</option>
                        <option value={10}>10s</option>
                        <option value={30}>30s</option>
                        <option value={60}>1m</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable Notifications</span>
                      <button
                        onClick={() => handleSettingChange('notifications', !settings.notifications)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sound Alerts</span>
                      <button
                        onClick={() => handleSettingChange('soundAlerts', !settings.soundAlerts)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.soundAlerts ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                        disabled={!settings.notifications}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Email Alerts</span>
                      <button
                        onClick={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                        disabled={!settings.notifications}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Risk Warnings</span>
                      <button
                        onClick={() => handleSettingChange('riskWarnings', !settings.riskWarnings)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.riskWarnings ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.riskWarnings ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-end space-x-3">
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
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadNotifications}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'border-gray-600 bg-gray-700/50' 
                        : 'border-blue-600/50 bg-blue-600/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            notification.type === 'signal' ? 'bg-green-400' :
                            notification.type === 'alert' ? 'bg-red-400' : 'bg-blue-400'
                          }`}></span>
                          <span className="text-white font-medium text-sm">{notification.title}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{notification.message}</p>
                        <span className="text-gray-400 text-xs">{notification.time}</span>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <div className="text-gray-400">No notifications</div>
                  <div className="text-sm text-gray-500">You're all caught up!</div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}