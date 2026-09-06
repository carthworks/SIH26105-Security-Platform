import urllib.request
import json

base = 'http://127.0.0.1:8000'

endpoints = [
    ('GET /api/v1/risk/calculate/1', f'{base}/api/v1/risk/calculate/1'),
    ('GET /api/v1/risk/drivers/1', f'{base}/api/v1/risk/drivers/1'),
]

print('=== Risk Calculation API Verification ===')
for name, url in endpoints:
    try:
        r = urllib.request.urlopen(url, timeout=5)
        body = r.read().decode()
        try:
            j = json.loads(body)
            print(f'  {name}: Status {r.status} - OK')
            print(f'    Risk score: {j.get("risk_score", "N/A")}')
            print(f'  Risk level: {j.get("risk_level", "N/A")}')
            print(f'  Expected loss: {j.get("expected_loss", "N/A")}')
        except:
            print(f'  {name}: Status {r.status} - Body: {body[:100]}')
    except urllib.error.HTTPError as e:
        print(f'  {name}: HTTP Error {e.code}')
    except Exception as e:
        print(f'  {name}: Error: {e}')

print()
print('API verification complete!')