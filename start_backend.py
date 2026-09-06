import sys
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
import uvicorn, threading, time

def run():
    uvicorn.run('zenith_backend.main:app', host='127.0.0.1', port=8000)

t = threading.Thread(target=run, daemon=True)
t.start()
time.sleep(3)
print('Backend running on http://127.0.0.1:8000')