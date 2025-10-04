// Base de données des installations sportives
const facilities = [
    // PISCINES INTÉRIEURES
    {
        id: 1,
        name: 'Arpidrome',
        type: 'piscine',
        ville: 'charlesbourg',
        lat: 46.8584,
        lng: -71.2698,
        address: '750 rue de la Sorbonne, Charlesbourg',
        availability: 'available',
        horaires: {
            lundi: '19h45 - 21h45',
            mardi: '07h00 - 08h30, 11h30 - 13h00',
            mercredi: '07h00 - 08h30, 11h30 - 13h00, 20h00 - 21h30',
            jeudi: '07h00 - 08h30',
            vendredi: '11h30 - 13h00, 19h45 - 21h45',
            samedi: '14h30 - 17h00',
            dimanche: '07h00 - 08h30'
        }
    },
    {
        id: 2,
        name: 'Centre communautaire Ferland',
        type: 'piscine',
        ville: 'quebec',
        lat: 46.8252,
        lng: -71.2428,
        address: '1600, 8e Avenue, La Cité-Limoilou',
        availability: 'available',
        horaires: {
            lundi: '12h00 - 13h20, 19h00 - 20h25',
            mardi: '12h00 - 13h20, 19h00 - 20h25',
            mercredi: '12h00 - 13h20, 14h30 - 15h55, 19h00 - 20h20, 20h30 - 21h55',
            jeudi: '15h00 - 16h25',
            vendredi: '12h00 - 13h20, 19h00 - 20h20, 20h30 - 21h55',
            samedi: '14h00 - 15h30, 19h00 - 20h25',
            dimanche: '14h00 - 15h30'
        }
    },
    {
        id: 3,
        name: 'Centre communautaire Lucien-Borne',
        type: 'piscine',
        ville: 'quebec',
        lat: 46.8020,
        lng: -71.2295,
        address: '100 chemin Sainte-Foy, La Cité-Limoilou',
        availability: 'available',
        horaires: {
            lundi: '07h00 - 08h30, 11h45 - 13h30, 18h30 - 20h00',
            mardi: '07h00 - 08h30, 11h45 - 13h30, 18h30 - 20h00',
            mercredi: '07h00 - 08h30, 11h45 - 13h30, 18h30 - 20h00',
            jeudi: '07h00 - 08h30, 11h45 - 13h30, 18h30 - 20h00',
            vendredi: '07h00 - 08h30, 11h45 - 13h30',
            samedi: '14h00 - 15h45, 19h00 - 20h45',
            dimanche: '14h00 - 15h45, 19h00 - 20h45'
        }
    },
    {
        id: 4,
        name: 'Centre communautaire Michel-Labadie',
        type: 'piscine',
        ville: 'les-rivieres',
        lat: 46.8745,
        lng: -71.3189,
        address: '3705 avenue Chauveau, Les Rivières',
        availability: 'available',
        horaires: {
            lundi: '11h45 - 13h15, 19h00 - 20h25',
            mardi: '10h00 - 11h45, 12h00 - 13h15, 19h00 - 20h25',
            mercredi: 'Fermé',
            jeudi: '11h45 - 13h15, 19h00 - 20h25',
            vendredi: '11h50 - 13h15, 19h00 - 20h40',
            samedi: '14h00 - 15h25',
            dimanche: '14h00 - 15h25'
        }
    },
    {
        id: 5,
        name: 'Centre municipal Monseigneur-De Laval',
        type: 'piscine',
        ville: 'beauport',
        lat: 46.8647,
        lng: -71.1928,
        address: '2 rue du Fargy, Beauport',
        availability: 'available',
        horaires: {
            lundi: '12h00 - 13h25, 13h45 - 15h15, 17h30 - 19h00',
            mardi: '12h00 - 13h25, 13h45 - 15h15',
            mercredi: '12h00 - 13h25, 13h45 - 15h15, 17h30 - 19h15, 19h30 - 20h30',
            jeudi: '12h00 - 13h25, 13h45 - 15h15, 17h30 - 19h15',
            vendredi: '12h00 - 13h25, 17h30 - 19h15, 19h30 - 20h30',
            samedi: 'Fermé',
            dimanche: 'Fermé'
        }
    },
    {
        id: 6,
        name: "Piscine de l'école L'Odyssée",
        type: 'piscine',
        ville: 'la-haute-saint-charles',
        lat: 46.9088,
        lng: -71.3683,
        address: "1485 rue de l'Innovation, La Haute-Saint-Charles",
        availability: 'available',
        horaires: {
            lundi: '11h35 - 12h40, 19h45 - 21h15',
            mardi: '20h15 - 21h45',
            mercredi: '06h30 - 08h00, 11h35 - 12h40, 20h15 - 21h45',
            jeudi: '20h15 - 21h45',
            vendredi: '11h35 - 12h40, 19h30 - 21h00',
            samedi: '14h00 - 16h00, 19h00 - 20h30',
            dimanche: '14h00 - 16h00, 19h00 - 20h30'
        }
    },
    {
        id: 7,
        name: "Piscine de l'édifice Denis-Giguère",
        type: 'piscine',
        ville: 'la-haute-saint-charles',
        lat: 46.8956,
        lng: -71.3892,
        address: '305 rue Racine, La Haute-Saint-Charles',
        availability: 'available',
        horaires: {
            lundi: '12h00 - 13h25, 13h30 - 14h25, 14h30 - 15h25',
            mardi: '06h30 - 08h30, 12h00 - 13h30, 18h00 - 19h55',
            mercredi: '12h05 - 13h30, 15h00 - 16h30',
            jeudi: '06h30 - 08h30, 12h00 - 13h30, 18h00 - 19h55, 20h00 - 21h00',
            vendredi: '12h00 - 13h25, 13h30 - 14h25, 14h30 - 15h25, 19h00 - 20h30',
            samedi: '13h30 - 14h55, 15h00 - 16h00',
            dimanche: '13h30 - 14h55, 15h00 - 16h00'
        }
    },
    {
        id: 8,
        name: 'Piscine Sylvie-Bernier',
        type: 'piscine',
        ville: 'sainte-foy',
        lat: 46.7743,
        lng: -71.2889,
        address: '3020 boulevard Hochelaga, Sainte-Foy–Sillery–Cap-Rouge',
        availability: 'available',
        horaires: {
            lundi: '06h30 - 08h30, 12h05 - 13h05, 18h15 - 19h10, 19h15 - 20h10',
            mardi: '06h30 - 08h30, 12h05 - 13h05, 17h00 - 18h20, 21h00 - 22h30',
            mercredi: '06h30 - 08h30, 12h05 - 13h05, 18h30 - 19h55',
            jeudi: '06h30 - 08h30, 12h05 - 13h05',
            vendredi: '06h30 - 08h30, 12h05 - 13h05, 20h45 - 22h15',
            samedi: '13h30 - 16h00',
            dimanche: '13h30 - 15h55, 18h30 - 19h55, 20h00 - 21h30'
        }
    },

    // TERRAINS DE TENNIS
    { id: 9, name: 'Parc Victoria - Tennis', type: 'tennis', ville: 'quebec', lat: 46.8024, lng: -71.2178, address: '160 rue du Cardinal-Maurice-Roy, La Cité-Limoilou', availability: 'available' },
    { id: 10, name: 'Chalet de tennis Courville', type: 'tennis', ville: 'beauport', lat: 46.8822, lng: -71.1725, address: '2271 avenue Larue, Beauport', availability: 'available' },
    { id: 11, name: 'Parc Saint-Ignace - Tennis', type: 'tennis', ville: 'beauport', lat: 46.8901, lng: -71.1547, address: '3300 chemin Royal, Beauport', availability: 'available' },
    { id: 12, name: 'Arpitennis', type: 'tennis', ville: 'charlesbourg', lat: 46.8590, lng: -71.2693, address: '570, 79e Rue Est, Charlesbourg', availability: 'available' },
    { id: 13, name: 'Parc Maria-Goretti - Tennis', type: 'tennis', ville: 'charlesbourg', lat: 46.8517, lng: -71.2836, address: '7475 avenue Paul-Comtois, Charlesbourg', availability: 'available' },
    { id: 14, name: 'Parc de La Chanterelle - Tennis', type: 'tennis', ville: 'la-haute-saint-charles', lat: 46.9089, lng: -71.3686, address: "1525 rue de l'Innovation, La Haute-Saint-Charles", availability: 'available' },
    { id: 15, name: 'Parc des Sources - Tennis', type: 'tennis', ville: 'sainte-foy', lat: 46.7851, lng: -71.2667, address: '1140 rue du Capitaine-Bernier, Sainte-Foy', availability: 'available' },
    { id: 16, name: 'Parc Provancher - Tennis', type: 'tennis', ville: 'sainte-foy', lat: 46.7651, lng: -71.3051, address: '4170 rue Michel-Hervé, Sainte-Foy', availability: 'available' },
    { id: 17, name: 'Parc des Trois-Saisons - Tennis', type: 'tennis', ville: 'sainte-foy', lat: 46.7692, lng: -71.2851, address: '1469 rue Buffon, Sainte-Foy', availability: 'available' },
    { id: 18, name: 'Parc Raymond-De Rosa - Tennis', type: 'tennis', ville: 'sainte-foy', lat: 46.7713, lng: -71.2981, address: '3224 rue Armand-Hamelin, Sainte-Foy', availability: 'available' },
    { id: 19, name: 'Parc Bardy - Tennis', type: 'tennis', ville: 'quebec', lat: 46.8150, lng: -71.2316, address: '2025 rue Adjutor-Rivard, La Cité-Limoilou', availability: 'available' },
    { id: 20, name: 'Parc Saint-Mathieu - Tennis', type: 'tennis', ville: 'sainte-foy', lat: 46.7825, lng: -71.2731, address: '1000 rue de Bar-le-Duc, Sainte-Foy', availability: 'available' },

    // TERRAINS DE SOCCER
    { id: 21, name: 'Complexe de soccer Chauveau', type: 'soccer', ville: 'les-rivieres', lat: 46.8964, lng: -71.3255, address: "7200 boulevard de l'Ormière, Les Rivières", availability: 'available' },
    { id: 22, name: 'Parc Victoria - Soccer', type: 'soccer', ville: 'quebec', lat: 46.8024, lng: -71.2178, address: '160 rue du Cardinal-Maurice-Roy, La Cité-Limoilou', availability: 'available' },
    { id: 23, name: 'Parc de la Ribambelle - Soccer', type: 'soccer', ville: 'beauport', lat: 46.8851, lng: -71.1892, address: '333 rue Perroteau, Beauport', availability: 'available' },
    { id: 24, name: 'Parc du Périgord - Soccer', type: 'soccer', ville: 'charlesbourg', lat: 46.8278, lng: -71.2896, address: '12050 boulevard Henri-Bourassa, Charlesbourg', availability: 'available' },
    { id: 25, name: 'Terrain de soccer Francheville', type: 'soccer', ville: 'beauport', lat: 46.8752, lng: -71.1588, address: '3928 boulevard Sainte-Anne, Beauport', availability: 'available' },
    { id: 26, name: 'Terrain de soccer du C.F.P.-Limoilou', type: 'soccer', ville: 'quebec', lat: 46.8253, lng: -71.2433, address: '2050, 8e Avenue, La Cité-Limoilou', availability: 'available' },

    // TERRAINS DE BASKETBALL
    { id: 27, name: 'Parc Bardy - Basketball', type: 'basketball', ville: 'quebec', lat: 46.8150, lng: -71.2316, address: '2025 rue Adjutor-Rivard, La Cité-Limoilou', availability: 'available' },
    { id: 28, name: 'Parc Bon-Pasteur - Basketball', type: 'basketball', ville: 'quebec', lat: 46.8119, lng: -71.2242, address: '395 rue du Bienheureux-Jean-XXIII, La Cité-Limoilou', availability: 'available' },
    { id: 29, name: 'École secondaire De Rochebelle - Basketball', type: 'basketball', ville: 'sainte-foy', lat: 46.7739, lng: -71.2820, address: '1095 avenue De Rochebelle, Sainte-Foy', availability: 'available' },
    { id: 30, name: 'Parc Saint-Charles-Garnier - Basketball', type: 'basketball', ville: 'sainte-foy', lat: 46.7691, lng: -71.2899, address: '1700 rue Sheppard, Sainte-Foy', availability: 'available' },

    // TERRAINS DE BASEBALL
    { id: 31, name: 'Parc Antoine-Masson - Baseball', type: 'baseball', ville: 'les-rivieres', lat: 46.8388, lng: -71.3018, address: "2650 avenue D'Alembert, Les Rivières", availability: 'available' },
    { id: 32, name: 'Parc Bardy - Baseball', type: 'baseball', ville: 'quebec', lat: 46.8150, lng: -71.2316, address: '2025 rue Adjutor-Rivard, La Cité-Limoilou', availability: 'available' },
    { id: 33, name: 'Parc Saint-Yves - Baseball', type: 'baseball', ville: 'sainte-foy', lat: 46.7582, lng: -71.3164, address: '2530 rue Anthony-Law, Sainte-Foy', availability: 'available' },
    { id: 34, name: 'Parc Maria-Goretti - Baseball', type: 'baseball', ville: 'charlesbourg', lat: 46.8517, lng: -71.2836, address: '7475 avenue Paul-Comtois, Charlesbourg', availability: 'available' },

    // VOLLEYBALL DE PLAGE
    { id: 35, name: 'Parc Noël-Langlois - Volleyball', type: 'volleyball', ville: 'beauport', lat: 46.8812, lng: -71.1692, address: '99 rue de la Terrasse-Orléans, Beauport', availability: 'available' },
    { id: 36, name: 'Parc Saint-Jérôme - Volleyball', type: 'volleyball', ville: 'charlesbourg', lat: 46.8604, lng: -71.2744, address: '585, 64e Rue Est, Charlesbourg', availability: 'available' },
    { id: 37, name: 'Base de plein air de Sainte-Foy - Volleyball', type: 'volleyball', ville: 'sainte-foy', lat: 46.7597, lng: -71.3222, address: '3137 rue Laberge, Sainte-Foy', availability: 'available' },
];

// Gestion de la navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');

        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(sectionId).classList.add('active');

        if (sectionId === 'explorer') {
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
});

// Initialisation de la carte Leaflet
let map, markers = [];

function initMap() {
    map = L.map('map').setView([46.8139, -71.2080], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Afficher tous les marqueurs au démarrage
    updateMap(facilities);
}

function updateMap(filteredFacilities = facilities) {
    // Supprimer les anciens marqueurs
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Créer des icônes personnalisées
    const iconColors = {
        tennis: '🎾',
        piscine: '🏊',
        soccer: '⚽',
        basketball: '🏀',
        volleyball: '🏐',
        baseball: '⚾'
    };

    filteredFacilities.forEach(facility => {
        const customIcon = L.divIcon({
            html: `<div style="font-size: 24px;">${iconColors[facility.type]}</div>`,
            className: 'custom-marker',
            iconSize: [30, 30]
        });

        const marker = L.marker([facility.lat, facility.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <strong>${facility.name}</strong><br>
                ${facility.address}<br>
                <span style="color: ${
                    facility.availability === 'available' ? '#065f46' :
                    facility.availability === 'limited' ? '#92400e' : '#991b1b'
                }">
                    ${
                        facility.availability === 'available' ? '✓ Disponible' :
                        facility.availability === 'limited' ? '⚠ Peu de places' : '✗ Complet'
                    }
                </span>
            `);

        // Ajouter événement clic sur le marqueur
        marker.on('click', () => {
            selectFacility(facility.id);
            // Scroller jusqu'à la carte
            const card = document.querySelector(`[data-facility-id="${facility.id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        markers.push(marker);
    });

    // Centrer la carte sur les marqueurs
    if (filteredFacilities.length > 0) {
        const bounds = L.latLngBounds(filteredFacilities.map(f => [f.lat, f.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

let selectedFacilityId = null;
let isMapLocked = false;

function displayFacilities(filteredFacilities = []) {
    const grid = document.getElementById('facilities-grid');

    if (filteredFacilities.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">Utilisez les filtres ci-dessus pour rechercher des installations sportives.</p>';
        return;
    }

    const availabilityText = {
        'available': 'Disponible',
        'limited': 'Peu de places',
        'full': 'Complet'
    };

    const typeText = {
        'tennis': 'Tennis',
        'piscine': 'Piscine',
        'soccer': 'Soccer',
        'basketball': 'Basketball',
        'volleyball': 'Volleyball',
        'baseball': 'Baseball'
    };

    grid.innerHTML = filteredFacilities.map(facility => `
        <div class="facility-card"
             data-facility-id="${facility.id}"
             onmouseenter="hoverFacility(${facility.id})"
             onmouseleave="unhoverFacility()"
             onclick="handleCardClick(event, ${facility.id})">
            <span class="availability-badge ${facility.availability}">${availabilityText[facility.availability]}</span>
            <h3>${facility.name}</h3>
            <p><strong>Type:</strong> ${typeText[facility.type]}</p>
            <p><strong>📍 Adresse:</strong> ${facility.address}</p>
            <p><strong>Ville:</strong> ${facility.ville.charAt(0).toUpperCase() + facility.ville.slice(1)}</p>
            <div class="reserve-btn-container" id="reserve-btn-${facility.id}" style="display: none;">
                <button class="reserve-btn" onclick="handleReserveClick(event, ${facility.id})">
                    ${facility.type === 'piscine' ? 'Voir l\'horaire' : 'Réserver maintenant'}
                </button>
            </div>
        </div>
    `).join('');
}

function handleCardClick(event, facilityId) {
    event.stopPropagation();
    selectFacility(facilityId);
}

function handleReserveClick(event, facilityId) {
    event.stopPropagation();
    const facility = facilities.find(f => f.id === facilityId);
    if (facility && facility.type === 'piscine') {
        showPoolSchedule(facilityId);
    } else {
        openReservationForm(facilityId);
    }
}

function hoverFacility(id) {
    if (isMapLocked) return;

    const facility = facilities.find(f => f.id === id);
    if (facility) {
        map.flyTo([facility.lat, facility.lng], 15, {
            animate: true,
            duration: 0.8
        });
        const marker = markers.find(m =>
            m.getLatLng().lat === facility.lat &&
            m.getLatLng().lng === facility.lng
        );
        if (marker) {
            setTimeout(() => marker.openPopup(), 400);
        }
    }
}

function unhoverFacility() {
    if (isMapLocked) return;
    // Optionnel: fermer le popup si pas locked
    map.closePopup();
}

function selectFacility(id) {
    console.log('selectFacility called with id:', id);

    // Désélectionner l'ancienne carte
    if (selectedFacilityId && selectedFacilityId !== id) {
        const oldBtn = document.getElementById(`reserve-btn-${selectedFacilityId}`);
        if (oldBtn) {
            oldBtn.style.display = 'none';
        }

        const oldCard = document.querySelector(`[data-facility-id="${selectedFacilityId}"]`);
        if (oldCard) {
            oldCard.classList.remove('selected');
        }
    }

    // Si on clique sur la même carte, ne rien faire
    if (selectedFacilityId === id) {
        return;
    }

    // Sélectionner la nouvelle carte
    selectedFacilityId = id;
    isMapLocked = true;

    const facility = facilities.find(f => f.id === id);
    if (!facility) {
        console.error('Facility not found:', id);
        return;
    }

    // Zoomer sur la map et locker
    map.flyTo([facility.lat, facility.lng], 16, {
        animate: true,
        duration: 1
    });

    const marker = markers.find(m =>
        m.getLatLng().lat === facility.lat &&
        m.getLatLng().lng === facility.lng
    );
    if (marker) {
        setTimeout(() => marker.openPopup(), 500);
    }

    // Ajouter classe selected à la carte
    const card = document.querySelector(`[data-facility-id="${id}"]`);
    if (card) {
        card.classList.add('selected');
    } else {
        console.error('Card not found for id:', id);
    }

    // Afficher le bouton réserver
    const btnContainer = document.getElementById(`reserve-btn-${id}`);
    if (btnContainer) {
        btnContainer.style.display = 'block';
        console.log('Button container shown for id:', id);

        // Scroller jusqu'à la carte sélectionnée pour voir le bouton
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        console.error('Button container not found for id:', id);
    }
}

function openReservationForm(facilityId) {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    // Remplir les informations de l'installation
    document.getElementById('facility-id').value = facility.id;
    document.getElementById('facility-name-display').value = facility.name;
    document.getElementById('form-title').textContent = `Réserver - ${facility.name}`;

    // Réinitialiser le formulaire
    document.getElementById('dynamic-reservation-form').reset();
    document.getElementById('facility-id').value = facility.id;
    document.getElementById('facility-name-display').value = facility.name;

    // Définir la date minimum à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('res-date').setAttribute('min', today);

    // Afficher le formulaire
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('reservation-form').classList.add('active');
}

function closeReservationForm() {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('explorer').classList.add('active');
}

function showPoolSchedule(facilityId) {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility || !facility.horaires) return;

    // Créer le contenu HTML de l'horaire
    const scheduleHTML = `
        <div class="pool-schedule">
            <button class="modal-close-btn" onclick="closePoolSchedule()">&times;</button>
            <h2>${facility.name}</h2>
            <p class="pool-address"><strong>📍</strong> ${facility.address}</p>
            <div class="schedule-grid">
                <div class="schedule-row">
                    <div class="day-label">Lundi</div>
                    <div class="time-value">${facility.horaires.lundi}</div>
                </div>
                <div class="schedule-row">
                    <div class="day-label">Mardi</div>
                    <div class="time-value">${facility.horaires.mardi}</div>
                </div>
                <div class="schedule-row">
                    <div class="day-label">Mercredi</div>
                    <div class="time-value">${facility.horaires.mercredi}</div>
                </div>
                <div class="schedule-row">
                    <div class="day-label">Jeudi</div>
                    <div class="time-value">${facility.horaires.jeudi}</div>
                </div>
                <div class="schedule-row">
                    <div class="day-label">Vendredi</div>
                    <div class="time-value">${facility.horaires.vendredi}</div>
                </div>
                <div class="schedule-row weekend">
                    <div class="day-label">Samedi</div>
                    <div class="time-value">${facility.horaires.samedi}</div>
                </div>
                <div class="schedule-row weekend">
                    <div class="day-label">Dimanche</div>
                    <div class="time-value">${facility.horaires.dimanche}</div>
                </div>
            </div>
        </div>
    `;

    // Créer et afficher la modale
    const modal = document.createElement('div');
    modal.id = 'pool-schedule-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            ${scheduleHTML}
        </div>
    `;
    document.body.appendChild(modal);

    // Fermer avec click sur overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePoolSchedule();
        }
    });
}

function closePoolSchedule() {
    const modal = document.getElementById('pool-schedule-modal');
    if (modal) {
        modal.remove();
    }
}

function focusOnFacility(id) {
    const facility = facilities.find(f => f.id === id);
    if (facility) {
        map.setView([facility.lat, facility.lng], 16);
        markers.find(m => m.getLatLng().lat === facility.lat && m.getLatLng().lng === facility.lng).openPopup();
    }
}

// Filtres
document.getElementById('filter-ville').addEventListener('change', applyFilters);
document.getElementById('filter-sport').addEventListener('change', applyFilters);

function applyFilters() {
    const villeFilter = document.getElementById('filter-ville').value;
    const sportFilter = document.getElementById('filter-sport').value;

    // Réinitialiser la sélection
    selectedFacilityId = null;
    isMapLocked = false;

    let filtered = facilities;

    // Appliquer les filtres
    if (villeFilter) {
        filtered = filtered.filter(f => f.ville === villeFilter);
    }

    if (sportFilter) {
        filtered = filtered.filter(f => f.type === sportFilter);
    }

    // Toujours mettre à jour la carte avec les résultats filtrés
    updateMap(filtered);

    // N'afficher la grille que si au moins un filtre est sélectionné
    if (!villeFilter && !sportFilter) {
        displayFacilities([]);
    } else {
        displayFacilities(filtered);
    }
}

// Système de disponibilité en temps réel simulé
function updateAvailability() {
    facilities.forEach(facility => {
        const rand = Math.random();
        if (rand < 0.5) {
            facility.availability = 'available';
        } else if (rand < 0.8) {
            facility.availability = 'limited';
        } else {
            facility.availability = 'full';
        }
    });

    applyFilters();
}

// Mettre à jour la disponibilité toutes les 30 secondes
setInterval(updateAvailability, 30000);

// Stockage des réservations
let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

// Fonction pour afficher une alerte
function showAlert(alertId, message, type) {
    const alert = document.getElementById(alertId);
    alert.textContent = message;
    alert.className = `alert ${type} show`;
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Fonction pour générer un numéro de confirmation
function generateConfirmation() {
    return 'QC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Fonction pour afficher les réservations
function displayReservations() {
    const list = document.getElementById('reservations-list');
    if (reservations.length === 0) {
        list.innerHTML = '<p style="color: #666;">Aucune réservation pour le moment.</p>';
        return;
    }

    list.innerHTML = reservations.map((res, index) => `
        <div class="reservation-card">
            <h3>${res.type}</h3>
            <p><strong>Confirmation:</strong> ${res.confirmation}</p>
            <p><strong>Nom:</strong> ${res.nom}</p>
            <p><strong>Lieu:</strong> ${res.lieu}</p>
            <p><strong>Date:</strong> ${res.date}</p>
            <p><strong>Heure:</strong> ${res.heure}</p>
            <p><strong>Durée:</strong> ${res.duree} heure(s)</p>
            ${res.notes ? `<p><strong>Notes:</strong> ${res.notes}</p>` : ''}
            <button class="cancel-btn" onclick="cancelReservation(${index})">Annuler la réservation</button>
        </div>
    `).join('');
}

// Fonction pour annuler une réservation
function cancelReservation(index) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
        reservations.splice(index, 1);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        displayReservations();
    }
}

// Formulaire de réservation dynamique
document.getElementById('dynamic-reservation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Trouver le bouton de soumission
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Empêcher les clics multiples
    if (submitButton.disabled) {
        return;
    }

    // Désactiver le bouton immédiatement
    submitButton.disabled = true;
    submitButton.textContent = 'Réservation en cours...';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    const facilityId = parseInt(document.getElementById('facility-id').value);
    const facility = facilities.find(f => f.id === facilityId);

    const typeText = {
        'tennis': 'Tennis',
        'piscine': 'Piscine',
        'soccer': 'Soccer',
        'basketball': 'Basketball',
        'volleyball': 'Volleyball',
        'baseball': 'Baseball'
    };

    const reservation = {
        type: typeText[facility.type],
        confirmation: generateConfirmation(),
        nom: document.getElementById('res-nom').value,
        email: document.getElementById('res-email').value,
        telephone: document.getElementById('res-telephone').value,
        lieu: facility.name,
        date: document.getElementById('res-date').value,
        heure: document.getElementById('res-heure').value,
        duree: document.getElementById('res-duree').value,
        notes: document.getElementById('res-notes').value
    };

    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Scroller en haut du formulaire pour voir le message
    document.getElementById('reservation-form').scrollIntoView({ behavior: 'smooth', block: 'start' });

    showAlert('reservation-alert', `Réservation confirmée avec succès! Numéro de confirmation: ${reservation.confirmation}. Consultez vos réservations dans l'onglet "Mes Réservations".`, 'success');

    // Réinitialiser le formulaire
    e.target.reset();

    // Réactiver le bouton immédiatement après l'affichage du message
    submitButton.disabled = false;
    submitButton.textContent = 'Confirmer la réservation';
    submitButton.style.opacity = '1';
    submitButton.style.cursor = 'none';
});

// Charger les réservations au démarrage
displayReservations();

// Mettre à jour l'affichage des réservations quand on navigue vers cette section
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.getAttribute('data-section') === 'mes-reservations') {
            displayReservations();
        }
    });
});

// Désélectionner quand on clique sur la liste (pas sur une carte)
document.addEventListener('DOMContentLoaded', () => {
    const facilitiesList = document.getElementById('facilities-grid');
    facilitiesList.addEventListener('click', (e) => {
        // Si on clique directement sur la liste (pas sur une carte)
        if (e.target === facilitiesList) {
            deselectFacility();
        }
    });
});

function deselectFacility() {
    if (selectedFacilityId) {
        const oldBtn = document.getElementById(`reserve-btn-${selectedFacilityId}`);
        if (oldBtn) oldBtn.style.display = 'none';

        const oldCard = document.querySelector(`[data-facility-id="${selectedFacilityId}"]`);
        if (oldCard) oldCard.classList.remove('selected');

        selectedFacilityId = null;
        isMapLocked = false;
        map.closePopup();
    }
}

// Initialiser la carte au chargement de la page
window.addEventListener('load', () => {
    initMap();
    displayFacilities([]);
});


// Scroll smooth vers explorer
function scrollToExplorer(e) {
    e.preventDefault();
    const explorerSection = document.getElementById('explorer');
    explorerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}