document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const userAuthSection = document.getElementById('userAuthSection');
    const userDashboard = document.getElementById('userDashboard');
    const bookingList = document.getElementById('bookingList');

    // Load site settings and locations on page load
    loadSiteContent();
    loadLocations();

    // Check user auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            console.log('User logged in:', user.email);
            displayUserInfo(user);
            loadUserBookings(user.uid);
            userDashboard.style.display = 'block';
        } else {
            // User is signed out
            console.log('User logged out.');
            displayLoginButton();
            userDashboard.style.display = 'none';
        }
    });

    // Handle booking form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookingData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            locationId: document.getElementById('storageLocation').value,
            locationName: document.getElementById('storageLocation').options[document.getElementById('storageLocation').selectedIndex].text,
            date: document.getElementById('bookingDate').value,
            duration: parseInt(document.getElementById('bookingDuration').value),
            serviceType: document.querySelector('input[name="serviceType"]:checked').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            promoCode: document.getElementById('promoCode').value,
            status: 'Pending',
            createdAt: new Date()
        };

        try {
            let user = auth.currentUser;
            let userId;

            if (user) {
                userId = user.uid;
            } else {
                // Auto-register user if email doesn't exist
                const methods = await auth.fetchSignInMethodsForEmail(bookingData.email);
                if (methods.length === 0) {
                    // New user, create account
                    const randomPassword = generateRandomPassword();
                    const newUserCredential = await auth.createUserWithEmailAndPassword(bookingData.email, randomPassword);
                    userId = newUserCredential.user.uid;
                    console.log(`New user created: ${bookingData.email} with a random password.`);
                    // Optionally, you could email the password to the user here.
                } else {
                    // Email exists, but user is not logged in. 
                    // For this flow, we can't log them in. We'll save the booking without a UID
                    // or ask them to log in first. For simplicity, we'll proceed without UID.
                    console.log("Email exists, but user not logged in. Booking will be anonymous.");
                    userId = null; // Or handle as an anonymous booking
                }
            }
            
            if (userId) {
                bookingData.userId = userId;
            }

            // Save booking to Firestore
            const docRef = await db.collection('bookings').add(bookingData);
            console.log("Booking successful with ID: ", docRef.id);

            // Handle payment
            if (bookingData.paymentMethod === 'Midtrans') {
                // Call Midtrans payment function
                payWithMidtrans(docRef.id, bookingData.duration * 10000, bookingData.name, bookingData.email, bookingData.phone); // Assuming price 10k/day
            } else {
                // COD
                alert('Booking successful! Please pay at the location.');
                bookingForm.reset();
            }

        } catch (error) {
            console.error("Error during booking: ", error);
            alert(`Error: ${error.message}`);
        }
    });
});

function displayUserInfo(user) {
    const userAuthSection = document.getElementById('userAuthSection');
    userAuthSection.innerHTML = `
        <span class="navbar-text me-3">Welcome, ${user.displayName || user.email}</span>
        <button class="btn btn-outline-danger" id="logoutBtn">Logout</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => auth.signOut());
}

function displayLoginButton() {
    const userAuthSection = document.getElementById('userAuthSection');
    userAuthSection.innerHTML = `
        <button class="btn btn-primary" id="loginBtn">Login with Google</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    });
}

async function loadUserBookings(userId) {
    const bookingList = document.getElementById('bookingList');
    bookingList.innerHTML = '<li>Loading...</li>';
    const bookingsRef = db.collection('bookings').where('userId', '==', userId).orderBy('createdAt', 'desc');

    bookingsRef.onSnapshot(snapshot => {
        bookingList.innerHTML = '';
        if (snapshot.empty) {
            bookingList.innerHTML = '<li class="list-group-item">No bookings found.</li>';
            return;
        }
        snapshot.forEach(doc => {
            const booking = doc.data();
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <strong>${booking.locationName}</strong> - ${booking.date} (${booking.duration} days)
                <span class="badge bg-info float-end">${booking.status}</span>
                <button class="btn btn-sm btn-secondary float-end me-2" onclick="downloadInvoice('${doc.id}')">Invoice</button>
            `;
            bookingList.appendChild(li);
        });
    });
}

async function loadLocations() {
    const locationSelect = document.getElementById('storageLocation');
    const locations = await db.collection('locations').get();
    locations.forEach(doc => {
        const loc = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = loc.name;
        locationSelect.appendChild(option);
    });
}

async function loadSiteContent() {
    const doc = await db.collection('siteContent').doc('settings').get();
    if (doc.exists) {
        const settings = doc.data();
        document.getElementById('siteLogo').src = settings.logoUrl || 'https://via.placeholder.com/150x50?text=Storapedia';
        document.getElementById('footerText').textContent = settings.footerText || '© 2024 Storapedia. All Rights Reserved.';
        // Note: API keys should be handled securely, this is a simplified example.
    }
}
