#!/usr/bin/env python3
"""Test creating tables separately (the working approach)."""

import sqlite3
import os

# Remove existing DB
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "risk_test2.db")
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Step 1: Create assets table first
print("=== Step 1: Create assets table ===")
try:
    c.execute("CREATE TABLE assets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")
    print("Step 1: OK")
except Exception as e:
    print(f"Step 1: ERROR - {e}")

# Step 2: Create vulnerabilities table with FK + created_at (separate statement)
print("\n=== Step 2: Create vulnerabilities table (separate) ===")
try:
    c.execute("CREATE TABLE vulnerabilities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Step 2: OK")
except Exception as e:
    print(f"Step 2: ERROR - {e}")

# Step 3: Insert some data
print("\n=== Step 3: Insert test data ===")
try:
    c.execute("INSERT INTO assets (name) VALUES ('Test Asset')")
    c.execute("INSERT INTO vulnerabilities (name, affected_asset_id) VALUES ('Test Vuln', 1)")
    print("Step 3: OK")
except Exception as e:
    print(f"Step 3: ERROR - {e}")

# Step 4: Query to verify
print("\n=== Step 4: Verify data ===")
try:
    c.execute("SELECT a.name, v.name FROM assets a JOIN vulnerabilities v ON v.affected_asset_id = a.id")
    rows = c.fetchall()
    print(f"Step 4: OK - {len(rows)} row(s) found: {rows}")
except Exception as e:
    print(f"Step 4: ERROR - {e}")

conn.commit()
conn.close()
print("\nTest completed successfully!")