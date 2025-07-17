from fastapi import WebSocket
from typing import List
import json
import logging

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending message to websocket: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to websocket: {e}")
                disconnected.append(connection)
        
        # Remove disconnected websockets
        for connection in disconnected:
            self.disconnect(connection)

    async def send_trading_signal(self, signal_data: dict):
        message = json.dumps({
            "type": "trading_signal",
            "data": signal_data
        })
        await self.broadcast(message)

    async def send_market_update(self, market_data: dict):
        message = json.dumps({
            "type": "market_update", 
            "data": market_data
        })
        await self.broadcast(message)

    async def send_trade_execution(self, trade_data: dict):
        message = json.dumps({
            "type": "trade_execution",
            "data": trade_data
        })
        await self.broadcast(message)