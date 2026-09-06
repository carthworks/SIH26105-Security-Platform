import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "risk_assessment.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables:", cursor.fetchall())

cursor.execute("SELECT COUNT(*) FROM assets")
print("Assets:", cursor.fetchone())

cursor.execute("SELECT COUNT(*) FROM risk_assessments")
print("Risk assessments:", cursor.fetchone())

cursor.execute("SELECT COUNT(*) FROM vulnerabilities")
print("Vulnerabilities:", cursor.fetchone())

cursor.execute("SELECT COUNT(*) FROM controls")
print("Controls:", cursor.fetchone())

cursor.execute("SELECT COUNT(*) FROM threats")
print("Threats:", cursor.fetchone())

conn.close()
print("Done checking database.")