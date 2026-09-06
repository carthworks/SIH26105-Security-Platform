import urllib.request, re
r = urllib.request.urlopen('http://localhost:5173/', timeout=3)
html = r.read().decode('utf-8', errors='replace')
# Check for any root content
root_content = re.search(r'<div id="root"[^>]*>(.*?)</div>', html, re.DOTALL)
if root_content:
    content = root_content.group(1)
    print('Root content length:', len(content))
    print('Root content:', content[:200] if content else 'empty')
else:
    print('Root div not found at all')
    
# Check for ReactDOM in the HTML
reactdom = re.search(r'ReactDOM', html)
print('ReactDOM in HTML:', reactdom is not None)

# Check for the script tag reference
main_script = re.search(r'src="/src/main[^"]*"', html)
print('Main script:', main_script.group() if main_script else 'not found')