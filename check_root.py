import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=3)
html = r.read().decode('utf-8', errors='replace')
root_match = re.search(r'<div id="root"[^>]*>(.*?)</div>', html, re.DOTALL)
if root_match:
    print('#root content:')
    print(root_match.group(1)[:2000])
else:
    print('#root div not found')
    body_start = html.find('<body>')
    body_end = html.find('</body>')
    if body_start > 0 and body_end > 0:
        print('Body content:', html[body_start:body_end][:2000])