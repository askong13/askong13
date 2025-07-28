// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeX6K3ejM-zu755LVDDMwgxBi-KW-ogx4",
  authDomain: "storapedia.firebaseapp.com",
  projectId: "storapedia",
  storageBucket: "storapedia.firebasestorage.app",
  messagingSenderId: "145464021088",
  appId: "1:145464021088:web:1e24a2847994ac5003f305"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Function to generate a random password
function generateRandomPassword() {
    return Math.random().toString(36).slice(-8);
}
