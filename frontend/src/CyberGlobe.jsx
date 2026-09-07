import React, { useEffect, useRef, useState } from 'react';

// High-Definition Continental Polygons for Precise Rasterization & Coastline Contours
const CONTINENT_POLYGONS = [
  // North America
  [
    { lat: 72, lon: -160 }, { lat: 70, lon: -130 }, { lat: 60, lon: -95 }, { lat: 62, lon: -65 },
    { lat: 50, lon: -55 }, { lat: 44, lon: -66 }, { lat: 30, lon: -81 }, { lat: 25, lon: -80 },
    { lat: 29, lon: -89 }, { lat: 26, lon: -97 }, { lat: 21, lon: -97 }, { lat: 15, lon: -92 },
    { lat: 8, lon: -77 }, { lat: 10, lon: -85 }, { lat: 18, lon: -105 }, { lat: 24, lon: -110 },
    { lat: 34, lon: -120 }, { lat: 48, lon: -125 }, { lat: 60, lon: -140 }, { lat: 66, lon: -168 },
    { lat: 72, lon: -160 }
  ],
  // Greenland
  [
    { lat: 78, lon: -70 }, { lat: 83, lon: -30 }, { lat: 75, lon: -20 }, { lat: 65, lon: -40 },
    { lat: 60, lon: -45 }, { lat: 70, lon: -55 }, { lat: 78, lon: -70 }
  ],
  // South America
  [
    { lat: 12, lon: -72 }, { lat: 8, lon: -60 }, { lat: -2, lon: -44 }, { lat: -8, lon: -35 },
    { lat: -23, lon: -42 }, { lat: -34, lon: -54 }, { lat: -45, lon: -65 }, { lat: -55, lon: -68 },
    { lat: -50, lon: -74 }, { lat: -33, lon: -72 }, { lat: -18, lon: -71 }, { lat: -5, lon: -81 },
    { lat: 4, lon: -77 }, { lat: 12, lon: -72 }
  ],
  // Europe
  [
    { lat: 36, lon: -6 }, { lat: 43, lon: -9 }, { lat: 48, lon: -5 }, { lat: 54, lon: 8 },
    { lat: 58, lon: 6 }, { lat: 71, lon: 26 }, { lat: 68, lon: 40 }, { lat: 60, lon: 30 },
    { lat: 54, lon: 20 }, { lat: 45, lon: 30 }, { lat: 40, lon: 26 }, { lat: 36, lon: 22 },
    { lat: 38, lon: 15 }, { lat: 44, lon: 12 }, { lat: 43, lon: 7 }, { lat: 36, lon: -6 }
  ],
  // United Kingdom & Ireland
  [
    { lat: 58, lon: -5 }, { lat: 58, lon: -2 }, { lat: 51, lon: 1 }, { lat: 50, lon: -5 },
    { lat: 55, lon: -6 }, { lat: 58, lon: -5 }
  ],
  // Africa
  [
    { lat: 36, lon: -6 }, { lat: 37, lon: 10 }, { lat: 32, lon: 25 }, { lat: 31, lon: 32 },
    { lat: 12, lon: 44 }, { lat: -12, lon: 40 }, { lat: -28, lon: 32 }, { lat: -34, lon: 20 },
    { lat: -22, lon: 14 }, { lat: -5, lon: 12 }, { lat: 4, lon: 9 }, { lat: 5, lon: 0 },
    { lat: 15, lon: -17 }, { lat: 28, lon: -13 }, { lat: 36, lon: -6 }
  ],
  // Madagascar
  [
    { lat: -12, lon: 49 }, { lat: -25, lon: 47 }, { lat: -25, lon: 44 }, { lat: -13, lon: 48 },
    { lat: -12, lon: 49 }
  ],
  // Asia & Northern Eurasia
  [
    { lat: 70, lon: 40 }, { lat: 75, lon: 100 }, { lat: 72, lon: 140 }, { lat: 65, lon: 170 },
    { lat: 60, lon: 162 }, { lat: 45, lon: 142 }, { lat: 38, lon: 128 }, { lat: 30, lon: 122 },
    { lat: 22, lon: 114 }, { lat: 10, lon: 106 }, { lat: 1, lon: 104 }, { lat: 15, lon: 96 },
    { lat: 22, lon: 70 }, { lat: 25, lon: 62 }, { lat: 15, lon: 53 }, { lat: 12, lon: 44 },
    { lat: 30, lon: 35 }, { lat: 40, lon: 40 }, { lat: 45, lon: 50 }, { lat: 55, lon: 60 },
    { lat: 65, lon: 60 }, { lat: 70, lon: 40 }
  ],
  // Indian Subcontinent
  [
    { lat: 25, lon: 68 }, { lat: 21, lon: 70 }, { lat: 15, lon: 74 }, { lat: 8, lon: 77 },
    { lat: 13, lon: 80 }, { lat: 17, lon: 82 }, { lat: 22, lon: 89 }, { lat: 28, lon: 95 },
    { lat: 34, lon: 76 }, { lat: 30, lon: 70 }, { lat: 25, lon: 68 }
  ],
  // Japan
  [
    { lat: 45, lon: 142 }, { lat: 40, lon: 141 }, { lat: 35, lon: 140 }, { lat: 32, lon: 130 },
    { lat: 37, lon: 137 }, { lat: 45, lon: 142 }
  ],
  // Australia
  [
    { lat: -12, lon: 132 }, { lat: -12, lon: 142 }, { lat: -24, lon: 153 }, { lat: -38, lon: 147 },
    { lat: -35, lon: 116 }, { lat: -22, lon: 114 }, { lat: -15, lon: 124 }, { lat: -12, lon: 132 }
  ],
  // New Zealand
  [
    { lat: -35, lon: 174 }, { lat: -46, lon: 168 }, { lat: -44, lon: 171 }, { lat: -35, lon: 174 }
  ],
  // Antarctica
  [
    { lat: -65, lon: -60 }, { lat: -70, lon: 0 }, { lat: -68, lon: 60 }, { lat: -65, lon: 120 },
    { lat: -70, lon: 160 }, { lat: -75, lon: -150 }, { lat: -72, lon: -100 }, { lat: -65, lon: -60 }
  ]
];

// Ray-Casting algorithm to check point inside polygon
function isPointInPolygon(lat, lon, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lon, yi = poly[i].lat;
    const xj = poly[j].lon, yj = poly[j].lat;
    const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Generate Dense Raster Scanline Matrix Dots
function generateGlobeDots() {
  const dots = [];
  const latStep = 2.4;
  const lonStep = 2.4;

  for (let lat = -80; lat <= 80; lat += latStep) {
    for (let lon = -180; lon < 180; lon += lonStep) {
      let isLand = false;
      for (let p = 0; p < CONTINENT_POLYGONS.length; p++) {
        if (isPointInPolygon(lat, lon, CONTINENT_POLYGONS[p])) {
          isLand = true;
          break;
        }
      }
      if (isLand) {
        dots.push({ lat, lon });
      }
    }
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
    from: { lat: 1.35, lon: 103.82, name: 'Lazarus Group Pivot' },
    targetAsset: {
      name: 'Treasury Settlement DB',
      city: 'Tokyo',
      lat: 35.68,
      lon: 139.76,
      valuation: '$18.0M',
      baselineRisk: 79,
      mitigatedRisk: 21,
      control: 'Zero-Trust Microsegmentation'
    },
    threat: 'Supply Chain Kernel Backdoor',
    cvss: 9.1,
    lossAvoided: '$3,200,000'
  },
  {
    id: 'stream-4',
    from: { lat: 52.52, lon: 13.4, name: 'LockBit 3.0 Affiliate' },
    targetAsset: {
      name: 'Cardholder Data Env (CDE)',
      city: 'Frankfurt',
      lat: 50.11,
      lon: 8.68,
      valuation: '$8.2M',
      baselineRisk: 74,
      mitigatedRisk: 16,
      control: 'AES-256 Envelope Tokenization'
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

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotYRef = useRef(-1.2); // Start showing America/Atlantic matching reference
  const tiltXRef = useRef(0.22); // Natural axial tilt

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dots = generateGlobeDots();
    const radius = 170; // Globe sphere radius
    const focalLength = 480; // Perspective camera focal length

    const arcs = ZENITH_THREAT_STREAMS.map((s, i) => ({
      ...s,
      progress: (i * 0.22) % 1,
      speed: 0.0055 + Math.random() * 0.0035,
      shieldRipples: []
    }));

    // Threat stream rotator
    const streamInterval = setInterval(() => {
      setSignalCount((c) => c + Math.floor(Math.random() * 9) + 2);
      setTotalLossSaved((s) => s + Math.floor(Math.random() * 25000));
      setActiveStream(ZENITH_THREAT_STREAMS[Math.floor(Math.random() * ZENITH_THREAT_STREAMS.length)]);
    }, 2800);

    // 3D Euler Rotation & Perspective Projection Engine
    const project3D = (lat, lon, altitude = 0) => {
      const radLat = (lat * Math.PI) / 180;
      const radLon = (lon * Math.PI) / 180 + rotYRef.current;
      const r = radius + altitude;

      // Base spherical coordinates
      const x0 = r * Math.cos(radLat) * Math.sin(radLon);
      const y0 = -r * Math.sin(radLat);
      const z0 = r * Math.cos(radLat) * Math.cos(radLon);

      // Pitch / Axial tilt around X-axis
      const tilt = tiltXRef.current;
      const x = x0;
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

      // Perspective scale factor
      const scale = focalLength / (focalLength + z);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      return {
        x: cx + x * scale,
        y: cy + y * scale,
        z,
        scale,
        visible: z > -radius * 0.2, // Depth clipping
        isFront: z > 0,
        nx: x / r,
        ny: y / r,
        nz: z / r
      };
    };

    const render = () => {
      // 1. Deep Black Canvas Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Auto-rotation when not dragging
      if (!isDraggingRef.current) {
        rotYRef.current += 0.0038;
      }

      // 2. Dark Grey Latitude & Longitude Wireframe Grid Circles
      [-60, -45, -30, -15, 0, 15, 30, 45, 60].forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const p = project3D(lat, lon);
          if (p.isFront) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(90, 90, 90, 0.45)' : 'rgba(50, 50, 50, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Longitude Meridians in 3D
      [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].forEach((lon) => {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 4) {
          const p = project3D(lat, lon);
          if (p.isFront) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      // 3. Outer Sphere Dark Grey Rim Enclosing Globe
      ctx.strokeStyle = 'rgba(140, 140, 140, 0.5)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Render Glowing Red Continental Coastline Contour Lines
      CONTINENT_POLYGONS.forEach((polygon) => {
        const interpPoints = [];
        for (let i = 0; i < polygon.length - 1; i++) {
          const ptA = polygon[i];
          const ptB = polygon[i + 1];
          const subSteps = 6;
          for (let s = 0; s < subSteps; s++) {
            const t = s / subSteps;
            const lat = ptA.lat + (ptB.lat - ptA.lat) * t;
            const lon = ptA.lon + (ptB.lon - ptA.lon) * t;
            interpPoints.push(project3D(lat, lon));
          }
        }
        interpPoints.push(project3D(polygon[polygon.length - 1].lat, polygon[polygon.length - 1].lon));

        ctx.beginPath();
        let frontStarted = false;
        interpPoints.forEach((p) => {
          if (p.isFront) {
            if (!frontStarted) {
              ctx.moveTo(p.x, p.y);
              frontStarted = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            frontStarted = false;
          }
        });
        ctx.strokeStyle = '#ff0033';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      });

      // 5. Render Dense Scanline Red Matrix Dots (Exact Visual Match to Reference)
      dots.forEach((dot) => {
        const p = project3D(dot.lat, dot.lon);
        if (p.isFront) {
          const dotSize = Math.max(1.1, 1.65 * p.scale);

          ctx.beginPath();
          ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = '#ff0028';
          ctx.fill();
        }
      });

      // 6. Render Zenith Digital Asset Hubs in 3D Space
      ZENITH_THREAT_STREAMS.forEach((item) => {
        const p = project3D(item.targetAsset.lat, item.targetAsset.lon);
        if (p.isFront) {
          const isShielded = knapsackShieldActive;

          // Outer 3D Shield Ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, (isShielded ? 9 : 7) * p.scale, 0, Math.PI * 2);
          ctx.strokeStyle = isShielded ? '#22c55e' : '#ff0033';
          ctx.lineWidth = 1.8 * p.scale;
          ctx.stroke();

          // Center Asset Node
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.8 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = isShielded ? '#22c55e' : '#ff0033';
          ctx.shadowColor = isShielded ? '#22c55e' : '#ff0033';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Asset HUD Label
          ctx.font = `bold ${Math.round(9 * p.scale)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = isShielded ? '#4ade80' : '#ff6b81';
          ctx.fillText(item.targetAsset.city, p.x + 9 * p.scale, p.y - 2);

          // Valuation & Risk Badge
          ctx.font = `700 ${Math.round(8 * p.scale)}px "Poppins", sans-serif`;
          ctx.fillStyle = '#e2e8f0';
          const currentScore = isShielded ? item.targetAsset.mitigatedRisk : item.targetAsset.baselineRisk;
          ctx.fillText(`${item.targetAsset.valuation} (Risk ${currentScore})`, p.x + 9 * p.scale, p.y + 8 * p.scale);
        }
      });

      // 7. Render 3D Elevated Attack Arcs & Projectile Lasers
      arcs.forEach((arc) => {
        const fromP = project3D(arc.from.lat, arc.from.lon);
        const toP = project3D(arc.targetAsset.lat, arc.targetAsset.lon);

        arc.progress += arc.speed;
        if (arc.progress >= 1) {
          arc.progress = 0;
          if (toP.isFront) {
            arc.shieldRipples.push({ radius: 5, alpha: 1.0, success: knapsackShieldActive });
          }
        }

        // Attacker origin beacon
        if (fromP.isFront) {
          ctx.beginPath();
          ctx.arc(fromP.x, fromP.y, 6 * fromP.scale, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 0, 50, 0.7)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(fromP.x, fromP.y, 3.2 * fromP.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ff0033';
          ctx.shadowColor = '#ff0033';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Parabolic 3D Attack Trajectory
        const steps = 24;
        let arcPoints = [];
        let anyVisible = false;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const lat = arc.from.lat + (arc.targetAsset.lat - arc.from.lat) * t;
          const lon = arc.from.lon + (arc.targetAsset.lon - arc.from.lon) * t;
          const altitude = Math.sin(t * Math.PI) * 45;
          const p = project3D(lat, lon, altitude);
          arcPoints.push(p);
          if (p.isFront) anyVisible = true;
        }

        if (anyVisible) {
          ctx.beginPath();
          let lineStarted = false;
          arcPoints.forEach((pt) => {
            if (pt.isFront) {
              if (!lineStarted) {
                ctx.moveTo(pt.x, pt.y);
                lineStarted = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            } else {
              lineStarted = false;
            }
          });
          ctx.strokeStyle = '#ff0033';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.setLineDash([]);

          // 3D Laser Projectile
          const projT = arc.progress;
          const projLat = arc.from.lat + (arc.targetAsset.lat - arc.from.lat) * projT;
          const projLon = arc.from.lon + (arc.targetAsset.lon - arc.from.lon) * projT;
          const projAlt = Math.sin(projT * Math.PI) * 45;
          const headP = project3D(projLat, projLon, projAlt);

          if (headP.isFront) {
            ctx.beginPath();
            ctx.arc(headP.x, headP.y, 4.2 * headP.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ff0033';
            ctx.shadowBlur = 10 * headP.scale;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Shield Deflection Ripples
        if (toP.isFront) {
          arc.shieldRipples.forEach((ripple) => {
            ripple.radius += 1.1 * toP.scale;
            ripple.alpha -= 0.035;
            if (ripple.alpha > 0) {
              ctx.beginPath();
              ctx.arc(toP.x, toP.y, ripple.radius, 0, Math.PI * 2);
              ctx.strokeStyle = ripple.success
                ? `rgba(34, 197, 94, ${ripple.alpha})`
                : `rgba(255, 0, 50, ${ripple.alpha})`;
              ctx.lineWidth = 2.0 * toP.scale;
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

  // Mouse & Touch Drag Handlers for 3D Interactive Rotation
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotYRef.current += dx * 0.008;
    tiltXRef.current = Math.max(-0.6, Math.min(0.6, tiltXRef.current + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

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
            <span className="hud-val">${(totalLossSaved / 1000000).toFixed(2)}M USD</span>
          </div>
        </div>

        {/* 3D Interactive Rotating Canvas */}
        <canvas
          ref={canvasRef}
          width={450}
          height={400}
          className="cyber-globe-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              isDraggingRef.current = true;
              prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
          }}
          onTouchMove={(e) => {
            if (isDraggingRef.current && e.touches.length === 1) {
              const dx = e.touches[0].clientX - prevMousePosRef.current.x;
              const dy = e.touches[0].clientY - prevMousePosRef.current.y;
              prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              rotYRef.current += dx * 0.008;
              tiltXRef.current = Math.max(-0.6, Math.min(0.6, tiltXRef.current + dy * 0.008));
            }
          }}
          onTouchEnd={() => {
            isDraggingRef.current = false;
          }}
          title="Click and drag to rotate the 3D Cyber Globe"
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
