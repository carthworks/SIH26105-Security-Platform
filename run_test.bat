@echo off
cd C:\Advi\Collegestuff\Events\SIH\zenith
C:\Python135\python.exe start_backend.py
timeout /t 3 > nul
C:\Python135\python.exe -c "import json; from urllib.request import urlopen; resp = urlopen('http://127.0.0.1:8000/api/v1/assets'); print(json.dumps(json.loads(resp.read().decode())[:3], indent=2)); resp2 = urlopen('http://127.0.0.1:8000/api/v1/risk-assessments'); print('Risk assess count:', len(json.loads(resp2.read().decode()))); resp3 = urlopen('http://127.0.0.1:8000/api/v1/investment-options'); print('Inv opts count:', len(json.loads(resp3.read().decode())))"