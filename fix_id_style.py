#!/usr/bin/env python
with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx') as f:
    content = f.read()

# Replace all occurrences where id is inside style with id as separate prop
# Pattern: style={{ id: 'X', marginBottom: '32px' }}  ->  id='X' style={{ marginBottom: '32px' }}

sections = ['assets', 'vuln', 'threat', 'ctrl', 'risk', 'invest', 'scenario', 'rec']

for section in sections:
    # Fix single-quoted id inside style
    old = f"style={{ id: '{section}', marginBottom: '32px'}}"
    new = f"id='{section}' style={{ marginBottom: '32px'}}"
    if old in content:
        content = content.replace(old, new)
        print(f'Fixed: {section} (single quote)')
    
    # Fix double-quoted id inside style
    old = f'style={{ id: "{section}", marginBottom: "32px"}}'
    new = f'id="{section}" style={{ marginBottom: "32px"}}'
    if old in content:
        content = content.replace(old, new)
        print(f'Fixed: {section} (double quote)')

with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx', 'w') as f:
    f.write(content)

print('\nDone fixing id positions')