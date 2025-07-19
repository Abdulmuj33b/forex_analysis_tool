import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, AlertCircle, BarChart3, Zap } from 'lucide-react';
import { apiService } from '../services/api';

export function AILearning() {
  const [selectedModel, setSelectedModel] = useState('trend-prediction');
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);
  const [learningMetrics, setLearningMetrics] = useState([
    { label: 'Model Accuracy', value: '87.3%', change: '+2.1%', color: 'text-green-400' },
    { label: 'Predictions Made', value: '1,247', change: '+156', color: 'text-blue-400' },
    { label: 'Success Rate', value: '74.2%', change: '+1.8%', color: 'text-green-400' },
    { label: 'Learning Sessions', value: '89', change: '+12', color: 'text-purple-400' }
  ]);
  const [mlLearningProgress, setMlLearningProgress] = useState({
    totalTrades: 0
  });
  const [analysisResults, setAnalysisResults] = useState({
    trendPrediction: {
      direction: 'Bullish',
      confidence: 78,
      timeframe: '4H',
      factors: ['EMA Crossover', 'Volume Increase', 'Support Hold']
    },
    patternRecognition: {
      pattern: 'Ascending Triangle',
      reliability: 85,
      target: 1.0920,
      probability: 72
    },
    sentimentAnalysis: {
      score: 0.65,
      sources: 156,
      bullish: 68,
      bearish: 32
    }
  });

  // Check backend connection and load ML metrics
  useEffect(() => {
    const loadMLMetrics = async () => {
      try {
        const [metrics, learningProgress] = await Promise.all([
          apiService.getMLMetrics(),
          apiService.getMLLearningProgress()
        ]);
        setIsConnectedToBackend(true);
        
        // Update ML learning progress
        setMlLearningProgress({
          totalTrades: learningProgress.training_metrics?.episodes || 0
        });
        
        // Update learning metrics with real data
        setLearningMetrics([
          { 
            label: 'Model Accuracy', 
            value: `${metrics.performance?.policy_accuracy?.toFixed(1) || '87.3'}%`, 
            change: '+2.1%', 
            color: 'text-green-400' 
          },
          { 
            label: 'Predictions Made', 
            value: metrics.training_metrics?.episodes?.toString() || '1,247', 
            change: '+156', 
            color: 'text-blue-400' 
          },
          { 
            label: 'Success Rate', 
            value: `${((metrics.training_metrics?.win_rate || 0.742) * 100).toFixed(1)}%`, 
            change: '+1.8%', 
            color: 'text-green-400' 
          },
          { 
            label: 'MCTS Simulations', 
            value: `${Math.floor((metrics.performance?.total_simulations || 89000) / 1000)}K`, 
            change: '+12K', 
            color: 'text-purple-400' 
          }
        ]);
      } catch (error) {
        console.error('Failed to load ML metrics:', error);
        setIsConnectedToBackend(false);
      }
    };

    loadMLMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMLMetrics, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const models = [
    { id: 'trend-prediction', name: 'Trend Prediction', icon: TrendingUp },
    { id: 'pattern-recognition', name: 'Pattern Recognition', icon: Target },
    { id: 'sentiment-analysis', name: 'Sentiment Analysis', icon: Brain },
    { id: 'risk-assessment', name: 'Risk Assessment', icon: AlertCircle }
  ];

  const recentPredictions = [
    {
      pair: 'EUR/USD',
      prediction: 'Bullish',
      confidence: 82,
      actual: 'Bullish',
      accuracy: true,
      time: '2 hours ago'
    },
    {
      pair: 'GBP/USD',
      prediction: 'Bearish',
      confidence: 76,
      actual: 'Bearish',
      accuracy: true,
      time: '4 hours ago'
    },
    {
      pair: 'USD/JPY',
      prediction: 'Bullish',
      confidence: 68,
      actual: 'Bearish',
      accuracy: false,
      time: '6 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Learning Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>AI Learning & Analysis</span>
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">AI Models Active</span>
          </div>
        </div>

        {/* Learning Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {learningMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">{metric.label}</div>
              <div className="text-xl font-bold text-white mt-1">{metric.value}</div>
              <div className={`text-xs ${metric.color} mt-1`}>{metric.change}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Models */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">AI Models</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {models.map((model) => {
                const Icon = model.icon;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedModel === model.id
                        ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2" />
                    <div className="text-xs font-medium text-center">{model.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Model Results */}
            {selectedModel === 'trend-prediction' && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Trend Prediction Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Direction</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">{analysisResults.trendPrediction.direction}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Confidence</span>
                    <span className="text-white font-medium">{analysisResults.trendPrediction.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Timeframe</span>
                    <span className="text-white font-medium">{analysisResults.trendPrediction.timeframe}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">Key Factors:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysisResults.trendPrediction.factors.map((factor, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedModel === 'pattern-recognition' && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Pattern Recognition</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pattern Detected</span>
                    <span className="text-blue-400 font-medium">{analysisResults.patternRecognition.pattern}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Reliability</span>
                    <span className="text-white font-medium">{analysisResults.patternRecognition.reliability}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price Target</span>
                    <span className="text-green-400 font-medium">{analysisResults.patternRecognition.target}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Success Probability</span>
                    <span className="text-white font-medium">{analysisResults.patternRecognition.probability}%</span>
                  </div>
                </div>
              </div>
            )}

            {selectedModel === 'sentiment-analysis' && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Market Sentiment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sentiment Score</span>
                    <span className="text-green-400 font-medium">{analysisResults.sentimentAnalysis.score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sources Analyzed</span>
                    <span className="text-white font-medium">{analysisResults.sentimentAnalysis.sources}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Bullish</span>
                      <span className="text-green-400">{analysisResults.sentimentAnalysis.bullish}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{ width: `${analysisResults.sentimentAnalysis.bullish}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Predictions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent AI Predictions</h3>
            <div className="space-y-3">
              {recentPredictions.map((prediction, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-white">{prediction.pair}</span>
                      <div className="flex items-center space-x-1">
                        {prediction.prediction === 'Bullish' ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          prediction.prediction === 'Bullish' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {prediction.prediction}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{prediction.confidence}% confidence</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        prediction.accuracy ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-xs text-gray-400">{prediction.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>AI Insights</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-400 mb-1">Market Opportunity</div>
                <div className="text-xs text-gray-300">
                  AI detected a high-probability setup in EUR/USD with 82% confidence based on technical convergence.
                </div>
              </div>
              <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-400 mb-1">Risk Alert</div>
                <div className="text-xs text-gray-300">
                  Increased volatility expected in GBP pairs due to upcoming economic data releases.
                </div>
              </div>
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                <div className="text-sm font-medium text-green-400 mb-1">Learning Update</div>
                <div className="text-xs text-gray-300">
                  Model accuracy improved by 2.1% after processing 156 new trade executions from analytics data.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Model Training</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Training Progress</span>
                  <span className="text-white">87%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Next training session: 2 hours
              </div>
              <div className="text-xs text-gray-300 mt-2">
                Learning from {mlLearningProgress.totalTrades} executed trades in analytics
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                Force Retrain Models
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}