#!/usr/bin/env python
import sys, threading, time
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
import uvicorn

def run():
    uvicorn.run('zenith_backend.main:app', host='127.0.0.1', port=8000)

t = threading.Thread(target=run, daemon=False)
t.start()
# Keep the main thread alive
while True:
    time.sleep(60)