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
    ('GET /api/v1/risk/calculate/1', f'{base}/api/v1/risk/calculate/1'),
    ('GET /api/v1/risk/drivers/1', f'{base}/api/v1/risk/drivers/1'),
]

print('=== API Verification ===')
for name, url in endpoints:
    try:
        r = urllib.request.urlopen(url, timeout=5)
        body = r.read().decode()
        try:
            j = json.loads(body)
            print(f'  {name}: Status {r.status} - OK')
            if 'risk_score' in j:
                print(f'    Risk score: {j["risk_score"]}')
                print(f'  Risk level: {j["risk_level"]}')
                print(f'  Expected loss: {j.get("expected_loss", "N/A")}')
            if 'id' in j:
                print(f'    First item id: {j[0]["id"] if isinstance(j, list) else j["id"]}')
        except:
            print(f'  {name}: Status {r.status}')
    except urllib.error.HTTPError as e:
        print(f'  {name}: HTTP Error {e.code}')
    except Exception as e:
        print(f'  {name}: Error: {e}')

print('Verification complete!')