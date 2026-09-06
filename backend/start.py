import uvicorn
import threading
import time

def run():
    uvicorn.run('zenith_backend.main:app', host='127.0.0.1', port=8000)

t = threading.Thread(target=run, daemon=True)
t.start()
time.sleep(3)
print('Backend server started on http://127.0.0.1:8000')