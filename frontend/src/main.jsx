import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LandingPage from './LandingPage';
import HowItWorksPage from './HowItWorksPage';
import RiskHeatmap from './RiskHeatmap';
import VisualAnalytics from './VisualAnalytics';

// High-fidelity fallback dataset for cyber risk quantification
const FALLBACK_DATA = {
  assets: [
    { id: 1, name: 'Core Banking API Gateway', criticality: 'CRITICAL', business_value: '$12.5M', owner: 'Infrastructure' },
    { id: 2, name: 'Customer Identity & Auth DB', criticality: 'HIGH', business_value: '$8.2M', owner: 'SecOps' },
    { id: 3, name: 'Swift Payment Processing', criticality: 'CRITICAL', business_value: '$25.0M', owner: 'Payments Team' },
    { id: 4, name: 'Public Web Portal & CDN', criticality: 'MEDIUM', business_value: '$3.1M', owner: 'Frontend Team' },
    { id: 5, name: 'Internal HR & Payroll System', criticality: 'LOW', business_value: '$1.4M', owner: 'Enterprise IT' }
  ],
  vulns: [
    { id: 1, name: 'Log4Shell in Microservice Broker', severity: 9.8, affected_asset_id: 'Core Banking API Gateway', status: 'Active' },
    { id: 2, name: 'Outdated TLS 1.1 Support', severity: 6.5, affected_asset_id: 'Public Web Portal & CDN', status: 'Mitigated' },
    { id: 3, name: 'SQL Injection in Legacy Reporting', severity: 8.4, affected_asset_id: 'Customer Identity & Auth DB', status: 'In Review' },
    { id: 4, name: 'Permissive IAM Role Policies', severity: 7.2, affected_asset_id: 'Swift Payment Processing', status: 'Active' }
  ],
  threats: [
    { id: 1, name: 'Advanced Ransomware Campaign (FIN7)', likelihood: 4, impact: 5, category: 'Malware' },
    { id: 2, name: 'Credential Stuffing on Auth Endpoint', likelihood: 5, impact: 4, category: 'Identity' },
    { id: 3, name: 'Distributed Denial of Service (DDoS)', likelihood: 3, impact: 4, category: 'Network' },
    { id: 4, name: 'Insider Data Exfiltration', likelihood: 2, impact: 5, category: 'Internal' }
  ],
  controls: [
    { id: 1, name: 'Cloud Native WAF & Rate Limiting', effectiveness: 9, cost: 12000, target_asset_id: 'Core Banking API Gateway' },
    { id: 2, name: 'Zero-Trust Multi-Factor Authentication', effectiveness: 8, cost: 18500, target_asset_id: 'Customer Identity & Auth DB' },
    { id: 3, name: 'Automated EDR & Threat Hunting', effectiveness: 9, cost: 24000, target_asset_id: 'Swift Payment Processing' },
    { id: 4, name: 'Continuous Static & Dynamic Code Scanning', effectiveness: 7, cost: 9500, target_asset_id: 'Public Web Portal & CDN' }
  ],
  riskAssessments: [
    { id: 1, asset_id: 1, current_risk_score: 88, risk_level: 'critical', trend: '+4%' },
    { id: 2, asset_id: 2, current_risk_score: 74, risk_level: 'high', trend: '-2%' },
    { id: 3, asset_id: 3, current_risk_score: 92, risk_level: 'critical', trend: '+8%' },
    { id: 4, asset_id: 4, current_risk_score: 48, risk_level: 'medium', trend: '0%' },
    { id: 5, asset_id: 5, current_risk_score: 22, risk_level: 'low', trend: '-10%' }
  ],
  invOpts: [
    { id: 1, name: 'Deploy Zero-Trust Micro-segmentation', cost: 18000, roi: '+38% Risk Reduction', selected: true },
    { id: 2, name: 'Next-Gen Endpoint Detection (EDR)', cost: 15000, roi: '+29% Risk Reduction', selected: true },
    { id: 3, name: 'API Security Posture Management', cost: 12000, roi: '+22% Risk Reduction', selected: false },
    { id: 4, name: 'Automated Compliance Auditor', cost: 8000, roi: '+14% Risk Reduction', selected: true }
  ],
  scenarios: [
    { id: 1, name: 'Targeted Ransomware Outbreak', risk_before: 92, risk_after: 38, cost: '$42,000', risk_reduction: '58.7%' },
    { id: 2, name: 'Major DDoS Attack on API Gateway', risk_before: 85, risk_after: 29, cost: '$18,000', risk_reduction: '65.8%' },
    { id: 3, name: 'Supply Chain Component Compromise', risk_before: 78, risk_after: 45, cost: '$27,500', risk_reduction: '42.3%' }
  ],
  recs: [
    { asset_id: 1, asset_name: 'Core Banking API Gateway', risk_level: 'Critical', urgency: 'Critical', recommendation: 'Upgrade WAF to layer 7 deep packet inspection and patch broker vulnerability immediately.' },
    { asset_id: 3, asset_name: 'Swift Payment Processing', risk_level: 'Critical', urgency: 'High', recommendation: 'Enforce hardware security module (HSM) key rotation and isolate network segments.' },
    { asset_id: 2, asset_name: 'Customer Identity & Auth DB', risk_level: 'High', urgency: 'Medium', recommendation: 'Apply database parameterization and enable automated suspicious login alerting.' },
    { asset_id: 4, asset_name: 'Public Web Portal & CDN', risk_level: 'Medium', urgency: 'Low', recommendation: 'Deprecate legacy TLS protocols across edge nodes.' }
  ]
};

function getBadgeClass(level) {
  if (!level) return 'badge-low';
  const l = String(level).toLowerCase();
  if (l === 'critical') return 'badge-critical';
  if (l === 'high') return 'badge-high';
  if (l === 'medium') return 'badge-medium';
  return 'badge-low';
}

function parseHash(hash) {
  const clean = (hash || '').replace('#', '').toLowerCase();
  if (clean === 'home' || clean === 'landing') return { page: 'landing', tab: 'overview' };
  if (clean === 'how-it-works' || clean === 'help' || clean === 'docs') return { page: 'how-it-works', tab: 'overview' };
  
  // Dashboard hashes
  if (clean === 'heatmap' || clean === 'matrix') return { page: 'dashboard', tab: 'matrix' };
  if (clean === 'vuln' || clean === 'vulns' || clean === 'vulnerabilities') return { page: 'dashboard', tab: 'vulns' };
  if (clean === 'assets' || clean === 'asset') return { page: 'dashboard', tab: 'assets' };
  if (clean === 'threat' || clean === 'threats') return { page: 'dashboard', tab: 'threats' };
  if (clean === 'ctrl' || clean === 'controls') return { page: 'dashboard', tab: 'controls' };
  if (clean === 'invest' || clean === 'optimizer') return { page: 'dashboard', tab: 'invest' };
  if (clean === 'scenario' || clean === 'scenarios') return { page: 'dashboard', tab: 'scenarios' };
  if (clean === 'rec' || clean === 'recommendations') return { page: 'dashboard', tab: 'recommendations' };
  if (clean === 'dashboard' || clean === 'risk') return { page: 'dashboard', tab: 'overview' };

  // Default to landing page if no hash or unrecognized
  return { page: 'landing', tab: 'overview' };
}

function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [viewMode, setViewMode] = useState('all'); // 'all' (single page scroll) vs 'tabbed'
  const [state, setState] = useState(FALLBACK_DATA);
  const [budget, setBudget] = useState(50000);
  const [selectedInvestments, setSelectedInvestments] = useState({ 1: true, 2: true, 4: true });
  const [backendOnline, setBackendOnline] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setRoute(parsed);
      const targetId = window.location.hash.replace('#', '');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch telemetry from port 8001 or 8000
  useEffect(() => {
    async function fetchData() {
      try {
        let workingBase = null;
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (!isLocalhost) {
          // In production (Vercel), use relative path
          try {
            const prodRes = await fetch('/api/v1/assets', { signal: AbortSignal.timeout(2000) });
            if (prodRes.ok) {
              workingBase = '';
            }
          } catch (e) {}
        }

        if (workingBase === null && isLocalhost) {
          const ports = ['8001', '8000'];
          for (const p of ports) {
            try {
              const testRes = await fetch(`http://127.0.0.1:${p}/api/v1/assets`, { signal: AbortSignal.timeout(1200) });
              if (testRes.ok) {
                workingBase = `http://127.0.0.1:${p}`;
                break;
              }
            } catch (e) {}
          }
        }

        if (workingBase) {
          const [assets, vulns, threats, controls, riskAssessments, invOpts, scenarios, recs] = await Promise.all([
            fetch(`${workingBase}/api/v1/assets`).then(r => r.json()).catch(() => FALLBACK_DATA.assets),
            fetch(`${workingBase}/api/v1/vulnerabilities`).then(r => r.json()).catch(() => FALLBACK_DATA.vulns),
            fetch(`${workingBase}/api/v1/threats`).then(r => r.json()).catch(() => FALLBACK_DATA.threats),
            fetch(`${workingBase}/api/v1/controls`).then(r => r.json()).catch(() => FALLBACK_DATA.controls),
            fetch(`${workingBase}/api/v1/risk-assessments`).then(r => r.json()).catch(() => FALLBACK_DATA.riskAssessments),
            fetch(`${workingBase}/api/v1/investment-options`).then(r => r.json()).catch(() => FALLBACK_DATA.invOpts),
            fetch(`${workingBase}/api/v1/scenarios`).then(r => r.json()).catch(() => FALLBACK_DATA.scenarios),
            fetch(`${workingBase}/api/v1/recommendations/prioritized`).then(r => r.json()).catch(() => FALLBACK_DATA.recs)
          ]);

          setState({
            assets: Array.isArray(assets) && assets.length ? assets : FALLBACK_DATA.assets,
            vulns: Array.isArray(vulns) && vulns.length ? vulns : FALLBACK_DATA.vulns,
            threats: Array.isArray(threats) && threats.length ? threats : FALLBACK_DATA.threats,
            controls: Array.isArray(controls) && controls.length ? controls : FALLBACK_DATA.controls,
            riskAssessments: Array.isArray(riskAssessments) && riskAssessments.length ? riskAssessments : FALLBACK_DATA.riskAssessments,
            invOpts: Array.isArray(invOpts) && invOpts.length ? invOpts : FALLBACK_DATA.invOpts,
            scenarios: Array.isArray(scenarios) && scenarios.length ? scenarios : FALLBACK_DATA.scenarios,
            recs: Array.isArray(recs) && recs.length ? recs : FALLBACK_DATA.recs
          });
          setBackendOnline(true);
        }
      } catch (err) {
        console.warn('Backend connection notice:', err);
      }
    }
    fetchData();
  }, []);

  const navigateTo = (pageName, tabKey = 'overview', hashAnchor = '') => {
    setRoute({ page: pageName, tab: tabKey });
    const h = hashAnchor || (pageName === 'dashboard' ? (tabKey === 'overview' ? 'dashboard' : tabKey) : pageName);
    window.location.hash = h;
    if (hashAnchor) {
      setTimeout(() => {
        const el = document.getElementById(hashAnchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const toggleInvestment = (id) => {
    setSelectedInvestments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalInvestmentCost = state.invOpts.reduce((acc, opt) => {
    return selectedInvestments[opt.id] ? acc + (opt.cost || 0) : acc;
  }, 0);

  const riskLevelMap = {};
  state.riskAssessments.forEach(ra => {
    riskLevelMap[ra.asset_id] = ra.risk_level;
  });

  const shouldShowSection = (tabName) => {
    if (viewMode === 'all') return true;
    return route.tab === tabName;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation Header */}
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--stone-100)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Logo & Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => navigateTo('landing')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--rose-600) 0%, var(--rose-800) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              fontWeight: 700,
              fontSize: '1.25rem',
              boxShadow: '0 8px 18px rgba(225, 29, 63, 0.35)'
            }}>
              Z
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--neutral-950)', letterSpacing: '-0.02em' }}>
                  ZENITH
                </span>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--stone-50)',
                  color: 'var(--rose-700)',
                  border: '1px solid var(--stone-100)'
                }}>
                  SIH26105
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--stone-700)' }}>
                Cyber Risk & Investment Platform
              </span>
            </div>
          </div>

          {/* Primary Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigateTo('landing')}
              style={{
                background: route.page === 'landing' ? 'var(--stone-50)' : 'transparent',
                color: route.page === 'landing' ? 'var(--rose-600)' : 'var(--stone-700)',
                border: route.page === 'landing' ? '1px solid var(--stone-100)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              style={{
                background: route.page === 'dashboard' ? 'var(--stone-50)' : 'transparent',
                color: route.page === 'dashboard' ? 'var(--rose-600)' : 'var(--stone-700)',
                border: route.page === 'dashboard' ? '1px solid var(--stone-100)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Live Dashboard
            </button>
            <button
              onClick={() => navigateTo('how-it-works')}
              style={{
                background: route.page === 'how-it-works' ? 'var(--stone-50)' : 'transparent',
                color: route.page === 'how-it-works' ? 'var(--rose-600)' : 'var(--stone-700)',
                border: route.page === 'how-it-works' ? '1px solid var(--stone-100)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              How It Works & Docs
            </button>
          </nav>

          {/* Telemetry Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: backendOnline ? '#ecfdf5' : 'var(--stone-50)',
            border: `1px solid ${backendOnline ? '#a7f3d0' : 'var(--stone-100)'}`,
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: backendOnline ? '#047857' : 'var(--rose-800)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendOnline ? '#10b981' : 'var(--rose-600)',
              boxShadow: backendOnline ? '0 0 8px #10b981' : '0 0 8px var(--rose-600)'
            }}></span>
            {backendOnline ? 'Backend Online (8001)' : 'Live Demo Data'}
          </div>
        </div>

        {/* Dashboard Sub-Tabs (shown only when in Dashboard page) */}
        {route.page === 'dashboard' && (
          <div style={{
            background: 'var(--white)',
            borderTop: '1px solid var(--stone-100)',
            padding: '0 24px'
          }}>
            <div style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              overflowX: 'auto'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { hash: 'matrix', key: 'matrix', label: '5×5 Risk Matrix' },
                  { hash: 'assets', key: 'assets', label: 'Assets' },
                  { hash: 'vuln', key: 'vulns', label: 'Vulnerabilities' },
                  { hash: 'threat', key: 'threats', label: 'Threats' },
                  { hash: 'ctrl', key: 'controls', label: 'Controls' },
                  { hash: 'risk', key: 'overview', label: 'Risk Scoring' },
                  { hash: 'invest', key: 'invest', label: 'Investment Optimizer' },
                  { hash: 'scenario', key: 'scenarios', label: 'Scenarios' },
                  { hash: 'rec', key: 'recommendations', label: 'Recommendations' }
                ].map(item => {
                  const isCurrent = route.tab === item.key;
                  return (
                    <a
                      key={item.hash}
                      href={`#${item.hash}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('dashboard', item.key, item.hash);
                      }}
                      style={{
                        padding: '10px 14px',
                        background: 'transparent',
                        textDecoration: 'none',
                        borderBottom: isCurrent ? '3px solid var(--rose-600)' : '3px solid transparent',
                        color: isCurrent ? 'var(--rose-600)' : 'var(--stone-700)',
                        fontWeight: isCurrent ? 600 : 500,
                        fontSize: '0.84rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* View Toggle */}
              <div style={{
                background: 'var(--stone-50)',
                border: '1px solid var(--stone-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '2px',
                display: 'flex',
                flexShrink: 0
              }}>
                <button
                  onClick={() => setViewMode('all')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-default)',
                    border: 'none',
                    background: viewMode === 'all' ? 'var(--white)' : 'transparent',
                    color: viewMode === 'all' ? 'var(--rose-600)' : 'var(--stone-700)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  All Sections
                </button>
                <button
                  onClick={() => setViewMode('tabbed')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-default)',
                    border: 'none',
                    background: viewMode === 'tabbed' ? 'var(--white)' : 'transparent',
                    color: viewMode === 'tabbed' ? 'var(--rose-600)' : 'var(--stone-700)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Tabbed View
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* PAGE 1: LANDING PAGE */}
      {route.page === 'landing' && (
        <LandingPage onNavigate={(p) => navigateTo(p)} />
      )}

      {/* PAGE 2: HOW IT WORKS / HELP PAGE */}
      {route.page === 'how-it-works' && (
        <HowItWorksPage onNavigate={(p) => navigateTo(p)} />
      )}

      {/* PAGE 3: DASHBOARD */}
      {route.page === 'dashboard' && (
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%', flex: 1 }}>
          {/* KPI Metrics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--stone-700)', textTransform: 'uppercase' }}>
                  Monitored Assets
                </span>
                <span style={{ color: 'var(--rose-600)', background: 'var(--stone-50)', padding: '6px', borderRadius: 'var(--radius-lg)' }}>
                  🛡️
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--neutral-950)', marginTop: '8px' }}>
                {state.assets.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', marginTop: '4px' }}>
                Across {state.assets.filter(a => a.criticality === 'CRITICAL').length} Critical Tier Systems
              </div>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--stone-700)', textTransform: 'uppercase' }}>
                  Active Vulnerabilities
                </span>
                <span style={{ color: 'var(--rose-600)', background: 'var(--stone-50)', padding: '6px', borderRadius: 'var(--radius-lg)' }}>
                  ⚠️
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--rose-600)', marginTop: '8px' }}>
                {state.vulns.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', marginTop: '4px' }}>
                {state.vulns.filter(v => v.severity >= 8.0).length} High / Critical CVSS
              </div>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--stone-700)', textTransform: 'uppercase' }}>
                  Allocated Budget
                </span>
                <span style={{ color: 'var(--rose-600)', background: 'var(--stone-50)', padding: '6px', borderRadius: 'var(--radius-lg)' }}>
                  💰
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--neutral-950)', marginTop: '8px' }}>
                ${(budget / 1000).toFixed(0)}k
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rose-700)', marginTop: '4px', fontWeight: 500 }}>
                Portfolio: ${(totalInvestmentCost / 1000).toFixed(1)}k ({((totalInvestmentCost / budget) * 100).toFixed(0)}%)
              </div>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--stone-700)', textTransform: 'uppercase' }}>
                  Threat Profiles
                </span>
                <span style={{ color: 'var(--rose-600)', background: 'var(--stone-50)', padding: '6px', borderRadius: 'var(--radius-lg)' }}>
                  🎯
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--neutral-950)', marginTop: '8px' }}>
                {state.threats.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', marginTop: '4px' }}>
                Simulated in Continuous Pipeline
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {/* SECTION: 5x5 RISK HEATMAP MATRIX & VISUAL ANALYTICS */}
            {(shouldShowSection('matrix') || shouldShowSection('overview')) && (
              <section id="matrix" style={{ scrollMarginTop: '130px' }}>
                <RiskHeatmap
                  assets={state.assets}
                  threats={state.threats}
                  vulns={state.vulns}
                  riskAssessments={state.riskAssessments}
                />
                <VisualAnalytics
                  assets={state.assets}
                  controls={state.controls}
                  invOpts={state.invOpts}
                  budget={budget}
                />
              </section>
            )}

            {/* SECTION: ASSETS */}
            {shouldShowSection('assets') && (
              <section id="assets" style={{ scrollMarginTop: '130px' }}>
                <div className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Enterprise Asset Inventory & Risk Posture</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                        Real-time risk scoring, criticality ranking, and ownership metrics.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {state.assets.map(asset => {
                      const ra = state.riskAssessments.find(r => r.asset_id === asset.id);
                      const rl = ra ? ra.risk_level : (riskLevelMap[asset.id] || 'Low');
                      const score = ra ? ra.current_risk_score : 45;

                      return (
                        <div key={asset.id} style={{
                          background: 'var(--white)',
                          border: '1px solid var(--stone-100)',
                          borderRadius: 'var(--radius-xl)',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: 'var(--shadow-xs)'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                              <h3 style={{ fontSize: '1rem', color: 'var(--neutral-950)', fontWeight: 600 }}>{asset.name}</h3>
                              <span className={`badge ${getBadgeClass(rl)}`}>{rl}</span>
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '6px' }}>
                              Owner: {asset.owner || 'SecOps Team'} • Value: {asset.business_value || '$5.0M'}
                            </p>
                          </div>

                          <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--stone-700)', fontWeight: 500 }}>Risk Score</span>
                              <span style={{ fontWeight: 700, color: 'var(--rose-700)' }}>{score}/100</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--stone-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                              <div style={{
                                width: `${score}%`,
                                height: '100%',
                                background: score > 75
                                  ? 'linear-gradient(90deg, var(--rose-400), var(--rose-600))'
                                  : 'linear-gradient(90deg, var(--rose-300), var(--rose-400))',
                                borderRadius: 'var(--radius-full)'
                              }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <button
                              className="btn-outline"
                              style={{ flex: 1, padding: '6px 10px', fontSize: '0.8125rem' }}
                              onClick={() => navigateTo('dashboard', 'recommendations', 'rec')}
                            >
                              Mitigate
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ flex: 1, padding: '6px 10px', fontSize: '0.8125rem' }}
                              onClick={() => navigateTo('dashboard', 'scenarios', 'scenario')}
                            >
                              Simulate
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* SECTION: VULNERABILITIES */}
            {shouldShowSection('vulns') && (
              <section id="vuln" style={{ scrollMarginTop: '130px' }}>
                <div id="vulns" className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Vulnerability Register & CVE Tracking</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                        Identified security flaws, severity ratings, and target systems.
                      </p>
                    </div>
                    <span className="badge badge-high">{state.vulns.length} Active Flaws</span>
                  </div>

                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Vulnerability Name</th>
                        <th>CVSS Base Score</th>
                        <th>Affected Asset</th>
                        <th>Remediation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.vulns.map(v => (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 600 }}>{v.name}</td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-default)',
                              background: v.severity >= 9 ? 'var(--rose-950)' : (v.severity >= 7 ? 'var(--rose-600)' : 'var(--stone-100)'),
                              color: v.severity >= 7 ? 'var(--white)' : 'var(--rose-900)',
                              fontWeight: 700,
                              fontFamily: 'var(--mono)',
                              fontSize: '0.8125rem'
                            }}>
                              {v.severity}
                            </span>
                          </td>
                          <td>{v.affected_asset_id}</td>
                          <td>
                            <span className="badge badge-medium">{v.status || 'Active'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION: THREATS */}
            {shouldShowSection('threats') && (
              <section id="threat" style={{ scrollMarginTop: '130px' }}>
                <div id="threats" className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Threat Matrix Intelligence</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                      Adversary campaign likelihood, attack surfaces, and impact scoring.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
                    {state.threats.map(t => (
                      <div key={t.id} style={{
                        background: 'var(--stone-50)',
                        border: '1px solid var(--stone-100)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '20px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{t.name}</h3>
                          <span className="badge badge-high">{t.category || 'Threat'}</span>
                        </div>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                          <span style={{ color: 'var(--stone-700)' }}>Likelihood Score:</span>
                          <span style={{ fontWeight: 600, color: 'var(--rose-700)' }}>{t.likelihood}/5</span>
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                          <span style={{ color: 'var(--stone-700)' }}>Business Impact:</span>
                          <span style={{ fontWeight: 600, color: 'var(--rose-900)' }}>{t.impact || 4}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SECTION: CONTROLS */}
            {shouldShowSection('controls') && (
              <section id="ctrl" style={{ scrollMarginTop: '130px' }}>
                <div id="controls" className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Defensive Security Safeguards</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                      Active security controls and efficiency assessment.
                    </p>
                  </div>

                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Control Mechanism</th>
                        <th>Effectiveness</th>
                        <th>Annual Cost</th>
                        <th>Protected Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.controls.map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#047857' }}>{c.effectiveness}/10</span>
                          </td>
                          <td style={{ fontFamily: 'var(--mono)' }}>${(c.cost || 0).toLocaleString()}</td>
                          <td>{c.target_asset_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION: RISK ASSESSMENTS */}
            {shouldShowSection('overview') && (
              <section id="risk" style={{ scrollMarginTop: '130px' }}>
                <div className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Risk Assessment Breakdown</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                      Normalized risk indicators and risk movement telemetry.
                    </p>
                  </div>

                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Asset Entity</th>
                        <th>Current Risk Score</th>
                        <th>Risk Level</th>
                        <th>Quarterly Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.riskAssessments.map(ra => {
                        const asset = state.assets.find(a => a.id === ra.asset_id);
                        return (
                          <tr key={ra.id}>
                            <td style={{ fontWeight: 600 }}>{asset ? asset.name : `Asset #${ra.asset_id}`}</td>
                            <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{ra.current_risk_score}</td>
                            <td>
                              <span className={`badge ${getBadgeClass(ra.risk_level)}`}>
                                {ra.risk_level}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--mono)', color: ra.trend?.startsWith('+') ? 'var(--rose-700)' : '#047857' }}>
                              {ra.trend || '0%'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION: INVESTMENT OPTIMIZER */}
            {shouldShowSection('invest') && (
              <section id="invest" style={{ scrollMarginTop: '130px' }}>
                <div className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem' }}>Security Portfolio Knapsack Optimizer</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                        Calculate optimal security spend allocations to maximize risk reduction ROI.
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Total Budget:</span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--stone-100)',
                          fontFamily: 'var(--mono)',
                          fontSize: '0.875rem',
                          width: '120px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Summary Banner */}
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-xl)',
                    background: totalInvestmentCost <= budget ? 'var(--stone-50)' : '#fff1f2',
                    border: `1px solid ${totalInvestmentCost <= budget ? 'var(--stone-100)' : '#fecdd3'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Selected Portfolio Spend
                      </span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: totalInvestmentCost <= budget ? 'var(--rose-800)' : 'var(--red-600)' }}>
                        ${totalInvestmentCost.toLocaleString()} / ${budget.toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        let rem = budget;
                        const newSel = {};
                        state.invOpts.forEach(o => {
                          if (o.cost <= rem) {
                            newSel[o.id] = true;
                            rem -= o.cost;
                          }
                        });
                        setSelectedInvestments(newSel);
                      }}
                    >
                      ⚡ Auto-Allocate Highest ROI
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
                    {state.invOpts.map(opt => {
                      const isSelected = !!selectedInvestments[opt.id];
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleInvestment(opt.id)}
                          style={{
                            padding: '20px',
                            borderRadius: 'var(--radius-xl)',
                            border: isSelected ? '2px solid var(--rose-600)' : '1px solid var(--stone-100)',
                            background: isSelected ? 'var(--stone-50)' : 'var(--white)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 10px 25px -10px rgba(225, 29, 63, 0.25)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? '6px solid var(--rose-600)' : '2px solid var(--stone-700)',
                              background: 'var(--white)'
                            }}></span>
                            <span className="badge badge-low">{opt.roi || '+25% ROI'}</span>
                          </div>
                          <h3 style={{ fontSize: '0.9375rem', marginTop: '12px', fontWeight: 600 }}>{opt.name}</h3>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rose-700)', marginTop: '8px', fontFamily: 'var(--mono)' }}>
                            ${(opt.cost || 0).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* SECTION: SCENARIOS */}
            {shouldShowSection('scenarios') && (
              <section id="scenario" style={{ scrollMarginTop: '130px' }}>
                <div id="scenarios" className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Scenario Analysis & Stress Testing</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                      Simulated outcome modeling comparing pre and post mitigation risk states.
                    </p>
                  </div>

                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Attack Scenario</th>
                        <th>Pre-Mitigation Risk</th>
                        <th>Post-Mitigation Risk</th>
                        <th>Mitigation Cost</th>
                        <th>Risk Reduction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.scenarios.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          <td>
                            <span style={{ color: 'var(--rose-700)', fontWeight: 700 }}>{s.risk_before}</span>
                          </td>
                          <td>
                            <span style={{ color: '#047857', fontWeight: 700 }}>{s.risk_after}</span>
                          </td>
                          <td style={{ fontFamily: 'var(--mono)' }}>{s.cost}</td>
                          <td>
                            <span className="badge badge-low">{s.risk_reduction}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION: RECOMMENDATIONS */}
            {shouldShowSection('recommendations') && (
              <section id="rec" style={{ scrollMarginTop: '130px' }}>
                <div id="recommendations" className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--neutral-950)' }}>Prioritized Security Recommendations</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '2px' }}>
                      Engine-recommended steps prioritized according to risk exposure and urgency.
                    </p>
                  </div>

                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Asset Entity</th>
                        <th>Risk Level</th>
                        <th>Urgency</th>
                        <th>Recommended Mitigation Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.recs.map((r, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{r.asset_name}</td>
                          <td>
                            <span className={`badge ${getBadgeClass(r.risk_level)}`}>
                              {r.risk_level}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getBadgeClass(r.urgency)}`}>
                              {r.urgency}
                            </span>
                          </td>
                          <td style={{ color: 'var(--neutral-950)', fontSize: '0.84rem' }}>{r.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </main>
      )}

      {/* Global Footer */}
      <footer style={{
        borderTop: '1px solid var(--stone-100)',
        background: 'var(--white)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--stone-700)'
      }}>
        <div>Zenith Cyber Risk Quantification & Defense Platform • SIH26105</div>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));