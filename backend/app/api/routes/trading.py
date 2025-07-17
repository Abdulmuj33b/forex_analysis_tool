from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import logging

from app.core.database import get_db, Trade, TradingSignal
from app.schemas.trading_schemas import TradeCreate, TradeResponse, SignalResponse
from app.services.ml_service import MLService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/execute-trade", response_model=TradeResponse)
async def execute_trade(
    trade_data: TradeCreate,
    db: Session = Depends(get_db)
):
    """Execute a new trade and store in database"""
    try:
        # Create new trade record
        new_trade = Trade(
            pair=trade_data.pair,
            type=trade_data.type,
            entry_price=trade_data.entry_price,
            lot_size=trade_data.lot_size,
            strategy=trade_data.strategy,
            confidence=trade_data.confidence,
            source=trade_data.source,
            volatility=trade_data.market_conditions.volatility if trade_data.market_conditions else None,
            trend=trade_data.market_conditions.trend if trade_data.market_conditions else None,
            volume=trade_data.market_conditions.volume if trade_data.market_conditions else None,
            news_impact=trade_data.market_conditions.news_impact if trade_data.market_conditions else None,
            rsi_entry=trade_data.ml_features.rsi_entry if trade_data.ml_features else None,
            macd_entry=trade_data.ml_features.macd_entry if trade_data.ml_features else None,
            ema_alignment=trade_data.ml_features.ema_alignment if trade_data.ml_features else None,
            smart_money_confirmation=trade_data.ml_features.smart_money_confirmation if trade_data.ml_features else None,
            liquidity_level=trade_data.ml_features.liquidity_level if trade_data.ml_features else None,
            mcts_simulations=trade_data.mcts_data.simulations if trade_data.mcts_data else None,
            policy_confidence=trade_data.mcts_data.policy_confidence if trade_data.mcts_data else None,
            value_estimate=trade_data.mcts_data.value_estimate if trade_data.mcts_data else None
        )
        
        db.add(new_trade)
        db.commit()
        db.refresh(new_trade)
        
        logger.info(f"Trade executed: {new_trade.id} - {new_trade.type} {new_trade.pair}")
        
        return TradeResponse(
            id=str(new_trade.id),
            pair=new_trade.pair,
            type=new_trade.type,
            entry_price=new_trade.entry_price,
            lot_size=new_trade.lot_size,
            strategy=new_trade.strategy,
            confidence=new_trade.confidence,
            source=new_trade.source,
            status=new_trade.status,
            created_at=new_trade.created_at
        )
        
    except Exception as e:
        logger.error(f"Error executing trade: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/close-trade/{trade_id}")
async def close_trade(
    trade_id: str,
    exit_price: float,
    db: Session = Depends(get_db)
):
    """Close an existing trade"""
    try:
        trade = db.query(Trade).filter(Trade.id == trade_id).first()
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        # Calculate profit and pips
        if trade.type == "buy":
            pips = (exit_price - trade.entry_price) * 10000
        else:
            pips = (trade.entry_price - exit_price) * 10000
        
        profit = pips * trade.lot_size
        
        # Calculate duration
        duration_minutes = int((datetime.utcnow() - trade.created_at).total_seconds() / 60)
        
        # Update trade
        trade.exit_price = exit_price
        trade.pips = pips
        trade.profit = profit
        trade.duration_minutes = duration_minutes
        trade.status = "closed"
        trade.updated_at = datetime.utcnow()
        
        db.commit()
        
        logger.info(f"Trade closed: {trade_id} - Profit: {profit}")
        
        return {
            "status": "success",
            "trade_id": trade_id,
            "profit": profit,
            "pips": pips,
            "duration_minutes": duration_minutes
        }
        
    except Exception as e:
        logger.error(f"Error closing trade: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trades", response_model=List[TradeResponse])
async def get_trades(
    limit: int = 100,
    offset: int = 0,
    pair: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get trades with optional filtering"""
    try:
        query = db.query(Trade)
        
        if pair:
            query = query.filter(Trade.pair == pair)
        if status:
            query = query.filter(Trade.status == status)
        
        trades = query.order_by(Trade.created_at.desc()).offset(offset).limit(limit).all()
        
        return [
            TradeResponse(
                id=str(trade.id),
                pair=trade.pair,
                type=trade.type,
                entry_price=trade.entry_price,
                exit_price=trade.exit_price,
                lot_size=trade.lot_size,
                pips=trade.pips,
                profit=trade.profit,
                strategy=trade.strategy,
                confidence=trade.confidence,
                source=trade.source,
                status=trade.status,
                created_at=trade.created_at,
                duration_minutes=trade.duration_minutes
            )
            for trade in trades
        ]
        
    except Exception as e:
        logger.error(f"Error getting trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trade/{trade_id}")
async def get_trade(trade_id: str, db: Session = Depends(get_db)):
    """Get specific trade details"""
    try:
        trade = db.query(Trade).filter(Trade.id == trade_id).first()
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        return {
            "id": str(trade.id),
            "pair": trade.pair,
            "type": trade.type,
            "entry_price": trade.entry_price,
            "exit_price": trade.exit_price,
            "lot_size": trade.lot_size,
            "pips": trade.pips,
            "profit": trade.profit,
            "strategy": trade.strategy,
            "confidence": trade.confidence,
            "risk_reward": trade.risk_reward,
            "source": trade.source,
            "status": trade.status,
            "created_at": trade.created_at,
            "updated_at": trade.updated_at,
            "duration_minutes": trade.duration_minutes,
            "market_conditions": {
                "volatility": trade.volatility,
                "trend": trade.trend,
                "volume": trade.volume,
                "news_impact": trade.news_impact
            },
            "ml_features": {
                "rsi_entry": trade.rsi_entry,
                "macd_entry": trade.macd_entry,
                "ema_alignment": trade.ema_alignment,
                "smart_money_confirmation": trade.smart_money_confirmation,
                "liquidity_level": trade.liquidity_level
            },
            "mcts_data": {
                "simulations": trade.mcts_simulations,
                "policy_confidence": trade.policy_confidence,
                "value_estimate": trade.value_estimate
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting trade: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/trade/{trade_id}")
async def delete_trade(trade_id: str, db: Session = Depends(get_db)):
    """Delete a trade"""
    try:
        trade = db.query(Trade).filter(Trade.id == trade_id).first()
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        db.delete(trade)
        db.commit()
        
        return {"status": "success", "message": "Trade deleted"}
        
    except Exception as e:
        logger.error(f"Error deleting trade: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/open-trades")
async def get_open_trades(db: Session = Depends(get_db)):
    """Get all open trades"""
    try:
        open_trades = db.query(Trade).filter(Trade.status == "open").all()
        
        return [
            {
                "id": str(trade.id),
                "pair": trade.pair,
                "type": trade.type,
                "entry_price": trade.entry_price,
                "lot_size": trade.lot_size,
                "strategy": trade.strategy,
                "created_at": trade.created_at,
                "duration_minutes": int((datetime.utcnow() - trade.created_at).total_seconds() / 60)
            }
            for trade in open_trades
        ]
        
    except Exception as e:
        logger.error(f"Error getting open trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))