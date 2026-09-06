import uvicorn
import threading
import time
import urllib.request
import json

def run_server():
    uvicorn.run('zenith_backend.main:app', host='127.0.0.1', port=8000)

t = threading.Thread(target=run_server, daemon=True)
t.start()
time.sleep(3)

base = 'http://127.0.0.1:8000'

endpoints = [
    ('GET /health', f'{base}/health'),
    ('GET /api/v1/assets', f'{base}/api/v1/assets'),
    ('GET /api/v1/assets/1', f'{base}/api/v1/assets/1'),
    ('GET /api/v1/vulnerabilities', f'{base}/api/v1/vulnerabilities'),
    ('GET /api/v1/threats', f'{base}/api/v1/threats'),
    ('GET /api/v1/controls', f'{base}/api/v1/controls'),
    ('GET /api/v1/risk-assessments', f'{base}/api/v1/risk-assessments'),
    ('GET /api/v1/risk-assessments/1', f'{base}/api/v1/risk-assessments/1'),
    ('GET /api/v1/investment-options', f'{base}/api/v1/investment-options'),
    ('GET /api/v1/scenarios', f'{base}/api/v1/scenarios'),
    ('GET /api/v1/risk/calculate/1', f'{base}/api/v1/risk/calculate/1'),
    ('GET /api/v1/risk/drivers/1', f'{base}/api/v1/risk/drivers/1'),
    ('GET /api/v1/recommendations/prioritized', f'{base}/api/v1/recommendations/prioritized'),
    ('GET /api/v1/recommendations/investment/50000', f'{base}/api/v1/recommendations/investment/50000'),
    ('GET /api/v1/scenarios', f'{base}/api/v1/scenarios'),
    ('GET /api/v1/scenarios/compare', f'{base}/api/v1/scenarios/compare'),
]

print('=== Complete API Verification ===')
results = []
for name, url in endpoints:
    try:
        r = urllib.request.urlopen(url, timeout=5)
        body = r.read().decode()
        try:
            j = json.loads(body)
            print(f'  {name}: Status {r.status} - OK')
            results.append((name, 'success', 'n/a'))
        except:
            print(f'  {name}: Status {r.status}')
            results.append((name, 'success', 'n/a'))
    except urllib.error.HTTPError as e:
        print(f'  {name}: HTTP Error {e.code}')
        results.append((name, 'error', e.code))
    except Exception as e:
        print(f'  {name}: Error: {e}')
        results.append((name, 'error', str(e)))

print()
print('Summary:')
successes = sum(1 for r in results if r[1] == 'success')
errors = sum(1 for r in results if r[1] == 'error')
print(f'  Total: {len(results)}, Successful: {successes}, Errors: {errors}')