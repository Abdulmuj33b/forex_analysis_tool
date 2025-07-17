from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from typing import Generator

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pair = Column(String, nullable=False)
    type = Column(String, nullable=False)  # buy/sell
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float)
    lot_size = Column(Float, nullable=False)
    pips = Column(Float)
    profit = Column(Float)
    strategy = Column(String, nullable=False)
    confidence = Column(Float)
    risk_reward = Column(Float)
    duration_minutes = Column(Integer)
    source = Column(String, default="manual")  # manual/auto/signal
    status = Column(String, default="open")  # open/closed/cancelled
    
    # Market conditions at entry
    volatility = Column(Float)
    trend = Column(String)
    volume = Column(String)
    news_impact = Column(String)
    
    # Technical indicators at entry
    rsi_entry = Column(Float)
    macd_entry = Column(Float)
    ema_alignment = Column(Boolean)
    smart_money_confirmation = Column(Boolean)
    liquidity_level = Column(String)
    
    # MCTS data
    mcts_simulations = Column(Integer)
    policy_confidence = Column(Float)
    value_estimate = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MLModel(Base):
    __tablename__ = "ml_models"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # policy/value/mcts
    version = Column(String, nullable=False)
    accuracy = Column(Float)
    training_episodes = Column(Integer)
    model_data = Column(Text)  # Serialized model
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TradingSignal(Base):
    __tablename__ = "trading_signals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pair = Column(String, nullable=False)
    type = Column(String, nullable=False)  # buy/sell
    entry_price = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    strategy = Column(String, nullable=False)
    reasoning = Column(Text)
    status = Column(String, default="active")  # active/executed/expired
    
    # MCTS analysis
    mcts_simulations = Column(Integer)
    policy_score = Column(Float)
    value_score = Column(Float)
    exploration_rate = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pair = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    open_price = Column(Float, nullable=False)
    high_price = Column(Float, nullable=False)
    low_price = Column(Float, nullable=False)
    close_price = Column(Float, nullable=False)
    volume = Column(Float)
    
    # Technical indicators
    rsi = Column(Float)
    macd = Column(Float)
    macd_signal = Column(Float)
    ema_20 = Column(Float)
    ema_50 = Column(Float)
    bollinger_upper = Column(Float)
    bollinger_lower = Column(Float)
    
    # Smart money analysis
    order_blocks = Column(Text)  # JSON data
    liquidity_zones = Column(Text)  # JSON data
    institutional_flow = Column(Float)

# Dependency to get DB session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()