#!/usr/bin/env python3
"""Test just the vulnerabilities table creation."""

import sqlite3
import os

# Remove existing DB
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "risk_test.db")
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Test 1: Simple table with created_at
print("=== Test 1: created_at only ===")
try:
    c.execute("CREATE TABLE test1 (id INTEGER PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test1: OK")
except Exception as e:
    print(f"Test1: ERROR - {e}")

# Test 2: Table with FK + created_at
print("\n=== Test 2: FK + created_at ===")
try:
    c.execute("CREATE TABLE test2 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test2: OK")
except Exception as e:
    print(f"Test2: ERROR - {e}")

# Test 3: Vulnerabilities table from database.py
print("\n=== Test 3: Vulnerabilities table ===")
try:
    c.execute("""CREATE TABLE test3 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        severity INTEGER NOT NULL CHECK(severity >= 1 AND severity <= 10),
        affected_asset_id INTEGER,
        FOREIGN KEY (affected_asset_id) REFERENCES assets(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
    print("Test3: OK")
except Exception as e:
    print(f"Test3: ERROR - {e}")

conn.close()
print("\nTest completed")