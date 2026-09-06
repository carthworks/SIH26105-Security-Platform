import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "risk_assessment.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print('=== Tables ===')
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cursor.fetchall()
for t in tables:
    print(f"  {t[0]}")

print('\n=== Assets ===')
cursor.execute('SELECT id, name, criticality, value_range, business_process FROM assets')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1]}, Criticality={row[2]}, Value={row[3]}, Process={row[4]}")

print('\n=== Vulnerabilities ===')
cursor.execute('SELECT id, name, severity, affected_asset_id FROM vulnerabilities')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1]}, Severity={row[2]}, Asset_ID={row[3]}")

print('\n=== Threats ===')
cursor.execute('SELECT id, name, likelihood, target_asset_id FROM threats')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1]}, Likelihood={row[2]}, Asset_ID={row[3]}")

print('\n=== Controls ===')
cursor.execute('SELECT id, name, effectiveness, cost, target_asset_id FROM controls')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1]}, Effectiveness={row[2]}, Cost={row[3]}, Asset_ID={row[4]}")

print('\n=== Risk Assessments ===')
cursor.execute('SELECT asset_id, current_likelihood, current_control_effectiveness, current_risk_score, expected_loss, risk_level FROM risk_assessments')
for row in cursor.fetchall():
    print(f"  Asset_ID={row[0]}, Likelihood={row[1]}, Control_Eff={row[2]}, Risk={row[3]:.0f}, Expected_Loss={row[4]:.2f}, Level={row[5]}")

print('\n=== Investment Options ===')
cursor.execute('SELECT id, name, cost, expected_effectiveness FROM investment_options')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1][:30]}..., Cost={row[2]}, Eff={row[3]}")

print('\n=== Scenarios ===')
cursor.execute('SELECT id, name, risk_before, risk_after, cost, risk_reduction FROM scenarios')
for row in cursor.fetchall():
    print(f"  ID={row[0]}, Name={row[1][:30]}..., Before={row[2]}, After={row[3]}, Cost={row[4]}, Reduction={row[5]}")

conn.close()
print('\nDatabase verification complete!')