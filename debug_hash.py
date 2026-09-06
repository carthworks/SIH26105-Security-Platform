#!/usr/bin/env python
import urllib.request, re, sys

try:
    resp = urllib.request.urlopen('http://127.0.0.1:5173/src/main.jsx', timeout=3)
    body = resp.read().decode()
    
    # Find the nav section
    nav_start = body.find('Nav')
    if nav_start >= 0:
        print('Navigation section (from transformed JSX):')
        print(body[nav_start:nav_start+600])
        print()
    
    # Find the vuln section
    vuln_pos = body.find('id: "vuln"')
    if vuln_pos >= 0:
        print('Vuln section found in JSX, context:')
        print(body[max(0,vuln_pos-50):vuln_pos+200])
    else:
        print('id="vuln" NOT found in JSX')
    
    # Check for any style that might prevent scrolling
    print()
    print('Checking for scrolling-related styles:')
    for line in body.split('\n'):
        lower = line.lower()
        if 'overflow' in lower or 'scroll' in lower or 'height' in lower:
            print(f'  {line[:120]}')
            
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)