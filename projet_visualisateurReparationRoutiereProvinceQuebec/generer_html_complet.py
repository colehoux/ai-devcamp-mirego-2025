import json

# Charger les données
with open('/Users/philippebilodeau/Downloads/toutes_reparations.json', 'r', encoding='utf-8') as f:
    reparations = json.load(f)

# Créer le HTML avec les données intégrées
html_content = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travaux Routiers Québec - Vue Complète</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            overflow: hidden;
        }
        #header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #header h1 {
            font-size: 24px;
        }
        #counter {
            background: rgba(255,255,255,0.2);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
        #controls {
            background: white;
            padding: 15px 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .control-group label {
            font-size: 12px;
            font-weight: 600;
            color: #666;
        }
        select, input[type="text"] {
            padding: 8px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
        }
        select:focus, input[type="text"]:focus {
            border-color: #667eea;
        }
        #search {
            min-width: 300px;
        }
        button {
            padding: 8px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;
            margin-top: 18px;
        }
        button:hover {
            background: #5568d3;
        }
        #container {
            display: flex;
            height: calc(100vh - 135px);
        }
        #sidebar {
            width: 400px;
            background: white;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            padding: 15px;
        }
        #map {
            flex: 1;
        }
        .reparation-card {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .reparation-card:hover {
            border-color: #667eea;
            transform: translateX(3px);
            box-shadow: 0 3px 8px rgba(102, 126, 234, 0.15);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .route-badge {
            background: #667eea;
            color: white;
            padding: 4px 10px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 8px;
            min-width: 40px;
            text-align: center;
        }
        .card-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            flex: 1;
            line-height: 1.3;
        }
        .card-info {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
            line-height: 1.4;
        }
        .entrave-badge {
            background: #ff6b6b;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            display: inline-block;
            margin-top: 5px;
        }
        #no-results {
            text-align: center;
            padding: 40px 20px;
            color: #999;
            display: none;
        }
        .leaflet-popup-content {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
        }
        .popup-title {
            font-weight: bold;
            font-size: 15px;
            color: #667eea;
            margin-bottom: 8px;
        }
        .popup-info {
            font-size: 12px;
            margin: 4px 0;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div id="header">
        <h1>🚧 Travaux Routiers au Québec</h1>
        <div id="counter">510 / 510 chantiers</div>
    </div>

    <div id="controls">
        <div class="control-group">
            <label>🔍 Recherche</label>
            <input type="text" id="search" placeholder="Rechercher par localisation, type de travaux...">
        </div>
        <div class="control-group">
            <label>🛣️ Route</label>
            <select id="filter-route">
                <option value="">Toutes les routes</option>
            </select>
        </div>
        <div class="control-group">
            <label>🚧 Type de travaux</label>
            <select id="filter-type">
                <option value="">Tous les types</option>
            </select>
        </div>
        <button id="reset-btn">Réinitialiser</button>
    </div>

    <div id="container">
        <div id="sidebar">
            <div id="reparations-list"></div>
            <div id="no-results">
                <h3>Aucun résultat</h3>
                <p>Essayez de modifier vos filtres</p>
            </div>
        </div>
        <div id="map"></div>
    </div>

    <script>
        // Données intégrées directement
        const allReparations = """ + json.dumps(reparations, ensure_ascii=False) + """;

        let filteredReparations = allReparations;
        let map;
        let markerCluster;
        let allLayers = [];

        // Initialiser la carte
        map = L.map('map').setView([46.8, -71.2], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Initialiser le cluster de markers
        markerCluster = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false
        });

        // Initialiser
        populateFilters();
        displayReparations();

        // Peupler les filtres
        function populateFilters() {
            const routes = new Set();
            const types = new Set();

            allReparations.forEach(rep => {
                routes.add(rep.route || 'Non spécifié');
                types.add(rep.type_travaux);
            });

            const routeSelect = document.getElementById('filter-route');
            Array.from(routes).sort((a, b) => {
                if (a === 'Non spécifié') return 1;
                if (b === 'Non spécifié') return -1;
                return a.localeCompare(b, undefined, {numeric: true});
            }).forEach(route => {
                const option = document.createElement('option');
                option.value = route;
                option.textContent = route === 'Non spécifié' ? route : `Route ${route}`;
                routeSelect.appendChild(option);
            });

            const typeSelect = document.getElementById('filter-type');
            Array.from(types).sort().forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });
        }

        // Afficher les réparations
        function displayReparations() {
            const container = document.getElementById('reparations-list');
            const noResults = document.getElementById('no-results');
            container.innerHTML = '';

            // Nettoyer la carte
            markerCluster.clearLayers();
            map.removeLayer(markerCluster);

            if (filteredReparations.length === 0) {
                noResults.style.display = 'block';
                return;
            }

            noResults.style.display = 'none';

            filteredReparations.forEach(rep => {
                // Créer la carte dans la sidebar
                const card = document.createElement('div');
                card.className = 'reparation-card';

                const location = rep.localisation.split('\\n')[0];

                card.innerHTML = `
                    <div class="card-header">
                        <div class="route-badge">${rep.route || 'N/A'}</div>
                        <div class="card-title">${rep.type_travaux}</div>
                    </div>
                    <div class="card-info">📍 ${location}</div>
                    <div class="card-info">🧭 ${rep.direction}</div>
                    <div class="entrave-badge">${rep.entraveType}</div>
                `;

                card.addEventListener('click', () => {
                    zoomToReparation(rep);
                });

                container.appendChild(card);

                // Ajouter sur la carte
                addToMap(rep);
            });

            map.addLayer(markerCluster);
        }

        // Ajouter une réparation sur la carte
        function addToMap(rep) {
            if (!rep.geometry || !rep.geometry.coordinates) return;

            const coords = rep.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            // Créer la ligne
            const polyline = L.polyline(coords, {
                color: '#FF6A33',
                weight: 4,
                opacity: 0.7
            });

            // Créer le popup
            const popupContent = `
                <div class="popup-title">${rep.type_travaux}</div>
                <div class="popup-info"><strong>Route:</strong> ${rep.route || 'N/A'}</div>
                <div class="popup-info"><strong>Localisation:</strong><br>${rep.localisation.replace(/\\n/g, '<br>').substring(0, 200)}</div>
                <div class="popup-info"><strong>Direction:</strong> ${rep.direction}</div>
                <div class="popup-info"><strong>Type d'entrave:</strong> ${rep.entraveType}</div>
                <div class="popup-info"><strong>Période:</strong><br>${rep.debut.split(' ')[0]} → ${rep.fin.split(' ')[0]}</div>
            `;

            polyline.bindPopup(popupContent, { maxWidth: 300 });

            // Marker au début
            const marker = L.circleMarker(coords[0], {
                radius: 6,
                fillColor: '#667eea',
                color: 'white',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            });

            marker.bindPopup(popupContent, { maxWidth: 300 });

            markerCluster.addLayer(marker);
            markerCluster.addLayer(polyline);
        }

        // Zoomer sur une réparation
        function zoomToReparation(rep) {
            const coords = rep.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }

        // Filtrer les réparations
        function filterReparations() {
            const searchText = document.getElementById('search').value.toLowerCase();
            const routeFilter = document.getElementById('filter-route').value;
            const typeFilter = document.getElementById('filter-type').value;

            filteredReparations = allReparations.filter(rep => {
                const matchSearch = !searchText ||
                    rep.localisation.toLowerCase().includes(searchText) ||
                    rep.type_travaux.toLowerCase().includes(searchText) ||
                    rep.description.toLowerCase().includes(searchText);

                const matchRoute = !routeFilter || (rep.route || 'Non spécifié') === routeFilter;
                const matchType = !typeFilter || rep.type_travaux === typeFilter;

                return matchSearch && matchRoute && matchType;
            });

            displayReparations();
            updateCounter();
        }

        // Mettre à jour le compteur
        function updateCounter() {
            const counter = document.getElementById('counter');
            counter.textContent = `${filteredReparations.length} / ${allReparations.length} chantiers`;
        }

        // Event listeners
        document.getElementById('search').addEventListener('input', filterReparations);
        document.getElementById('filter-route').addEventListener('change', filterReparations);
        document.getElementById('filter-type').addEventListener('change', filterReparations);
        document.getElementById('reset-btn').addEventListener('click', () => {
            document.getElementById('search').value = '';
            document.getElementById('filter-route').value = '';
            document.getElementById('filter-type').value = '';
            filterReparations();
        });
    </script>
</body>
</html>
"""

# Sauvegarder le fichier
with open('/Users/philippebilodeau/Downloads/visualisation_complete.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✓ Visualisation complète générée avec succès!")
print("✓ Les données sont maintenant intégrées directement dans le HTML")
print("✓ Plus besoin de fichier JSON séparé!")
