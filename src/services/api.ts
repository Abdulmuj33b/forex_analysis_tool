// API service for communicating with Python backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Trading endpoints
  async executeTrade(tradeData: any) {
    return this.request('/trading/execute-trade', {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  }

  async closeTrade(tradeId: string, exitPrice: number) {
    return this.request(`/trading/close-trade/${tradeId}`, {
      method: 'PUT',
      body: JSON.stringify({ exit_price: exitPrice }),
    });
  }

  async getTrades(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/trading/trades?${queryString}`);
  }

  async getOpenTrades() {
    return this.request('/trading/open-trades');
  }

  // ML endpoints
  async initializeML() {
    return this.request('/ml/initialize', { method: 'POST' });
  }

  async getMLMetrics() {
    return this.request('/ml/metrics');
  }

  async trainModels() {
    return this.request('/ml/train', { method: 'POST' });
  }

  async generateSignals() {
    return this.request('/ml/generate-signals', { method: 'POST' });
  }

  async runMCTSAnalysis(marketState: number[]) {
    return this.request('/ml/mcts-analysis', {
      method: 'POST',
      body: JSON.stringify({ market_state: marketState }),
    });
  }

  async getLearningInsights() {
    return this.request('/ml/learning-insights');
  }

  // Analytics endpoints
  async getTradeSummary(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/trade-summary?${queryString}`);
  }

  async getStrategyPerformance(timeframe: string = 'all') {
    return this.request(`/analytics/strategy-performance?timeframe=${timeframe}`);
  }

  async getMLLearningProgress() {
    return this.request('/analytics/ml-learning-progress');
  }

  async getPairPerformance(timeframe: string = 'all') {
    return this.request(`/analytics/pair-performance?timeframe=${timeframe}`);
  }

  async getRecentTrades(limit: number = 20) {
    return this.request(`/analytics/recent-trades?limit=${limit}`);
  }

  // Signals endpoints
  async getActiveSignals(pair?: string) {
    const params = pair ? `?pair=${pair}` : '';
    return this.request(`/signals/active${params}`);
  }

  async executeSignal(signalId: string, lotSize: number) {
    return this.request(`/signals/execute/${signalId}`, {
      method: 'PUT',
      body: JSON.stringify({ lot_size: lotSize }),
    });
  }

  async getSignalPerformance(timeframe: string = '7d') {
    return this.request(`/signals/performance?timeframe=${timeframe}`);
  }

  // WebSocket connections
  createWebSocket(endpoint: string): WebSocket {
    const wsUrl = `ws://localhost:8000/ws/${endpoint}`;
    return new WebSocket(wsUrl);
  }

  // Market data WebSocket
  connectToMarketData(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const ws = this.createWebSocket('market-data');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    return ws;
  }

  // Trading signals WebSocket
  connectToTradingSignals(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const ws = this.createWebSocket('trading-signals');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    return ws;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export types for TypeScript
export interface TradeData {
  pair: string;
  type: 'buy' | 'sell';
  entry_price: number;
  lot_size: number;
  strategy: string;
  confidence?: number;
  source: 'manual' | 'auto' | 'signal';
  market_conditions?: {
    volatility?: number;
    trend?: string;
    volume?: string;
    news_impact?: string;
  };
  ml_features?: {
    rsi_entry?: number;
    macd_entry?: number;
    ema_alignment?: boolean;
    smart_money_confirmation?: boolean;
    liquidity_level?: string;
  };
  mcts_data?: {
    simulations?: number;
    policy_confidence?: number;
    value_estimate?: number;
  };
}

export interface TradingSignal {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence: number;
  strategy: string;
  reasoning: string;
  timestamp: string;
  status: 'active' | 'executed' | 'expired';
  risk_reward: number;
  pips: number;
  mcts_data: {
    simulations: number;
    policy_score: number;
    value_score: number;
    exploration_rate: number;
  };
}

export default apiService;