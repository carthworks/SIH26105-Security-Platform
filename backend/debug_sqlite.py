import sqlite3
import os

# Remove existing DB
if os.path.exists('risk_assessment.db'):
    os.remove('risk_assessment.db')

conn = sqlite3.connect('risk_assessment.db')
c = conn.cursor()

# Test 1: Simple table
print("=== Test 1: Simple table ===")
try:
    c.execute("CREATE TABLE test1 (id INTEGER PRIMARY KEY, name TEXT)")
    print("Test1: OK")
except Exception as e:
    print(f"Test1: ERROR - {e}")

# Test 2: Table with created_at
print("\n=== Test 2: created_at column ===")
try:
    c.execute("CREATE TABLE test2 (id INTEGER PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test2: OK")
except Exception as e:
    print(f"Test2: ERROR - {e}")

# Test 3: Table with FOREIGN KEY
print("\n=== Test 3: FOREIGN KEY ===")
try:
    c.execute("CREATE TABLE test3 (id INTEGER PRIMARY KEY, name TEXT, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id))")
    print("Test3: OK")
except Exception as e:
    print(f"Test3: ERROR - {e}")

# Test 4: FOREIGN KEY + created_at
print("\n=== Test 4: FOREIGN KEY + created_at ===")
try:
    c.execute("CREATE TABLE test4 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES assets(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    print("Test4: OK")
except Exception as e:
    print(f"Test4: ERROR - {e}")

# Test 5: Two separate CREATE TABLEs
print("\n=== Test 5: Two separate CREATE TABLEs ===")
try:
    c.execute("CREATE TABLE test5a (id INTEGER PRIMARY KEY, name TEXT)")
    c.execute("CREATE TABLE test5b (id INTEGER, name TEXT, affected_asset_id INTEGER, FOREIGN KEY (affected_asset_id) REFERENCES test5a(id))")
    print("Test5: OK")
except Exception as e:
    print(f"Test5: ERROR - {e}")

conn.close()
print("\nDebug completed")