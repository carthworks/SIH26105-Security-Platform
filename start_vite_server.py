import subprocess
import time
import sys
import os

# Find vite executable
vite_bin = r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\node_modules\.bin\vite'

os.chdir(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend')

# Start Vite dev server as a subprocess
proc = subprocess.Popen(
    [vite_bin, 'dev', '--host', '127.0.0.1', '--port', '5173'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

# Wait for Vite to start
time.sleep(5)

# Check if the process is still running
if proc.poll() is not None:
    stdout = proc.stdout.read().decode()
    stderr = proc.stderr.read().decode()
    print(f'Vite exited with error:')
    print(stdout[-500:] if len(stdout) > 500 else stdout)
    print(stderr[-500:] if len(stderr) > 500 else stderr)
else:
    print(f'Vite started with PID {proc.pid}')
    print('Waiting 3 more seconds...')
    time.sleep(3)
    
    # Try to fetch the page
    import urllib.request
    try:
        resp = urllib.request.urlopen('http://127.0.0.1:5173')
        print(f'Page fetched! Status: {resp.status}')
        body = resp.read().decode()
        print(f'Page length: {len(body)} bytes')
        # Print first 1000 chars
        print('First 1000 chars:')
        print(body[:1000])
    except Exception as e:
        print(f'Failed to fetch page: {e}')
    
    # Terminate the Vite process
    proc.terminate()
    proc.wait()