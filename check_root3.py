import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=5)
html = r.read().decode('utf-8', errors='replace')

# Check for test-output div
test_pattern = r'<div id="test-output"[^>]*>.*?</div>'
test_match = re.search(test_pattern, html)
if test_match:
    print('test-output div FOUND')
    print('Content:', test_match.group()[:200])
else:
    print('test-output div NOT found in HTML')

# Check root div
root_match = re.search(r'<div id="root"[^>]*>(.*?)</div>', html, re.DOTALL)
if root_match:
    content = root_match.group(1)
    print('Root content length:', len(content))
    print('Root content:', content[:200] if content else 'empty')
else:
    print('Root div not found')