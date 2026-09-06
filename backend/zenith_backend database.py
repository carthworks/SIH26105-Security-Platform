import sqlite3
import os
from datetime import datetime, timedelta
import random

# Use a fixed database path relative to the project root (two levels up from this module).
# When this module is at zenith_backend/database.py, going up two levels gives the backend/ directory.
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "risk_assessment.db")


def get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database with all required tables."""
    conn = get_connection()
    cursor = conn.cursor()

    # --- Assets table ---
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

    # --- Vulnerabilities table ---
    # NOTE: created_at MUST come before FOREIGN KEY in column order (SQLite requirement)
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS vulnerabilities ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "name TEXT NOT NULL, "
        "description TEXT, "
        "severity INTEGER NOT NULL CHECK(severity >= 1 AND severity <= 10), "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        "affected_asset_id INTEGER, "
        "FOREIGN KEY (affected_asset_id) REFERENCES assets(id))"
    )

    # --- Threats table ---
    # NOTE: created_at MUST come before FOREIGN KEY in column order (SQLite requirement)
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS threats ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "name TEXT NOT NULL, "
        "description TEXT, "
        "likelihood INTEGER NOT NULL CHECK(likelihood >= 1 AND likelihood <= 5), "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        "target_asset_id INTEGER, "
        "FOREIGN KEY (target_asset_id) REFERENCES assets(id))"
    )

    # --- Controls table ---
    # NOTE: created_at MUST come before FOREIGN KEY in column order (SQLite requirement)
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS controls ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "name TEXT NOT NULL, "
        "description TEXT, "
        "effectiveness INTEGER NOT NULL CHECK(effectiveness >= 1 AND effectiveness <= 10), "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        "cost INTEGER NOT NULL DEFAULT 0, "
        "target_asset_id INTEGER, "
        "FOREIGN KEY (target_asset_id) REFERENCES assets(id))"
    )

    # --- Telemetry table ---
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

    # --- Risk assessments table ---
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

    # --- Investment options table ---
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS investment_options ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "name TEXT NOT NULL, "
        "description TEXT, "
        "cost INTEGER NOT NULL DEFAULT 0, "
        "expected_effectiveness INTEGER NOT NULL DEFAULT 5 CHECK(expected_effectiveness >= 1 AND expected_effectiveness <= 10), "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        "target_vulnerability_id INTEGER, "
        "target_control_id INTEGER, "
        "FOREIGN KEY (target_vulnerability_id) REFERENCES vulnerabilities(id), "
        "FOREIGN KEY (target_control_id) REFERENCES controls(id))"
    )

    # --- Scenarios table ---
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

    conn.commit()
    conn.close()


def seed_deterministic(seed_value=42):
    """Seed the database with deterministic synthetic cybersecurity data using a fixed seed.

    Creates realistic demo data for a cyber risk quantification prototype.
    The fixed seed ensures reproducibility.
    """
    random.seed(seed_value)

    conn = get_connection()
    cursor = conn.cursor()

    # --- Assets ---
    asset_names = [
        "Customer Database Server",
        "Employee Laptop Fleet",
        "Web Application Portal",
        "Payment Processing System",
        "Corporate Email Infrastructure",
        "Cloud Storage Bucket",
        "Internal Network Segment",
        "Remote Access VPN Gateway",
        "Intellectual Property Repository",
        "Supply Chain Management System",
    ]

    business_processes = [
        "Customer Data Management",
        "Employee Onboarding/Offboarding",
        "Transaction Processing",
        "Communication & Collaboration",
        "File Storage & Sharing",
        "Software Development",
        "Vendor Management",
        "Financial Reporting",
    ]

    for i, name in enumerate(asset_names):
        criticality = random.randint(1, 5)
        value_range = random.choice(["low", "medium", "high"])
        bp = random.choice(business_processes)
        cursor.execute(
            "INSERT INTO assets (name, description, criticality, value_range, business_process) "
            "VALUES (?, ?, ?, ?, ?)",
            (name, f"Critical asset for {bp}", criticality, value_range, bp),
        )

    # --- Vulnerabilities ---
    vulnerability_names = [
        "Unpatched Software",
        "Weak Password Policies",
        "Lack of Multi-Factor Authentication",
        "Insufficient Network Segmentation",
        "Outdated Operating Systems",
        "Excessive User Privileges",
        "Missing Security Monitoring",
        "Unencrypted Data at Rest",
        "Social Engineering Gaps",
        "Insecure API Endpoints",
    ]

    for i, name in enumerate(vulnerability_names):
        severity = random.randint(1, 10)
        affected_asset_id = random.randint(1, len(asset_names)) + 1
        cursor.execute(
            "INSERT INTO vulnerabilities (name, description, severity, created_at, affected_asset_id) "
            "VALUES (?, ?, ?, NULL, ?)",
            (name, f"Vulnerability: {name.lower()}", severity, affected_asset_id),
        )

    # --- Threats ---
    threat_names = [
        "Ransomware Attack",
        "Data Exfiltration",
        "Insider Threat",
        "Phishing Campaign",
        "DDoS Attack",
        "Credential Theft",
        "Supply Chain Compromise",
        "Internal System Misuse",
    ]

    for i, name in enumerate(threat_names):
        likelihood = random.randint(1, 5)
        target_asset_id = random.randint(1, len(asset_names)) + 1
        cursor.execute(
            "INSERT INTO threats (name, description, likelihood, created_at, target_asset_id) "
            "VALUES (?, ?, ?, NULL, ?)",
            (name, f"Threat: {name.lower()}", likelihood, target_asset_id),
        )

    # --- Controls ---
    # created_at is placed before FOREIGN KEY in the schema; include it in INSERT with NULL
    # so SQLite assigns the DEFAULT CURRENT_TIMESTAMP.
    control_names = [
        "Multi-Factor Authentication",
        "Regular Patch Management",
        "Network Segmentation",
        "Encryption at Rest",
        "Security Awareness Training",
        "Endpoint Detection & Response",
        "Access Review & Privilege Management",
        "Backup & Recovery System",
        "Web Application Firewall",
        "Identity & Access Management",
    ]

    for i, name in enumerate(control_names):
        effectiveness = random.randint(1, 10)
        cost = random.randint(5000, 50000)
        target_asset_id = random.randint(1, len(asset_names)) + 1
        cursor.execute(
            "INSERT INTO controls (name, description, effectiveness, created_at, cost, target_asset_id) "
            "VALUES (?, ?, ?, NULL, ?, ?)",
            (name, f"Control: {name.lower()}", effectiveness, cost, target_asset_id),
        )

    # --- Telemetry ---
    observation_dates = [datetime.now() - timedelta(days=x) for x in range(30)]

    for i, obs_date in enumerate(observation_dates):
        severity = random.randint(1, 10)
        note = f"Observation {i+1}: security telemetry entry"
        related_asset_id = random.randint(1, len(asset_names)) + 1
        related_vuln_id = random.randint(1, len(vulnerability_names)) + 1
        related_threat_id = random.randint(1, len(threat_names)) + 1
        related_ctrl_id = random.randint(1, len(control_names)) + 1

        cursor.execute(
            "INSERT INTO telemetry "
            "(observation_date, severity_rating, note, related_asset_id, related_vulnerability_id, related_threat_id, related_control_id) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                obs_date.strftime("%Y-%m-%d %H:%M:%S"),
                severity,
                note,
                related_asset_id,
                related_vuln_id,
                related_threat_id,
                related_ctrl_id,
            ),
        )

    # --- Risk Assessments ---
    for asset_id in range(1, len(asset_names) + 1):
        likelihood = random.randint(1, 5)
        # Re-query criticality from the asset we're assessing
        cursor.execute("SELECT criticality FROM assets WHERE id = ?", (asset_id,))
        row = cursor.fetchone()
        crit = row["criticality"] if row else 3
        control_eff = random.randint(1, 10)

        risk_score = min(
            100, int(crit * likelihood * (100 - control_eff) / 10 + random.uniform(-5, 5))
        )

        expected_loss = round(risk_score * random.uniform(5000, 500000), 2)

        if risk_score >= 70:
            risk_level = "critical"
        elif risk_score >= 50:
            risk_level = "high"
        elif risk_score >= 30:
            risk_level = "medium"
        else:
            risk_level = "low"

        cursor.execute(
            "INSERT INTO risk_assessments "
            "(asset_id, current_likelihood, current_control_effectiveness, current_risk_score, expected_loss, risk_level) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (asset_id, likelihood, control_eff, risk_score, expected_loss, risk_level),
        )

    # --- Investment Options ---
    investment_names = [
        "MFA Deployment Across All Assets",
        "Enterprise-wide Patch Management System",
        "Network Segmentation Implementation",
        "Company-wide Encryption Initiative",
        "Security Awareness Training Program",
        "EDR Solution for Endpoint Protection",
        "Regular Access Review Process",
        "Comprehensive Backup & Recovery",
        "WAF for Web Application Protection",
        "Advanced IAM Solution",
    ]

    for i, name in enumerate(investment_names):
        cost = random.randint(10000, 100000)
        effectiveness = random.randint(1, 10)
        target_vuln_id = random.randint(1, len(vulnerability_names)) + 1 if i % 2 == 0 else None
        target_ctrl_id = random.randint(1, len(control_names)) + 1 if i % 2 == 1 else None

        cursor.execute(
            "INSERT INTO investment_options "
            "(name, description, cost, expected_effectiveness, target_vulnerability_id, target_control_id) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (name, f"Investment: {name.lower()}", cost, effectiveness, target_vuln_id, target_ctrl_id),
        )

    # --- Scenarios ---
    scenario_names = [
        "Current State",
        "Deploy MFA Everywhere",
        "Implement Patch Management",
        "Network Segmentation",
        "Full Encryption Rollout",
        "Security Training Program",
        "EDR Implementation",
        "Combined Investment (MFA + Patching)",
        "Combined Investment (Network + Encryption)",
        "Maximum Security Posture",
    ]

    for i, name in enumerate(scenario_names):
        risk_before = random.randint(30, 90)
        risk_after = max(0, risk_before - random.randint(10, 60))
        cost = random.randint(5000, 80000)
        risk_reduction = max(0, risk_before - risk_after)

        cursor.execute(
            "INSERT INTO scenarios "
            "(name, description, risk_before, risk_after, cost, risk_reduction) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (name, f"Scenario: {name.lower()}", risk_before, risk_after, cost, risk_reduction),
        )

    conn.commit()
    conn.close()
    print(f"Database seeded deterministically with seed={seed_value}")


if __name__ == "__main__":
    # Run initialization and seeding when script executed directly
    init_db()
    seed_deterministic(42)
    print("Database initialization and seeding complete when run directly.")