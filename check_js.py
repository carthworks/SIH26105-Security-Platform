import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=3)
html = r.read().decode('utf-8', errors='replace')
print('JavaScript executing!' in html)
# Check for document.write
print('document.write in HTML:', 'document.write' in html)
# Check for the text
idx = html.find('JavaScript')
if idx >= 0:
    print('Found JavaScript at index', idx)
    print('Context:', html[idx:idx+50])
# Check root
root_match = re.search(r'<div id="root"[^>]*>(.*?)</div>', html, re.DOTALL)
if root_match:
    content = root_match.group(1)
    print('Root content length:', len(content))
    print('Root content:', content[:200] if content else 'empty')
else:
    print('Root div not found')