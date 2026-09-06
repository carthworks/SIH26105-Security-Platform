import React from 'react';

export default function VisualAnalytics({ assets = [], controls = [], invOpts = [], budget = 50000 }) {
  // Compute criticality distribution
  const critCounts = {
    CRITICAL: assets.filter(a => a.criticality === 'CRITICAL').length,
    HIGH: assets.filter(a => a.criticality === 'HIGH').length,
    MEDIUM: assets.filter(a => a.criticality === 'MEDIUM').length,
    LOW: assets.filter(a => a.criticality === 'LOW').length
  };
  const totalAssets = assets.length || 1;

  // Pareto Frontier Points (Spend vs Risk Reduction)
  const paretoPoints = [
    { spend: 0, reduction: 0, label: 'Baseline' },
    { spend: 10000, reduction: 18, label: 'Phase 1' },
    { spend: 25000, reduction: 42, label: 'Phase 2' },
    { spend: 45000, reduction: 68, label: 'Knapsack Optimal' },
    { spend: 60000, reduction: 79, label: 'Phase 4' },
    { spend: 85000, reduction: 86, label: 'Diminishing Returns' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* Chart 1: Knapsack Pareto Frontier Curve */}
      <div className="card-glass" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--neutral-950)' }}>Security Spend Pareto Frontier</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '2px' }}>
              Investment spend ($) vs. cumulative risk mitigation (%)
            </p>
          </div>
          <span className="badge badge-low">Optimal ROI</span>
        </div>

        {/* SVG Pareto Curve */}
        <div style={{ width: '100%', height: '180px', position: 'relative', marginTop: '10px' }}>
          <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid lines */}
            <line x1="40" y1="20" x2="380" y2="20" stroke="var(--stone-100)" strokeDasharray="4" />
            <line x1="40" y1="70" x2="380" y2="70" stroke="var(--stone-100)" strokeDasharray="4" />
            <line x1="40" y1="120" x2="380" y2="120" stroke="var(--stone-100)" strokeDasharray="4" />

            {/* Axes */}
            <line x1="40" y1="10" x2="40" y2="130" stroke="var(--stone-700)" strokeWidth="1.5" />
            <line x1="40" y1="130" x2="380" y2="130" stroke="var(--stone-700)" strokeWidth="1.5" />

            {/* Axis text */}
            <text x="35" y="25" textAnchor="end" fontSize="9" fill="var(--stone-700)" fontFamily="var(--mono)">80%</text>
            <text x="35" y="75" textAnchor="end" fontSize="9" fill="var(--stone-700)" fontFamily="var(--mono)">40%</text>
            <text x="35" y="125" textAnchor="end" fontSize="9" fill="var(--stone-700)" fontFamily="var(--mono)">0%</text>
            <text x="380" y="145" textAnchor="end" fontSize="9" fill="var(--stone-700)">Spend ($)</text>

            {/* Shaded Area under curve */}
            <path
              d="M 40,130 Q 120,70 200,45 T 380,25 L 380,130 Z"
              fill="rgba(225, 29, 63, 0.08)"
            />

            {/* Curve Line */}
            <path
              d="M 40,130 Q 120,70 200,45 T 380,25"
              fill="none"
              stroke="var(--rose-600)"
              strokeWidth="3"
            />

            {/* Knapsack Optimal Point marker */}
            <circle cx="210" cy="45" r="6" fill="var(--rose-600)" stroke="var(--white)" strokeWidth="2" />
            <text x="215" y="38" fontSize="10" fontWeight="700" fill="var(--rose-800)">
              Optimal Knee ($45k, 68%)
            </text>
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--stone-700)', marginTop: '8px', borderTop: '1px solid var(--stone-100)', paddingTop: '10px' }}>
          <span>Current Budget Cap: <strong>${budget.toLocaleString()}</strong></span>
          <span style={{ color: '#047857', fontWeight: 600 }}>Knapsack Efficiency: 94.2%</span>
        </div>
      </div>

      {/* Chart 2: Asset Criticality & Risk Distribution */}
      <div className="card-glass" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--neutral-950)' }}>Asset Criticality Breakdown</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginTop: '2px' }}>
              Tiered classification across enterprise inventory
            </p>
          </div>
          <span className="badge badge-high">{assets.length} Total</span>
        </div>

        {/* Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
          {[
            { label: 'Critical Tier', count: critCounts.CRITICAL, color: 'var(--rose-950)', bg: 'var(--rose-600)', badge: 'badge-critical' },
            { label: 'High Priority', count: critCounts.HIGH, color: 'var(--rose-700)', bg: 'var(--rose-400)', badge: 'badge-high' },
            { label: 'Medium Priority', count: critCounts.MEDIUM, color: '#c2410c', bg: '#f97316', badge: 'badge-medium' },
            { label: 'Low Priority', count: critCounts.LOW, color: '#047857', bg: '#10b981', badge: 'badge-low' }
          ].map((item, idx) => {
            const pct = Math.round((item.count / totalAssets) * 100) || 0;
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--neutral-950)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: item.color }}>
                    {item.count} assets ({pct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--stone-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: item.bg,
                    borderRadius: 'var(--radius-full)'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
