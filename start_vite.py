#!/usr/bin/env python
import subprocess, time, sys, os

os.chdir(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend')

proc = subprocess.Popen(
    [r'C:\Python135\python.exe', '-c',
     r'import subprocess, time, sys, os; '
     r'os.chdir(r"C:\Advi\Collegestuff\Events\SIH\zenith\frontend"); '
     r'p = subprocess.Popen([\"node\", \"node_modules\\\\vite\\\\bin\\\\vite.js\", \"dev\", \"--host\", \"127.0.0.1\", \"--port\", \"5173\"])',
     stdout=subprocess.PIPE, stderr=subprocess.PIPE,
)
time.sleep(5)
if proc.poll() is None:
    print('Vite process started, PID:', proc.pid)
else:
    out = proc.stdout.read().decode()
    err = proc.stderr.read().decode()
    print('Vite failed:')
    print('STDERR:', err[:500])
    print('STDOUT:', out[:500])
"