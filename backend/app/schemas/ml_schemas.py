from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class TrainingRequest(BaseModel):
    trade_data: List[Dict[str, Any]]
    epochs: Optional[int] = 50
    learning_rate: Optional[float] = 0.001

class MLMetricsResponse(BaseModel):
    training_metrics: Dict[str, float]
    model_status: Dict[str, str]
    performance: Dict[str, float]

class SignalRequest(BaseModel):
    pair: str
    market_state: List[float]
    timeframe: Optional[str] = "1h"

class MCTSAnalysisResponse(BaseModel):
    action: int
    action_name: str
    confidence: float
    value_estimate: float
    simulations: int
    search_stats: Dict[str, Any]