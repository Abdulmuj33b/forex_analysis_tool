from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/forex_analysis"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ML Models
    MODEL_PATH: str = "models/"
    MCTS_SIMULATIONS: int = 1000
    NEURAL_NETWORK_EPOCHS: int = 100
    
    # Trading
    DEFAULT_RISK_PERCENTAGE: float = 2.0
    MAX_CONCURRENT_TRADES: int = 5
    
    # Market Data
    MARKET_DATA_PROVIDER: str = "mock"  # mock, alpha_vantage, etc.
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    
    # Broker APIs
    MT4_SERVER: Optional[str] = None
    MT4_LOGIN: Optional[str] = None
    MT4_PASSWORD: Optional[str] = None
    
    OANDA_API_KEY: Optional[str] = None
    OANDA_ACCOUNT_ID: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()