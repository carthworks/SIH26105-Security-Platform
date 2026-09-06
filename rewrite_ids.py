#!/usr/bin/env python
import re

with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx') as f:
    content = f.read()

sections = ['assets', 'vuln', 'threat', 'ctrl', 'risk', 'invest', 'scenario', 'rec']

for section in sections:
    # Fix: style={{ id: "section", marginBottom: "32px"}} -> id="section" style={{ marginBottom: "32px" }}
    # Also handle single quotes
    old_single = f"style={{ id: '{section}', marginBottom: '32px'}}"
    new_single = f"id='{section}' style={{ marginBottom: '32px'}}"
    
    old_double = f"style={{ id: \"{section}\", marginBottom: \"32px\"}}"
    new_double = f'id="{section}" style={{ marginBottom: "32px"}}'
    
    count_single = content.count(old_single)
    if count_single > 0:
        content = content.replace(old_single, new_single)
        print(f'Fixed single quotes: {section}')
    
    count_double = content.count(old_double)
    if count_double > 0:
        content = content.replace(old_double, new_double)
        print(f'Fixed double quotes: {section}')

with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx', 'w') as f:
    f.write(content)

print(f'\nDone. Check output above.')