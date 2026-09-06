import sqlite3, os

db_path = os.path.abspath('risk_assessment.db')
print('DB path:', db_path)
print('DB size:', os.path.getsize(db_path))

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print('Tables:', tables)

cursor.execute('SELECT count(*) FROM assets')
print('Assets count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM vulnerabilities')
print('Vulns count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM threats')
print('Threats count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM controls')
print('Controls count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM risk_assessments')
print('Risk assess count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM investment_options')
print('InvOptions count:', cursor.fetchone()[0])

cursor.execute('SELECT count(*) FROM scenarios')
print('Scenarios count:', cursor.fetchone()[0])

conn.close()
print('Verification complete!')