import sqlite3
db_path = r'C:\Advi\Collegestuff\Events\SIH\zenith\backend\risk_assessment.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print('Tables:', tables)
conn.close()
"