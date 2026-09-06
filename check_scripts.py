import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=3)
html = r.read().decode('utf-8', errors='replace')
main_script = re.search(r'src="/src/main[^"]*"', html)
if main_script:
    print('Main script found:', main_script.group())
else:
    print('Main script not found')

# Look for React error boundaries or error messages
error_patterns = re.findall(r'Error|error|ErrorBoundary', html)
print('Error patterns found:', error_patterns[:5] if error_patterns else 'none')

# Check for refresh sig
refresh_sig = re.search(r'\\$RefreshSig\\$', html)
print('RefreshSig found:', refresh_sig is not None)