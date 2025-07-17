#!/usr/bin/env python3
"""
Forex Analysis Pro - Python Backend Server
Run this script to start the FastAPI backend server
"""

import uvicorn
import asyncio
import logging
from app.main import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def main():
    """Main entry point for the backend server"""
    logger.info("Starting Forex Analysis Pro Backend Server...")
    
    # Run the FastAPI server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main()