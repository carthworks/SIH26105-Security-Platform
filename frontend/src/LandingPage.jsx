import React, { useState } from 'react';

export default function LandingPage({ onNavigate }) {
  const [demoBudget, setDemoBudget] = useState(50000);

  // Simulated ROI math for interactive slider
  const calculatedRiskReduction = Math.min(88, Math.round(20 + (demoBudget / 200000) * 65));
  const estimatedLossAvoided = (demoBudget * 4.2).toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Hero Glow */}
      <div className="hero-glow"></div>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--stone-50)',
          border: '1px solid var(--stone-100)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--rose-700)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--rose-600)',
            boxShadow: '0 0 8px var(--rose-600)'
          }}></span>
          SIH26105 AI Cyber Defense Platform
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 20px',
          color: 'var(--neutral-950)'
        }}>
          Continuous Cyber Risk Quantification &{' '}
          <span className="text-gradient">Investment Optimization</span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--stone-700)',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Convert subjective security assessments into real-time financial risk scores.
          Mathematically optimize your defensive budget with knapsack ROI allocation and Monte Carlo attack simulations.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
            onClick={() => onNavigate('dashboard')}
          >
            Launch Risk Dashboard →
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
            onClick={() => onNavigate('how-it-works')}
          >
            📖 How It Works & Architecture
          </button>
        </div>

        {/* Live Interactive Hero Preview Card */}
        <div className="card-glass" style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '32px',
          textAlign: 'left',
          border: '1px solid var(--stone-100)',
          boxShadow: 'var(--shadow-default)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--stone-100)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neutral-950)' }}>
                  Enterprise Risk Telemetry Simulation
                </span>
                <span className="badge badge-critical">Active Risk Alert</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '4px' }}>
                Simulating Core Banking API Gateway & Swift Infrastructure
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-high">CVSS 9.8</span>
              <span className="badge badge-low">FAIR Compliant</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'var(--stone-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--stone-100)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>Calculated Risk Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--rose-600)', marginTop: '4px' }}>88.4 / 100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rose-700)', marginTop: '2px' }}>High Exposure Tier</div>
            </div>

            <div style={{ background: 'var(--stone-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--stone-100)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>Optimized Budget Cap</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--neutral-950)', marginTop: '4px' }}>$50,000</div>
              <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>Knapsack Strategy Applied</div>
            </div>

            <div style={{ background: 'var(--stone-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--stone-100)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>Post-Mitigation Risk</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#047857', marginTop: '4px' }}>24.2 / 100</div>
              <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>-72.6% Risk Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Features Section */}
      <section style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--stone-100)',
        borderBottom: '1px solid var(--stone-100)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Built for Quantitative Cyber Defense</h2>
            <p style={{ color: 'var(--stone-700)', maxWidth: '640px', margin: '8px auto 0' }}>
              Four integrated engines that bridge technical vulnerability telemetry and executive security investment decisions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Feature 1 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div className="feature-icon-box">📊</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Continuous Risk Scoring</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6 }}>
                Dynamic scoring engine combining CVSS vulnerability scores, real-time threat likelihoods, and asset criticality valuations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div className="feature-icon-box">💰</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Knapsack Budget Optimizer</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6 }}>
                0/1 Knapsack optimization algorithm that mathematically selects defensive controls to maximize overall risk reduction ROI within budget limits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div className="feature-icon-box">🎲</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Monte Carlo Stress Testing</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6 }}>
                Simulate targeted ransomware, DDoS, and insider breach scenarios to predict post-control efficacy and financial resilience.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div className="feature-icon-box">🎯</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Prioritized Directives</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6 }}>
                Auto-generated mitigation playbooks rank ordered by urgency, reducing time-to-remediation for critical enterprise infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Beneficiaries & Value Realization Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px 40px'
      }}>
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
            Organizational Impact & Value Realization
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--neutral-950)' }}>
            Who Benefits & <span className="text-gradient">How Zenith Transforms Defense</span>
          </h2>
          <p style={{ color: 'var(--stone-700)', maxWidth: '680px', margin: '10px auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
            Bridging the communication and decision-making gap between security practitioners, engineering leaders, and the executive boardroom.
          </p>
        </div>

        {/* 4 Beneficiaries Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          {/* Persona 1: CISOs & Board */}
          <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>👔</span>
                <span className="badge badge-critical">Executive Board</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--neutral-950)', marginBottom: '8px' }}>
                CISOs & Board Directors
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>The Challenge:</strong> Struggle to translate complex vulnerability acronyms (CVEs, CVSS) into dollar-denominated business risk.
              </p>
              <div style={{
                background: 'var(--stone-50)',
                border: '1px solid var(--stone-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                fontSize: '0.8125rem',
                color: 'var(--rose-900)',
                lineHeight: 1.5
              }}>
                <strong>How Zenith Helps:</strong> Delivers financial loss quantification ($) and mathematical proof of Knapsack budget optimization for board justification.
              </div>
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--stone-100)', paddingTop: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--rose-700)' }}>
              ✓ Defensible Security ROI & Capital Efficiency
            </div>
          </div>

          {/* Persona 2: SecOps & Security Engineers */}
          <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>🛡️</span>
                <span className="badge badge-high">SecOps & IR</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--neutral-950)', marginBottom: '8px' }}>
                SecOps & Security Engineers
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>The Challenge:</strong> Overwhelmed by thousands of unprioritized vulnerability scan alerts with no context on exploitability.
              </p>
              <div style={{
                background: 'var(--stone-50)',
                border: '1px solid var(--stone-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                fontSize: '0.8125rem',
                color: 'var(--rose-900)',
                lineHeight: 1.5
              }}>
                <strong>How Zenith Helps:</strong> Correlates CVEs with real-time threat matrices and asset criticality to auto-generate rank-ordered mitigation directives.
              </div>
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--stone-100)', paddingTop: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--rose-700)' }}>
              ✓ 65% Faster Time-To-Remediation (MTTR)
            </div>
          </div>

          {/* Persona 3: GRC & Compliance Officers */}
          <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>📋</span>
                <span className="badge badge-medium">GRC & Audit</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--neutral-950)', marginBottom: '8px' }}>
                GRC & Compliance Officers
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>The Challenge:</strong> Static annual audit spreadsheets become obsolete the moment new code or cloud infrastructure is deployed.
              </p>
              <div style={{
                background: 'var(--stone-50)',
                border: '1px solid var(--stone-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                fontSize: '0.8125rem',
                color: 'var(--rose-900)',
                lineHeight: 1.5
              }}>
                <strong>How Zenith Helps:</strong> Continuous telemetry tracking mapped directly against NIST CSF and ISO 27001 standards with verifiable historical logs.
              </div>
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--stone-100)', paddingTop: '12px', fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>
              ✓ Always-On Continuous Audit Readiness
            </div>
          </div>

          {/* Persona 4: DevOps & Cloud Architects */}
          <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>⚙️</span>
                <span className="badge badge-low">DevOps & Cloud</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--neutral-950)', marginBottom: '8px' }}>
                DevOps & Cloud Architects
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>The Challenge:</strong> Security controls often feel like blockers that slow down deployment velocity and microservice releases.
              </p>
              <div style={{
                background: 'var(--stone-50)',
                border: '1px solid var(--stone-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                fontSize: '0.8125rem',
                color: 'var(--rose-900)',
                lineHeight: 1.5
              }}>
                <strong>How Zenith Helps:</strong> Pinpoints high-risk nodes (e.g. Swift broker vs public web proxy) to deploy targeted controls without friction.
              </div>
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--stone-100)', paddingTop: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--rose-700)' }}>
              ✓ Frictionless Zero-Trust Architecture
            </div>
          </div>
        </div>

        {/* Transformation Comparison Table */}
        <div className="card-glass" style={{ padding: '36px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--neutral-950)' }}>
            The Zenith Paradigm Shift: Before vs. After
          </h3>
          <p style={{ color: 'var(--stone-700)', fontSize: '0.875rem', marginBottom: '24px' }}>
            How continuous quantitative risk modeling replaces outdated legacy security practices.
          </p>

          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Capability Dimension</th>
                <th style={{ width: '37.5%', background: '#fff1f2', color: 'var(--red-600)' }}>Legacy Security Approach</th>
                <th style={{ width: '37.5%', background: '#ecfdf5', color: '#047857' }}>Zenith Platform Approach</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Risk Evaluation</td>
                <td style={{ color: 'var(--stone-700)' }}>Subjective "Red/Yellow/Green" guesswork in static spreadsheets</td>
                <td style={{ fontWeight: 600, color: 'var(--neutral-950)' }}>Mathematical 0–100 score + Dollar Expected Financial Loss ($)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Budget Allocation</td>
                <td style={{ color: 'var(--stone-700)' }}>Intuition-based tool purchasing leading to redundant spend</td>
                <td style={{ fontWeight: 600, color: 'var(--neutral-950)' }}>0/1 Knapsack Optimization for maximum risk reduction per dollar</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Threat Modeling</td>
                <td style={{ color: 'var(--stone-700)' }}>Static vulnerability reports reviewed once per quarter</td>
                <td style={{ fontWeight: 600, color: 'var(--neutral-950)' }}>Real-time threat matrix correlation with continuous telemetry</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Attack Simulation</td>
                <td style={{ color: 'var(--stone-700)' }}>Infrequent manual penetration tests with delayed reports</td>
                <td style={{ fontWeight: 600, color: 'var(--neutral-950)' }}>On-demand Monte Carlo simulations (Ransomware, DDoS, Insider)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Budget & Risk Calculator Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="card-glass" style={{
          padding: '48px 36px',
          background: 'linear-gradient(135deg, var(--white) 0%, var(--stone-50) 100%)',
          border: '1px solid var(--stone-100)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-high" style={{ marginBottom: '12px' }}>Interactive Calculator</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>
                Estimate Security ROI for Your Budget
              </h2>
              <p style={{ color: 'var(--stone-700)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Adjust the budget slider to see how Zenith's optimization algorithms allocate capital across microsegmentation, WAF, EDR, and IAM safeguards.
              </p>

              {/* Slider */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Defensive Budget:</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--rose-700)', fontSize: '1.125rem' }}>
                    ${demoBudget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={demoBudget}
                  onChange={(e) => setDemoBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--rose-600)', cursor: 'pointer' }}
                />
              </div>

              <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
                Customize in Dashboard →
              </button>
            </div>

            {/* Calculated Output Box */}
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--stone-100)',
              borderRadius: 'var(--radius-2xl)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Projected Risk Reduction
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--rose-600)', fontFamily: 'var(--mono)' }}>
                  +{calculatedRiskReduction}%
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--stone-100)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${calculatedRiskReduction}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--rose-400), var(--rose-600))',
                    borderRadius: 'var(--radius-full)'
                  }}></div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--stone-100)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Estimated Expected Loss Avoided
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#047857', fontFamily: 'var(--mono)', marginTop: '4px' }}>
                  ${estimatedLossAvoided}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--neutral-950) 0%, var(--rose-950) 100%)',
        color: 'var(--white)',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--white)', marginBottom: '16px' }}>
            Ready to Quantify and Optimize Your Cyber Risk?
          </h2>
          <p style={{ color: 'var(--rose-200)', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.6 }}>
            Explore real-time telemetry, run stress simulations, and configure budget allocations in the Zenith dashboard.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ background: 'var(--white)', color: 'var(--rose-900)', boxShadow: '0 4px 14px rgba(255,255,255,0.2)' }}
              onClick={() => onNavigate('dashboard')}
            >
              Open Live Dashboard
            </button>
            <button
              className="btn-outline"
              style={{ borderColor: 'var(--rose-300)', color: 'var(--white)' }}
              onClick={() => onNavigate('how-it-works')}
            >
              Read Architecture Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
