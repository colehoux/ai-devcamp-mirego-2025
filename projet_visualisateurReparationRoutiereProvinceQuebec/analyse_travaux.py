import json

# Charger le fichier GeoJSON
with open('/Users/philippebilodeau/Downloads/TravauxRoutiers.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extraire 3 réparations intéressantes
reparations = []
features = data['features']

# Sélectionner 3 réparations variées
selected_indices = [0, 7, 9]  # Tunnel La Fontaine, desserte rue Curatteau, A-40 peinture

for idx in selected_indices:
    feature = features[idx]
    props = feature['properties']

    reparation = {
        'id': props['identifiant'],
        'route': props['routeAutoroute'],
        'type_travaux': props['identificationDesTravaux'],
        'localisation': props['localisation'],
        'direction': props['direction'],
        'entrave': props['entrave'],
        'debut': props['debut'],
        'fin': props['fin'],
        'description': props['descriptionFrancais'],
        'detours': props['detoursEtItinerairesFacultatifs'],
        'geometry': feature['geometry'],
        'bbox': feature['bbox']
    }
    reparations.append(reparation)

# Afficher l'analyse
print("="*80)
print("ANALYSE DE 3 RÉPARATIONS ROUTIÈRES")
print("="*80)

for i, rep in enumerate(reparations, 1):
    print(f"\n{'='*80}")
    print(f"RÉPARATION #{i}")
    print(f"{'='*80}")
    print(f"ID: {rep['id']}")
    print(f"Route/Autoroute: {rep['route']}")
    print(f"Type de travaux: {rep['type_travaux']}")
    print(f"Période: {rep['debut']} → {rep['fin']}")
    print(f"\nLocalisation:")
    print(f"  {rep['localisation']}")
    print(f"\nDirection: {rep['direction']}")
    print(f"\nEntrave:")
    print(f"  {rep['entrave']}")
    if rep['detours']:
        print(f"\nDétours:")
        print(f"  {rep['detours']}")
    print(f"\nDescription complète:")
    for line in rep['description'].split('\r\n'):
        if line.strip():
            print(f"  {line}")

# Sauvegarder les données pour la visualisation
with open('/Users/philippebilodeau/Downloads/reparations_selected.json', 'w', encoding='utf-8') as f:
    json.dump(reparations, f, ensure_ascii=False, indent=2)

print(f"\n{'='*80}")
print("Données sauvegardées dans: reparations_selected.json")
print("="*80)
