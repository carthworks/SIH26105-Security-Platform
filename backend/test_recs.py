import sys
sys.path.insert(0, r'C:\Advi\Collegestuff\Events\SIH\zenith\backend')
from zenith_backend.recommendation_engine import get_prioritized_recommendations, get_investment_recommendations

# Test prioritized recommendations
print('=== Test: get_prioritized_recommendations ===')
recs = get_prioritized_recommendations()
for r in recs[:3]:  # Show first 3
    print(f'  Asset: {r["asset_name"]}')
    print(f'  Risk score: {r["risk_score"]}, Level: {r["risk_level"]}')
    print(f'  Recommendation: {r["recommendation"][:80]}...')
    print(f'  Urgency: {r["urgency"]}')
    print()

# Test investment recommendations
print('=== Test: get_investment_recommendations ===')
inv_recs = get_investment_recommendations(budget=50000)
for r in inv_recs[:3]:
    print(f'  {r["control_name"]}: cost=${r["cost"]}, effectiveness={r["expected_effectiveness"]}')
    print(f'  Reason: {r["reason"]}')
    print(f'  Urgency: {r["urgency"]}')
    print()