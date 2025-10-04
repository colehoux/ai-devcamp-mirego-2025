// Base de données des installations sportives
const facilities = [
    { id: 1, name: 'Parc Victoria - Court 1', type: 'tennis', ville: 'quebec', lat: 46.8139, lng: -71.2080, address: '155 rue Crémazie Est', availability: 'available' },
    { id: 2, name: 'Parc Victoria - Court 2', type: 'tennis', ville: 'quebec', lat: 46.8139, lng: -71.2078, address: '155 rue Crémazie Est', availability: 'limited' },
    { id: 3, name: 'Parc des Braves - Court 1', type: 'tennis', ville: 'quebec', lat: 46.7889, lng: -71.2404, address: '2365 avenue des Braves', availability: 'available' },
    { id: 4, name: 'Parc des Braves - Court 2', type: 'tennis', ville: 'quebec', lat: 46.7889, lng: -71.2402, address: '2365 avenue des Braves', availability: 'full' },
    { id: 5, name: 'Complexe St-Louis - Court 1', type: 'tennis', ville: 'sainte-foy', lat: 46.7767, lng: -71.2893, address: '1200 rue de l\'Église', availability: 'available' },
    { id: 6, name: 'Complexe St-Louis - Court 2', type: 'tennis', ville: 'sainte-foy', lat: 46.7767, lng: -71.2891, address: '1200 rue de l\'Église', availability: 'limited' },

    {
        id: 7,
        name: 'Piscine Montcalm',
        type: 'piscine',
        ville: 'quebec',
        lat: 46.8025,
        lng: -71.2244,
        address: '901 avenue Wolfe',
        availability: 'available',
        horaires: {
            lundi: '6h00 - 21h00',
            mardi: '6h00 - 21h00',
            mercredi: '6h00 - 21h00',
            jeudi: '6h00 - 21h00',
            vendredi: '6h00 - 21h00',
            samedi: '8h00 - 18h00',
            dimanche: '8h00 - 18h00'
        }
    },
    {
        id: 8,
        name: 'Piscine de Sainte-Foy',
        type: 'piscine',
        ville: 'sainte-foy',
        lat: 46.7714,
        lng: -71.2920,
        address: '2320 chemin Sainte-Foy',
        availability: 'limited',
        horaires: {
            lundi: '6h30 - 20h30',
            mardi: '6h30 - 20h30',
            mercredi: '6h30 - 20h30',
            jeudi: '6h30 - 20h30',
            vendredi: '6h30 - 20h30',
            samedi: '9h00 - 17h00',
            dimanche: '9h00 - 17h00'
        }
    },
    {
        id: 9,
        name: 'Centre Aquatique de Beauport',
        type: 'piscine',
        ville: 'beauport',
        lat: 46.8601,
        lng: -71.1861,
        address: '345 rue Clemenceau',
        availability: 'available',
        horaires: {
            lundi: '5h30 - 22h00',
            mardi: '5h30 - 22h00',
            mercredi: '5h30 - 22h00',
            jeudi: '5h30 - 22h00',
            vendredi: '5h30 - 22h00',
            samedi: '7h00 - 19h00',
            dimanche: '7h00 - 19h00'
        }
    },

    { id: 10, name: 'Parc de la Plage-Jacques-Cartier - Soccer', type: 'soccer', ville: 'quebec', lat: 46.8324, lng: -71.2574, address: '235 rue Abraham-Martin', availability: 'available' },
    { id: 11, name: 'Parc du Bois-de-Coulonge - Soccer', type: 'soccer', ville: 'quebec', lat: 46.7894, lng: -71.2516, address: '1215 chemin Saint-Louis', availability: 'limited' },
    { id: 12, name: 'Complexe Sportif Sainte-Foy - Basketball', type: 'basketball', ville: 'sainte-foy', lat: 46.7725, lng: -71.2944, address: '930 avenue Myrand', availability: 'available' },
    { id: 13, name: 'Parc des Champs-de-Bataille - Volleyball', type: 'volleyball', ville: 'quebec', lat: 46.7970, lng: -71.2177, address: '835 avenue Wilfrid-Laurier', availability: 'available' },
    { id: 14, name: 'Centre Sportif Beauport - Baseball', type: 'baseball', ville: 'beauport', lat: 46.8677, lng: -71.1784, address: '500 rue Seigneuriale', availability: 'full' },
    { id: 15, name: 'Parc Chauveau - Soccer', type: 'soccer', ville: 'charlesbourg', lat: 46.8834, lng: -71.2688, address: '7650 boulevard Cloutier', availability: 'available' },
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
            <button class="reserve-btn" onclick="closePoolSchedule()" style="margin-top: 2rem;">Retour</button>
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

    list.innerHTML = reservations.map(res => `
        <div class="reservation-card">
            <h3>${res.type}</h3>
            <p><strong>Confirmation:</strong> ${res.confirmation}</p>
            <p><strong>Nom:</strong> ${res.nom}</p>
            <p><strong>Lieu:</strong> ${res.lieu}</p>
            <p><strong>Date:</strong> ${res.date}</p>
            <p><strong>Heure:</strong> ${res.heure}</p>
            <p><strong>Durée:</strong> ${res.duree} heure(s)</p>
            ${res.notes ? `<p><strong>Notes:</strong> ${res.notes}</p>` : ''}
        </div>
    `).join('');
}

// Formulaire de réservation dynamique
document.getElementById('dynamic-reservation-form').addEventListener('submit', (e) => {
    e.preventDefault();

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

    showAlert('reservation-alert', `Réservation confirmée! Numéro: ${reservation.confirmation}`, 'success');

    // Retourner à l'explorer après 2 secondes
    setTimeout(() => {
        closeReservationForm();
    }, 2000);
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

// Curseur personnalisé
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;

    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;

    cursor.style.left = cursorX - 20 + 'px';
    cursor.style.top = cursorY - 20 + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

document.addEventListener('mousedown', () => {
    cursor.classList.add('clicked');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicked');
});

// Scroll smooth vers explorer
function scrollToExplorer(e) {
    e.preventDefault();
    const explorerSection = document.getElementById('explorer');
    explorerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}