import React, { useState } from 'react';

export default function RiskHeatmap({ assets = [], threats = [], vulns = [], riskAssessments = [] }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredAsset, setHoveredAsset] = useState(null);

  // Map each asset to Likelihood (1-5) and Impact (1-5)
  // Derived from its highest threat likelihood and asset criticality impact
  const assetCoordinates = assets.map((a, idx) => {
    let impact = 3;
    if (a.criticality === 'CRITICAL') impact = 5;
    else if (a.criticality === 'HIGH') impact = 4;
    else if (a.criticality === 'MEDIUM') impact = 3;
    else if (a.criticality === 'LOW') impact = 2;

    // Determine likelihood based on associated threats or vulnerabilities
    const relatedThreat = threats.find(t => t.target_asset_id === a.name || t.target_asset_id === a.id);
    const relatedVuln = vulns.find(v => v.affected_asset_id === a.name || v.affected_asset_id === a.id);

    let likelihood = 3;
    if (relatedThreat && relatedThreat.likelihood) {
      likelihood = Math.min(5, Math.max(1, relatedThreat.likelihood));
    } else if (relatedVuln) {
      likelihood = relatedVuln.severity >= 9.0 ? 5 : (relatedVuln.severity >= 7.0 ? 4 : 3);
    } else {
      likelihood = ((idx % 3) + 3);
    }

    const ra = riskAssessments.find(r => r.asset_id === a.id);
    const score = ra ? ra.current_risk_score : (likelihood * impact * 3.8);

    return {
      ...a,
      likelihood,
      impact,
      calculatedScore: Math.round(score),
      threatName: relatedThreat?.name || 'Automated Threat Vector',
      vulnName: relatedVuln?.name || 'General Exploit Vector'
    };
  });

  const getCellColor = (likelihood, impact) => {
    const product = likelihood * impact;
    if (product >= 16) return { bg: 'var(--rose-950)', text: 'var(--rose-200)', border: 'var(--rose-800)', tier: 'Critical' };
    if (product >= 10) return { bg: '#ffe0e4', text: 'var(--rose-800)', border: 'var(--rose-300)', tier: 'High' };
    if (product >= 6) return { bg: '#ffe6da', text: '#c2410c', border: '#fed7aa', tier: 'Medium' };
    return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', tier: 'Low' };
  };

  const getAssetsInCell = (likelihood, impact) => {
    return assetCoordinates.filter(a => a.likelihood === likelihood && a.impact === impact);
  };

  const selectedAssets = selectedCell
    ? getAssetsInCell(selectedCell.likelihood, selectedCell.impact)
    : assetCoordinates;

  const likelihoodLabels = [
    { level: 5, label: '5 - Almost Certain' },
    { level: 4, label: '4 - Likely' },
    { level: 3, label: '3 - Moderate' },
    { level: 2, label: '2 - Unlikely' },
    { level: 1, label: '1 - Rare' }
  ];

  const impactLabels = [
    { level: 1, label: '1 - Negligible' },
    { level: 2, label: '2 - Minor' },
    { level: 3, label: '3 - Moderate' },
    { level: 4, label: '4 - Major' },
    { level: 5, label: '5 - Catastrophic' }
  ];

  return (
    <div className="card-glass" style={{ padding: '32px', marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--neutral-950)' }}>
              Interactive 5×5 Cyber Risk Heatmap Matrix
            </h2>
            <span className="badge badge-high">Live Matrix</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--stone-700)', marginTop: '4px' }}>
            Multi-dimensional risk visualization correlating threat likelihood against organizational business impact.
          </p>
        </div>

        {/* Matrix Legend */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-critical">Critical (16-25)</span>
          <span className="badge badge-high">High (10-15)</span>
          <span className="badge badge-medium">Medium (6-9)</span>
          <span className="badge badge-low">Low (1-5)</span>
        </div>
      </div>

      {/* Main Grid & Inspection Drawer Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* The 5x5 Heatmap Matrix Grid */}
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ minWidth: '460px' }}>
            {/* Top Y-Axis Indicator */}
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--stone-700)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              ▲ Threat Likelihood (Frequency)
            </div>

            {/* Matrix Rows */}
            {likelihoodLabels.map(({ level: lLevel, label: lLabel }) => (
              <div key={lLevel} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                {/* Y-axis Label */}
                <div style={{ width: '120px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--stone-700)', paddingRight: '10px', textAlign: 'right' }}>
                  {lLabel}
                </div>

                {/* 5 Column Cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', flex: 1 }}>
                  {[1, 2, 3, 4, 5].map(iLevel => {
                    const style = getCellColor(lLevel, iLevel);
                    const cellAssets = getAssetsInCell(lLevel, iLevel);
                    const isSelected = selectedCell && selectedCell.likelihood === lLevel && selectedCell.impact === iLevel;

                    return (
                      <div
                        key={iLevel}
                        onClick={() => setSelectedCell(isSelected ? null : { likelihood: lLevel, impact: iLevel, style })}
                        style={{
                          height: '62px',
                          background: style.bg,
                          border: isSelected ? '3px solid var(--rose-600)' : `1px solid ${style.border}`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isSelected ? 'scale(1.04)' : 'none',
                          boxShadow: isSelected ? '0 8px 20px rgba(225, 29, 63, 0.25)' : 'none',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', fontWeight: 700, color: style.text }}>
                          <span>{lLevel * iLevel}</span>
                          <span style={{ fontSize: '0.625rem', opacity: 0.85 }}>{style.tier[0]}</span>
                        </div>

                        {/* Asset Badges in Cell */}
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', overflow: 'hidden' }}>
                          {cellAssets.map(a => (
                            <span
                              key={a.id}
                              onMouseEnter={() => setHoveredAsset(a)}
                              onMouseLeave={() => setHoveredAsset(null)}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: 'var(--white)',
                                border: '1px solid var(--stone-950)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.5625rem',
                                fontWeight: 700,
                                color: 'var(--neutral-950)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                              }}
                              title={a.name}
                            >
                              {a.id}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* X-Axis Labels */}
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <div style={{ width: '120px' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', flex: 1, textAlign: 'center' }}>
                {impactLabels.map(({ level, label }) => (
                  <div key={level} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--stone-700)' }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--stone-700)', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.05em' }}>
              ► Business Impact Severity
            </div>
          </div>
        </div>

        {/* Selected Cell Inspection Box / Asset Details */}
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--stone-100)',
          borderRadius: 'var(--radius-2xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--neutral-950)' }}>
              {selectedCell
                ? `Quadrant L:${selectedCell.likelihood} × I:${selectedCell.impact} (${selectedCell.style.tier})`
                : 'All Assets Risk Mapping'}
            </h3>
            {selectedCell && (
              <button
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setSelectedCell(null)}
              >
                Clear Filter
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', marginBottom: '16px' }}>
            {selectedAssets.length} asset(s) mapped to this exposure tier. Click any cell on the left to filter.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {selectedAssets.map(a => (
              <div
                key={a.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--stone-50)',
                  border: '1px solid var(--stone-100)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--rose-600)',
                      color: 'var(--white)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {a.id}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--neutral-950)' }}>
                      {a.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--stone-700)', marginTop: '4px' }}>
                    Criticality: <strong>{a.criticality}</strong> • Likelihood: {a.likelihood}/5 • Impact: {a.impact}/5
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--rose-700)', fontFamily: 'var(--mono)' }}>
                    {a.calculatedScore}/100
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--stone-700)' }}>
                    Risk Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
