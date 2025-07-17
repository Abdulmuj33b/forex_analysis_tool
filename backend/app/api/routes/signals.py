from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.core.database import get_db, TradingSignal
from app.services.ml_service import MLService
from app.services.market_data import MarketDataService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/active")
async def get_active_signals(
    pair: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get active trading signals"""
    try:
        query = db.query(TradingSignal).filter(TradingSignal.status == "active")
        
        if pair:
            query = query.filter(TradingSignal.pair == pair)
        
        # Filter out expired signals
        current_time = datetime.utcnow()
        query = query.filter(TradingSignal.expires_at > current_time)
        
        signals = query.order_by(TradingSignal.created_at.desc()).all()
        
        result = []
        for signal in signals:
            signal_data = {
                "id": str(signal.id),
                "type": signal.type,
                "pair": signal.pair,
                "entry_price": signal.entry_price,
                "stop_loss": signal.stop_loss,
                "take_profit": signal.take_profit,
                "confidence": signal.confidence,
                "strategy": signal.strategy,
                "reasoning": signal.reasoning,
                "timestamp": signal.created_at,
                "expires_at": signal.expires_at,
                "status": signal.status,
                "risk_reward": abs((signal.take_profit - signal.entry_price) / (signal.entry_price - signal.stop_loss)),
                "pips": abs((signal.take_profit - signal.entry_price) * 10000),
                "mcts_data": {
                    "simulations": signal.mcts_simulations,
                    "policy_score": signal.policy_score,
                    "value_score": signal.value_score,
                    "exploration_rate": signal.exploration_rate
                }
            }
            result.append(signal_data)
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting active signals: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_new_signals(
    background_tasks: BackgroundTasks,
    pairs: Optional[List[str]] = None
):
    """Generate new trading signals using ML models"""
    try:
        ml_service = MLService()
        
        # Generate signals
        signals = await ml_service.generate_trading_signals()
        
        # Filter by requested pairs if specified
        if pairs:
            signals = [s for s in signals if s.get("pair") in pairs]
        
        # Store signals in database
        background_tasks.add_task(_store_signals_in_db, signals)
        
        return {
            "status": "success",
            "signals_generated": len(signals),
            "signals": signals
        }
        
    except Exception as e:
        logger.error(f"Error generating signals: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _store_signals_in_db(signals: List[Dict]):
    """Store generated signals in database"""
    try:
        from app.core.database import SessionLocal
        
        db = SessionLocal()
        
        for signal_data in signals:
            if not signal_data:  # Skip None signals
                continue
                
            # Create expiration time (30 minutes from now)
            expires_at = datetime.utcnow() + timedelta(minutes=30)
            
            signal = TradingSignal(
                pair=signal_data["pair"],
                type=signal_data["type"],
                entry_price=signal_data["entry_price"],
                stop_loss=signal_data["stop_loss"],
                take_profit=signal_data["take_profit"],
                confidence=signal_data["confidence"],
                strategy=signal_data["strategy"],
                reasoning=signal_data["reasoning"],
                expires_at=expires_at,
                mcts_simulations=signal_data["mcts_data"]["simulations"],
                policy_score=signal_data["mcts_data"]["policy_score"],
                value_score=signal_data["mcts_data"]["value_estimate"],
                exploration_rate=signal_data["mcts_data"]["exploration_rate"]
            )
            
            db.add(signal)
        
        db.commit()
        db.close()
        
        logger.info(f"Stored {len(signals)} signals in database")
        
    except Exception as e:
        logger.error(f"Error storing signals in database: {e}")

@router.put("/execute/{signal_id}")
async def execute_signal(
    signal_id: str,
    lot_size: float,
    db: Session = Depends(get_db)
):
    """Execute a trading signal"""
    try:
        signal = db.query(TradingSignal).filter(TradingSignal.id == signal_id).first()
        if not signal:
            raise HTTPException(status_code=404, detail="Signal not found")
        
        if signal.status != "active":
            raise HTTPException(status_code=400, detail="Signal is not active")
        
        # Update signal status
        signal.status = "executed"
        
        # Here you would integrate with broker API to execute the trade
        # For now, we'll simulate the execution
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Signal executed successfully",
            "signal_id": signal_id,
            "execution_details": {
                "pair": signal.pair,
                "type": signal.type,
                "entry_price": signal.entry_price,
                "lot_size": lot_size,
                "stop_loss": signal.stop_loss,
                "take_profit": signal.take_profit
            }
        }
        
    except Exception as e:
        logger.error(f"Error executing signal: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/expire-old")
async def expire_old_signals(db: Session = Depends(get_db)):
    """Expire old signals that have passed their expiration time"""
    try:
        current_time = datetime.utcnow()
        
        expired_signals = db.query(TradingSignal).filter(
            and_(
                TradingSignal.status == "active",
                TradingSignal.expires_at <= current_time
            )
        ).all()
        
        for signal in expired_signals:
            signal.status = "expired"
        
        db.commit()
        
        return {
            "status": "success",
            "expired_signals": len(expired_signals)
        }
        
    except Exception as e:
        logger.error(f"Error expiring old signals: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance")
async def get_signal_performance(
    timeframe: str = "7d",
    db: Session = Depends(get_db)
):
    """Get trading signal performance metrics"""
    try:
        # Calculate timeframe
        timeframe_hours = {"1d": 24, "7d": 168, "30d": 720}
        hours = timeframe_hours.get(timeframe, 168)
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        # Get signals from timeframe
        signals = db.query(TradingSignal).filter(
            TradingSignal.created_at >= cutoff_time
        ).all()
        
        total_signals = len(signals)
        executed_signals = len([s for s in signals if s.status == "executed"])
        expired_signals = len([s for s in signals if s.status == "expired"])
        active_signals = len([s for s in signals if s.status == "active"])
        
        # Calculate average confidence
        avg_confidence = sum(s.confidence for s in signals) / total_signals if total_signals > 0 else 0
        
        # Group by strategy
        strategy_performance = {}
        for signal in signals:
            strategy = signal.strategy
            if strategy not in strategy_performance:
                strategy_performance[strategy] = {"total": 0, "executed": 0}
            
            strategy_performance[strategy]["total"] += 1
            if signal.status == "executed":
                strategy_performance[strategy]["executed"] += 1
        
        return {
            "timeframe": timeframe,
            "total_signals": total_signals,
            "executed_signals": executed_signals,
            "expired_signals": expired_signals,
            "active_signals": active_signals,
            "execution_rate": (executed_signals / total_signals * 100) if total_signals > 0 else 0,
            "average_confidence": round(avg_confidence, 1),
            "strategy_performance": strategy_performance
        }
        
    except Exception as e:
        logger.error(f"Error getting signal performance: {e}")
        raise HTTPException(status_code=500, detail=str(e))