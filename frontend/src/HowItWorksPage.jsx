import React, { useState } from 'react';

export default function HowItWorksPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState({ 0: true });

  const toggleFaq = (idx) => {
    setOpenFaq(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const steps = [
    {
      num: 1,
      title: 'Enterprise Asset Ingestion & Lifecycle CRUD',
      desc: 'Zenith maps digital infrastructure across hybrid environments, tracking valuation, assigned SecOps business process ownership, and criticality tiers (Critical, High, Medium, Low) with real-time API sync.'
    },
    {
      num: 2,
      title: 'Threat Matrix & Multi-Source CVE Correlation',
      desc: 'Active CVE vulnerabilities with CVSS v3.1 base ratings are correlated with adversary threat campaign profiles (likelihood, attack surfaces, MITRE ATT&CK tactics) to quantify real-world exploitability.'
    },
    {
      num: 3,
      title: 'Continuous FAIR-Inspired Risk Engine & 5x5 Heatmap',
      desc: 'Calculates continuous 0-100 risk scores per asset by multiplying severity, threat likelihood, and asset criticality, attenuated by active defensive controls and placed on an interactive 5x5 Matrix.'
    },
    {
      num: 4,
      title: '0/1 Knapsack Portfolio Investment Optimization',
      desc: 'Utilizes a dynamic programming Knapsack algorithm to determine the mathematically optimal combination of security safeguards that maximizes risk reduction ROI within strict budget constraints.'
    },
    {
      num: 5,
      title: 'Live Zero-Day Incident Simulation & 3D Telemetry',
      desc: 'Injects live attack scenarios (Log4Shell, FIN7 Ransomware, Layer-7 DDoS, Insider Exfiltration) streaming real-time telemetry spikes and rendering 3D parabolic laser trajectories with auto-mitigation.'
    },
    {
      num: 6,
      title: 'One-Click Executive PDF & GRC Compliance Export',
      desc: 'Generates board-ready audit briefings (PDF / JSON / CSV) with regulatory standard mappings (NIST CSF 2.0, ISO 27001, SOC 2 Type II, CIS Controls) and formal multi-stakeholder CISO sign-off blocks.'
    }
  ];

  const faqs = [
    {
      q: 'How does Zenith quantify cyber risk into a defensible 0-100 score?',
      a: 'Zenith uses a multi-factor formula inspired by the FAIR (Factor Analysis of Information Risk) framework. It combines Asset Criticality (weight), Vulnerability Severity (CVSS v3.1), and Threat Likelihood (1-5 scale), discounted by existing defensive Control Effectiveness.'
    },
    {
      q: 'What is the Knapsack Optimization algorithm and why is it used?',
      a: 'Security budgets are finite. Rather than randomly purchasing tools, the 0/1 Knapsack optimizer calculates the exact combination of security controls (WAF, Zero-Trust, EDR, IAM) that delivers the maximum total risk reduction percentage without exceeding your specified budget cap.'
    },
    {
      q: 'How does the Executive Audit PDF and GRC Export work?',
      a: 'Clicking "Executive Audit PDF" generates an A4 boardroom-ready briefing including KPI scorecards, risk matrices, budget ROI, NIST CSF 2.0/ISO 27001 compliance mappings, and CISO attestation signatures. You can Print/Save as PDF, download raw JSON compliance evidence, or export CSV spreadsheets.'
    },
    {
      q: 'How does the Live Zero-Day Incident Simulation Sandbox operate?',
      a: 'The simulation sandbox streams simulated adversary telemetry signals, surging asset risk scores in real-time, shifting quadrant coordinates on the 5x5 Risk Heatmap, and computing instantaneous Knapsack auto-containment strategies with one-click countermeasure deployment.'
    },
    {
      q: 'How do I resolve backend port conflicts (Port 8000 vs 8001)?',
      a: 'If another process is using port 8000 on Windows, run the backend on port 8001: "python -m uvicorn zenith_backend.main:app --reload --port 8001". The frontend automatically probes both ports 8001 and 8000.'
    },
    {
      q: 'How can I integrate Zenith with our existing SIEM or vulnerability scanners?',
      a: 'Zenith provides standard RESTful endpoints under /api/v1/ (Assets, Vulnerabilities, Threats, Controls). You can push findings from scanners like Nessus, Qualys, or Snyk directly via POST/PUT requests.'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--stone-50)',
          border: '1px solid var(--stone-100)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--rose-700)',
          marginBottom: '16px'
        }}>
          Architecture & Methodology Guide
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--neutral-950)' }}>
          How <span className="text-gradient">Zenith</span> Works
        </h1>
        <p style={{ color: 'var(--stone-700)', maxWidth: '680px', margin: '12px auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
          A technical walkthrough of our quantitative risk scoring models, knapsack optimization algorithms, and automated defense pipelines.
        </p>
      </div>

      {/* 5-Stage Workflow Pipeline */}
      <div className="card-glass" style={{ padding: '36px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>End-to-End Quantification Pipeline</h2>
        <p style={{ color: 'var(--stone-700)', fontSize: '0.875rem', marginBottom: '32px' }}>
          From raw vulnerability feeds to executive capital allocation decisions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((step) => (
            <div key={step.num} style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--stone-50)',
              border: '1px solid var(--stone-100)'
            }}>
              <div className="step-number">{step.num}</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--neutral-950)', marginBottom: '6px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {/* Math Card 1 */}
        <div className="card-glass" style={{ padding: '32px' }}>
          <span className="badge badge-high" style={{ marginBottom: '12px' }}>Quantitative Scoring Model</span>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Asset Risk Score Equation</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginBottom: '16px' }}>
            Combines normalized threat likelihood, vulnerability severity, and defensive control mitigation:
          </p>
          <div className="formula-card">
            <code>
              Risk(A) = Criticality(A) × Σ [ CVSS(v) × Likelihood(t) ] × [ 1 - Efficiency(C) ]
            </code>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '14px' }}>
            • <strong>Criticality</strong>: Weight factor [1.0 (Low) to 3.0 (Critical)]<br />
            • <strong>Efficiency(C)</strong>: Attenuation coefficient of active controls [0.0 to 0.95]
          </p>
        </div>

        {/* Math Card 2 */}
        <div className="card-glass" style={{ padding: '32px' }}>
          <span className="badge badge-low" style={{ marginBottom: '12px' }}>Budget Optimization Algorithm</span>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>0/1 Knapsack Optimization</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginBottom: '16px' }}>
            Maximizes the sum of security ROI across discrete controls subject to financial constraints:
          </p>
          <div className="formula-card">
            <code>
              Maximize: Σ ( RiskReduction_i · x_i )<br />
              Subject to: Σ ( Cost_i · x_i ) ≤ Budget<br />
              Where x_i ∈ {'{0, 1}'}
            </code>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '14px' }}>
            • <strong>x_i = 1</strong>: Deploy control safeguard<br />
            • <strong>x_i = 0</strong>: Defer or reject control package
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card-glass" style={{ padding: '36px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Frequently Asked Questions & Help</h2>
        <p style={{ color: 'var(--stone-700)', fontSize: '0.875rem', marginBottom: '28px' }}>
          Common questions regarding installation, model assumptions, and troubleshooting.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, i) => {
            const isOpen = !!openFaq[i];
            return (
              <div key={i} className="faq-item" onClick={() => toggleFaq(i)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--neutral-950)' }}>
                    {faq.q}
                  </h3>
                  <span style={{ fontSize: '1.25rem', color: 'var(--rose-600)', fontWeight: 700, marginLeft: '12px' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '12px', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div style={{
        textAlign: 'center',
        padding: '36px',
        borderRadius: 'var(--radius-2xl)',
        background: 'var(--stone-50)',
        border: '1px solid var(--stone-100)'
      }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Explore the Live Environment</h3>
        <p style={{ color: 'var(--stone-700)', fontSize: '0.875rem', marginBottom: '20px' }}>
          Try running optimization calculations and scenario simulations with real data.
        </p>
        <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
          Launch Interactive Dashboard →
        </button>
      </div>
    </div>
  );
}
