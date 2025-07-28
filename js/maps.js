let map;
let markers = [];

async function initMap() {
    const defaultCenter = { lat: -8.7932, lng: 115.2167 }; // Default to Bali
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultCenter,
    });

    // Load locations from Firestore and add markers
    try {
        const locations = await db.collection('locations').get();
        locations.forEach(doc => {
            const loc = doc.data();
            addMarker({ lat: loc.lat, lng: loc.lng }, loc.name);
        });
    } catch (error) {
        console.error("Error loading locations for map:", error);
    }
}

function addMarker(position, title) {
    const marker = new google.maps.Marker({
        position,
        map,
        title,
    });
    markers.push(marker);
}
