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

threat_order = ['Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct']
threat_counts_filtered['threatLevel'] = pd.Categorical(
    threat_counts_filtered['threatLevel'], 
    categories=threat_order, 
    ordered=True
)
threat_counts_filtered = threat_counts_filtered.sort_values('threatLevel')

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

taxon_counts_group['taxonGroup'] = taxon_counts_group['taxonGroup'].replace(
    'crabs, lobsters, shrimps, woodlice', 'Crustaceans'
)

animal_groups = ['birds', 'mammals', 'reptiles', 'frogs', 'insects', 
                 'ray-finned fishes', 'sharks', 'Crustaceans']
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

#process data to create a dot map
tsx = pd.read_csv('tsx-aggregated-data-dataset.csv', low_memory=False)

dot_map = tsx[['TaxonomicGroup', 'RegionCentroidLatitude', 'RegionCentroidLongitude', 'EPBCStatus']].drop_duplicates()
dot_map.columns = ['taxonomicGroup', 'latitude', 'longitude', 'epbcStatus']
dot_map = dot_map.dropna()

dot_map = dot_map[
    (dot_map['latitude'] >= -44) &   # southern bound
    (dot_map['latitude'] <= -10) &   # northern bound
    (dot_map['longitude'] >= 113) &  # western bound
    (dot_map['longitude'] <= 154)    # eastern bound
]

print(f'Total dots after filtering: {len(dot_map)}')
dot_map.to_csv('dot_map.csv', index=False)
print('Saved to dot_map.csv')

# process marine species data
terrestrial_intro = pd.read_csv('IntroducedSpeciesOccurrencesByTerrestrialEcoregion.csv')

terrestrial_grouped = terrestrial_intro.groupby(['yearStart', 'griisStatus'])['speciesCount'].sum().reset_index()
terrestrial_grouped = terrestrial_grouped[terrestrial_grouped['yearStart'] >= 1970]

print(terrestrial_grouped)
terrestrial_grouped.to_csv('terrestrial_introduced.csv', index=False)
print('\nSaved to terrestrial_introduced.csv!')



# process lanad and marine introduced vs invasive species
terrestrial_intro = pd.read_csv('IntroducedSpeciesOccurrencesByTerrestrialEcoregion.csv')
marine_intro = pd.read_csv('IntroducedSpeciesOccurrencesByMarineEcoregion.csv')

# Process terrestrial
terrestrial_grouped = terrestrial_intro.groupby(['yearStart', 'griisStatus'])['speciesCount'].sum().reset_index()
terrestrial_grouped = terrestrial_grouped[terrestrial_grouped['yearStart'] >= 1970]
terrestrial_grouped['environment'] = 'Terrestrial'

# Process marine
marine_grouped = marine_intro.groupby(['yearStart', 'griisStatus'])['speciesCount'].sum().reset_index()
marine_grouped = marine_grouped[marine_grouped['yearStart'] >= 1970]
marine_grouped['environment'] = 'Marine'

# Combine
combined = pd.concat([terrestrial_grouped, marine_grouped])
combined = combined[combined['griisStatus'] != 'Native']

# Add category column BEFORE using it
combined['category'] = combined['environment'] + ' - ' + combined['griisStatus']

# Calculate percentage growth
combined['pct_growth'] = combined.groupby('category')['speciesCount'].transform(
    lambda x: (x / x.iloc[0] - 1) * 100
)

print(combined.head(20))
combined.to_csv('combined_introduced.csv', index=False)
print('\nSaved to combined_introduced.csv')

# process protection rate by threat level data
protection = pd.read_csv('ProtectionStatusAustralianTerrestrialSpeciesOccurrences.csv')

relevant = ['Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct']
protection = protection[protection['epbcStatus'].isin(relevant)]

prot_grouped = protection.groupby('epbcStatus').agg(
    totalRecords=('recordCount', 'sum'),
    protectedRecords=('protectedRecordCount', 'sum')
).reset_index()

prot_grouped = protection.groupby('epbcStatus').agg(
    totalRecords=('recordCount', 'sum'),
    protectedRecords=('protectedRecordCount', 'sum'),
    indigenousRecords=('indigenousProtectedRecordCount', 'sum')
).reset_index()

prot_grouped['protectionRate'] = (prot_grouped['protectedRecords'] / prot_grouped['totalRecords'] * 100).round(2)
prot_grouped['indigenousRate'] = (prot_grouped['indigenousRecords'] / prot_grouped['totalRecords'] * 100).round(2)
prot_grouped['nonIndigenousRate'] = (prot_grouped['protectionRate'] - prot_grouped['indigenousRate']).round(2)

stacked_rows = []
for _, row in prot_grouped.iterrows():
    stacked_rows.append({'epbcStatus': row['epbcStatus'], 'type': 'Indigenous Protected', 'rate': row['indigenousRate']})
    stacked_rows.append({'epbcStatus': row['epbcStatus'], 'type': 'Non-Indigenous Protected', 'rate': row['nonIndigenousRate']})
    stacked_rows.append({'epbcStatus': row['epbcStatus'], 'type': 'Unprotected', 'rate': round(100 - row['protectionRate'], 2)})

stacked_df = pd.DataFrame(stacked_rows)
print(stacked_df)
stacked_df.to_csv('protection_stacked.csv', index=False)
print('\nSaved to protection_stacked.csv')

# Calculate total protection rate across all threat levels
total_records = prot_grouped['totalRecords'].sum()
total_protected = prot_grouped['protectedRecords'].sum()
total_unprotected = total_records - total_protected

total_protection_rate = round((total_protected / total_records) * 100, 1)
total_unprotected_rate = round(100 - total_protection_rate, 1)

print(f"Total Protected: {total_protection_rate}%")
print(f"Total Unprotected: {total_unprotected_rate}%")

#process data for a correlation chart on ehwther protected areas are working
# Map IBRA regions to states
ibra_to_state = {
    'Arnhem Coast': 'Northern Territory',
    'Arnhem Plateau': 'Northern Territory',
    'Australian Alps': 'New South Wales',
    'Avon Wheatbelt': 'Western Australia',
    'Ben Lomond': 'Tasmania',
    'Brigalow Belt North': 'Queensland',
    'Brigalow Belt South': 'Queensland',
    'Broken Hill Complex': 'New South Wales',
    'Burt Plain': 'Northern Territory',
    'Cape York Peninsula': 'Queensland',
    'Carnarvon': 'Western Australia',
    'Central Arnhem': 'Northern Territory',
    'Central Kimberley': 'Western Australia',
    'Central Mackay Coast': 'Queensland',
    'Central Ranges': 'Northern Territory',
    'Channel Country': 'Queensland',
    'Cobar Peneplain': 'New South Wales',
    'Coolgardie': 'Western Australia',
    'Coral Sea': 'Queensland',
    'Daly Basin': 'Northern Territory',
    'Dampierland': 'Western Australia',
    'Darling Riverine Plains': 'New South Wales',
    'Darwin Coastal': 'Northern Territory',
    'Davenport Murchison Ranges': 'Northern Territory',
    'Desert Uplands': 'Queensland',
    'Einasleigh Uplands': 'Queensland',
    'Esperance Plains': 'Western Australia',
    'Eyre Yorke Block': 'South Australia',
    'Finke': 'Northern Territory',
    'Flinders Lofty Block': 'South Australia',
    'Furneaux': 'Tasmania',
    'Gascoyne': 'Western Australia',
    'Gawler': 'South Australia',
    'Geraldton Sandplains': 'Western Australia',
    'Gibson Desert': 'Western Australia',
    'Great Sandy Desert': 'Western Australia',
    'Great Victoria Desert': 'Western Australia',
    'Gulf Coastal': 'Queensland',
    'Gulf Fall and Uplands': 'Queensland',
    'Gulf Plains': 'Queensland',
    'Hampton': 'South Australia',
    'Indian Tropical Islands': 'Western Australia',
    'Jarrah Forest': 'Western Australia',
    'Kanmantoo': 'South Australia',
    'King': 'Tasmania',
    'Little Sandy Desert': 'Western Australia',
    'MacDonnell Ranges': 'Northern Territory',
    'Mallee': 'Victoria',
    'Mitchell Grass Downs': 'Queensland',
    'Mount Isa Inlier': 'Queensland',
    'Mulga Lands': 'Queensland',
    'Murchison': 'Western Australia',
    'Murray Darling Depression': 'New South Wales',
    'NSW North Coast': 'New South Wales',
    'NSW South Western Slopes': 'New South Wales',
    'Nandewar': 'New South Wales',
    'Naracoorte Coastal Plain': 'South Australia',
    'New England Tablelands': 'New South Wales',
    'Northern Kimberley': 'Western Australia',
    'Nullarbor': 'South Australia',
    'Ord Victoria Plain': 'Western Australia',
    'Pacific Subtropical Islands': 'Queensland',
    'Pilbara': 'Western Australia',
    'Pine Creek': 'Northern Territory',
    'Riverina': 'New South Wales',
    'Simpson Strzelecki Dunefields': 'South Australia',
    'South East Coastal Plain': 'Victoria',
    'South East Corner': 'New South Wales',
    'South Eastern Highlands': 'New South Wales',
    'South Eastern Queensland': 'Queensland',
    'Southern Volcanic Plain': 'Victoria',
    'Stony Plains': 'South Australia',
    'Sturt Plateau': 'Northern Territory',
    'Subantarctic Islands': 'Tasmania',
    'Swan Coastal Plain': 'Western Australia',
    'Sydney Basin': 'New South Wales',
    'Tanami': 'Northern Territory',
    'Tasmanian Central Highlands': 'Tasmania',
    'Tasmanian Northern Midlands': 'Tasmania',
    'Tasmanian Northern Slopes': 'Tasmania',
    'Tasmanian South East': 'Tasmania',
    'Tasmanian Southern Ranges': 'Tasmania',
    'Tasmanian West': 'Tasmania',
    'Tiwi Cobourg': 'Northern Territory',
    'Victoria Bonaparte': 'Western Australia',
    'Victorian Midlands': 'Victoria',
    'Warren': 'Western Australia',
    'Wet Tropics': 'Queensland',
    'Yalgoo': 'Western Australia'
}

protection_corr = pd.read_csv('protection_correlation.csv')
protection_corr['state'] = protection_corr['ibraRegion'].map(ibra_to_state)
protection_corr = protection_corr.dropna(subset=['state'])

state_protection = protection_corr.groupby('state').agg(
    avgProtectionRate=('protectionRate', 'mean'),
    totalSpecies=('speciesCount', 'sum')
).reset_index().round(2)

print(state_protection)
state_protection.to_csv('state_protection.csv', index=False)
print('\nSaved to state_protection.csv!')