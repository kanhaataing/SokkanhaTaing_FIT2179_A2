import pandas as pd

df = pd.read_csv('Endangered_Wildlife.csv', header=[0, 1])

threat_status = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threat Status')]

states = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'South Australia',
    'Western Australia',
    'Tasmania',
    'Northern Territory',
    'Australian Capital Territory'
]

threatened = df[threat_status.notna()]

results = []
for state in states:
    presence = threatened[('State, Mainland Territory and External Territory Presence', state)]
    count = presence.notna().sum()
    results.append({'state': state, 'threatCount': count})

output = pd.DataFrame(results)
print(output)
output.to_csv('threat_by_state.csv', index=False)
print("\nSaved to threat_by_state.csv!")

threat_counts = threat_status.value_counts().reset_index()
threat_counts.columns = ['threatLevel', 'count']

print(threat_counts)
threat_counts.to_csv('threat_levels.csv', index=False)
print("\nSaved to threat_levels.csv!")

# Waffle chart data
threat_counts_filtered = threat_counts[threat_counts['threatLevel'].isin([
    'Endangered', 'Vulnerable', 'Critically Endangered', 'Extinct'
])]

total = threat_counts_filtered['count'].sum()
waffle_data = []
square = 0

for _, row in threat_counts_filtered.iterrows():
    n_squares = round((row['count'] / total) * 100)
    for _ in range(n_squares):
        if square >= 100:  # ← add this check
            break
        waffle_data.append({
            'x': square % 10,
            'y': square // 10,
            'threatLevel': row['threatLevel']
        })
        square += 1

waffle_df = pd.DataFrame(waffle_data)
waffle_df.to_csv('waffle_data.csv', index=False)
print(waffle_df)
print("\nSaved to waffle_data.csv!")