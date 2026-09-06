#!/usr/bin/env python
import subprocess
import time
import sys
import os
import urllib.request
import json
import signal

# Start Backend
print("=== Starting Backend ===")
backend_cmd = [
    sys.executable, '-c',
    'import sys; sys.path.insert(0, r"C:\\Advi\\Collegestuff\\Events\\SIH\\zenith\\backend"); '
    'import uvicorn, threading, time; '
    'def run(): uvicorn.run("zenith_backend.main:app", host="127.0.0.1", port=8000); '
    't = threading.Thread(target=run, daemon=True); t.start(); time.sleep(3); print("BACKEND_READY")'
]
backend_proc = subprocess.Popen(
    [sys.executable, '-c',
     'import sys; sys.path.insert(0, r"C:\\Advi\\Collegestuff\\Events\\SIH\\zenith\\backend"); '
     'import uvicorn, threading, time; '
     'def run(): uvicorn.run("zenith_backend.main:app", host="127.0.0.1", port=8000); '
     't = threading.Thread(target=run, daemon=True); t.start(); time.sleep(3); print("BACKEND_READY")'],
    cwd=r'C:\Advi\Collegestuff\Events\SIH\zenith',
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
time.sleep(3)

# Check if backend is ready
try:
    resp = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/assets')
    print("Backend API confirmed operational")
except Exception as e:
    print(f"Backend not ready: {e}")

# Start Vite
print("=== Starting Vite ===")
vite_cmd = [
    r'C:\Python135\python.exe', '-m', 'vite', 'dev',
    '--host', '127.0.0.1', '--port', '5173'
]
vite_proc = subprocess.Popen(
    vite_cmd,
    cwd=r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend',
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

# Wait for Vite to start
for i in range(10):
    time.sleep(1)
    # Check if process is still running
    if vite_proc.poll() is not None:
        print(f"Vite exited: {vite_proc.stdout.read().decode()[:200]}")
        break
    # Check if port is open
    try:
        resp = urllib.request.urlopen('http://127.0.0.1:5173', timeout=2)
        print(f"Vite server running after {i+1} seconds")
        break
    except:
        print(f"Waiting for Vite... {i+1}")
else:
    print("Vite took too long to start")

# Now fetch the page
print("=== Fetching Dashboard ===")
try:
    resp = urllib.request.urlopen('http://127.0.0.1:5173', timeout=10)
    body = resp.read().decode()
    print(f'Page status: {resp.status}')
    print(f'Page length: {len(body)} bytes')
    
    # Check for key dashboard elements
    checks = [
        'Risk Overview', 'Assets', 'Vulnerabilities', 'Threats', 'Controls',
        'Risk Assessments', 'Investment', 'Scenario', 'Recommendations',
        'Customer Database Server', 'risk_score', 'risk_level'
    ]
    print("\nDashboard element checks:")
    for check in checks:
        found = check in body
        status = "FOUND" if found else "MISSING"
        print(f"  [{status}] {check}")
        
except Exception as e:
    print(f"Failed to fetch page: {e}")
    print("This might mean the Vite server isn't fully up yet.")

# Keep running for a bit then cleanup
print("=== Keeping alive for 5 seconds... ===")
time.sleep(5)

# Cleanup
print("=== Cleanup ===")
vite_proc.terminate()
vite_proc.wait()
print("Done.")