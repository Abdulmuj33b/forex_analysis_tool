import numpy as np
import math
import random
from typing import Dict, List, Optional, Tuple
import torch
import torch.nn as nn

class MCTSNode:
    def __init__(self, state: np.ndarray, parent: Optional['MCTSNode'] = None, action: Optional[int] = None):
        self.state = state
        self.parent = parent
        self.action = action
        self.children: Dict[int, 'MCTSNode'] = {}
        self.visits = 0
        self.value_sum = 0.0
        self.prior_probability = 0.0
        
    def is_expanded(self) -> bool:
        return len(self.children) > 0
    
    def is_terminal(self) -> bool:
        # In trading, we don't have terminal states in the traditional sense
        # We can consider a position as "terminal" after a certain time or profit/loss threshold
        return False
    
    def get_ucb_score(self, c_puct: float = 1.0) -> float:
        if self.visits == 0:
            return float('inf')
        
        # UCB1 formula with policy prior
        exploitation = self.value_sum / self.visits
        exploration = c_puct * self.prior_probability * math.sqrt(self.parent.visits) / (1 + self.visits)
        
        return exploitation + exploration
    
    def select_child(self, c_puct: float = 1.0) -> 'MCTSNode':
        return max(self.children.values(), key=lambda child: child.get_ucb_score(c_puct))
    
    def expand(self, action_probs: np.ndarray) -> 'MCTSNode':
        """Expand node with all possible actions"""
        for action in range(len(action_probs)):
            if action not in self.children:
                # Create new state by applying action (simplified for trading)
                new_state = self._apply_action(self.state, action)
                child = MCTSNode(new_state, parent=self, action=action)
                child.prior_probability = action_probs[action]
                self.children[action] = child
        
        # Return a random child for simulation
        return random.choice(list(self.children.values()))
    
    def _apply_action(self, state: np.ndarray, action: int) -> np.ndarray:
        """Apply trading action to current state"""
        # This is a simplified state transition for trading
        # In practice, this would involve more complex market simulation
        new_state = state.copy()
        
        if action == 0:  # Buy
            new_state[0] *= 1.001  # Simulate small price increase
        elif action == 1:  # Sell
            new_state[0] *= 0.999  # Simulate small price decrease
        # action == 2 is Hold, no change
        
        return new_state
    
    def backup(self, value: float):
        """Backup value through the tree"""
        self.visits += 1
        self.value_sum += value
        if self.parent:
            self.parent.backup(value)

class MCTSTrader:
    def __init__(self, policy_network, value_network, simulations: int = 1000):
        self.policy_network = policy_network
        self.value_network = value_network
        self.simulations = simulations
        self.c_puct = 1.0
        
    def search(self, root: MCTSNode, simulations: Optional[int] = None) -> int:
        """Run MCTS search and return best action"""
        num_simulations = simulations or self.simulations
        
        for _ in range(num_simulations):
            node = root
            path = []
            
            # Selection
            while node.is_expanded() and not node.is_terminal():
                node = node.select_child(self.c_puct)
                path.append(node)
            
            # Expansion and Evaluation
            if not node.is_terminal():
                # Get policy and value from neural networks
                state_tensor = torch.FloatTensor(node.state).unsqueeze(0)
                
                with torch.no_grad():
                    action_probs = torch.softmax(self.policy_network(state_tensor), dim=1).numpy()[0]
                    value = self.value_network(state_tensor).item()
                
                # Expand node
                if not node.is_expanded():
                    node = node.expand(action_probs)
                    path.append(node)
                
                # Backup
                for node_in_path in reversed(path):
                    node_in_path.backup(value)
            else:
                # Terminal node evaluation
                value = self._evaluate_terminal_state(node.state)
                for node_in_path in reversed(path):
                    node_in_path.backup(value)
        
        # Return action with highest visit count
        if not root.children:
            return 2  # Default to HOLD if no children
        
        return max(root.children.keys(), key=lambda action: root.children[action].visits)
    
    def _evaluate_terminal_state(self, state: np.ndarray) -> float:
        """Evaluate terminal state value"""
        # Simplified terminal state evaluation
        # In practice, this would be based on profit/loss of the position
        return 0.0
    
    def get_action_probabilities(self, root: MCTSNode, temperature: float = 1.0) -> np.ndarray:
        """Get action probabilities based on visit counts"""
        if not root.children:
            return np.array([0.33, 0.33, 0.34])  # Uniform distribution
        
        visits = np.array([root.children.get(action, MCTSNode(root.state)).visits 
                          for action in range(3)])
        
        if temperature == 0:
            # Deterministic selection
            probs = np.zeros_like(visits)
            probs[np.argmax(visits)] = 1.0
        else:
            # Stochastic selection
            visits = visits ** (1 / temperature)
            probs = visits / np.sum(visits)
        
        return probs
    
    def get_search_statistics(self, root: MCTSNode) -> Dict:
        """Get statistics about the MCTS search"""
        if not root.children:
            return {
                "total_visits": root.visits,
                "children_count": 0,
                "best_action": 2,
                "best_action_visits": 0,
                "value_estimate": 0.0
            }
        
        best_action = max(root.children.keys(), 
                         key=lambda action: root.children[action].visits)
        
        return {
            "total_visits": root.visits,
            "children_count": len(root.children),
            "best_action": best_action,
            "best_action_visits": root.children[best_action].visits,
            "value_estimate": root.value_sum / root.visits if root.visits > 0 else 0.0,
            "action_visits": {action: child.visits for action, child in root.children.items()}
        }