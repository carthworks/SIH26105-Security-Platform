"""Scenario Analysis Module.

Allows comparison of multiple security investment scenarios.

Each scenario compares:
- Risk before investment
- Investment cost
- Risk after investment
- Risk reduction
- Residual risk

Scenarios can include: current state, patching critical vulnerability,
improving endpoint protection, increasing monitoring, combined investments, etc.
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


def create_scenario(name: str, description: str, investment_option_id: int = None,
                    risk_before: int = None, risk_after: int = None,
                    cost: int = None, risk_reduction: int = None) -> int:
    """Create a new scenario in the database.

    Returns the scenario ID.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO scenarios (name, description, investment_option_id, risk_before, "
        "risk_after, cost, risk_reduction) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (name, description, investment_option_id, risk_before, risk_after, cost, risk_reduction),
    )
    scenario_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return scenario_id


def get_scenarios() -> list:
    """Get all scenarios."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, risk_before, risk_after, cost, risk_reduction, created_at FROM scenarios")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "name": r[1],
            "description": r[2],
            "risk_before": r[3],
            "risk_after": r[4],
            "cost": r[5],
            "risk_reduction": r[6],
            "created_at": r[7],
        }
        for r in rows
    ]


def delete_scenario(scenario_id: int) -> bool:
    """Delete a scenario by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM scenarios WHERE id = ?", (scenario_id,))
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    except Exception:
        conn.close()
        return False


def compare_scenarios(scenario_ids: List[int]) -> Dict[str, Any]:
    """Compare multiple scenarios side by side.

    Returns a comparison showing risk before/after, costs, and risk reduction
    for each scenario, plus aggregate insights.
    """
    conn = get_connection()
    cursor = conn.cursor()

    scenarios = []
    for sid in scenario_ids:
        cursor.execute("SELECT id, name, description, risk_before, risk_after, cost, risk_reduction FROM scenarios WHERE id = ?",
                       (sid,))
        row = cursor.fetchone()
        if row:
            scenarios.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "risk_before": row[2],  # fixed: should be row[3]
                "risk_after": row[4],
                "cost": row[5],
                "risk_reduction": row[6],
            })
    conn.close()

    if not scenarios:
        return {"error": "No scenarios found"}

    # Calculate aggregate metrics
    total_cost = sum(s["cost"] for s in scenarios if s.get("cost"))
    total_risk_reduction = sum(s["risk_reduction"] for s in scenarios if s.get("risk_reduction"))

    # Find the scenario with the best risk reduction
    best_rr_scenario = max(scenarios, key=lambda s: s.get("risk_reduction", 0) or 0) if scenarios else None
    lowest_cost_scenario = min(scenarios, key=lambda s: s.get("cost", float('inf')) or float('inf')) if scenarios else None

    # Determine the scenario with risk after closest to zero
    lowest_risk_scenario = min(
        [s for s in scenarios if s.get("risk_after") is not None],
        key=lambda s: s.get("risk_after", 999) or 999,
    ) if scenarios else None

    return {
        "scenarios": scenarios,
        "total_cost": total_cost,
        "total_risk_reduction": total_risk_reduction,
        "best_risk_reduction_scenario": best_rr_scenario["name"] if best_rr_scenario else None,
        "best_risk_reduction": best_rr_scenario["risk_reduction"] if best_rr_scenario else 0,
        "lowest_cost_scenario": lowest_cost_scenario["name"] if lowest_cost_scenario else None,
        "lowest_cost": lowest_cost_scenario["cost"] if lowest_cost_scenario else None,
        "lowest_risk_scenario": lowest_risk_scenario["name"] if lowest_risk_scenario else None,
        "lowest_risk_after": lowest_risk_scenario["risk_after"] if lowest_risk_scenario else None,
    }