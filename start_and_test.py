#!/usr/bin/env python
"""Start backend + Vite in detached consoles, test dashboard, stay alive."""
import subprocess
import time
import sys
import os
import urllib.request
import json

proj_dir = r'C:\Advi\Collegestuff\Events\SIH\zenith'
frontend_dir = r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend'

# Start Backend in new console
print("=== Starting Backend ===")
backend_cmd = [sys.executable, r'C:\Advi\Collegestuff\Events\SIH\zenith\start_backend.py']
backend_proc = subprocess.Popen(
    backend_cmd,
    cwd=proj_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    creationflags=subprocess.CREATE_NEW_CONSOLE,
)
# Wait for backend
for i in range(20):
    time.sleep(1)
    try:
        r = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/assets', timeout=3)
        print(f"Backend ready after {i+1}s")
        break
    except:
        print(f"Waiting for backend... {i+1}s")
else:
    print("Backend may not be ready!")

# Start Vite in new console
print("\n=== Starting Vite ===")
vite_cmd = ['node', r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\node_modules\vite\bin\vite.js', 'dev', '--host', '127.0.0.1', '--port', '5173']
vite_proc = subprocess.Popen(
    vite_cmd,
    cwd=frontend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    creationflags=subprocess.CREATE_NEW_CONSOLE,
)
# Wait for Vite
for i in range(20):
    time.sleep(1)
    try:
        r = urllib.request.urlopen('http://127.0.0.1:5173', timeout=3)
        print(f"Vite ready after {i+1}s")
        break
    except:
        print(f"Waiting for Vite... {i+1}s")
else:
    print("Vite may not be ready!")

# Fetch the page
print("\n=== Fetching Dashboard ===")
try:
    r = urllib.request.urlopen('http://127.0.0.1:5173', timeout=10)
    body = r.read().decode()
    print(f'Page status: {r.status}')
    print(f'Page length: {len(body)} bytes')
    
    # Check for dashboard content
    import re
    # Extract text content between tags
    text_content = re.sub(r'<[^>]+>', ' ', body)
    text_content = re.sub(r'\s+', ' ', text_content).strip()
    
    checks = ['Risk Overview', 'Assets', 'Vulnerabilities', 'Threats', 'Controls', 
              'Risk Assessments', 'Investment', 'Scenario', 'Recommendations', 
              'Customer Database', 'risk_score', 'risk_level', 'cyber risk']
    print('\nDashboard element checks:')
    for c in checks:
        found = c.lower() in text_content.lower()
        status = 'FOUND' if found else 'MISSING'
        print(f'  [{status}] {c}')
    
    # Also check for HTML elements
    html_checks = ['<div', '<h2', '<table', '<button', '<p', '<span']
    print('\nHTML structure checks:')
    for c in html_checks:
        found = c in body
        status = 'FOUND' if found else 'MISSING'
        print(f'  [{status}] {c}')
        
except Exception as e:
    print(f'Failed to fetch page: {e}')

# Stay alive for user to interact
print('\n=== Keeping servers alive for 30 seconds... ===')
time.sleep(30)

# Don't terminate - leave servers running
print('Done. Servers still running.')