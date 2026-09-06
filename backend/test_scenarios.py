import sys
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
from zenith_backend.scenario_analysis import create_scenario, get_scenarios, delete_scenario, compare_scenarios

# Test creating scenarios
print('=== Test: create_scenario ===')
s1 = create_scenario('Current State', 'Current risk posture', risk_before=75, risk_after=75, cost=0, risk_reduction=0)
s2 = create_scenario('Deploy MFA', 'Multi-Factor Authentication deployment', risk_before=75, risk_after=45, cost=20000, risk_reduction=30)
s3 = create_scenario('Patch Management', 'Patch critical vulnerabilities', risk_before=75, risk_after=55, cost=15000, risk_reduction=20)
print(f'  Scenario 1 (Current State): ID={s1}')
print(f'  Scenario 2 (Deploy MFA): ID={s2}')
print(f'  Scenario 3 (Patch Management): ID={s3}')

# Test getting scenarios
print('\n=== Test: get_scenarios ===')
scenarios = get_scenarios()
for s in scenarios:
    print(f'  ID={s["id"]}, Name={s["name"]}, Before={s["risk_before"]}, After={s["risk_after"]}, Cost={s["cost"]}, Reduction={s["risk_reduction"]}')

# Test comparing scenarios
print('\n=== Test: compare_scenarios ===')
comparison = compare_scenarios([s1, s2, s3])
print(f'  Total cost: {comparison["total_cost"]}')
print(f'  Total risk reduction: {comparison["total_risk_reduction"]}')
print(f'  Best reduction: {comparison["best_risk_reduction_scenario"]}')
print(f'  Lowest cost: {comparison["lowest_cost_scenario"]}')
print(f'  Lowest risk after: {comparison["lowest_risk_scenario"]}')