# Forex Analysis Pro - Python Backend

Advanced AI-powered forex trading analysis backend with MCTS algorithm, neural networks, and real-time trading signals.

## 🚀 Features

- **MCTS Algorithm**: Monte Carlo Tree Search for optimal trading decisions
- **Neural Networks**: Policy and Value networks for action prediction and position evaluation
- **Real-time Trading Signals**: AI-generated buy/sell/hold recommendations
- **Trade Analytics**: Comprehensive performance tracking and analysis
- **WebSocket Support**: Real-time data streaming to frontend
- **Database Integration**: PostgreSQL with SQLAlchemy ORM
- **RESTful API**: FastAPI with automatic documentation

## 🧠 Machine Learning Components

### MCTS (Monte Carlo Tree Search)
- **Policy Network**: Predicts optimal trading actions with confidence scores
- **Value Network**: Evaluates market position values and risk-adjusted returns
- **Tree Search**: Performs 1000+ simulations per trading decision
- **Continuous Learning**: Improves from executed trade outcomes

### Neural Network Architecture
- **Input Features**: 20 market indicators (RSI, MACD, EMA, volume, etc.)
- **Hidden Layers**: 128-64-32 neurons with batch normalization
- **Output**: Action probabilities (BUY/SELL/HOLD) and value estimates
- **Training**: Backpropagation with Adam optimizer

## 📊 API Endpoints

### Trading
- `POST /api/v1/trading/execute-trade` - Execute new trade
- `PUT /api/v1/trading/close-trade/{trade_id}` - Close existing trade
- `GET /api/v1/trading/trades` - Get trade history with filtering
- `GET /api/v1/trading/open-trades` - Get currently open trades

### Machine Learning
- `POST /api/v1/ml/initialize` - Initialize ML models
- `GET /api/v1/ml/metrics` - Get ML performance metrics
- `POST /api/v1/ml/train` - Train models on trade data
- `POST /api/v1/ml/generate-signals` - Generate trading signals
- `POST /api/v1/ml/mcts-analysis` - Run MCTS analysis

### Analytics
- `GET /api/v1/analytics/trade-summary` - Comprehensive trade analytics
- `GET /api/v1/analytics/strategy-performance` - Performance by strategy
- `GET /api/v1/analytics/ml-learning-progress` - ML learning insights
- `GET /api/v1/analytics/pair-performance` - Performance by currency pair

### Signals
- `GET /api/v1/signals/active` - Get active trading signals
- `POST /api/v1/signals/generate` - Generate new signals
- `PUT /api/v1/signals/execute/{signal_id}` - Execute signal
- `GET /api/v1/signals/performance` - Signal performance metrics

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Redis (optional, for caching)

### Setup
1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

5. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb forex_analysis
   
   # Run migrations (tables will be created automatically)
   python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"
   ```

6. **Start the server**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/forex_analysis

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# ML Configuration
MODEL_PATH=models/
MCTS_SIMULATIONS=1000
NEURAL_NETWORK_EPOCHS=100

# Trading Settings
DEFAULT_RISK_PERCENTAGE=2.0
MAX_CONCURRENT_TRADES=5

# Broker APIs (optional)
OANDA_API_KEY=your-oanda-api-key
MT4_SERVER=your-mt4-server
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_ml_service.py
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t forex-analysis-backend .

# Run container
docker run -p 8000:8000 forex-analysis-backend
```

### Production
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

## 📈 Performance Monitoring

The backend includes comprehensive monitoring:

- **ML Metrics**: Model accuracy, training progress, prediction confidence
- **Trade Analytics**: Win rate, profit factor, strategy performance
- **System Health**: Database connections, memory usage, response times
- **Real-time Updates**: WebSocket connections for live data streaming

## 🔒 Security

- **JWT Authentication**: Secure API access
- **Input Validation**: Pydantic schemas for request validation
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Rate Limiting**: API endpoint protection (can be added)

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **WebSocket Connections**: Real-time market data and trading signals
2. **RESTful APIs**: Standard HTTP endpoints for all operations
3. **CORS Enabled**: Allows frontend connections from localhost
4. **JSON Responses**: Consistent data format for easy consumption

## 📊 Database Schema

### Tables
- **trades**: Trade execution records with ML features
- **trading_signals**: AI-generated trading recommendations
- **ml_models**: Stored neural network models and metadata
- **market_data**: Historical and real-time market information

### Key Relationships
- Trades link to signals that generated them
- ML models track training history and performance
- Market data provides context for trade decisions

## 🔄 Continuous Learning

The ML system continuously improves through:

1. **Trade Outcome Analysis**: Learning from profitable/losing trades
2. **Pattern Recognition**: Identifying successful market conditions
3. **Strategy Optimization**: Refining entry/exit timing
4. **Risk Assessment**: Improving position sizing and stop-loss placement

## 📞 Support

For technical support or questions:
- Check the API documentation at `/docs`
- Review logs in the console output
- Ensure all dependencies are properly installed
- Verify database connections and environment variables

## 🎯 Next Steps

1. **Connect to Frontend**: Ensure React app can communicate with backend
2. **Configure Database**: Set up PostgreSQL with proper credentials
3. **Train Models**: Run initial training on sample trade data
4. **Test Signals**: Generate and validate trading signals
5. **Monitor Performance**: Track ML model accuracy and improvements