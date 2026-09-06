import sys
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
from zenith_backend.continuous_risk import record_risk_snapshot, get_risk_history, update_telemetry, get_top_risk_drivers, compare_risk_state

# Test 1: Record a risk snapshot
print('=== Test 1: record_risk_snapshot ===')
snapshot_id = record_risk_snapshot(asset_id=1, risk_score=75, risk_level='critical',
                                   likelihood=5, control_eff=1, vuln_severity=7)
print(f'  Snapshot ID: {snapshot_id}')

# Test 2: Get risk history
print('\n=== Test 2: get_risk_history ===')
history = get_risk_history(asset_id=1, limit=3)
for h in history:
    print(f'  {h["recorded_at"]}: score={h["risk_score"]}, level={h["risk_level"]}')

# Test 3: Update telemetry
print('\n=== Test 3: update_telemetry ===')
t_id = update_telemetry(asset_id=1, severity_rating=8, note='New critical vulnerability detected',
                        related_vulnerability_id=1)
print(f'  Telemetry ID: {t_id}')

# Test 4: Get top risk drivers
print('\n=== Test 4: get_top_risk_drivers ===')
drivers = get_top_risk_drivers(asset_id=1)
for d in drivers:
    print(f'  {d["driver"]}: {d["percentage"]}% ({d["occurrences"]}/{d["total"]})')

# Test 5: Compare risk state
print('\n=== Test 5: compare_risk_state ===')
comparison = compare_risk_state(asset_id=1, new_likelihood=5, new_effectiveness=1)
for k, v in comparison.items():
    if k != 'driver_changes':
        print(f'  {k}: {v}')
    else:
        print(f'  driver_changes: {v}')
"