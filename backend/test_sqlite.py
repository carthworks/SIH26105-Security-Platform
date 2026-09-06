import sqlite3

conn = sqlite3.connect(":memory:")
c = conn.cursor()

# Test minimal table with created_at
c.execute("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
print("Minimal table created OK")

c.execute("INSERT INTO test (name) VALUES (?)", ("test",))
print("Insert OK")

c.execute("SELECT * FROM test")
row = c.fetchone()
print("Query result:", row)

conn.close()
print("Test completed successfully")