from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class MarketConditions(BaseModel):
    volatility: Optional[float] = None
    trend: Optional[str] = None
    volume: Optional[str] = None
    news_impact: Optional[str] = None

class MLFeatures(BaseModel):
    rsi_entry: Optional[float] = None
    macd_entry: Optional[float] = None
    ema_alignment: Optional[bool] = None
    smart_money_confirmation: Optional[bool] = None
    liquidity_level: Optional[str] = None

class MCTSData(BaseModel):
    simulations: Optional[int] = None
    policy_confidence: Optional[float] = None
    value_estimate: Optional[float] = None

class TradeCreate(BaseModel):
    pair: str
    type: str  # buy/sell
    entry_price: float
    lot_size: float
    strategy: str
    confidence: Optional[float] = None
    source: str = "manual"
    market_conditions: Optional[MarketConditions] = None
    ml_features: Optional[MLFeatures] = None
    mcts_data: Optional[MCTSData] = None

class TradeResponse(BaseModel):
    id: str
    pair: str
    type: str
    entry_price: float
    exit_price: Optional[float] = None
    lot_size: float
    pips: Optional[float] = None
    profit: Optional[float] = None
    strategy: str
    confidence: Optional[float] = None
    source: str
    status: str
    created_at: datetime
    duration_minutes: Optional[int] = None

class SignalResponse(BaseModel):
    id: str
    pair: str
    type: str
    entry_price: float
    stop_loss: float
    take_profit: float
    confidence: float
    strategy: str
    reasoning: str
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None