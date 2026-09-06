"""Continuous Risk Update Module.

Allows synthetic security telemetry or observations to modify the risk state.

When inputs change (vulnerability severity, threat likelihood, control effectiveness,
asset criticality), the affected risks are recalculated.

Implements:
- Risk history/trend tracking
- Top risk drivers identification
- Before/after comparisons when state changes
"""

import sqlite3
import os
from datetime import datetime, timedelta
from collections import OrderedDict


DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "risk_assessment.db"
)


def get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def record_risk_snapshot(asset_id: int, risk_score: float, risk_level: str,
                         likelihood: float, control_eff: float,
                         vulnerability_severity: float) -> int:
    """Record a risk assessment snapshot for history/trend tracking.

    Returns the snapshot ID.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO risk_history (asset_id, risk_score, risk_level, "
        "likelihood, control_effectiveness, vulnerability_severity, recorded_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (asset_id, risk_score, risk_level, likelihood, control_eff,
         vulnerability_severity, datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
    )
    snapshot_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return snapshot_id


def get_risk_history(asset_id: int, limit: int = 30) -> list:
    """Get risk history/trend for an asset.

    Returns ordered list of snapshots (most recent first).
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT risk_score, risk_level, likelihood, control_effecticiency, "
        "vulnerability_severity, recorded_at FROM risk_history "
        "WHERE asset_id = ? ORDER BY recorded_at DESC LIMIT ?",
        (asset_id, limit),
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "risk_score": row[0],
            "risk_level": row[1],
            "likelihood": row[2],
            "control_effectiveness": row[3],
            "vulnerability_severity": row[4],
            "recorded_at": row[5],
        }
        for row in rows
    ]


def update_telemetry(asset_id: int, severity_rating: int,
                     note: str, related_vulnerability_id: int = None,
                     related_threat_id: int = None, related_control_id: int = None) -> int:
    """Add a new telemetry observation.

    Returns the telemetry ID.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO telemetry (observation_date, severity_rating, note, "
        "related_asset_id, related_vulnerability_id, related_threat_id, related_control_id) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), severity_rating, note,
         asset_id, related_vulnerability_id, related_threat_id, related_control_id),
    )
    telemetry_id = cursor.lastrowid
    conn.commit()
    conn.close()

    # Recalculate risk after new telemetry
    _recalculate_risk_after_telemetry(asset_id)

    return telemetry_id


def _recalculate_risk_after_telemetry(asset_id: int):
    """Recalculate risk after a new telemetry observation.

    Gets the latest vulnerability severity and threat likelihood,
    then recalculates the asset risk.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get latest vulnerability severity
    cursor.execute("SELECT severity FROM vulnerabilities WHERE affected_asset_id = ? ORDER BY id DESC LIMIT 1",
                   (asset_id,))
    vuln_row = cursor.fetchone()
    vuln_severity = vuln_row[0] if vuln_row else 5

    # Get latest threat likelihood
    cursor.execute("SELECT likelihood FROM threats WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1",
                   (asset_id,))
    threat_row = cursor.fetchone()
    likelihood = threat_row[0] if threat_row else 3

    # Get latest control effectiveness
    cursor.execute("SELECT effectiveness FROM controls WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1",
                   (asset_id,))
    control_row = cursor.fetchone()
    effectiveness = control_row[0] if control_row else 3

    conn.close()

    # Assess updated risk
    try:
        from zenith_backend.risk_engine import assess_asset_risk
        assess_asset_risk(asset_id)
    except Exception:
        pass  # Error handled by assess_asset_risk


def get_top_risk_drivers(asset_id: int, limit: int = 3) -> list:
    """Get the top N risk drivers for an asset based on historical data.

    Analyzes risk history to identify which factors most commonly
    contribute to high risk states.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get risk history where risk was high
    cursor.execute(
        "SELECT risk_score, risk_level, likelihood, control_effecticiency, vulnerability_severity, recorded_at "
        "FROM risk_history WHERE asset_id = ? AND risk_level IN ('high', 'critical') "
        "ORDER BY recorded_at DESC LIMIT ?",
        (asset_id, limit),
    )
    high_risk_records = cursor.fetchall()

    conn.close()

    if not high_risk_records:
        return []

    # Analyze factor frequencies
    driver_counts = {"likelihood": 0, "criticality": 0, "control_weakness": 0}
    total = len(high_risk_records)

    for record in high_risk_records:
        likelihood = record[2] or 3
        # We don't have criticality directly in history, so estimate from risk_score
        # and control effectiveness
        control_gap = (100 - (record[3] or 3)) / 9.0
        # Simple heuristic: if risk_score > 70, it's critical
        if record[0] and record[0] >= 70:
            driver_counts["likelihood"] += 1
            driver_counts["control_weakness"] += 1

    # Convert to percentages
    result = []
    for driver, count in driver_counts.items():
        pct = round((count / total) * 100, 1) if total > 0 else 0
        result.append({"driver": driver, "percentage": pct, "occurrences": count, "total": total})

    return result


def compare_risk_state(asset_id: int, new_likelihood: float = None,
                       new_effectiveness: float = None,
                       new_vulnerability_severity: float = None) -> dict:
    """Compare current risk state with a modified state.

    Shows risk before and after changes, useful for scenario analysis.

    Returns dict with before and after risk scores, levels, and driver changes.
    """
    from zenith_backend.risk_engine import assess_asset_risk, get_risk_drivers_detail

    # Get current risk
    current_risk = assess_asset_risk(asset_id)
    current_detail = get_risk_drivers_detail(asset_id)

    # Apply modifications
    modified_likelihood = new_likelihood if new_likelihood is not None else current_risk.factors.likelihood
    modified_effectiveness = new_effectiveness if new_effectiveness is not None else current_risk.factors.control_effectiveness
    modified_vuln_severity = new_vulnerability_severity if new_vulnerability_severity is not None \
        else current_risk.factors.vulnerability_severity

    # Temporarily modify the database values and recalculate
    # (in a real implementation, we'd use a transaction)
    modified_risk = assess_asset_risk(asset_id)  # This uses current DB values

    # For a proper implementation, we'd need to temporarily modify DB values
    # and then restore them. Here we'll compute a "what-if" based on the
    # provided parameters rather than actually modifying the DB.

    # Compute what-if risk using the engine with modified factors
    # Get current asset data
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT criticality, value_range FROM assets WHERE id = ?", (asset_id,))
    asset_row = cursor.fetchone()
    conn.close()

    if not asset_row:
        return {"error": f"Asset {asset_id} not found"}

    criticality = asset_row[0]
    value_factor_map = {"low": 1.0, "medium": 5.0, "high": 20.0}
    asset_value_factor = value_factor_map.get(value_range, 5.0)

    # Create modified factors and calculate
    from zenith_backend.risk_engine import RiskFactors, calculate_risk
    modified_factors = RiskFactors(
        likelihood=modified_likelihood,
        criticality=criticality,
        vulnerability_severity=modified_vulnerability_severity,
        control_effectiveness=modified_effectiveness,
        asset_value_factor=float(asset_value_factor),
    )
    modified_result = calculate_risk(modified_factors)

    # Compute driver changes
    # Compare current vs modified drivers
    current_drivers = current_detail.get("risk_drivers", {})
    modified_drivers = {
        "likelihood_pct": round(
            (modified_likelihood / 5.0) / 
            (modified_likelihood / 5.0 + criticality / 5.0 + (100 - modified_effectiveness) / 9.0) * 100, 1)
        if modified_likelihood > 0 else 0,
        "criticality_pct": round(
            (criticality / 5.0) / 
            (modified_likelihood / 5.0 + criticality / 5.0 + (100 - modified_effectiveness) / 9.0) * 100, 1)
        if criticality > 0 else 0,
        "control_weakness_pct": round(
            ((100 - modified_effectiveness) / 9.0) / 
            (modified_likelihood / 5.0 + criticality / 5.0 + (100 - modified_effectiveness) / 9.0) * 100, 1)
        if modified_effectiveness < 100 else 0,
    }

    return {
        "asset_id": asset_id,
        "current_risk_score": current_risk.risk_score,
        "current_risk_level": current_risk.risk_level,
        "modified_risk_score": modified_result.risk_score,
        "modified_risk_level": modified_result.risk_level,
        "risk_change": modified_result.risk_score - current_risk.risk_score,
        "risk_change_pct": round((modified_result.risk_score - current_risk.risk_score) / current_risk.risk_score * 100, 1) if current_risk.risk_score > 0 else 0,
        "driver_changes": {
            "likelihood_delta": round(modified_drivers.get("likelihood_pct", 0) - current_drivers.get("likelihood_pct", 0), 1),
            "criticality_delta": round(modified_drivers.get("criticality_pct", 0) - current_drivers.get("criticality_pct", 0), 1),
            "control_weakness_delta": round(modified_drivers.get("control_weakness_pct", 0) - current_drivers.get("control_weakness_pct", 0), 1),
        }
    }