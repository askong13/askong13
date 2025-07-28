document.addEventListener('DOMContentLoaded', () => {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    const whitelistedAdmins = ['admin@storapedia.com', 'jamal@example.com']; // Your whitelisted emails

    auth.onAuthStateChanged(user => {
        if (user && whitelistedAdmins.includes(user.email)) {
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminData();
        } else {
            adminLogin.style.display = 'flex';
            adminPanel.style.display = 'none';
        }
    });

    adminLoginBtn.addEventListener('click', () => {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        if (!whitelistedAdmins.includes(email)) {
            alert('This email is not authorized for admin access.');
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert(`Login Failed: ${error.message}`));
    });

    adminLogoutBtn.addEventListener('click', () => auth.signOut());

    // Handle settings form
    document.getElementById('siteSettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
            logoUrl: document.getElementById('settingLogoUrl').value,
            footerText: document.getElementById('settingFooterText').value,
            midtransClientKey: document.getElementById('settingMidtransClientKey').value,
            googleMapsKey: document.getElementById('settingGoogleMapsKey').value,
        };
        db.collection('siteContent').doc('settings').set(settings, { merge: true })
            .then(() => alert('Settings saved!'))
            .catch(err => alert(`Error: ${err.message}`));
    });

    // Handle add location form
    document.getElementById('addLocationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const locationData = {
            name: document.getElementById('locName').value,
            lat: parseFloat(document.getElementById('locLat').value),
            lng: parseFloat(document.getElementById('locLng').value),
        };
        db.collection('locations').add(locationData)
            .then(() => {
                alert('Location added!');
                document.getElementById('addLocationForm').reset();
                loadAdminLocations();
            })
            .catch(err => alert(`Error: ${err.message}`));
    });
});

function loadAdminData() {
    loadAdminBookings();
    loadAdminLocations();
    loadAdminSettings();
}

function loadAdminBookings() {
    const bookingList = document.getElementById('adminBookingList');
    db.collection('bookings').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        bookingList.innerHTML = '';
        snapshot.forEach(doc => {
            const booking = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id.substring(0, 6)}...</td>
                <td>${booking.name} (${booking.email})</td>
                <td>${new Date(booking.createdAt.seconds * 1000).toLocaleDateString()}</td>
                <td><span class="badge bg-primary">${booking.status}</span></td>
                <td><button class="btn btn-sm btn-info">Details</button></td>
            `;
            bookingList.appendChild(row);
        });
    });
}

function loadAdminLocations() {
    const locationList = document.getElementById('adminLocationList');
    db.collection('locations').onSnapshot(snapshot => {
        locationList.innerHTML = '';
        snapshot.forEach(doc => {
            const loc = doc.data();
            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
            div.innerHTML = `
                <span>${loc.name} (${loc.lat}, ${loc.lng})</span>
                <button class="btn btn-sm btn-danger" onclick="deleteLocation('${doc.id}')">Delete</button>
            `;
            locationList.appendChild(div);
        });
    });
}

function deleteLocation(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        db.collection('locations').doc(id).delete();
    }
}

async function loadAdminSettings() {
    const doc = await db.collection('siteContent').doc('settings').get();
    if (doc.exists) {
        const settings = doc.data();
        document.getElementById('settingLogoUrl').value = settings.logoUrl || '';
        document.getElementById('settingFooterText').value = settings.footerText || '';
        document.getElementById('settingMidtransClientKey').value = settings.midtransClientKey || '';
        document.getElementById('settingGoogleMapsKey').value = settings.googleMapsKey || '';
    }
}
