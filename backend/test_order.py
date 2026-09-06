#!/usr/bin/env python3
"""Test different column orderings for CREATE TABLE."""

import sqlite3
import os

# Remove existing DB
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "risk_test3.db")
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Test A: created_at BEFORE FOREIGN KEY
print("=== Test A: created_at BEFORE FOREIGN KEY ===")
try:
    c.execute("CREATE TABLE test_a (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id))")
    print("Test A: OK")
except Exception as e:
    print(f"Test A: ERROR - {e}")

# Test B: FOREIGN KEY BEFORE created_at
print("\n=== Test B: FOREIGN KEY BEFORE created_at ===")
try:
    c.execute("CREATE TABLE test_b (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test B: OK")
except Exception as e:
    print(f"Test B: ERROR - {e}")

# Test C: created_at as last column, no FK
print("\n=== Test C: created_at last, no FK ===")
try:
    c.execute("CREATE TABLE test_c (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, affected_asset_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test C: OK")
except Exception as e:
    print(f"Test C: ERROR - {e}")

# Test D: Just created_at as single column
print("\n=== Test D: Simple created_at ===")
try:
    c.execute("CREATE TABLE test_d (id INTEGER PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test D: OK")
except Exception as e:
    print(f"Test D: ERROR - {e}")

conn.close()
print("\nOrder test completed")