import sys
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
from zenith_backend.investment_optimizer import optimize_investment, get_control_details

# Test optimization with a budget
result = optimize_investment(budget=50000)
print('=== Test: optimize_investment(budget=50000) ===')
print(f'  Selected controls: {result["selected_controls"]}')
print(f'  Total cost: {result["total_cost"]}')
print(f'  Risk reduction: {result["risk_reduction"]}')
print(f'  Residual risk: {result["residual_risk"]}')
print(f'  ROI metric: {result["roi_metric"]}')
print(f'  Current risk: {result["current_risk"]}')

# Test control details
print('\n=== Test: get_control_details ===')
details = get_control_details([1, 2, 3])
for d in details:
    print(f'  Control ID {d["id"]}: {d["name"]} - effectiveness={d["effectiveness"]}, cost={d["cost"]}')