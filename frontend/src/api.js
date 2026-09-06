import { useEffect, useState } from 'react';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = isLocalhost
  ? (localStorage.getItem('API_BASE') || 'http://127.0.0.1:8001')
  : '';

export const api = {
  // Assets
  getAssets: async () => {
    const res = await fetch(`${API_BASE}/api/v1/assets`);
    return res.ok ? await res.json() : [];
  },
  getAsset: async (id) => {
    const res = await fetch(`${API_BASE}/api/v1/assets/${id}`);
    return res.ok ? await res.json() : null;
  },

  // Vulnerabilities
  getVulnerabilities: async () => {
    const res = await fetch(`${API_BASE}/api/v1/vulnerabilities`);
    return res.ok ? await res.json() : [];
  },

  // Threats
  getThreats: async () => {
    const res = await fetch(`${API_BASE}/api/v1/threats`);
    return res.ok ? await res.json() : [];
  },

  // Controls
  getControls: async () => {
    const res = await fetch(`${API_BASE}/api/v1/controls`);
    return res.ok ? await res.json() : [];
  },

  // Risk Assessments
  getRiskAssessments: async () => {
    const res = await fetch(`${API_BASE}/api/v1/risk-assessments`);
    return res.ok ? await res.json() : [];
  },
  getRiskAssessment: async (assetId) => {
    const res = await fetch(`${API_BASE}/api/v1/risk-assessments/${assetId}`);
    return res.ok ? await res.json() : null;
  },

  // Investment Options
  getInvestmentOptions: async () => {
    const res = await fetch(`${API_BASE}/api/v1/investment-options`);
    return res.ok ? await res.json() : [];
  },

  // Scenarios
  getScenarios: async () => {
    const res = await fetch(`${API_BASE}/api/v1/scenarios`);
    return res.ok ? await res.json() : [];
  },
  compareScenarios: async (scenarioIds = []) => {
    const res = await fetch(`${API_BASE}/api/v1/scenarios/compare?scenario_ids=${scenarioIds.join(',')}`);
    return res.ok ? await res.json() : null;
  },

  // Risk Calculation
  calculateRisk: async (assetId) => {
    const res = await fetch(`${API_BASE}/api/v1/risk/calculate/${assetId}`);
    return res.ok ? await res.json() : null;
  },

  // Risk Drivers
  getRiskDrivers: async (assetId) => {
    const res = await fetch(`${API_BASE}/api/v1/risk/drivers/${assetId}`);
    return res.ok ? await res.json() : { error: 'Not found' };
  },

  // Recommendations
  getPrioritizedRecommendations: async () => {
    const res = await fetch(`${API_BASE}/api/v1/recommendations/prioritized`);
    return res.ok ? await res.json() : [];
  },
  getInvestmentRecommendations: async (budget) => {
    const res = await fetch(`${API_BASE}/api/v1/recommendations/investment/${budget}`);
    return res.ok ? await res.json() : [];
  },
};