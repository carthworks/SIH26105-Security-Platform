import React, { useState } from 'react';

export function AssetModal({ isOpen, onClose, onSave, existingAssets = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    criticality: 'High',
    valuation: 500000,
    business_process: 'Core Operations'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Asset name is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSave({
        ...formData,
        valuation: Number(formData.valuation)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge badge-primary">Inventory</span>
            <h3 className="modal-title">Register Enterprise Asset</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Asset Name / Identifier *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AWS EKS Production Cluster, Core Banking API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Criticality Tier</label>
              <select
                className="form-select"
                value={formData.criticality}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
              >
                <option value="Critical">Critical (Tier 1)</option>
                <option value="High">High (Tier 2)</option>
                <option value="Medium">Medium (Tier 3)</option>
                <option value="Low">Low (Tier 4)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Financial Valuation ($ USD)</label>
              <input
                type="number"
                min="1000"
                step="10000"
                className="form-input"
                value={formData.valuation}
                onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Business Function / Process</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Real-Time Settlement, Customer Onboarding"
              value={formData.business_process}
              onChange={(e) => setFormData({ ...formData, business_process: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Ingesting Asset...' : 'Ingest Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VulnerabilityModal({ isOpen, onClose, onSave, assets = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    severity: 7,
    affected_asset_id: assets[0]?.id || 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vulnerability name/CVE is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSave({
        ...formData,
        severity: Number(formData.severity),
        affected_asset_id: Number(formData.affected_asset_id)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to log vulnerability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge badge-danger">Threat Surface</span>
            <h3 className="modal-title">Log Vulnerability / CVE</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">CVE Identifier / Vulnerability Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CVE-2024-3094 XZ Utils Backdoor, SQL Injection in Auth"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Severity Score (1 - 10)</label>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-range"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                />
                <span className={`severity-tag ${formData.severity >= 8 ? 'tag-critical' : formData.severity >= 5 ? 'tag-high' : 'tag-med'}`}>
                  {formData.severity} / 10 ({formData.severity >= 9 ? 'CRITICAL' : formData.severity >= 7 ? 'HIGH' : formData.severity >= 4 ? 'MEDIUM' : 'LOW'})
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Impacted Target Asset *</label>
              <select
                className="form-select"
                value={formData.affected_asset_id}
                onChange={(e) => setFormData({ ...formData, affected_asset_id: e.target.value })}
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    #{asset.id} - {asset.name} ({asset.criticality})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vulnerability Technical Context</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Detailed exploitation pathway, proof-of-concept indicators, or patch availability..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? 'Registering CVE...' : 'Log Vulnerability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ThreatModal({ isOpen, onClose, onSave, assets = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    likelihood: 3,
    target_asset_id: assets[0]?.id || 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Threat name is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSave({
        ...formData,
        likelihood: Number(formData.likelihood),
        target_asset_id: Number(formData.target_asset_id)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create threat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge badge-warning">Adversary Intel</span>
            <h3 className="modal-title">Map Threat Vector / Actor</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Threat Campaign / Adversary Actor *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. FIN7 Ransomware Syndicate, APT29 Spear-Phishing"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Likelihood (1 - 5)</label>
              <select
                className="form-select"
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: e.target.value })}
              >
                <option value="1">1 - Rare / Improbable</option>
                <option value="2">2 - Unlikely</option>
                <option value="3">3 - Moderate Probability</option>
                <option value="4">4 - High Likelihood</option>
                <option value="5">5 - Imminent / Active Attack</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Asset</label>
              <select
                className="form-select"
                value={formData.target_asset_id}
                onChange={(e) => setFormData({ ...formData, target_asset_id: e.target.value })}
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    #{asset.id} - {asset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">MITRE ATT&CK TTPs & Motivation</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="TTPs (e.g. T1190 Initial Access, T1078 Valid Accounts), attacker capabilities, telemetry signals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Mapping Vector...' : 'Map Threat Vector'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ControlModal({ isOpen, onClose, onSave, assets = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    effectiveness: 8,
    cost: 50000,
    target_asset_id: assets[0]?.id || 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Control name is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSave({
        ...formData,
        effectiveness: Number(formData.effectiveness),
        cost: Number(formData.cost),
        target_asset_id: Number(formData.target_asset_id)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to deploy control');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge badge-success">Defense Layer</span>
            <h3 className="modal-title">Deploy Security Control</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Control Name / Safeguard Solution *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Zero-Trust mTLS Mesh, WAF Rate-Limiting Policy, EDR Agent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Control Effectiveness (1 - 10)</label>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-range"
                  value={formData.effectiveness}
                  onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value })}
                />
                <span className="severity-tag tag-high">
                  {formData.effectiveness * 10}% Mitigation Power
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Implementation Cost ($ USD)</label>
              <input
                type="number"
                min="1000"
                step="5000"
                className="form-input"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Protected Asset</label>
            <select
              className="form-select"
              value={formData.target_asset_id}
              onChange={(e) => setFormData({ ...formData, target_asset_id: e.target.value })}
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  #{asset.id} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Architectural Implementation Notes</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="NIST 800-53 or ISO 27001 mapping, policy enforceability, deployment SLA..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Deploying...' : 'Deploy Security Control'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
