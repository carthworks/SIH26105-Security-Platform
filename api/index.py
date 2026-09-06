import os
import sys

# Ensure backend directory is in the Python module search path
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, os.path.abspath(backend_dir))

# Import the FastAPI application from zenith_backend
from zenith_backend.main import app

# Export app for Vercel Serverless Function
