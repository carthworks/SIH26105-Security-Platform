#!/usr/bin/env python
import re

with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx') as f:
    content = f.read()

# Fix pattern: style={{ id: "X", marginBottom: "32px" }} 
# Should become: id="X" style={{ marginBottom: "32px" }}

# This regex finds style props that have id inside them and moves id out
# Pattern: style={{ id: "something", ...rest }}
# We need to be careful - only fix when id is inside style

# Let's do targeted fixes for the known sections
sections = ['assets', 'vuln', 'threat', 'ctrl', 'risk', 'invest', 'scenario', 'rec']

for section in sections:
    # Fix: style={{ id: "section", marginBottom: "32px" }} -> id="section" style={{ marginBottom: "32px" }}
    # We need to match the specific pattern
    old = f'style={{ id: "{section}", marginBottom: "32px"}}'
    new = f'id="{section}" style={{ marginBottom: "32px"}}'
    
    # Also handle single quotes
    old2 = f"style={{ id: '{section}', marginBottom: '32px'}}"
    new2 = f"id='{section}' style={{ marginBottom: '32px'}}"
    
    # Also handle without quotes on marginBottom
    old3 = f'style={{ id: "{section}", marginBottom: 32}}'
    new3 = f'id="{section}" style={{ marginBottom: 32}}'
    
    count = content.count(old)
    if count > 0:
        content = content.replace(old, new)
        print(f'Fixed {count} occurrence(s) of: {old}')
    else:
        print(f'  Not found: {old}')
    
    count2 = content.count(old2)
    if count2 > 0:
        content = content.replace(old2, new2)
        print(f'Fixed {count2} occurrence(s) of: {old2}')
    else:
        print(f'  Not found: {old2}')
    
    count3 = content.count(old3)
    if count3 > 0:
        content = content.replace(old3, new3)
        print(f'Fixed {count3} occurrence(s) of: {old3}')
    else:
        print(f'  Not found: {old3}')

with open(r'C:\Advi\Collegestuff\Events\SIH\zenith\frontend\src\main.jsx', 'w') as f:
    f.write(content)

print('\nDone fixing IDs')