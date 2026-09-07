# Zenith — AI-Powered Cyber Risk Quantification & Investment Optimizer

**SIH26105 Security Platform** — Continuous cyber risk posture quantification, threat intelligence modeling, 3D telemetry visualization, and data-driven security investment optimization.

<p align="center">
  <img src="./docs/dashboard-preview.png" alt="Zenith Platform Dashboard Preview" width="100%" />
</p>

---

## 🌟 Key Upgrades & Platform Capabilities

### 1. 🌐 3D Black & Red Dotted Cyber Threat Globe
- **High-Density Raster Scanline Dot Matrix**: Spherical ray-casting landmass projection (`isPointInPolygon`) rendering ultra-dense red continental dot coordinates across North America, South America, Europe, Africa, Asia, India, Australia, and Antarctica.
- **Dynamic 3D Euler Perspective**: Interactive mouse & touch drag-to-spin controls, axial tilting, and smooth auto-rotation.
- **Threat Vector Lasers & Deflection Ripples**: Animated parabolic 3D threat trajectories, glowing red coastline boundary contours, longitude/latitude wireframe grids, and live defense shield deflection arcs.

### 2. 📄 One-Click Executive PDF & GRC Audit Export
- **Boardroom-Ready Executive Briefings**: Generates multi-page formatted compliance audit packages with formal letterheads, executive summary scorecards, 5x5 risk matrices, and Knapsack capital allocation ROI.
- **Regulatory Standard Cross-Mappings**: Comprehensive compliance mappings to **NIST CSF 2.0**, **ISO/IEC 27001:2022**, **SOC 2 Type II**, and **CIS Controls v8**.
- **Formal Attestation Blocks**: CISO, Head of SecOps, and Lead Compliance Auditor sign-off signature blocks for formal stakeholder submission.
- **Multi-Format Export**: One-click **Print / Save as PDF**, **JSON compliance evidence download**, and **CSV spreadsheet export**.

### 3. ⚡ Live Zero-Day Incident Simulation Sandbox
- **Adversary Attack Injection**: Real-time simulation of critical adversary attack campaigns:
  - `Log4Shell (CVE-2021-44228)` Remote Code Execution
  - `FIN7 Carbon Spider` Ransomware & Lateral Movement
  - `Layer-7 Distributed SYN/HTTP Flood` DDoS
  - `Insider Threat` Privileged Data Exfiltration
- **Real-Time Telemetry Surging**: Live signal logs, dynamic risk score surging, and automated quadrant shifting on the 5x5 Risk Heatmap.
- **Instant Knapsack Containment**: Automated countermeasure computation and 1-click mitigation deployment to neutralize active incidents.

### 4. 📝 Interactive Inventory & Threat CRUD Engine
- **Full Lifecycle Asset Management**: Ingest, edit, and decommission enterprise digital assets across hybrid environments with valuation and business owner tracking.
- **CVE Flaw & Threat Profile Mapping**: Register custom vulnerabilities with CVSS v3.1 base metrics and correlate with MITRE ATT&CK campaign tactics.
- **Defensive Control Deployment**: Add and tune safeguard effectiveness ratings across microsegmentation, WAF, EDR, and IAM.
- **Live State Recalculation**: Instant recalculation of enterprise risk scores and ROI upon any CRUD operation.

### 5. 💰 0/1 Knapsack Budget ROI Optimizer
- **Algorithmic Capital Allocation**: Dynamic programming 0/1 Knapsack algorithm maximizing risk reduction percentage per dollar spent under strict financial constraints.
- **Interactive Budget Slider**: Real-time simulation of security ROI and estimated expected financial loss avoided.
- **Pareto Frontier Analytics**: Visual Pareto frontier curve and safeguard distribution charts.

### 6. 🎯 Prioritized Action Directives & 5x5 Matrix
- **Actionable Remediation Directives**: Rank-ordered remediation tasks sorted by urgency and financial mitigation impact.
- **Interactive 5x5 Cyber Risk Heatmap**: Likelihood vs. Impact matrix with drill-down asset inspection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic, Python-dotenv |
| **Data & Math** | NumPy, Pandas, SQLite3, 0/1 Knapsack Optimization |
| **Frontend** | React 17/18, Vite, HTML5 Canvas 3D Euler Math, Vanilla CSS Design System (`Poppins` font) |
| **Architecture** | RESTful API with automated dual-port fallback telemetry (`:8001` / `:8000`) |

---

## 📁 Repository Structure

```
zenith/
├── backend/
│   ├── zenith_backend/
│   │   ├── main.py                    # FastAPI application & route registration
│   │   ├── database.py                # SQLite schema & database operations
│   │   ├── risk_engine.py             # Risk calculation algorithms
│   │   ├── continuous_risk.py         # Continuous risk monitoring
│   │   ├── investment_optimizer.py    # Knapsack budget optimization
│   │   ├── scenario_analysis.py       # Stress testing & scenario simulation
│   │   └── recommendation_engine.py   # Prioritized recommendation generation
│   ├── requirements.txt               # Backend Python dependencies
│   └── start.py                       # Server runner utility
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                   # Root application & dashboard view
│   │   ├── CyberGlobe.jsx             # 3D Black & Red Dotted Cyber Threat Globe
│   │   ├── ExecutiveReportModal.jsx   # One-Click C-level audit & PDF export
│   │   ├── CrudModals.jsx             # Asset, CVE, Threat & Control CRUD modals
│   │   ├── IncidentSimulator.jsx      # Live Zero-Day attack simulation sandbox
│   │   ├── LandingPage.jsx            # Platform landing showcase page
│   │   ├── HowItWorksPage.jsx         # Architecture guide & documentation
│   │   ├── RiskHeatmap.jsx            # Interactive 5x5 Cyber Risk Matrix
│   │   ├── VisualAnalytics.jsx        # Pareto frontier curve & distribution charts
│   │   ├── api.js                     # Backend API client with dynamic port fallback
│   │   └── index.css                  # Design system tokens & utility styles
│   ├── index.html                     # HTML root with Google Fonts (Poppins)
│   ├── package.json                   # Frontend dependencies & scripts
│   └── vite.config.js                 # Vite configuration
│
├── api/
│   └── index.py                       # Vercel Serverless Function entry point
├── start.bat                          # One-Click Windows Launch Script
├── vercel.json                        # Vercel production deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

---

### ⚡ Quick Start (Single Command / One-Click)

Run the root launcher batch script:
```cmd
.\start.bat
```
This automatically starts both the FastAPI backend (Port 8001) and Vite frontend (Port 5173), and opens `http://localhost:5173` in your browser.

---

### 🔧 Manual Setup

#### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Install Python dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```powershell
   python -m uvicorn zenith_backend.main:app --reload --port 8001
   ```
   *(Or port `8000`)*:
   ```powershell
   python -m uvicorn zenith_backend.main:app --reload --port 8000
   ```

Backend API documentation will be available at:
- **Swagger UI**: `http://127.0.0.1:8001/docs` (or `:8000/docs`)
- **ReDoc**: `http://127.0.0.1:8001/redoc`

---

#### 2. Frontend Setup

1. In a second terminal, navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```

2. Install npm dependencies:
   ```powershell
   npm install
   ```

3. Launch the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔗 Direct Dashboard Section Navigation

You can jump directly to any section using URL hash anchors:

| Section | URL Hash |
|---|---|
| **Executive PDF & GRC Report** | `http://localhost:5173/#report` |
| **Incident Simulation Sandbox** | `http://localhost:5173/#simulation` |
| **Asset Inventory** | `http://localhost:5173/#assets` |
| **Vulnerabilities (CVE)** | `http://localhost:5173/#vuln` |
| **Threat Matrix (ATT&CK)** | `http://localhost:5173/#threat` |
| **Security Controls** | `http://localhost:5173/#ctrl` |
| **5x5 Risk Heatmap & Scoring** | `http://localhost:5173/#risk` |
| **Knapsack Investment Optimizer** | `http://localhost:5173/#invest` |
| **Attack Scenario Stress-Tests** | `http://localhost:5173/#scenario` |
| **Prioritized Action Directives** | `http://localhost:5173/#rec` |

---

## 📡 Core API Endpoints

- `GET /api/v1/assets` — Retrieve list of monitored enterprise assets
- `POST /api/v1/assets` — Ingest new enterprise asset
- `GET /api/v1/vulnerabilities` — List discovered vulnerabilities & CVEs
- `POST /api/v1/vulnerabilities` — Log new CVE vulnerability
- `GET /api/v1/threats` — Adversary threats & likelihood ratings
- `POST /api/v1/threats` — Register threat actor campaign
- `GET /api/v1/controls` — Defensive security controls
- `POST /api/v1/controls` — Deploy defensive control
- `GET /api/v1/risk-assessments` — Quantitative risk scores per asset
- `GET /api/v1/investment-options` — Security investment packages & Knapsack ROI metrics
- `POST /api/v1/investment-options/optimize` — Run 0/1 Knapsack optimization on custom budget
- `GET /api/v1/scenarios` — Attack simulation scenarios (Ransomware, DDoS, Insider, etc.)
- `GET /api/v1/recommendations/prioritized` — Actionable security directives sorted by urgency

---

## 🌐 Deploy to Vercel

The project is pre-configured for instant Vercel deployment (serving both the React SPA frontend and the Python FastAPI serverless functions):

### Quick Steps:
1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **`zenith`** repository.
4. Click **"Deploy"** (Vercel automatically detects [vercel.json](file:///c:/Users/tkart/OneDrive/Documents/zenith/zenith/vercel.json), builds the frontend, and packages `api/index.py` as serverless functions).

---



## 📄 License
Internal SIH26105 Security Platform.