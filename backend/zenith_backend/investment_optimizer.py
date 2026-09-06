"""Investment Optimization Engine.

Given a security budget and available controls with costs and expected effectiveness,
determine the optimal control combination under the budget constraint.

Uses a knapsack-style approach: maximize risk reduction within budget constraints.

The output shows:
- Current risk
- Recommended controls
- Cost
- Expected risk reduction
- Residual risk
- ROI/investment efficiency metric
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


def optimize_investment(budget: int) -> Dict[str, Any]:
    """Optimize security investment under a budget constraint.

    Uses a 0/1 knapsack algorithm to select the combination of controls
    that maximizes risk reduction while staying within budget.

    Returns:
        - selected_controls: list of selected control IDs and names
        - total_cost: total cost of selected controls
        - risk_reduction: total expected risk reduction
        - residual_risk: risk remaining after investment
        - roi_metric: risk reduction per dollar spent
        - current_risk: risk before investment
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Get all controls with their cost and effectiveness
    cursor.execute("SELECT id, name, effectiveness, cost FROM controls")
    controls = cursor.fetchall()
    conn.close()

    if not controls or budget <= 0:
        return {
            "selected_controls": [],
            "total_cost": 0,
            "risk_reduction": 0,
            "residual_risk": 0,
            "roi_metric": 0,
            "current_risk": 0,
        }

    # Get current risk assessment
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT current_risk_score FROM risk_assessments")
    risk_rows = cursor.fetchall()
    conn.close()

    current_risk_score = 0
    if risk_rows:
        # Use the average or the highest risk assessment
        current_risk_score = max(r[0] for r in risk_rows)

    # Knapsack-style optimization
    # Value = expected risk reduction = effectiveness * baseline_reduction
    # Weight = cost
    # We want to maximize total value within budget

    n = len(controls)
    if n == 0:
        return {
            "selected_controls": [],
            "total_cost": 0,
            "risk_reduction": 0,
            "residual_risk": current_risk_score,
            "roi_metric": 0,
            "current_risk": current_risk_score,
        }

    # Each control's "value" is its effectiveness score
    # We use a simplified approach: sort by effectiveness/cost ratio
    # and select controls within budget

    # Prepare control data for knapsack
    control_values = []  # effectiveness (risk reduction contribution)
    control_costs = []   # cost
    control_ids = []     # control ID
    control_names = []   # control name

    for c in controls:
        control_ids.append(c[0])
        control_names.append(c[1])
        control_values.append(c[2])  # effectiveness as value
        control_costs.append(c[3])  # cost

    # 0/1 Knapsack algorithm
    # dp[j] = maximum value achievable with budget j
    dp = [0] * (budget + 1)
    selected = [[] for _ in range(budget + 1)]

    for i in range(n):
        cost = control_costs[i]
        value = control_values[i]
        for j in range(budget, cost - 1, -1):
            if dp[j - cost] + value > dp[j]:
                dp[j] = dp[j - cost] + value
                selected[j] = selected[j - cost] + [i]

    # Find the best budget point
    best_budget = 0
    best_value = dp[0]
    for j in range(1, budget + 1):
        if dp[j] > best_value:
            best_value = dp[j]
            best_budget = j

    # Get selected control indices
    selected_indices = selected[best_budget]
    selected_control_ids = [control_ids[i] for i in selected_indices]
    selected_control_names = [control_names[i] for i in selected_indices]

    # Calculate total cost and risk reduction
    total_cost = sum(control_costs[i] for i in selected_indices)

    # Expected risk reduction: proportional to total effectiveness
    # If current risk is X and total control effectiveness sum is Y,
    # risk reduction = X * (total_effectiveness / max_possible_effectiveness)
    total_effectiveness = sum(control_values[i] for i in selected_indices)
    max_possible = max(control_values) * n  # theoretical max
    risk_reduction = current_risk_score * (total_effectiveness / max_possible) if max_possible > 0 else 0

    # Residual risk = current risk - risk reduction
    residual_risk = max(0, current_risk_score - risk_reduction)

    # ROI metric: risk reduction per dollar spent
    if total_cost > 0:
        roi_metric = risk_reduction / total_cost
    else:
        roi_metric = 0

    return {
        "selected_controls": [
            {"id": control_ids[i], "name": control_names[i], "cost": control_costs[i], "effectiveness": control_values[i]}
            for i in selected_indices
        ],
        "total_cost": total_cost,
        "risk_reduction": round(risk_reduction, 1),
        "residual_risk": round(residual_risk, 1),
        "roi_metric": round(roi_metric, 2),
        "current_risk": current_risk_score,
    }


def get_control_details(control_ids: List[int]) -> List[Dict[str, Any]]:
    """Get detailed information about specific controls."""
    conn = get_connection()
    cursor = conn.cursor()

    if not control_ids:
        conn.close()
        return []

    placeholders = ",".join("?" for _ in control_ids)
    cursor.execute(f"SELECT id, name, description, effectiveness, cost FROM controls WHERE id IN ({placeholders})",
                   control_ids)
    rows = cursor.fetchall()
    conn.close()

    return [
        {"id": r[0], "name": r[1], "description": r[2], "effectiveness": r[3], "cost": r[4]}
        for r in rows
    ]