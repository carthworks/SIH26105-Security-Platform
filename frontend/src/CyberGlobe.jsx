import React, { useEffect, useRef, useState } from 'react';

// Geographic continental dot clusters (lat, lon coordinates)
const CONTINENT_POINTS = [
  // North America
  { lat: 45, lon: -100 }, { lat: 50, lon: -110 }, { lat: 40, lon: -95 }, { lat: 35, lon: -85 },
  { lat: 42, lon: -71 }, { lat: 38, lon: -122 }, { lat: 30, lon: -90 }, { lat: 55, lon: -120 },
  { lat: 60, lon: -140 }, { lat: 32, lon: -115 }, { lat: 25, lon: -80 }, { lat: 48, lon: -80 },
  { lat: 52, lon: -105 }, { lat: 37, lon: -105 }, { lat: 44, lon: -123 }, { lat: 20, lon: -100 },
  { lat: 65, lon: -150 }, { lat: 43, lon: -79 }, { lat: 29, lon: -95 }, { lat: 33, lon: -84 },
  
  // South America
  { lat: -10, lon: -55 }, { lat: -15, lon: -47 }, { lat: -23, lon: -46 }, { lat: -34, lon: -58 },
  { lat: 4, lon: -73 }, { lat: -12, lon: -77 }, { lat: -2, lon: -60 }, { lat: -20, lon: -65 },
  { lat: -30, lon: -60 }, { lat: -40, lon: -68 }, { lat: 0, lon: -50 }, { lat: -8, lon: -35 },
  
  // Europe
  { lat: 51, lon: 0 }, { lat: 48, lon: 2 }, { lat: 52, lon: 13 }, { lat: 41, lon: 12 },
  { lat: 40, lon: -3 }, { lat: 55, lon: 37 }, { lat: 59, lon: 18 }, { lat: 60, lon: 10 },
  { lat: 45, lon: 9 }, { lat: 50, lon: 20 }, { lat: 47, lon: 19 }, { lat: 56, lon: 24 },
  { lat: 53, lon: -6 }, { lat: 38, lon: 23 }, { lat: 46, lon: 25 }, { lat: 58, lon: 26 },

  // Africa
  { lat: 30, lon: 31 }, { lat: 9, lon: 7 }, { lat: -26, lon: 28 }, { lat: -1, lon: 36 },
  { lat: 33, lon: -7 }, { lat: 15, lon: 32 }, { lat: 6, lon: 3 }, { lat: -4, lon: 15 },
  { lat: -18, lon: 31 }, { lat: 12, lon: 15 }, { lat: 25, lon: 17 }, { lat: -12, lon: 28 },
  { lat: 0, lon: 25 }, { lat: 5, lon: 40 }, { lat: -33, lon: 18 },

  // Asia
  { lat: 35, lon: 139 }, { lat: 31, lon: 121 }, { lat: 39, lon: 116 }, { lat: 28, lon: 77 },
  { lat: 19, lon: 72 }, { lat: 13, lon: 80 }, { lat: 1, lon: 103 }, { lat: 13, lon: 100 },
  { lat: 37, lon: 127 }, { lat: 22, lon: 114 }, { lat: 25, lon: 121 }, { lat: 35, lon: 51 },
  { lat: 24, lon: 54 }, { lat: 32, lon: 35 }, { lat: 60, lon: 100 }, { lat: 55, lon: 82 },
  { lat: 43, lon: 76 }, { lat: 14, lon: 121 }, { lat: -6, lon: 106 }, { lat: 23, lon: 90 },

  // Australia & Oceania
  { lat: -33, lon: 151 }, { lat: -37, lon: 144 }, { lat: -27, lon: 153 }, { lat: -31, lon: 115 },
  { lat: -23, lon: 133 }, { lat: -41, lon: 174 }, { lat: -36, lon: 174 }
];

function generateGlobeDots() {
  const dots = [];
  CONTINENT_POINTS.forEach((pt) => {
    dots.push({ lat: pt.lat, lon: pt.lon });
    for (let i = 0; i < 9; i++) {
      const dLat = (Math.random() - 0.5) * 8;
      const dLon = (Math.random() - 0.5) * 10;
      dots.push({
        lat: Math.max(-80, Math.min(80, pt.lat + dLat)),
        lon: (pt.lon + dLon + 180) % 360 - 180
      });
    }
  });

  for (let i = 0; i < 160; i++) {
    dots.push({
      lat: (Math.random() - 0.5) * 150,
      lon: (Math.random() - 0.5) * 360,
      isOcean: true
    });
  }
  return dots;
}

// Zenith Cyber Risk Engine Asset & Adversary Vectors
const ZENITH_THREAT_STREAMS = [
  {
    id: 'stream-1',
    from: { lat: 55.75, lon: 37.61, name: 'FIN7 Syndicate Node' },
    targetAsset: {
      name: 'Core Banking Gateway',
      city: 'New York',
      lat: 40.71,
      lon: -74.0,
      valuation: '$12.5M',
      baselineRisk: 88,
      mitigatedRisk: 24,
      control: 'Layer-7 DPI WAF & Rate Limiting'
    },
    threat: 'Log4Shell JNDI RCE (CVE-2021-44228)',
    cvss: 9.8,
    lossAvoided: '$2,100,000'
  },
  {
    id: 'stream-2',
    from: { lat: 39.9, lon: 116.4, name: 'Mirai IoT Botnet' },
    targetAsset: {
      name: 'Swift Payment Processing',
      city: 'London',
      lat: 51.5,
      lon: -0.12,
      valuation: '$25.0M',
      baselineRisk: 92,
      mitigatedRisk: 18,
      control: 'HSM Key Isolation & Anycast Scrub'
    },
    threat: '4.2 Tbps Volumetric HTTP Flood',
    cvss: 8.5,
    lossAvoided: '$4,500,000'
  },
  {
    id: 'stream-3',
    from: { lat: 14.59, lon: 120.98, name: 'Adversary Proxy Hive' },
    targetAsset: {
      name: 'AWS EKS Prod Cluster',
      city: 'Tokyo',
      lat: 35.67,
      lon: 139.65,
      valuation: '$18.0M',
      baselineRisk: 78,
      mitigatedRisk: 16,
      control: 'Zero-Trust mTLS & EDR Hunting'
    },
    threat: 'Admin Token Hijack & Lateral Probe',
    cvss: 8.9,
    lossAvoided: '$1,800,000'
  },
  {
    id: 'stream-4',
    from: { lat: 52.52, lon: 13.4, name: 'Compromised CI/CD Pipeline' },
    targetAsset: {
      name: 'Customer Identity DB',
      city: 'Frankfurt',
      lat: 50.11,
      lon: 8.68,
      valuation: '$8.2M',
      baselineRisk: 74,
      mitigatedRisk: 21,
      control: 'DB Query Proxy & Air-Gapped Snapshots'
    },
    threat: 'SQLi Mass PII Exfiltration',
    cvss: 8.4,
    lossAvoided: '$1,350,000'
  },
  {
    id: 'stream-5',
    from: { lat: 37.56, lon: 126.97, name: 'APT29 Spear-Phishing' },
    targetAsset: {
      name: 'Settlement Router',
      city: 'Sydney',
      lat: -33.86,
      lon: 151.2,
      valuation: '$9.5M',
      baselineRisk: 65,
      mitigatedRisk: 19,
      control: 'Hardware Token FIDO2 MFA'
    },
    threat: 'Privileged Credential Abuse',
    cvss: 7.8,
    lossAvoided: '$950,000'
  }
];

export function CyberGlobe() {
  const canvasRef = useRef(null);
  const [knapsackShieldActive, setKnapsackShieldActive] = useState(true);
  const [activeStream, setActiveStream] = useState(ZENITH_THREAT_STREAMS[0]);
  const [signalCount, setSignalCount] = useState(28470);
  const [totalLossSaved, setTotalLossSaved] = useState(10700000);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dots = generateGlobeDots();
    let rotation = 0;
    const radius = 170; // Globe sphere radius

    const arcs = ZENITH_THREAT_STREAMS.map((s, i) => ({
      ...s,
      progress: (i * 0.2) % 1,
      speed: 0.006 + Math.random() * 0.004,
      shieldRipples: []
    }));

    // Threat stream rotator
    const streamInterval = setInterval(() => {
      setSignalCount((c) => c + Math.floor(Math.random() * 9) + 2);
      setTotalLossSaved((s) => s + Math.floor(Math.random() * 25000));
      setActiveStream(ZENITH_THREAT_STREAMS[Math.floor(Math.random() * ZENITH_THREAT_STREAMS.length)]);
    }, 2800);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      rotation += 0.0042; // Constant smooth 3D globe rotation

      // 1. Globe Ambient Red Radial Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.18);
      glowGrad.addColorStop(0, 'rgba(225, 29, 63, 0.04)');
      glowGrad.addColorStop(0.7, 'rgba(225, 29, 63, 0.14)');
      glowGrad.addColorStop(1, 'rgba(13, 6, 10, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Wireframe Globe Rim
      ctx.strokeStyle = 'rgba(225, 29, 63, 0.35)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Latitude Grid Circles
      ctx.strokeStyle = 'rgba(225, 29, 63, 0.09)';
      ctx.lineWidth = 0.8;
      [-45, -20, 0, 20, 45].forEach((lat) => {
        const phi = (lat * Math.PI) / 180;
        const rLat = radius * Math.cos(phi);
        const yLat = cy - radius * Math.sin(phi);
        ctx.beginPath();
        ctx.ellipse(cx, yLat, rLat, rLat * 0.24, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3D Perspective Projection formula
      const project = (lat, lon) => {
        const radLat = (lat * Math.PI) / 180;
        const radLon = (lon * Math.PI) / 180 + rotation;

        const x = radius * Math.cos(radLat) * Math.sin(radLon);
        const y = -radius * Math.sin(radLat);
        const z = radius * Math.cos(radLat) * Math.cos(radLon);

        return {
          x: cx + x,
          y: cy + y,
          z,
          visible: z > 0
        };
      };

      // 4. Render rotating 3D world landmass dots
      dots.forEach((dot) => {
        const p = project(dot.lat, dot.lon);
        if (p.visible) {
          const depthAlpha = Math.max(0.12, p.z / radius);
          ctx.beginPath();
          ctx.arc(p.x, p.y, dot.isOcean ? 1.0 : 1.75, 0, Math.PI * 2);
          if (dot.isOcean) {
            ctx.fillStyle = `rgba(225, 29, 63, ${depthAlpha * 0.22})`;
          } else {
            ctx.fillStyle = `rgba(244, 63, 94, ${depthAlpha * 0.95})`;
            if (p.z > radius * 0.5) {
              ctx.shadowColor = '#e11d3f';
              ctx.shadowBlur = 3;
            } else {
              ctx.shadowBlur = 0;
            }
          }
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // 5. Render Zenith Digital Asset Hubs & Knapsack Shields
      ZENITH_THREAT_STREAMS.forEach((item) => {
        const p = project(item.targetAsset.lat, item.targetAsset.lon);
        if (p.visible) {
          const isShielded = knapsackShieldActive;

          // Outer Shield Ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, isShielded ? 8.5 : 6, 0, Math.PI * 2);
          ctx.strokeStyle = isShielded ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Center Asset Node
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isShielded ? '#22c55e' : '#ef4444';
          ctx.shadowColor = isShielded ? '#22c55e' : '#ef4444';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Asset HUD Label
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = isShielded ? '#86efac' : '#fca5a5';
          ctx.fillText(item.targetAsset.city, p.x + 8, p.y - 2);

          // Valuation & Risk Badge
          ctx.font = '8px "Poppins", sans-serif';
          ctx.fillStyle = '#cbd5e1';
          const currentScore = isShielded ? item.targetAsset.mitigatedRisk : item.targetAsset.baselineRisk;
          ctx.fillText(`${item.targetAsset.valuation} (Risk ${currentScore})`, p.x + 8, p.y + 8);
        }
      });

      // 6. Render Parabolic Threat Ingress Arcs & Shield Neutralizations
      arcs.forEach((arc) => {
        const fromP = project(arc.from.lat, arc.from.lon);
        const toP = project(arc.targetAsset.lat, arc.targetAsset.lon);

        arc.progress += arc.speed;
        if (arc.progress >= 1) {
          arc.progress = 0;
          if (toP.visible) {
            arc.shieldRipples.push({ radius: 4, alpha: 1.0, success: knapsackShieldActive });
          }
        }

        // Adversary attacker origin point
        if (fromP.visible) {
          ctx.beginPath();
          ctx.arc(fromP.x, fromP.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw Parabolic Attack Trajectory
        if (fromP.visible || toP.visible) {
          const midX = (fromP.x + toP.x) / 2;
          const midY = (fromP.y + toP.y) / 2 - 42;

          ctx.beginPath();
          ctx.moveTo(fromP.x, fromP.y);
          ctx.quadraticCurveTo(midX, midY, toP.x, toP.y);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
          ctx.setLineDash([3, 4]);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);

          // Leading Projectile Head
          const t = arc.progress;
          const headX = (1 - t) * (1 - t) * fromP.x + 2 * (1 - t) * t * midX + t * t * toP.x;
          const headY = (1 - t) * (1 - t) * fromP.y + 2 * (1 - t) * t * midY + t * t * toP.y;

          ctx.beginPath();
          ctx.arc(headX, headY, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ff2c55';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Animate Shield Deflection Ripples
        if (toP.visible) {
          arc.shieldRipples.forEach((ripple) => {
            ripple.radius += 0.9;
            ripple.alpha -= 0.038;
            if (ripple.alpha > 0) {
              ctx.beginPath();
              ctx.arc(toP.x, toP.y, ripple.radius, 0, Math.PI * 2);
              ctx.strokeStyle = ripple.success
                ? `rgba(34, 197, 94, ${ripple.alpha})`
                : `rgba(239, 68, 68, ${ripple.alpha})`;
              ctx.lineWidth = 1.8;
              ctx.stroke();
            }
          });
          arc.shieldRipples = arc.shieldRipples.filter((r) => r.alpha > 0);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(streamInterval);
    };
  }, [knapsackShieldActive]);

  return (
    <div className="cyber-globe-wrapper">
      <div className="globe-canvas-card">
        
        {/* Top HUD Stats: Application Concepts */}
        <div className="globe-hud-top">
          <div className="hud-live-tag">
            <span className="live-dot-pulse"></span>
            <span>ZENITH CYBER RISK TELEMETRY</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">ESTIMATED LOSS AVOIDED</span>
            <span className="hud-val text-success">${(totalLossSaved / 1000000).toFixed(2)}M USD</span>
          </div>
        </div>

        {/* 3D Rotating Canvas */}
        <canvas
          ref={canvasRef}
          width={450}
          height={400}
          className="cyber-globe-canvas"
        />

        {/* Dynamic Concept HUD & Interactive Shield Controls */}
        <div className="globe-hud-bottom">
          <div className="globe-concept-row">
            <div className="globe-telemetry-info">
              <div className="globe-telemetry-title">
                <span className="hud-alert-badge">⚡ THREAT VECTOR</span>
                <span className="globe-threat-name">{activeStream.threat} (CVSS {activeStream.cvss})</span>
              </div>
              <div className="globe-target-detail">
                Target: <strong>{activeStream.targetAsset.name} ({activeStream.targetAsset.valuation})</strong>
              </div>
              <div className="globe-control-detail">
                Safeguard: <span className="text-target">{activeStream.targetAsset.control}</span>
              </div>
            </div>

            {/* Knapsack Shield Switch & Simulation Trigger */}
            <div className="globe-shield-toggle-wrap">
              <button
                className={`globe-shield-btn ${knapsackShieldActive ? 'shield-on' : 'shield-off'}`}
                onClick={() => setKnapsackShieldActive(!knapsackShieldActive)}
                title="Toggle Knapsack Automated Defense Optimization"
              >
                {knapsackShieldActive ? '🛡️ Knapsack Shield: ACTIVE' : '⚠️ Shield: BYPASSED'}
              </button>
              <span className="globe-roi-tag">
                {knapsackShieldActive ? `Risk ${activeStream.targetAsset.mitigatedRisk}/100 (Optimal ROI)` : `Risk ${activeStream.targetAsset.baselineRisk}/100 (Unmitigated)`}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
