#!/usr/bin/env python
"""Start backend + Vite servers in background, then test the dashboard."""
import subprocess
import time
import sys
import os
import urllib.request
import json

proj_dir = r'C:\Advi\Collegestuff\Events\SIH\zenith'
frontend_dir = r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend'

# Start Backend
print("=== Starting Backend ===")
backend_proc = subprocess.Popen(
    [sys.executable, r'C:\Advi\Collegestuff\Events\SIH\zenith\start_backend.py'],
    cwd=proj_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
# Wait for backend to be ready
for i in range(15):
    time.sleep(1)
    try:
        r = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/assets', timeout=3)
        print(f"Backend ready after {i+1}s ({len(json.loads(r.read().decode()))} assets)")
        break
    except Exception as e:
        print(f"Waiting for backend... {i+1}s")
else:
    print("Backend failed to start!")

# Start Vite
print("\n=== Starting Vite ===")
vite_proc = subprocess.Popen(
    [sys.executable, '-m', 'vite', 'dev', '--host', '127.0.0.1', '--port', '5173'],
    cwd=frontend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
# Wait for Vite to start
for i in range(20):
    time.sleep(1)
    # Check if port is open
    try:
        r = urllib.request.urlopen('http://127.0.0.1:5173', timeout=3)
        print(f"Vite ready after {i+1}s")
        break
    except Exception as e:
        print(f"Waiting for Vite... {i+1}s")
else:
    print("Vite failed to start!")

# Fetch the page
print("\n=== Fetching Dashboard ===")
try:
    r = urllib.request.urlopen('http://127.0.0.1:5173', timeout=10)
    body = r.read().decode()
    print(f'Page status: {r.status}')
    print(f'Page length: {len(body)} bytes')
    
    import re
    text_content = re.sub(r'<[^>]+>', ' ', body)
    text_content = re.sub(r'\s+', ' ', text_content).strip()
    
    checks = ['Risk Overview', 'Assets', 'Vulnerabilities', 'Threats', 'Controls', 
              'Risk Assessments', 'Investment', 'Scenario', 'Recommendations', 
              'Customer Database', 'risk_score', 'risk_level']
    print('\nDashboard element checks:')
    for c in checks:
        found = c.lower() in text_content.lower()
        status = 'FOUND' if found else 'MISSING'
        print(f'  [{status}] {c}')
        
    html_checks = ['<div', '<h2', '<table', '<button', '<p', '<span', 'class="chip"']
    print('\nHTML structure checks:')
    for c in html_checks:
        found = c in body
        status = 'FOUND' if found else 'MISSING'
        print(f'  [{status}] {c}')
        
except Exception as e:
    print(f'Failed to fetch page: {e}')

# Stay alive for results
print('\n=== Keeping servers alive 20 seconds... ===')
time.sleep(20)
print('Done. Servers still running.')