import React, { Component } from 'react';

// 404 - Not Found Page Component
export function NotFound404({ onNavigate }) {
  return (
    <div style={{
      maxWidth: '860px',
      margin: '40px auto 80px',
      padding: '48px 24px',
      textAlign: 'center'
    }}>
      <div className="card-glass" style={{
        padding: '56px 36px',
        border: '1px solid var(--stone-100)',
        boxShadow: 'var(--shadow-default)'
      }}>
        {/* Error Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--rose-950)',
          color: 'var(--rose-200)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          marginBottom: '20px',
          border: '1px solid var(--rose-800)'
        }}>
          ⚠️ HTTP 404 — Security Endpoint Not Found
        </div>

        {/* Large 404 Heading */}
        <h1 style={{
          fontSize: 'clamp(3.5rem, 8vw, 6rem)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          margin: '0 0 16px',
          fontFamily: 'var(--mono)'
        }} className="text-gradient">
          404
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--neutral-950)', marginBottom: '12px' }}>
          Resource or Route Not Located
        </h2>

        <p style={{
          color: 'var(--stone-700)',
          maxWidth: '520px',
          margin: '0 auto 32px',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          The asset, dashboard view, or URL route you are attempting to access does not exist or has been relocated in the risk index.
        </p>

        {/* Navigation Quick Recovery Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <button
            className="btn-primary"
            style={{ padding: '12px 24px' }}
            onClick={() => onNavigate('landing')}
          >
            🏠 Return to Home
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '12px 24px' }}
            onClick={() => onNavigate('dashboard')}
          >
            📊 Open Live Dashboard
          </button>
          <button
            className="btn-outline"
            style={{ padding: '12px 24px' }}
            onClick={() => onNavigate('how-it-works')}
          >
            📖 System Documentation
          </button>
        </div>

        {/* Suggested Quick Links */}
        <div style={{
          borderTop: '1px solid var(--stone-100)',
          paddingTop: '24px',
          textAlign: 'left',
          maxWidth: '580px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--stone-700)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Suggested Dashboard Sections:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: '5×5 Risk Matrix', hash: 'matrix' },
              { label: 'Asset Inventory', hash: 'assets' },
              { label: 'Vulnerabilities', hash: 'vuln' },
              { label: 'Threat Intelligence', hash: 'threat' },
              { label: 'Knapsack Optimizer', hash: 'invest' },
              { label: 'Scenario Simulator', hash: 'scenario' }
            ].map((item) => (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dashboard', item.hash, item.hash);
                }}
                style={{
                  fontSize: '0.8125rem',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--stone-50)',
                  border: '1px solid var(--stone-100)',
                  color: 'var(--rose-700)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 500 - Server Error / Connection Disruption Page Component
export function ServerError500({ onRetry, onNavigate }) {
  return (
    <div style={{
      maxWidth: '860px',
      margin: '40px auto 80px',
      padding: '48px 24px',
      textAlign: 'center'
    }}>
      <div className="card-glass" style={{
        padding: '56px 36px',
        border: '1px solid var(--stone-100)',
        boxShadow: 'var(--shadow-default)'
      }}>
        {/* Error Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: '#fff1f2',
          color: 'var(--red-600)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          marginBottom: '20px',
          border: '1px solid #fecdd3'
        }}>
          ⚡ HTTP 500 — Backend Service Disruption
        </div>

        {/* Large 500 Heading */}
        <h1 style={{
          fontSize: 'clamp(3.5rem, 8vw, 6rem)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          margin: '0 0 16px',
          color: 'var(--rose-600)',
          fontFamily: 'var(--mono)'
        }}>
          500
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--neutral-950)', marginBottom: '12px' }}>
          Telemetry Engine Error
        </h2>

        <p style={{
          color: 'var(--stone-700)',
          maxWidth: '540px',
          margin: '0 auto 32px',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          The risk quantification backend service encountered an unexpected error or the FastAPI server is currently unreachable.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <button
            className="btn-primary"
            style={{ padding: '12px 24px' }}
            onClick={() => onRetry ? onRetry() : window.location.reload()}
          >
            🔄 Retry Connection
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '12px 24px' }}
            onClick={() => onNavigate('dashboard')}
          >
            🛡️ Continue in Live Demo Mode
          </button>
        </div>

        {/* Diagnostic Steps */}
        <div style={{
          background: 'var(--stone-50)',
          border: '1px solid var(--stone-100)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          textAlign: 'left',
          maxWidth: '580px',
          margin: '0 auto',
          fontSize: '0.8125rem',
          color: 'var(--stone-700)'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--neutral-950)', marginBottom: '8px' }}>
            🛠️ Local Troubleshooting Checklist:
          </div>
          <ol style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.7 }}>
            <li>Verify backend server is running: <code>python -m uvicorn zenith_backend.main:app --reload --port 8001</code></li>
            <li>Check if port 8001 or 8000 is open and listening.</li>
            <li>Run <code>.\start.bat</code> to automatically initialize both services.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// React Error Boundary Component for catching runtime render exceptions
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Zenith UI Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '800px', margin: '60px auto', padding: '24px', textAlign: 'center' }}>
          <div className="card-glass" style={{ padding: '48px 32px' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--rose-700)', marginBottom: '12px' }}>
              Unexpected Application Error
            </h1>
            <p style={{ color: 'var(--stone-700)', marginBottom: '24px' }}>
              An error occurred while rendering this view. Your session data is intact.
            </p>
            <div style={{
              background: '#1b1418',
              color: '#fff1f3',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--mono)',
              fontSize: '0.8125rem',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '24px'
            }}>
              {this.state.error?.toString() || 'Unknown error'}
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = 'dashboard';
                window.location.reload();
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
