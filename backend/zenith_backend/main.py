from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from zenith_backend.routes import router
from zenith_backend.database import get_connection
from zenith_backend.risk_engine import calculate_risk, assess_asset_risk, get_risk_drivers_detail
from zenith_backend.investment_optimizer import optimize_investment, get_control_details
from zenith_backend.recommendation_engine import get_prioritized_recommendations as get_recommendations, get_investment_recommendations as get_invest_recs
from zenith_backend.scenario_analysis import create_scenario, get_scenarios, delete_scenario, compare_scenarios

app = FastAPI(
    title="AI-Powered Cyber Risk Quantification API",
    description="Continuous cyber risk quantification and investment optimization platform",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return JSONResponse(content={"message": "Zenith Cyber Risk API is running", "version": "0.2.0"})


@app.get("/health")
def health_check():
    return JSONResponse(content={"status": "healthy"})


# --- Pydantic Schemas for CRUD ---

class AssetCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    criticality: int = 3
    value_range: Optional[str] = "medium"
    business_process: Optional[str] = "General Operations"


class VulnerabilityCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    severity: float = 5.0
    affected_asset_id: int


class ThreatCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    likelihood: int = 3
    target_asset_id: int


class ControlCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    effectiveness: int = 5
    cost: int = 10000
    target_asset_id: int


# --- Assets API Endpoints ---

@app.get("/api/v1/assets")
def list_assets():
    """List all assets."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, criticality, value_range, business_process FROM assets ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "criticality": r[3], "value_range": r[4], "business_process": r[5]}
        for r in rows
    ]


@app.get("/api/v1/assets/{asset_id}")
def get_asset(asset_id: int):
    """Get a specific asset by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, criticality, value_range, business_process FROM assets WHERE id = ?", (asset_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "name": row[1], "description": row[2], "criticality": row[3], "value_range": row[4], "business_process": row[5]}
    raise HTTPException(status_code=404, detail="Asset not found")


@app.post("/api/v1/assets")
def create_asset(asset: AssetCreate):
    """Create a new asset."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO assets (name, description, criticality, value_range, business_process) VALUES (?, ?, ?, ?, ?)",
        (asset.name, asset.description, asset.criticality, asset.value_range, asset.business_process)
    )
    new_id = cursor.lastrowid
    
    # Initialize default assessment record
    cursor.execute(
        "INSERT INTO risk_assessments (asset_id, current_likelihood, current_control_effectiveness, current_risk_score, expected_loss, risk_level) "
        "VALUES (?, 3, 3, 50.0, 150000.0, 'medium')",
        (new_id,)
    )
    conn.commit()
    conn.close()
    return {"id": new_id, "name": asset.name, "criticality": asset.criticality, "value_range": asset.value_range, "business_process": asset.business_process}


@app.delete("/api/v1/assets/{asset_id}")
def delete_asset(asset_id: int):
    """Delete an asset and its associated records."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM vulnerabilities WHERE affected_asset_id = ?", (asset_id,))
    cursor.execute("DELETE FROM threats WHERE target_asset_id = ?", (asset_id,))
    cursor.execute("DELETE FROM controls WHERE target_asset_id = ?", (asset_id,))
    cursor.execute("DELETE FROM risk_assessments WHERE asset_id = ?", (asset_id,))
    cursor.execute("DELETE FROM assets WHERE id = ?", (asset_id,))
    conn.commit()
    conn.close()
    return {"message": f"Asset {asset_id} successfully deleted"}


# --- Vulnerabilities API Endpoints ---

@app.get("/api/v1/vulnerabilities")
def list_vulnerabilities():
    """List all vulnerabilities."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, severity, affected_asset_id FROM vulnerabilities ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "severity": r[3], "affected_asset_id": r[4]}
        for r in rows
    ]


@app.post("/api/v1/vulnerabilities")
def create_vulnerability(vuln: VulnerabilityCreate):
    """Log a new vulnerability."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO vulnerabilities (name, description, severity, affected_asset_id) VALUES (?, ?, ?, ?)",
        (vuln.name, vuln.description, int(vuln.severity), vuln.affected_asset_id)
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": new_id, "name": vuln.name, "severity": vuln.severity, "affected_asset_id": vuln.affected_asset_id}


@app.delete("/api/v1/vulnerabilities/{vuln_id}")
def delete_vulnerability(vuln_id: int):
    """Delete a vulnerability."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM vulnerabilities WHERE id = ?", (vuln_id,))
    conn.commit()
    conn.close()
    return {"message": f"Vulnerability {vuln_id} deleted"}


# --- Threats API Endpoints ---

@app.get("/api/v1/threats")
def list_threats():
    """List all threats."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, likelihood, target_asset_id FROM threats ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "likelihood": r[3], "target_asset_id": r[4]}
        for r in rows
    ]


@app.post("/api/v1/threats")
def create_threat(threat: ThreatCreate):
    """Create a new threat actor / campaign."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO threats (name, description, likelihood, target_asset_id) VALUES (?, ?, ?, ?)",
        (threat.name, threat.description, threat.likelihood, threat.target_asset_id)
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": new_id, "name": threat.name, "likelihood": threat.likelihood, "target_asset_id": threat.target_asset_id}


@app.delete("/api/v1/threats/{threat_id}")
def delete_threat(threat_id: int):
    """Delete a threat."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM threats WHERE id = ?", (threat_id,))
    conn.commit()
    conn.close()
    return {"message": f"Threat {threat_id} deleted"}


# --- Controls API Endpoints ---

@app.get("/api/v1/controls")
def list_controls():
    """List all controls."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, effectiveness, cost, target_asset_id FROM controls ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "effectiveness": r[3], "cost": r[4], "target_asset_id": r[5]}
        for r in rows
    ]


@app.post("/api/v1/controls")
def create_control(control: ControlCreate):
    """Deploy a new security control safeguard."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO controls (name, description, effectiveness, cost, target_asset_id) VALUES (?, ?, ?, ?, ?)",
        (control.name, control.description, control.effectiveness, control.cost, control.target_asset_id)
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": new_id, "name": control.name, "effectiveness": control.effectiveness, "cost": control.cost, "target_asset_id": control.target_asset_id}


@app.delete("/api/v1/controls/{control_id}")
def delete_control(control_id: int):
    """Delete a control."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM controls WHERE id = ?", (control_id,))
    conn.commit()
    conn.close()
    return {"message": f"Control {control_id} deleted"}


# --- Risk Assessments API Endpoints ---

@app.get("/api/v1/risk-assessments")
def list_risk_assessments():
    """List all risk assessments."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, asset_id, current_likelihood, current_control_effectiveness, current_risk_score, expected_loss, risk_level FROM risk_assessments ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "asset_id": r[1], "current_likelihood": r[2], "current_control_effectiveness": r[3], "current_risk_score": r[4], "expected_loss": r[5], "risk_level": r[6]}
        for r in rows
    ]


@app.get("/api/v1/risk-assessments/{asset_id}")
def get_risk_assessment(asset_id: int):
    """Get risk assessment for a specific asset."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, asset_id, current_likelihood, current_control_effectiveness, current_risk_score, expected_loss, risk_level FROM risk_assessments WHERE asset_id = ?", (asset_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "asset_id": row[1], "current_likelihood": row[2], "current_control_effectiveness": row[3], "current_risk_score": row[4], "expected_loss": row[5], "risk_level": row[6]}
    raise HTTPException(status_code=404, detail="Risk assessment not found")


@app.get("/api/v1/investment-options")
def list_investment_options():
    """List all investment options."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, cost, expected_effectiveness FROM investment_options")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "cost": r[3], "expected_effectiveness": r[4]}
        for r in rows
    ]


@app.get("/api/v1/scenarios")
def list_scenarios():
    """List all scenarios."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, risk_before, risk_after, cost, risk_reduction FROM scenarios")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "description": r[2], "risk_before": r[3], "risk_after": r[4], "cost": r[5], "risk_reduction": r[6]}
        for r in rows
    ]


# --- Risk Engine APIs ---

@app.get("/api/v1/risk/calculate/{asset_id}")
def calculate_asset_risk(asset_id: int):
    """Calculate risk for a specific asset using the quantitative risk engine."""
    result = assess_asset_risk(asset_id)
    return {
        "asset_id": asset_id,
        "risk_score": result.risk_score,
        "expected_loss": result.expected_loss,
        "risk_level": result.risk_level,
        "risk_drivers": result.risk_drivers,
        "factors": {
            "likelihood": result.factors.likelihood,
            "criticality": result.factors.criticality,
            "vulnerability_severity": result.factors.vulnerability_severity,
            "control_effectiveness": result.factors.control_effectiveness,
        }
    }


@app.get("/api/v1/risk/drivers/{asset_id}")
def get_risk_drivers(asset_id: int):
    """Get detailed risk driver analysis for an asset."""
    result = get_risk_drivers_detail(asset_id)
    if "error" in result:
        return JSONResponse(status_code=404, content={"error": result["error"]})
    return result


@app.get("/api/v1/recommendations/prioritized")
def get_prioritized_recommendations_endpoint():
    """Get prioritized recommendations for the organization."""
    recs = get_recommendations()
    return JSONResponse(content=recs)


@app.get("/api/v1/recommendations/investment/{budget}")
def get_investment_recommendations_endpoint(budget: int):
    """Get investment recommendations based on available budget."""
    recs = get_invest_recs(budget)
    return JSONResponse(content=recs)


@app.get("/api/v1/scenarios/compare")
def compare_scenarios_api(scenario_ids: str = ""):
    """Compare multiple scenarios side by side."""
    scenario_ids_list = [int(x) for x in scenario_ids.split(",") if x.strip()] if scenario_ids else []
    comparison = compare_scenarios(scenario_ids_list)
    return comparison