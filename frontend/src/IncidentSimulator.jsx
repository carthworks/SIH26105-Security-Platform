import React, { useState, useEffect } from 'react';

const ATTACK_SCENARIOS = [
  {
    id: 'log4shell',
    title: 'Log4Shell (CVE-2021-44228) Zero-Day Exploit',
    targetAssetName: 'Core Banking API',
    category: 'Remote Code Execution',
    severity: 9.8,
    financialImpact: 2100000,
    riskSpike: 52,
    description: 'Adversary leverages unauthenticated JNDI injection in logging pipeline to execute arbitrary shell payloads on microservices.',
    attackVector: 'Unauthenticated HTTP Header Injection (User-Agent / X-Api-Version)',
    mitigations: [
      { name: 'WAF JNDI Pattern Filtering Rule', cost: 15000, riskReduction: 45, timeToDeploy: '< 5 mins' },
      { name: 'JDK TrustURLCodebase JVM Runtime Patch', cost: 5000, riskReduction: 35, timeToDeploy: '15 mins' },
      { name: 'Outbound Egress DNS/LDAP Firewall Lock', cost: 10000, riskReduction: 15, timeToDeploy: '< 10 mins' }
    ]
  },
  {
    id: 'ransomware',
    title: 'FIN7 Double-Extortion Ransomware Campaign',
    targetAssetName: 'PostgreSQL Customer DB',
    category: 'Data Exfiltration & Encryption',
    severity: 9.2,
    financialImpact: 3500000,
    riskSpike: 48,
    description: 'Compromised service credentials used to access primary database replicas, staging 450GB of PII for leak site extortion before encrypting storage volumes.',
    attackVector: 'Compromised CI/CD Service Account Token -> Lateral Movement',
    mitigations: [
      { name: 'Instant Revocation & Token Rotation', cost: 2000, riskReduction: 40, timeToDeploy: 'Immediate' },
      { name: 'Immutable Air-Gapped Snapshot Isolation', cost: 25000, riskReduction: 38, timeToDeploy: '< 20 mins' },
      { name: 'Zero-Trust DB Query Proxy Interception', cost: 35000, riskReduction: 18, timeToDeploy: '1 hour' }
    ]
  },
  {
    id: 'ddos',
    title: '4.2 Tbps Volumetric Layer-7 HTTP Flood',
    targetAssetName: 'Payment Gateway Broker',
    category: 'Distributed Denial of Service',
    severity: 8.5,
    financialImpact: 1200000,
    riskSpike: 38,
    description: 'Botnet generates 140M requests/sec targeting checkout and webhook authorization endpoints, exhausting connection pool and degrading settlement latency.',
    attackVector: 'Distributed Mirai-variant IoT Botnet via compromised residential proxies',
    mitigations: [
      { name: 'Anycast Edge Cloudflare Under-Attack Shield', cost: 20000, riskReduction: 60, timeToDeploy: '< 2 mins' },
      { name: 'Adaptive Token Bucket Rate-Limiter', cost: 8000, riskReduction: 25, timeToDeploy: '< 10 mins' },
      { name: 'Geographic Traffic Scrubbing & CAPTCHA Challenge', cost: 12000, riskReduction: 12, timeToDeploy: '< 5 mins' }
    ]
  },
  {
    id: 'insider',
    title: 'Privileged Insider Credential Abuse & Exfiltration',
    targetAssetName: 'AWS EKS Production Cluster',
    category: 'Privilege Escalation',
    severity: 8.9,
    financialImpact: 1800000,
    riskSpike: 42,
    description: 'Disgruntled DevOps engineer with cluster-admin RBAC attempts clandestine export of production environment secrets and S3 bucket contents.',
    attackVector: 'Legitimate Admin Session Token -> Mass Secret Pull via kubectl API',
    mitigations: [
      { name: 'Emergency Multi-Party Authorization (M-of-N)', cost: 12000, riskReduction: 50, timeToDeploy: '< 10 mins' },
      { name: 'Kubernetes Audit Log Anomaly Isolation Rule', cost: 18000, riskReduction: 30, timeToDeploy: '< 15 mins' },
      { name: 'Hardware Security Key (FIDO2) Re-Authentication', cost: 5000, riskReduction: 15, timeToDeploy: '< 5 mins' }
    ]
  }
];

export function IncidentSimulator({ assets = [], onApplySimulationState }) {
  const [selectedScenario, setSelectedScenario] = useState(ATTACK_SCENARIOS[0]);
  const [simState, setSimState] = useState('idle'); // 'idle' | 'simulating' | 'mitigated'
  const [logs, setLogs] = useState([]);
  const [selectedMitigations, setSelectedMitigations] = useState({});
  const [countdown, setCountdown] = useState(null);

  // Initialize selected mitigations when scenario changes
  useEffect(() => {
    const initial = {};
    selectedScenario.mitigations.forEach((m, idx) => {
      initial[idx] = true; // default select all recommended mitigations
    });
    setSelectedMitigations(initial);
  }, [selectedScenario]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Date.now() + Math.random(), timestamp, msg, type }, ...prev.slice(0, 19)]);
  };

  const handleLaunchAttack = () => {
    setSimState('simulating');
    setLogs([]);
    addLog(`[ALERT] Ingress Telemetry Spike detected on ${selectedScenario.targetAssetName}`, 'danger');
    addLog(`[IOC DETECTED] Signature match: ${selectedScenario.title}`, 'danger');
    addLog(`[EXPLOIT PATH] ${selectedScenario.attackVector}`, 'warning');
    addLog(`[IMPACT COMPUTED] Annual Loss Expectancy (ALE) surging +$${(selectedScenario.financialImpact / 1000000).toFixed(1)}M`, 'danger');

    // Notify parent to reflect simulated risk spike if provided
    if (onApplySimulationState) {
      onApplySimulationState({
        active: true,
        scenario: selectedScenario,
        targetAssetName: selectedScenario.targetAssetName,
        riskScoreDelta: selectedScenario.riskSpike
      });
    }
  };

  const handleNeutralize = () => {
    addLog(`[RESPONSE] Emergency Knapsack containment protocol initiated...`, 'info');
    
    // Calculate total cost and risk reduction from checked mitigations
    const activeMitigations = selectedScenario.mitigations.filter((_, idx) => selectedMitigations[idx]);
    const totalCost = activeMitigations.reduce((acc, m) => acc + m.cost, 0);
    const totalReduction = activeMitigations.reduce((acc, m) => acc + m.riskReduction, 0);

    setTimeout(() => {
      activeMitigations.forEach((m) => {
        addLog(`[DEPLOYED] ${m.name} (${m.riskReduction}% risk neutralized)`, 'success');
      });
      addLog(`[CONTAINED] Attack isolated. Total mitigation investment: $${totalCost.toLocaleString()} USD`, 'success');
      addLog(`[POSTURE RESTORED] Residual Risk lowered by ${totalReduction}% to safe baseline tolerance.`, 'success');
      setSimState('mitigated');

      if (onApplySimulationState) {
        onApplySimulationState({
          active: false,
          scenario: selectedScenario,
          mitigated: true,
          residualRiskReduction: totalReduction
        });
      }
    }, 600);
  };

  const handleReset = () => {
    setSimState('idle');
    setLogs([]);
    if (onApplySimulationState) {
      onApplySimulationState({ active: false });
    }
  };

  const toggleMitigation = (idx) => {
    setSelectedMitigations((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const activeMitigationsCount = Object.values(selectedMitigations).filter(Boolean).length;
  const totalMitigationCost = selectedScenario.mitigations
    .filter((_, idx) => selectedMitigations[idx])
    .reduce((sum, m) => sum + m.cost, 0);
  const totalRiskReduction = Math.min(
    99,
    selectedScenario.mitigations
      .filter((_, idx) => selectedMitigations[idx])
      .reduce((sum, m) => sum + m.riskReduction, 0)
  );

  return (
    <div className="incident-sim-card">
      <div className="sim-header">
        <div>
          <div className="sim-title-tag">
            <span className="live-dot-pulse"></span>
            <span>Real-Time Incident Simulation Sandbox</span>
          </div>
          <h2 className="sim-main-title">Simulate Zero-Day & Advanced Persistent Threat (APT) Attacks</h2>
          <p className="sim-subtitle">
            Stress-test your defense posture in real-time. Watch how zero-days dynamically alter risk scores, 5x5 heatmap placements, and trigger instant Knapsack containment packages.
          </p>
        </div>

        <div className="sim-status-pill">
          {simState === 'idle' && <span className="status-idle">● Baseline Steady State</span>}
          {simState === 'simulating' && <span className="status-danger animate-pulse">🔥 ACTIVE ZERO-DAY ATTACK</span>}
          {simState === 'mitigated' && <span className="status-success">✓ Incident Neutralized</span>}
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="scenario-grid">
        {ATTACK_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              className={`scenario-card ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (simState !== 'simulating') {
                  setSelectedScenario(sc);
                }
              }}
            >
              <div className="sc-header">
                <span className="sc-category">{sc.category}</span>
                <span className="sc-severity">CVSS {sc.severity}</span>
              </div>
              <h4 className="sc-title">{sc.title}</h4>
              <div className="sc-meta">
                <span>Target: <strong>{sc.targetAssetName}</strong></span>
                <span className="sc-loss">+${(sc.financialImpact / 1000000).toFixed(1)}M Exposure</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Workspace */}
      <div className="sim-workspace">
        <div className="sim-left-panel">
          <div className="sim-target-box">
            <div className="target-badge-row">
              <span className="badge-target">TARGET ASSET</span>
              <span className="target-name">{selectedScenario.targetAssetName}</span>
            </div>
            <p className="target-desc">{selectedScenario.description}</p>
            <div className="target-vector-box">
              <span className="vector-label">Primary Attack Vector:</span>
              <code className="vector-code">{selectedScenario.attackVector}</code>
            </div>

            {/* Risk Gauges Comparison */}
            <div className="sim-gauge-comparison">
              <div className="gauge-card">
                <span className="gauge-label">Normal Baseline Risk</span>
                <div className="gauge-value normal">38 / 100</div>
                <span className="gauge-sub">Tier 2 Tolerable</span>
              </div>
              <div className="gauge-arrow">➔</div>
              <div className={`gauge-card ${simState === 'simulating' ? 'gauge-danger-pulse' : simState === 'mitigated' ? 'gauge-success-border' : ''}`}>
                <span className="gauge-label">
                  {simState === 'simulating' ? 'CURRENT ATTACK SPIKE' : simState === 'mitigated' ? 'RESIDUAL POST-MITIGATION' : 'SIMULATED ATTACK STATE'}
                </span>
                <div className={`gauge-value ${simState === 'simulating' ? 'danger' : simState === 'mitigated' ? 'success' : 'pending'}`}>
                  {simState === 'simulating' ? `${38 + selectedScenario.riskSpike} / 100` : simState === 'mitigated' ? `${Math.round(38 + selectedScenario.riskSpike * (1 - totalRiskReduction / 100))} / 100` : `${38 + selectedScenario.riskSpike} / 100`}
                </div>
                <span className="gauge-sub">
                  {simState === 'simulating' ? `CRITICAL (+${selectedScenario.riskSpike} pts)` : simState === 'mitigated' ? `Safe Baseline (${totalRiskReduction}% neutralized)` : `Est. +${selectedScenario.riskSpike} Risk Surge`}
                </span>
              </div>
            </div>

            {/* Attack Trigger Buttons */}
            <div className="sim-control-actions">
              {simState === 'idle' && (
                <button className="btn btn-danger btn-large btn-full" onClick={handleLaunchAttack}>
                  ⚡ Launch Zero-Day Attack Simulation
                </button>
              )}

              {simState === 'simulating' && (
                <button className="btn btn-primary btn-large btn-full animate-bounce" onClick={handleNeutralize}>
                  🛡️ Deploy Emergency Containment ({activeMitigationsCount} Safeguards)
                </button>
              )}

              {simState === 'mitigated' && (
                <div className="mitigated-btn-row">
                  <button className="btn btn-outline btn-full" onClick={handleReset}>
                    ↺ Reset Simulation Baseline
                  </button>
                  <button className="btn btn-danger btn-full" onClick={handleLaunchAttack}>
                    ⚡ Re-Test Exploit Vector
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Knapsack Mitigations & Live Attack Terminal Logs */}
        <div className="sim-right-panel">
          <div className="mitigation-box">
            <div className="mitigation-header">
              <span className="mitigation-badge">KNAPSACK ALGORITHM</span>
              <h4>Optimized Emergency Containment Package</h4>
              <div className="mitigation-summary-row">
                <span className="mit-cost">Total Cost: <strong>${totalMitigationCost.toLocaleString()}</strong></span>
                <span className="mit-power">Risk Reduction: <strong>{totalRiskReduction}%</strong></span>
              </div>
            </div>

            <div className="mitigation-list">
              {selectedScenario.mitigations.map((m, idx) => {
                const isChecked = !!selectedMitigations[idx];
                return (
                  <label key={idx} className={`mitigation-item ${isChecked ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMitigation(idx)}
                      disabled={simState === 'simulating' && false}
                    />
                    <div className="mit-info">
                      <div className="mit-top">
                        <span className="mit-name">{m.name}</span>
                        <span className="mit-eff">-{m.riskReduction}% Risk</span>
                      </div>
                      <div className="mit-meta">
                        <span>Cost: ${m.cost.toLocaleString()}</span>
                        <span>SLA: {m.timeToDeploy}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Live Incident Telemetry Terminal */}
          <div className="sim-terminal-box">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">ZENITH REAL-TIME TELEMETRY FEED</span>
              <span className="terminal-clock">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="terminal-body">
              {logs.length === 0 ? (
                <div className="terminal-empty">
                  <em>Telemetry stream online. Select a threat scenario above and click "Launch Zero-Day Attack Simulation" to stream real-time attack signals and automated Knapsack mitigations.</em>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className={`terminal-line log-${log.type}`}>
                    <span className="log-time">[{log.timestamp}]</span>{' '}
                    <span className="log-content">{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
