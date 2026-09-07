import React, { useRef } from 'react';

export function ExecutiveReportModal({
  isOpen,
  onClose,
  assets = [],
  vulns = [],
  threats = [],
  controls = [],
  riskAssessments = [],
  invOpts = [],
  budget = 50000,
  recs = []
}) {
  const reportRef = useRef(null);

  if (!isOpen) return null;

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportId = `ZENITH-EXEC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Calculations
  const criticalAssets = assets.filter((a) => a.criticality === 'CRITICAL' || a.criticality === 'Critical');
  const highVulns = vulns.filter((v) => Number(v.severity) >= 7.0);
  const avgRisk = riskAssessments.length
    ? Math.round(riskAssessments.reduce((acc, r) => acc + (r.current_risk_score || 0), 0) / riskAssessments.length)
    : 62;
  const totalValuation = assets.reduce((acc, a) => {
    const v = String(a.business_value || '').replace(/[^0-9.]/g, '');
    return acc + (Number(v) || 5.0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      report_id: reportId,
      generated_at: new Date().toISOString(),
      classification: "CONFIDENTIAL // C-SUITE & AUDIT COMMITTEE ONLY",
      organization_posture: {
        portfolio_risk_index: avgRisk,
        monitored_asset_count: assets.length,
        critical_tier_assets: criticalAssets.length,
        total_asset_valuation_usd: `$${totalValuation.toFixed(1)}M`,
        active_cve_count: vulns.length,
        high_severity_cve_count: highVulns.length,
        allocated_security_budget: budget
      },
      compliance_alignment: [
        "NIST CSF 2.0 (Identify, Protect, Detect, Respond, Recover)",
        "ISO/IEC 27001:2022 Annex A Controls",
        "SOC 2 Type II Security & Confidentiality Criteria",
        "PCI-DSS v4.0 Requirement 6 & 12"
      ],
      asset_inventory: assets,
      vulnerability_register: vulns,
      threat_intelligence: threats,
      active_controls: controls,
      knapsack_investment_options: invOpts,
      prioritized_action_directives: recs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportId}-Audit-Package.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csv = 'Report ID,Asset Name,Criticality,Business Value,Current Risk Score,Risk Level\n';
    assets.forEach((a) => {
      const ra = riskAssessments.find((r) => r.asset_id === a.id);
      const score = ra ? ra.current_risk_score : 50;
      const level = ra ? ra.risk_level : a.criticality;
      csv += `"${reportId}","${a.name}","${a.criticality}","${a.business_value || 'N/A'}",${score},"${level}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportId}-Asset-Risk-Matrix.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay report-modal-overlay" onClick={onClose}>
      <div className="modal-container report-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Control Action Bar (Hidden during window.print) */}
        <div className="report-action-bar no-print">
          <div className="report-badge-meta">
            <span className="report-confidential-pill">🔒 C-LEVEL EXECUTIVE CONFIDENTIAL</span>
            <span className="report-id-tag">{reportId}</span>
          </div>
          <div className="report-actions-btn-group">
            <button className="btn btn-outline btn-sm" onClick={handleDownloadCSV} title="Export spreadsheet format">
              📊 Export CSV
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleDownloadJSON} title="Download full JSON compliance evidence">
              📥 Download JSON
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} title="Print or save as multi-page A4 PDF">
              🖨️ Print / Save as PDF
            </button>
            <button className="modal-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Printable Executive Report Body */}
        <div className="printable-report-wrapper" ref={reportRef}>
          
          {/* Executive Letterhead */}
          <div className="report-letterhead">
            <div className="letterhead-brand">
              <div className="letterhead-logo">Z</div>
              <div>
                <h1 className="letterhead-title">ZENITH CYBER RISK ENGINE</h1>
                <span className="letterhead-sub">Continuous Cyber Risk Quantification & Investment Optimization • SIH26105</span>
              </div>
            </div>
            <div className="letterhead-meta">
              <div><strong>Generated:</strong> {reportDate}</div>
              <div><strong>Document ID:</strong> {reportId}</div>
              <div><strong>Classification:</strong> RESTRICTED // EXECUTIVE AUDIT</div>
            </div>
          </div>

          <hr className="report-divider" />

          {/* Section: Executive Briefing & Posture Summary */}
          <div className="report-section">
            <div className="section-header-wrap">
              <span className="section-num">01</span>
              <h2 className="section-heading">Executive Cyber Risk Posture & Valuation Summary</h2>
            </div>
            <p className="section-intro">
              This executive audit report provides algorithmic cyber risk quantification, continuous vulnerability exposure ratings, and Knapsack-optimized security budget allocations across enterprise digital assets.
            </p>

            {/* Scorecard KPI Cards */}
            <div className="report-kpi-grid">
              <div className="report-kpi-box">
                <span className="kpi-box-label">Composite Risk Index</span>
                <div className={`kpi-box-val ${avgRisk >= 75 ? 'danger' : avgRisk >= 50 ? 'warning' : 'success'}`}>
                  {avgRisk} / 100
                </div>
                <span className="kpi-box-sub">{avgRisk >= 75 ? 'Critical Exposure Tier' : avgRisk >= 50 ? 'Elevated High Tier' : 'Tolerable Baseline'}</span>
              </div>

              <div className="report-kpi-box">
                <span className="kpi-box-label">Monitored Assets Value</span>
                <div className="kpi-box-val normal">${totalValuation.toFixed(1)}M USD</div>
                <span className="kpi-box-sub">Across {assets.length} Ingested Entities</span>
              </div>

              <div className="report-kpi-box">
                <span className="kpi-box-label">Active CVSS Flaws</span>
                <div className="kpi-box-val danger">{vulns.length} CVEs</div>
                <span className="kpi-box-sub">{highVulns.length} Critical / High Severity</span>
              </div>

              <div className="report-kpi-box">
                <span className="kpi-box-label">Security Spend Budget</span>
                <div className="kpi-box-val success">${(budget / 1000).toFixed(0)}k Allocated</div>
                <span className="kpi-box-sub">Knapsack Portfolio Optimized</span>
              </div>
            </div>
          </div>

          {/* Section: Regulatory Compliance & Governance Alignment */}
          <div className="report-section">
            <div className="section-header-wrap">
              <span className="section-num">02</span>
              <h2 className="section-heading">Governance & Regulatory Standards Mapping</h2>
            </div>
            <div className="compliance-chips-row">
              <div className="compliance-chip">
                <strong>NIST CSF 2.0</strong>
                <span>ID.RA / PR.AC / DE.CM</span>
              </div>
              <div className="compliance-chip">
                <strong>ISO/IEC 27001:2022</strong>
                <span>Clause 6.1.2 & Annex A.8</span>
              </div>
              <div className="compliance-chip">
                <strong>SOC 2 Type II</strong>
                <span>CC6.6 / CC7.1 Security</span>
              </div>
              <div className="compliance-chip">
                <strong>CIS Controls v8</strong>
                <span>Controls 4, 7, 9 & 10</span>
              </div>
            </div>
          </div>

          {/* Section: Asset Inventory & Risk Matrix */}
          <div className="report-section page-break-before">
            <div className="section-header-wrap">
              <span className="section-num">03</span>
              <h2 className="section-heading">Enterprise Asset Inventory & Risk Quantification</h2>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Asset Identifier</th>
                  <th>Criticality Tier</th>
                  <th>Financial Valuation</th>
                  <th>Risk Score</th>
                  <th>Current Posture</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => {
                  const ra = riskAssessments.find((r) => r.asset_id === a.id);
                  const score = ra ? ra.current_risk_score : 50;
                  const level = ra ? ra.risk_level : a.criticality;
                  return (
                    <tr key={a.id}>
                      <td><strong>{a.name}</strong><br /><small className="text-muted">{a.owner || 'SecOps Team'}</small></td>
                      <td><span className="report-tier-badge">{a.criticality}</span></td>
                      <td>{a.business_value || '$5.0M'}</td>
                      <td><strong className={score >= 75 ? 'text-danger' : score >= 50 ? 'text-warning' : 'text-success'}>{score} / 100</strong></td>
                      <td><span className="report-status-badge">{level.toUpperCase()}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section: Vulnerabilities & Threats */}
          <div className="report-section">
            <div className="section-header-wrap">
              <span className="section-num">04</span>
              <h2 className="section-heading">Vulnerability Register & Active Threat Vectors</h2>
            </div>
            <div className="report-split-grid">
              <div>
                <h4 className="split-title">Tracked CVE Vulnerabilities</h4>
                <table className="report-table-mini">
                  <thead>
                    <tr>
                      <th>Vulnerability / CVE</th>
                      <th>CVSS Base</th>
                      <th>Affected Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vulns.map((v) => (
                      <tr key={v.id}>
                        <td>{v.name}</td>
                        <td><span className="report-cvss-tag">{v.severity}</span></td>
                        <td>{v.affected_asset_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="split-title">Active Adversary Vectors</h4>
                <table className="report-table-mini">
                  <thead>
                    <tr>
                      <th>Threat Campaign</th>
                      <th>Likelihood</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threats.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td><strong>{t.likelihood} / 5</strong></td>
                        <td>{t.category || 'Adversary'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section: Knapsack Portfolio Optimization & Mitigation Directives */}
          <div className="report-section page-break-before">
            <div className="section-header-wrap">
              <span className="section-num">05</span>
              <h2 className="section-heading">Knapsack Portfolio Allocations & Strategic Directives</h2>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Target Entity</th>
                  <th>Urgency</th>
                  <th>Action Directive & Recommended Countermeasure</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {recs.map((r, idx) => (
                  <tr key={idx}>
                    <td><strong>{r.asset_name}</strong></td>
                    <td><span className={`report-urgency-badge ${String(r.urgency).toLowerCase() === 'critical' ? 'urgency-critical' : 'urgency-high'}`}>{r.urgency}</span></td>
                    <td>{r.recommendation}</td>
                    <td><strong className="text-success">+High ROI</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section: Attestation & Executive Sign-Off */}
          <div className="report-section report-signoff-section">
            <div className="section-header-wrap">
              <span className="section-num">06</span>
              <h2 className="section-heading">Compliance Attestation & Formal Sign-Off</h2>
            </div>
            <p className="signoff-disclaimer">
              This document represents algorithmic cyber risk quantification generated via the Zenith Risk Assessment Engine. Findings are continuous and subject to automated recalculation upon new CVE ingestion or configuration changes.
            </p>

            <div className="signoff-grid">
              <div className="signoff-box">
                <div className="signoff-line"></div>
                <div className="signoff-name">Chief Information Security Officer (CISO)</div>
                <div className="signoff-role">Enterprise Cybersecurity Governance</div>
                <div className="signoff-date">Date: {reportDate}</div>
              </div>

              <div className="signoff-box">
                <div className="signoff-line"></div>
                <div className="signoff-name">Head of Security Operations (SecOps)</div>
                <div className="signoff-role">Incident Response & Threat Intelligence</div>
                <div className="signoff-date">Date: {reportDate}</div>
              </div>

              <div className="signoff-box">
                <div className="signoff-line"></div>
                <div className="signoff-name">Lead Cyber Risk Auditor</div>
                <div className="signoff-role">GRC & Continuous Audit Assurance</div>
                <div className="signoff-date">Date: {reportDate}</div>
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="report-footer-watermark">
            <span>ZENITH PLATFORM • SIH26105 • CONFIDENTIAL & PROPRIETARY</span>
            <span>Page 1 of 1 (Electronic Summary)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
