// ==========================================
// FIREBASE CONFIG & INIT (COMPAT VERSION)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBuL1g1nCDi_0FwIi0cdZAhw_FxWtaI84s",
    authDomain: "westroads-4292e.firebaseapp.com",
    databaseURL: "https://westroads-4292e-default-rtdb.firebaseio.com",
    projectId: "westroads-4292e",
    storageBucket: "westroads-4292e.firebasestorage.app",
    messagingSenderId: "385355475632",
    appId: "1:385355475632:web:b5d65189197a8d20d7e975",
    measurementId: "G-4PS4S7N52Y"
};

// Initialisierung über die globalen Fenster-Objekte des CDN
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ==========================================
// GLOBALE KARTEN-FUNKTIONEN
// ==========================================
let map, hazardLayer, routeLayer;

function initMap(mapId) {
    map = L.map(mapId).setView([-42.716, 170.966], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    hazardLayer = L.layerGroup().addTo(map);
    routeLayer = L.layerGroup().addTo(map);
}

// Lädt ALLES (für alle Rollen sichtbar)
function loadPublicData() {
    // 1. Hazards laden
    db.ref('hazards').on('value', snapshot => {
        hazardLayer.clearLayers();
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(h => {
                L.circleMarker([h.lat, h.lng], { radius: 8, fillColor: '#F56C6C', color: '#fff', weight: 2, fillOpacity: 1 })
                 .addTo(hazardLayer)
                 .bindPopup(`<b>⚠️ ${h.title}</b><br>${h.desc}`);
            });
        }
    });

    // 2. Schulrouten laden
    db.ref('schools').on('value', snapshot => {
        routeLayer.clearLayers();
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(school => {
                if (school.routes) {
                    Object.values(school.routes).forEach(route => {
                        if (route.coords) L.polyline(route.coords, { color: route.color, weight: 4 }).addTo(routeLayer);
                    });
                }
            });
        }
    });
}

function logout() {
    auth.signOut().then(() => window.location.href = "index.html");
}