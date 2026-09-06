#!/usr/bin/env python
import urllib.request, re, json

r = urllib.request.urlopen('http://127.0.0.1:5173')
body = r.read().decode()
scripts = re.findall(r'src="\/([^"]+)"', body)
print('Script sources:', scripts)
print('Has Error:', 'Error' in body)
print('Has 404:', '404' in body)
print()
print('Body length:', len(body))
print('First 600 chars:')
print(body[:600])