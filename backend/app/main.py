from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import asyncio
from typing import List, Dict, Any
import json
from datetime import datetime, timedelta
import logging

from app.api.routes import trading, ml, analytics, signals
from app.core.config import settings
from app.core.database import engine, Base
from app.services.websocket_manager import WebSocketManager
from app.services.market_data import MarketDataService
from app.services.ml_service import MLService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Forex Analysis Pro API",
    description="Advanced AI-Powered Forex Trading Analysis Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# WebSocket manager
websocket_manager = WebSocketManager()

# Services
market_data_service = MarketDataService()
ml_service = MLService()

# Include API routes
app.include_router(trading.router, prefix="/api/v1/trading", tags=["trading"])
app.include_router(ml.router, prefix="/api/v1/ml", tags=["machine-learning"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(signals.router, prefix="/api/v1/signals", tags=["signals"])

@app.get("/")
async def root():
    return {
        "message": "Forex Analysis Pro API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "ml_models": "loaded",
            "market_data": "active"
        }
    }

@app.websocket("/ws/market-data")
async def websocket_market_data(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Send real-time market data
            market_data = await market_data_service.get_real_time_data()
            await websocket_manager.send_personal_message(
                json.dumps(market_data), websocket
            )
            await asyncio.sleep(1)  # Send updates every second
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

@app.websocket("/ws/trading-signals")
async def websocket_trading_signals(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Generate and send trading signals
            signals = await ml_service.generate_trading_signals()
            await websocket_manager.send_personal_message(
                json.dumps(signals), websocket
            )
            await asyncio.sleep(15)  # Send signals every 15 seconds
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Forex Analysis Pro API...")
    
    # Initialize ML models
    await ml_service.initialize_models()
    
    # Start background tasks
    asyncio.create_task(market_data_service.start_data_collection())
    asyncio.create_task(ml_service.start_continuous_learning())
    
    logger.info("API startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Forex Analysis Pro API...")
    await ml_service.cleanup()
    await market_data_service.cleanup()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )