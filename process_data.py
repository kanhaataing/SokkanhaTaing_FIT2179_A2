import pandas as pd

df = pd.read_csv('Endangered_Wildlife.csv', header=[0, 1])

# create csv file for choropleth map on the threat status of biodiveristy by state
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
print("\nSaved to threat_by_state.csv")

# process data and create separate csv for proportion of species by threat level graph
threat_counts = threat_status.value_counts().reset_index()
threat_counts.columns = ['threatLevel', 'count']

print(threat_counts)
threat_counts.to_csv('threat_levels.csv', index=False)
print("\nSaved to threat_levels.csv")


threat_counts_filtered = threat_counts[threat_counts['threatLevel'].isin([
    'Endangered', 'Vulnerable', 'Critically Endangered', 'Extinct'
])]

total = threat_counts_filtered['count'].sum()
waffle_data = []
square = 0

for _, row in threat_counts_filtered.iterrows():
    n_squares = round((row['count'] / total) * 100)
    for _ in range(n_squares):
        if square >= 100: 
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
print("\nSaved to waffle_data.csv")

#adding another data csv
tsx = pd.read_csv('tsx-aggregated-data-dataset.csv', low_memory=False)

#process data for chart showing count threatened species by taxonomic group

taxon_group = df[('Taxonomic Data', 'Taxon Group')]
threat = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threat Status')]

taxon_df = pd.DataFrame({'taxonGroup': taxon_group, 'threatLevel': threat})
taxon_df = taxon_df[taxon_df['threatLevel'].notna()]

taxon_counts_group = taxon_df.groupby('taxonGroup').size().reset_index(name='count')
taxon_counts_group = taxon_counts_group.sort_values('count', ascending=False)

animal_groups = ['birds', 'mammals', 'reptiles', 'frogs', 'insects', 
                 'ray-finned fishes', 'sharks', 'crabs, lobsters, shrimps, woodlice']
taxon_counts_group = taxon_counts_group[taxon_counts_group['taxonGroup'].isin(animal_groups)]

print(taxon_counts_group)
taxon_counts_group.to_csv('taxon_group_counts.csv', index=False)
print('\nSaved to taxon_group_counts.csv')



# process data for species listed as threatened by year
taxon = df[('Taxonomic Data', 'Taxon Group')]
dates = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threatened Species Date Effective')]
threat_status = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threat Status')]

listing_df2 = pd.DataFrame({
    'date': dates, 
    'threatLevel': threat_status,
    'taxonGroup': taxon
})

animal_groups = ['birds', 'mammals', 'reptiles', 'frogs', 'ray-finned fishes']

listing_df2 = listing_df2[listing_df2['date'].notna()]
listing_df2 = listing_df2[listing_df2['threatLevel'].isin(['Vulnerable', 'Endangered', 'Critically Endangered'])]
listing_df2 = listing_df2[listing_df2['taxonGroup'].isin(animal_groups)]

listing_df2['year'] = pd.to_datetime(listing_df2['date'], format='%d-%b-%Y').dt.year

listing_counts2 = listing_df2.groupby(['year', 'threatLevel', 'taxonGroup']).size().reset_index(name='count')
listing_counts2 = listing_counts2.sort_values('year')
listing_counts2['cumulative'] = listing_counts2.groupby(['threatLevel', 'taxonGroup'])['count'].cumsum()

print(listing_counts2)
listing_counts2.to_csv('listing_trends.csv', index=False)
print('\nSaved to listing_trends.csv')

#calcaulate big number callout values
threat_status = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threat Status')]

counts = threat_status.value_counts()
print("=== Big Number Callout Values ===")
print(f"Critically Endangered: {counts.get('Critically Endangered', 0)}")
print(f"Endangered: {counts.get('Endangered', 0)}")
print(f"Vulnerable: {counts.get('Vulnerable', 0)}")
print(f"Extinct: {counts.get('Extinct', 0)}")
print(f"Total threatened: {counts.get('Critically Endangered', 0) + counts.get('Endangered', 0) + counts.get('Vulnerable', 0)}")

#process data to create a csv of taxon groups and threat level counts
animal_groups = ['birds', 'mammals', 'reptiles', 'frogs', 'insects', 
                 'ray-finned fishes', 'sharks']

taxon_group = df[('Taxonomic Data', 'Taxon Group')]
threat_status = df[('EPBC Act Threatened, Migratory, Marine and Cetacean Species ', 'EPBC Threat Status')]

taxon_df = pd.DataFrame({'taxonGroup': taxon_group, 'threatLevel': threat_status})
taxon_df = taxon_df[taxon_df['threatLevel'].notna()]
taxon_df = taxon_df[taxon_df['taxonGroup'].isin(animal_groups)]
taxon_df = taxon_df[taxon_df['threatLevel'].isin(['Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct'])]

taxon_threat = taxon_df.groupby(['taxonGroup', 'threatLevel']).size().reset_index(name='count')
print(taxon_threat)
taxon_threat.to_csv('taxon_threat.csv', index=False)
print('\nSaved to taxon_threat.csv!')