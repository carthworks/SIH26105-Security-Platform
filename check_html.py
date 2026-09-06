import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=3)
html = r.read().decode('utf-8', errors='replace')

# Print head section
head_start = html.find('<head>')
head_end = html.find('</head>') + 7
print('HEAD:')
print(html[head_start:head_end])
print()

# Print body section
body_start = html.find('<body>')
body_end = html.find('</body>') + 7
print('BODY:')
print(html[body_start:body_end])
print()

# Check for script tags
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print('SCRIPT TAGS:')
for i, s in enumerate(scripts):
    print(f'Script {i+1}: {s[:150]}...' if len(s) > 150 else f'Script {i+1}: {s}')

# Check for any inline code
if 'document.write' in html:
    print('document.write FOUND')
else:
    print('document.write NOT found')

if 'ReactDOM' in html:
    print('ReactDOM FOUND')
else:
    print('ReactDOM NOT found')

if 'createRoot' in html:
    print('createRoot FOUND')
else:
    print('createRoot NOT found')