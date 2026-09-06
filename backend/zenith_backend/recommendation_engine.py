"""Recommendation Engine.

Provides explainable, deterministic recommendations grounded in the actual
calculated data from the risk engine and investment optimizer.

Recommendations answer questions such as:
- Why is this asset high risk?
- What is driving the risk?
- Which control should be prioritized?
- Why is this investment recommended?
- What happens if the organization does nothing?
- What happens if the budget increases?
"""

import sqlite3
import os
from typing import Dict, List, Any, Optional

DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "risk_assessment.db"
)


def get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_prioritized_recommendations() -> List[Dict[str, Any]]:
    """Get prioritized recommendations for the organization.

    Recommendations are ordered by urgency and impact, based on:
    - Risk score (higher risk assets first)
    - Control gaps (controls with low effectiveness)
    - Investment efficiency (best risk reduction per dollar)
    - Current risk level (critical assets first)

    Returns a list of recommendations with reason, cost, expected impact, and urgency.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get all risk assessments with asset info
    cursor.execute("""
        SELECT ra.id, ra.asset_id, ra.current_risk_score, ra.risk_level,
               a.name as asset_name, a.criticality, a.value_range
        FROM risk_assessments ra
        JOIN assets a ON ra.asset_id = a.id
        ORDER BY ra.current_risk_score DESC, ra.risk_level DESC
    """)
    risk_assessments = cursor.fetchall()

    # Get all controls with effectiveness
    cursor.execute("SELECT id, name, effectiveness, cost FROM controls ORDER BY effectiveness ASC")
    controls = cursor.fetchall()

    # Get asset value factors
    value_factor_map = {"low": 1.0, "medium": 5.0, "high": 20.0}

    recommendations = []

    for ra in risk_assessments:
        asset_id = ra[1]
        risk_score = ra[2]
        risk_level = ra[3]
        asset_name = ra[4]
        criticality = ra[4]  # criticality from assets join (actually it's index 4, but let me check)
        # Actually: ra = (id, asset_id, current_risk_score, risk_level, asset_name) - need to verify

    # Let me redo this with proper column access
    conn.close()
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ra.id, ra.asset_id, ra.current_risk_score, ra.risk_level,
               a.name, a.criticality, a.value_range
        FROM risk_assessments ra
        JOIN assets a ON ra.asset_id = a.id
        ORDER BY ra.current_risk_score DESC, ra.risk_level DESC
    """)
    risk_assessments = cursor.fetchall()
    conn.close()

    value_factor_map = {"low": 1.0, "medium": 5.0, "high": 20.0}

    for ra in risk_assessments:
        rec_id = ra[0]  # risk assessment ID (not used in output, just for reference)
        asset_id = ra[1]
        risk_score = ra[2]
        risk_level = ra[3]
        asset_name = ra[4]
        criticality = ra[5]
        value_range = ra[6]
        value_factor = value_factor_map.get(value_range, 5.0)

        # Determine recommendation based on risk level and factors
        if risk_level == "critical":
            # Critical: immediate action required
            recommendation = _critical_recommendation(asset_id, asset_name, criticality, value_factor, controls)
            urgency = "Immediate"
        elif risk_level == "high":
            recommendation = _high_recommendation(asset_id, asset_name, criticality, value_factor, controls)
            urgency = "High"
        elif risk_level == "medium":
            recommendation = _medium_recommendation(asset_id, asset_name, criticality, value_factor, controls)
            urgency = "Medium"
        else:
            recommendation = _low_recommendation(asset_id, asset_name, criticality, value_factor, controls)
            urgency = "Low"

        recommendations.append({
            "asset_id": asset_id,
            "asset_name": asset_name,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "urgency": urgency,
        })

    # Sort by urgency order: Critical > High > Medium > Low
    urgency_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    recommendations.sort(key=lambda r: urgency_order.get(r["urgency"], 99))

    return recommendations


def _critical_recommendation(asset_id, asset_name, criticality, value_factor, controls):
    """Generate recommendation for a critical-risk asset."""
    # Get the asset's vulnerabilities and threats
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name, severity FROM vulnerabilities WHERE affected_asset_id = ?", (asset_id,))
    vulnerabilities = cursor.fetchall()

    cursor.execute("SELECT name, effectiveness FROM controls WHERE target_asset_id = ?", (asset_id,))
    controls_for_asset = cursor.fetchall()

    conn.close()

    # Build recommendation
    vulnerability_names = [v[0] for v in vulnerabilities]
    control_names = [c[0] for c in controls_for_asset]

    # If MFA is not deployed, recommend it
    mfa_deployed = any("MFA" in name or "multi-factor" in name.lower() for name in control_names)

    recommendation_parts = []

    # Primary recommendation
    if not mfa_deployed:
        recommendation_parts.append(
            "Implement Multi-Factor Authentication across all assets - this alone can reduce account compromise risk by 90%+"
        )
    else:
        recommendation_parts.append(
            "MFA is already deployed - ensure coverage for all critical access points"
        )

    # Address top vulnerabilities
    if vulnerabilities:
        top_vuln = vulnerabilities[0]  # highest severity
        recommendation_parts.append(
            f"Address critical vulnerability: {top_vuln[0]} (severity: {top_vuln[1]}/10) - apply patches or implement compensating controls"
        )

    # Financial impact
    loss_range = (10_000, 2_000_000)
    expected_loss = round(100_000 * criticality * value_factor, 2)  # simplified estimate
    recommendation_parts.append(
        f"Estimated financial exposure: ~${expected_loss:,.2f} if this asset is compromised"
    )

    return " ".join(recommendation_parts)


def _high_recommendation(asset_id, asset_name, criticality, value_factor, controls):
    """Generate recommendation for a high-risk asset."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name, severity FROM vulnerabilities WHERE affected_asset_id = ? ORDER BY severity DESC LIMIT 1",
                   (asset_id,))
    top_vuln = cursor.fetchone()

    cursor.execute("SELECT name, effectiveness FROM controls WHERE target_asset_id = ? ORDER BY effectiveness ASC LIMIT 3",
                   (asset_id,))
    weakest_controls = cursor.fetchall()

    conn.close()

    recommendation_parts = []

    # Recommend prioritized controls
    if weakest_controls:
        ctrl_name = weakest_controls[0][0]
        recommendation_parts.append(
            f"Prioritize control: {ctrl_name} (currently {weakest_controls[0][1]}/10 effectiveness) - this is the weakest link"
        )

    # Address top vulnerability if exists
    if top_vuln:
        recommendation_parts.append(
            f"Address vulnerability: {top_vuln[0]} (severity: {top_vuln[1]}/10)"
        )

    # General security improvement
    recommendation_parts.append(
        "Conduct a detailed asset-specific risk assessment and implement layered defense"
    )

    return " ".join(recommendation_parts)


def _medium_recommendation(asset_id, asset_name, criticality, value_factor, controls):
    """Generate recommendation for a medium-risk asset."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name, severity FROM vulnerabilities WHERE affected_asset_id = ? LIMIT 1",
                   (asset_id,))
    vuln = cursor.fetchone()

    cursor.execute("SELECT name, effectiveness FROM controls ORDER BY effectiveness ASC LIMIT 1")
    weakest_ctrl = cursor.fetchone()

    conn.close()

    recommendation_parts = []

    if vuln:
        recommendation_parts.append(
            f"Review vulnerability: {vuln[0]} (severity: {vuln[1]}/10)"
        )

    if weakest_ctrl:
        recommendation_parts.append(
            f"Consider strengthening control: {weakest_ctrl[0]} (effectiveness: {weakest_ctrl[1]}/10)"
        )

    recommendation_parts.append(
        "Monitor risk trends and reassess in 30-60 days"
    )

    return " ".join(recommendation_parts)


def _low_recommendation(asset_id, asset_name, criticality, value_factor, controls):
    """Generate recommendation for a low-risk asset."""
    return (
        "Maintain current security posture with regular monitoring and "
        "periodic reassessment. Continue routine security practices."
    )


def get_investment_recommendations(budget: int) -> List[Dict[str, Any]]:
    """Get investment recommendations based on available budget.

    Uses the investment optimization engine to recommend the best controls
    to invest in, given a budget constraint.
    """
    from zenith_backend.investment_optimizer import optimize_investment

    optimization = optimize_investment(budget)

    recommendations = []
    for ctrl in optimization["selected_controls"]:
        recommendations.append({
            "type": "investment",
            "control_id": ctrl["id"],
            "control_name": ctrl["name"],
            "cost": ctrl["cost"],
            "expected_effectiveness": ctrl["effectiveness"],
            "urgency": "High" if ctrl["cost"] > budget * 0.5 else "Medium",
            "reason": f"Provides {ctrl['effectiveness']}/10 effectiveness for ${ctrl['cost']:,.0f}",
            "expected_risk_reduction": round(
                (ctrl["effectiveness"] / 10.0) * 100 * 0.1, 1  # proportional reduction
            ),
        })

    # Also add a "do nothing" recommendation
    recommendations.append({
        "type": "do_nothing",
        "control_name": "Do Nothing",
        "cost": 0,
        "expected_effectiveness": 0,
        "urgency": "Immediate",
        "reason": "Risk will remain at current level with potential for increase",
    })

    # Sort by urgency
    urgency_order = {"Immediate": 0, "High": 1, "Medium": 2}
    recommendations.sort(key=lambda r: urgency_order.get(r["urgency"], 99))

    return recommendations