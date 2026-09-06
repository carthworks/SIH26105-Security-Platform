#!/usr/bin/env python3
"""Standalone database initialization script."""

import sqlite3
import os

# Fixed database path
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "risk_assessment.db")

# Remove existing DB if present
db_dir = os.path.dirname(DB_PATH)
if not os.path.exists(db_dir):
    os.makedirs(db_dir, exist_ok=True)

if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
    print(f"Removed existing: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Assets table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS assets ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "criticality INTEGER NOT NULL CHECK(criticality >= 1 AND criticality <= 5), "
    "value_range TEXT NOT NULL DEFAULT 'medium', "
    "business_process TEXT, "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
)
print("Assets table created")

# Vulnerabilities table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS vulnerabilities ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "severity INTEGER NOT NULL CHECK(severity >= 1 AND severity <= 10), "
    "affected_asset_id INTEGER, "
    "FOREIGN KEY (affected_asset_id) REFERENCES assets(id), "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
)
print("Vulnerabilities table created")

# Threats table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS threats ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "likelihood INTEGER NOT NULL CHECK(likelihood >= 1 AND likelihood <= 5), "
    "target_asset_id INTEGER, "
    "FOREIGN KEY (target_asset_id) REFERENCES assets(id), "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
)
print("Threats table created")

# Controls table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS controls ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "effectiveness INTEGER NOT NULL CHECK(effectiveness >= 1 AND effectiveness <= 10), "
    "cost INTEGER NOT NULL DEFAULT 0, "
    "target_asset_id INTEGER, "
    "FOREIGN KEY (target_asset_id) REFERENCES assets(id), "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
)
print("Controls table created")

# Telemetry table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS telemetry ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "observation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
    "severity_rating INTEGER CHECK(severity_rating >= 1 AND severity_rating <= 10), "
    "note TEXT, "
    "related_asset_id INTEGER, "
    "related_vulnerability_id INTEGER, "
    "related_threat_id INTEGER, "
    "related_control_id INTEGER, "
    "FOREIGN KEY (related_asset_id) REFERENCES assets(id), "
    "FOREIGN KEY (related_vulnerability_id) REFERENCES vulnerabilities(id), "
    "FOREIGN KEY (related_threat_id) REFERENCES threats(id), "
    "FOREIGN KEY (related_control_id) REFERENCES controls(id))"
)
print("Telemetry table created")

# Risk assessments table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS risk_assessments ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "asset_id INTEGER, "
    "current_likelihood INTEGER NOT NULL DEFAULT 3, "
    "current_control_effectiveness INTEGER NOT NULL DEFAULT 3, "
    "current_risk_score INTEGER NOT NULL DEFAULT 50, "
    "expected_loss REAL NOT NULL DEFAULT 0, "
    "risk_level TEXT NOT NULL DEFAULT 'medium', "
    "calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
    "FOREIGN KEY (asset_id) REFERENCES assets(id))"
)
print("Risk assessments table created")

# Investment options table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS investment_options ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "cost INTEGER NOT NULL DEFAULT 0, "
    "expected_effectiveness INTEGER NOT NULL DEFAULT 5 CHECK(expected_effectiveness >= 1 AND expected_effectiveness <= 10), "
    "target_vulnerability_id INTEGER, "
    "target_control_id INTEGER, "
    "FOREIGN KEY (target_vulnerability_id) REFERENCES vulnerabilities(id), "
    "FOREIGN KEY (target_control_id) REFERENCES controls(id), "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
)
print("Investment options table created")

# Scenarios table
cursor.execute(
    "CREATE TABLE IF NOT EXISTS scenarios ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "name TEXT NOT NULL, "
    "description TEXT, "
    "investment_option_id INTEGER, "
    "risk_before INTEGER NOT NULL DEFAULT 50, "
    "risk_after INTEGER, "
    "cost INTEGER NOT NULL DEFAULT 0, "
    "risk_reduction INTEGER, "
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
    "FOREIGN KEY (investment_option_id) REFERENCES investment_options(id))"
)
print("Scenarios table created")

conn.commit()
conn.close()
print("\nAll tables created successfully!")
print(f"Database location: {DB_PATH}")