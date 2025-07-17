import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class PolicyNetwork(nn.Module):
    """Neural network for predicting trading action probabilities"""
    
    def __init__(self, input_size: int = 20, hidden_size: int = 128, output_size: int = 3):
        super(PolicyNetwork, self).__init__()
        
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size  # 3 actions: BUY, SELL, HOLD
        
        # Network layers
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc4 = nn.Linear(hidden_size // 2, output_size)
        
        # Dropout for regularization
        self.dropout = nn.Dropout(0.2)
        
        # Batch normalization
        self.bn1 = nn.BatchNorm1d(hidden_size)
        self.bn2 = nn.BatchNorm1d(hidden_size)
        self.bn3 = nn.BatchNorm1d(hidden_size // 2)
        
        # Initialize weights
        self._initialize_weights()
    
    def _initialize_weights(self):
        """Initialize network weights using Xavier initialization"""
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                nn.init.constant_(module.bias, 0)
    
    def forward(self, x):
        """Forward pass through the network"""
        # Input layer
        x = F.relu(self.bn1(self.fc1(x)))
        x = self.dropout(x)
        
        # Hidden layers
        x = F.relu(self.bn2(self.fc2(x)))
        x = self.dropout(x)
        
        x = F.relu(self.bn3(self.fc3(x)))
        x = self.dropout(x)
        
        # Output layer with softmax for probabilities
        x = self.fc4(x)
        return F.softmax(x, dim=1)
    
    def predict_action(self, state: np.ndarray) -> tuple:
        """Predict action probabilities and select best action"""
        self.eval()
        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0)
            action_probs = self.forward(state_tensor)
            
            # Get best action and its probability
            best_action = torch.argmax(action_probs, dim=1).item()
            confidence = action_probs[0][best_action].item()
            
            return best_action, confidence, action_probs.numpy()[0]

class ValueNetwork(nn.Module):
    """Neural network for estimating state values"""
    
    def __init__(self, input_size: int = 20, hidden_size: int = 128):
        super(ValueNetwork, self).__init__()
        
        self.input_size = input_size
        self.hidden_size = hidden_size
        
        # Network layers
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc4 = nn.Linear(hidden_size // 2, 1)  # Single output for value
        
        # Dropout for regularization
        self.dropout = nn.Dropout(0.2)
        
        # Batch normalization
        self.bn1 = nn.BatchNorm1d(hidden_size)
        self.bn2 = nn.BatchNorm1d(hidden_size)
        self.bn3 = nn.BatchNorm1d(hidden_size // 2)
        
        # Initialize weights
        self._initialize_weights()
    
    def _initialize_weights(self):
        """Initialize network weights using Xavier initialization"""
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                nn.init.constant_(module.bias, 0)
    
    def forward(self, x):
        """Forward pass through the network"""
        # Input layer
        x = F.relu(self.bn1(self.fc1(x)))
        x = self.dropout(x)
        
        # Hidden layers
        x = F.relu(self.bn2(self.fc2(x)))
        x = self.dropout(x)
        
        x = F.relu(self.bn3(self.fc3(x)))
        x = self.dropout(x)
        
        # Output layer with tanh activation for bounded values
        x = torch.tanh(self.fc4(x))
        return x
    
    def evaluate_state(self, state: np.ndarray) -> float:
        """Evaluate the value of a given state"""
        self.eval()
        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0)
            value = self.forward(state_tensor)
            return value.item()

class CombinedNetwork(nn.Module):
    """Combined policy and value network for more efficient training"""
    
    def __init__(self, input_size: int = 20, hidden_size: int = 128, action_size: int = 3):
        super(CombinedNetwork, self).__init__()
        
        # Shared layers
        self.shared_fc1 = nn.Linear(input_size, hidden_size)
        self.shared_fc2 = nn.Linear(hidden_size, hidden_size)
        self.shared_bn1 = nn.BatchNorm1d(hidden_size)
        self.shared_bn2 = nn.BatchNorm1d(hidden_size)
        
        # Policy head
        self.policy_fc = nn.Linear(hidden_size, action_size)
        
        # Value head
        self.value_fc = nn.Linear(hidden_size, 1)
        
        self.dropout = nn.Dropout(0.2)
        self._initialize_weights()
    
    def _initialize_weights(self):
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                nn.init.constant_(module.bias, 0)
    
    def forward(self, x):
        # Shared layers
        x = F.relu(self.shared_bn1(self.shared_fc1(x)))
        x = self.dropout(x)
        x = F.relu(self.shared_bn2(self.shared_fc2(x)))
        x = self.dropout(x)
        
        # Policy output
        policy = F.softmax(self.policy_fc(x), dim=1)
        
        # Value output
        value = torch.tanh(self.value_fc(x))
        
        return policy, value

class TechnicalIndicatorNetwork(nn.Module):
    """Specialized network for processing technical indicators"""
    
    def __init__(self, input_size: int = 20):
        super(TechnicalIndicatorNetwork, self).__init__()
        
        # Separate processing for different indicator types
        self.price_processor = nn.Linear(5, 16)  # OHLC + volume
        self.momentum_processor = nn.Linear(5, 16)  # RSI, MACD, etc.
        self.trend_processor = nn.Linear(5, 16)  # EMAs, Bollinger, etc.
        self.volume_processor = nn.Linear(5, 16)  # Volume indicators
        
        # Combination layer
        self.combiner = nn.Linear(64, 32)
        self.output = nn.Linear(32, 16)
        
        self.dropout = nn.Dropout(0.1)
        
    def forward(self, x):
        # Split input into different indicator categories
        price_features = x[:, :5]
        momentum_features = x[:, 5:10]
        trend_features = x[:, 10:15]
        volume_features = x[:, 15:20]
        
        # Process each category
        price_out = F.relu(self.price_processor(price_features))
        momentum_out = F.relu(self.momentum_processor(momentum_features))
        trend_out = F.relu(self.trend_processor(trend_features))
        volume_out = F.relu(self.volume_processor(volume_features))
        
        # Combine all features
        combined = torch.cat([price_out, momentum_out, trend_out, volume_out], dim=1)
        combined = self.dropout(combined)
        
        # Final processing
        x = F.relu(self.combiner(combined))
        x = self.dropout(x)
        x = self.output(x)
        
        return x

class AttentionMechanism(nn.Module):
    """Attention mechanism for focusing on important market features"""
    
    def __init__(self, input_size: int, attention_size: int = 64):
        super(AttentionMechanism, self).__init__()
        
        self.attention_size = attention_size
        self.query = nn.Linear(input_size, attention_size)
        self.key = nn.Linear(input_size, attention_size)
        self.value = nn.Linear(input_size, attention_size)
        
        self.scale = np.sqrt(attention_size)
        
    def forward(self, x):
        # x shape: (batch_size, sequence_length, input_size)
        Q = self.query(x)
        K = self.key(x)
        V = self.value(x)
        
        # Compute attention scores
        attention_scores = torch.matmul(Q, K.transpose(-2, -1)) / self.scale
        attention_weights = F.softmax(attention_scores, dim=-1)
        
        # Apply attention to values
        attended_values = torch.matmul(attention_weights, V)
        
        return attended_values, attention_weights