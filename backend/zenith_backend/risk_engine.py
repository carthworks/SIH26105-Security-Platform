"""Quantitative Cyber Risk Engine.

Deterministic risk calculation engine that combines:
- threat likelihood
- vulnerability severity
- asset criticality
- control effectiveness
- business impact

Produces: risk score, expected financial loss, risk level, risk drivers.

The methodology is transparent and documentable. No arbitrary random values.
"""

import sqlite3
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

# Database path - same location as in database.py
DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "risk_assessment.db"
)


def get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@dataclass
class RiskFactors:
    """Raw input factors for risk calculation."""
    likelihood: float  # 1-5, from threat data
    criticality: float  # 1-5, from asset data
    vulnerability_severity: float  # 1-10, from vulnerability data
    control_effectiveness: float  # 1-10, from control data
    asset_value_factor: float  # 1-20+, based on asset value_range


@dataclass
class RiskResult:
    """Output result from risk calculation."""
    risk_score: float  # 0-100
    expected_loss: float  # financial impact
    risk_level: str  # "low", "medium", "high", "critical"
    risk_drivers: Dict[str, float]  # percentages contributing to risk
    factors: RiskFactors


def calculate_risk(factors: RiskFactors) -> RiskResult:
    """Calculate quantitative cyber risk using a transparent formula.

    The risk score is computed as:

    risk_score = min(100, (likelihood/5) * (criticality/5) * ((100-effectiveness)/9) * 100)

    This normalizes each factor to a 0-1 range and multiplies them,
    then scales to 0-100.

    Expected loss is based on the risk score and the asset's value factor.

    Risk drivers break down the contribution of each factor as percentages.
    """
    # Normalize factors to 0-1 ranges
    likelihood_norm = factors.likelihood / 5.0  # 0.2 - 1.0
    criticality_norm = factors.criticality / 5.0  # 0.2 - 1.0
    control_gap = (100.0 - factors.control_effectiveness) / 9.0  # 0.1 - 1.0

    # Calculate risk score (0-100)
    risk_score = likelihood_norm * criticality_norm * control_gap * 100.0
    risk_score = min(100.0, max(0.0, risk_score))  # Clamp to 0-100

    # Determine risk level
    if risk_score >= 70:
        risk_level = "critical"
    elif risk_score >= 50:
        risk_level = "high"
    elif risk_score >= 30:
        risk_level = "medium"
    else:
        risk_level = "low"

    # Calculate expected financial loss
    # Base loss range: $10K-$2M, multiplied by risk_score/100 and value_factor
    base_loss_low = 10_000
    base_loss_high = 2_000_000
    loss_span = base_loss_high - base_loss_low
    expected_loss = base_loss_low + (risk_score / 100.0) * loss_span * factors.asset_value_factor

    # Calculate risk drivers as percentages of total risk contribution
    total_weight = likelihood_norm + criticality_norm + control_gap
    if total_weight > 0:
        drivers = {
            "likelihood": (likelihood_norm / total_weight) * 100.0,
            "criticality": (criticality_norm / total_weight) * 100.0,
            "control_weakness": (control_gap / total_weight) * 100.0,
        }
    else:
        drivers = {
            "likelihood": 33.3,
            "criticality": 33.3,
            "control_weakness": 33.4,
        }

    # Round risk score and drivers
    risk_score = round(risk_score, 1)
    for key in drivers:
        drivers[key] = round(drivers[key], 1)

    return RiskResult(
        risk_score=risk_score,
        expected_loss=round(expected_loss, 2),
        risk_level=risk_level,
        risk_drivers=drivers,
        factors=factors,
    )


def assess_asset_risk(asset_id: int) -> RiskResult:
    """Assess risk for a specific asset by querying the database.

    Gets the latest likelihood (from threats), control effectiveness (from controls),
    and computes the risk using the quantitative engine.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get asset criticality and value range
    cursor.execute("SELECT criticality, value_range FROM assets WHERE id = ?", (asset_id,))
    asset_row = cursor.fetchone()
    if not asset_row:
        conn.close()
        raise ValueError(f"Asset {asset_id} not found")

    criticality = asset_row[0]
    value_range = asset_row[1]

    # Map value_range to asset_value_factor
    value_factor_map = {"low": 1.0, "medium": 5.0, "high": 20.0}
    asset_value_factor = value_factor_map.get(value_range, 5.0)

    # Get the latest threat likelihood for this asset
    cursor.execute("SELECT likelihood FROM threats WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    threat_row = cursor.fetchone()
    likelihood = threat_row[0] if threat_row else 3  # default to 3 if no threats

    # Get the latest vulnerability severity for this asset
    cursor.execute("SELECT severity FROM vulnerabilities WHERE affected_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    vuln_row = cursor.fetchone()
    vulnerability_severity = vuln_row[0] if vuln_row else 5

    # Get the latest control effectiveness for this asset
    cursor.execute("SELECT effectiveness FROM controls WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    control_row = cursor.fetchone()
    effectiveness = control_row[0] if control_row else 3  # default to 3 if no controls

    conn.close()

    # Create risk factors and calculate
    factors = RiskFactors(
        likelihood=float(likelihood),
        criticality=float(criticality),
        vulnerability_severity=float(vulnerability_severity),
        control_effectiveness=float(effectiveness),
        asset_value_factor=float(asset_value_factor),
    )

    return calculate_risk(factors)


def get_risk_drivers_detail(asset_id: int) -> Dict[str, Any]:
    """Get detailed risk driver analysis for an asset.

    Returns the normalized component values so the UI can show the breakdown.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get asset data
    cursor.execute("SELECT criticality, value_range FROM assets WHERE id = ?", (asset_id,))
    asset_row = cursor.fetchone()
    if not asset_row:
        conn.close()
        return {"error": f"Asset {asset_id} not found"}

    criticality = asset_row[0]
    value_range = asset_row[1]
    value_factor_map = {"low": 1.0, "medium": 5.0, "high": 20.0}
    asset_value_factor = value_factor_map.get(value_range, 5.0)

    # Get threat likelihood
    cursor.execute("SELECT likelihood FROM threats WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    threat_row = cursor.fetchone()
    likelihood = threat_row[0] if threat_row else 3

    # Get control effectiveness
    cursor.execute("SELECT effectiveness FROM controls WHERE target_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    control_row = cursor.fetchone()
    effectiveness = control_row[0] if control_row else 3

    # Get vulnerability severity
    cursor.execute("SELECT severity FROM vulnerabilities WHERE affected_asset_id = ? ORDER BY id DESC LIMIT 1", (asset_id,))
    vuln_row = cursor.fetchone()
    vulnerability_severity = vuln_row[0] if vuln_row else 5

    conn.close()

    # Normalize factors
    likelihood_norm = likelihood / 5.0
    criticality_norm = criticality / 5.0
    control_gap = (100.0 - effectiveness) / 9.0

    # Calculate risk score
    risk_score = likelihood_norm * criticality_norm * control_gap * 100.0
    risk_score = min(100.0, max(0.0, risk_score))

    # Risk level
    if risk_score >= 70:
        risk_level = "critical"
    elif risk_score >= 50:
        risk_level = "high"
    elif risk_score >= 30:
        risk_level = "medium"
    else:
        risk_level = "low"

    # Risk drivers percentages
    total_weight = likelihood_norm + criticality_norm + control_gap
    if total_weight > 0:
        drivers = {
            "likelihood_pct": round((likelihood_norm / total_weight) * 100, 1),
            "criticality_pct": round((criticality_norm / total_weight) * 100, 1),
            "control_weakness_pct": round((control_gap / total_weight) * 100, 1),
        }
    else:
        drivers = {"likelihood_pct": 33.3, "criticality_pct": 33.3, "control_weakness_pct": 33.4}

    return {
        "asset_id": asset_id,
        "criticality": criticality,
        "value_range": value_range,
        "likelihood": likelihood,
        "likelihood_norm": round(likelihood_norm, 3),
        "effectiveness": effectiveness,
        "control_gap": round(control_gap, 3),
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
        "risk_drivers": drivers,
    }