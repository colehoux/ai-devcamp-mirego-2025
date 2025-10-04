import json

# Charger le fichier GeoJSON complet
print("Chargement du fichier GeoJSON...")
with open('/Users/philippebilodeau/Downloads/TravauxRoutiers.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Nombre total de réparations: {len(data['features'])}")

# Extraire toutes les réparations
reparations = []

for feature in data['features']:
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
        'entraveType': props['entraveType'],
        'geometry': feature['geometry'],
        'bbox': feature['bbox']
    }
    reparations.append(reparation)

# Sauvegarder toutes les données
print("Sauvegarde des données...")
with open('/Users/philippebilodeau/Downloads/toutes_reparations.json', 'w', encoding='utf-8') as f:
    json.dump(reparations, f, ensure_ascii=False, indent=2)

print(f"✓ {len(reparations)} réparations exportées dans: toutes_reparations.json")

# Statistiques
routes = {}
types_travaux = {}
for rep in reparations:
    # Compter les routes
    route = rep['route'] if rep['route'] else 'Non spécifié'
    routes[route] = routes.get(route, 0) + 1

    # Compter les types de travaux
    type_t = rep['type_travaux']
    types_travaux[type_t] = types_travaux.get(type_t, 0) + 1

print("\n=== STATISTIQUES ===")
print(f"\nTop 10 routes avec le plus de travaux:")
for route, count in sorted(routes.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"  Route {route}: {count} chantiers")

print(f"\nTop 10 types de travaux:")
for type_t, count in sorted(types_travaux.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"  {type_t}: {count} chantiers")
