import os
import sys

# Remove existing DB first
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "risk_assessment.db")
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"Removed existing: {db_path}")

# Change to backend directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from zenith_backend.database import init_db, seed_deterministic

print("Calling init_db()...")
init_db()
print("init_db() completed OK")

print("Calling seed_deterministic(42)...")
seed_deterministic(42)
print("seed_deterministic(42) completed OK")

print("Phase 2 database ready")
"