import asyncio
import random
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class MarketDataService:
    def __init__(self):
        self.current_prices = {
            "EUR/USD": 1.0850,
            "GBP/USD": 1.2674,
            "USD/JPY": 149.85,
            "AUD/USD": 0.6521,
            "USD/CAD": 1.3712,
            "NZD/USD": 0.5987
        }
        
        self.technical_indicators = {}
        self.is_running = False
        
    async def start_data_collection(self):
        """Start collecting market data"""
        self.is_running = True
        logger.info("Market data collection started")
        
        while self.is_running:
            try:
                await self._update_market_data()
                await asyncio.sleep(1)  # Update every second
            except Exception as e:
                logger.error(f"Error in market data collection: {e}")
                await asyncio.sleep(5)
    
    async def _update_market_data(self):
        """Update market data with simulated values"""
        for pair in self.current_prices:
            # Simulate price movement
            volatility = 0.0001  # 1 pip volatility
            change = (random.random() - 0.5) * volatility
            self.current_prices[pair] += change
            
            # Update technical indicators
            await self._calculate_technical_indicators(pair)
    
    async def _calculate_technical_indicators(self, pair: str):
        """Calculate technical indicators for a currency pair"""
        price = self.current_prices[pair]
        
        # Simulate technical indicators
        self.technical_indicators[pair] = {
            "rsi": 30 + random.random() * 40,  # RSI between 30-70
            "macd": (random.random() - 0.5) * 0.002,
            "macd_signal": (random.random() - 0.5) * 0.0015,
            "ema_20": price + (random.random() - 0.5) * 0.001,
            "ema_50": price + (random.random() - 0.5) * 0.002,
            "bollinger_upper": price + 0.002,
            "bollinger_lower": price - 0.002,
            "volatility": random.random() * 100,
            "volume": random.randint(500000, 2000000),
            "institutional_flow": (random.random() - 0.5) * 100,
            "order_blocks": self._generate_order_blocks(price),
            "liquidity_zones": self._generate_liquidity_zones(price)
        }
    
    def _generate_order_blocks(self, price: float) -> List[Dict]:
        """Generate simulated order blocks"""
        return [
            {
                "price": price + 0.0025,
                "type": "bullish",
                "strength": random.choice(["high", "medium", "low"]),
                "time": datetime.utcnow().isoformat()
            },
            {
                "price": price - 0.0025,
                "type": "bearish", 
                "strength": random.choice(["high", "medium", "low"]),
                "time": datetime.utcnow().isoformat()
            }
        ]
    
    def _generate_liquidity_zones(self, price: float) -> List[Dict]:
        """Generate simulated liquidity zones"""
        return [
            {
                "price": price + 0.004,
                "type": "buy",
                "volume": random.choice(["high", "medium", "low"])
            },
            {
                "price": price - 0.004,
                "type": "sell",
                "volume": random.choice(["high", "medium", "low"])
            }
        ]
    
    async def get_real_time_data(self) -> Dict[str, Any]:
        """Get current real-time market data"""
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "prices": self.current_prices.copy(),
            "technical_indicators": self.technical_indicators.copy()
        }
    
    async def get_current_market_state(self) -> Dict[str, Dict]:
        """Get current market state for ML processing"""
        market_state = {}
        
        for pair in self.current_prices:
            indicators = self.technical_indicators.get(pair, {})
            
            market_state[pair] = {
                "close_price": self.current_prices[pair],
                "rsi": indicators.get("rsi", 50),
                "macd": indicators.get("macd", 0),
                "macd_signal": indicators.get("macd_signal", 0),
                "ema_20": indicators.get("ema_20", self.current_prices[pair]),
                "ema_50": indicators.get("ema_50", self.current_prices[pair]),
                "bollinger_upper": indicators.get("bollinger_upper", self.current_prices[pair] + 0.002),
                "bollinger_lower": indicators.get("bollinger_lower", self.current_prices[pair] - 0.002),
                "volatility": indicators.get("volatility", 50),
                "volume": indicators.get("volume", 1000000),
                "institutional_flow": indicators.get("institutional_flow", 0),
                "order_blocks": indicators.get("order_blocks", []),
                "liquidity_zones": indicators.get("liquidity_zones", [])
            }
        
        return market_state
    
    async def get_historical_data(self, pair: str, timeframe: str = "1h", limit: int = 100) -> List[Dict]:
        """Get historical market data"""
        # Simulate historical data
        data = []
        current_time = datetime.utcnow()
        current_price = self.current_prices.get(pair, 1.0850)
        
        for i in range(limit):
            timestamp = current_time - timedelta(hours=i)
            
            # Simulate OHLC data
            open_price = current_price + (random.random() - 0.5) * 0.01
            high_price = open_price + random.random() * 0.005
            low_price = open_price - random.random() * 0.005
            close_price = open_price + (random.random() - 0.5) * 0.003
            
            data.append({
                "timestamp": timestamp.isoformat(),
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "close": close_price,
                "volume": random.randint(500000, 2000000)
            })
            
            current_price = close_price
        
        return list(reversed(data))  # Return chronological order
    
    async def cleanup(self):
        """Cleanup market data service"""
        self.is_running = False
        logger.info("Market data service stopped")