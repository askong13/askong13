# Storapedia - Modern Digital Storage Booking System

This project is a complete front-end and back-end system for a storage booking platform called Storapedia. It's built with vanilla HTML/CSS/JS and uses Google Firebase for the database and authentication.

## Features

-   **Login-less Booking**: Users can book without an account.
-   **Auto Registration**: An account is automatically created in Firebase Auth if the user's email is new.
-   **Google Login**: Users can sign in with their Google account.
-   **Dual Payment**: Supports "Pay at Location" (COD) and online payments via Midtrans.
-   **Admin Panel**: A secure area to manage bookings, locations, users, and all site settings.
-   **Dynamic Configuration**: API keys, logos, and other settings are managed from the admin panel (stored in Firestore).
-   **PDF Invoices**: Users can download their booking invoices as a PDF.
-   **Google Maps**: Displays storage locations on an interactive map.
-   **Database Seeder**: A Google Colab script is provided to reset and seed the Firestore database with dummy data.

## Tech Stack

-   **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
-   **Backend**: Google Firebase (Firestore Database, Authentication)
-   **Payment Gateway**: Midtrans Snap
-   **PDF Generation**: html2pdf.js
-   **Maps**: Google Maps API
-   **Hosting**: Netlify
-   **Version Control**: GitHub

---

## 🚀 Setup and Deployment Guide

### Step 1: Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your project, go to **Project Settings** > **General**. Under "Your apps", create a new **Web app** (</>).
3.  Copy the `firebaseConfig` object. You will need this.
4.  In the left menu, go to **Authentication** > **Sign-in method**. Enable **Email/Password** and **Google** providers.
5.  Go to **Firestore Database** and create a database. Start in **test mode** for now (you can change security rules later).

### Step 2: Get Firebase Service Account Key

This is needed for the Google Colab script to manage your database.

1.  In Firebase, go to **Project Settings** > **Service accounts**.
2.  Click **"Generate new private key"**. A JSON file will be downloaded.
3.  **Rename this file to `serviceAccountKey.json`**. Keep it secure and do not commit it to GitHub.

### Step 3: Configure the Project Files

1.  **`js/firebase.js`**: Open this file and replace the placeholder `firebaseConfig` with the one you copied from the Firebase console.
2.  **`admin.js`**: In `js/admin.js`, find the `whitelistedAdmins` array and add the email addresses you want to grant admin access to.
3.  **API Keys**: You will need API keys for Google Maps and Midtrans. It's best practice to store these in your hosting environment (Netlify) and not directly in the code. For this project's simplicity, they are managed via the Admin Panel's "Site Settings" and stored in Firestore.

### Step 4: Seed the Database (Optional, but Recommended)

1.  Open [Google Colab](https://colab.research.google.com/).
2.  Upload the `reset_firebase.ipynb` notebook.
3.  Run the first cell. It will prompt you to upload your `serviceAccountKey.json` file.
4.  The script will delete any existing data and populate your Firestore with dummy locations, bookings, and settings.

### Step 5: Deploy to GitHub and Netlify

1.  **Initialize a Git repository** in your project folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Create a new repository** on [GitHub](https://github.com) and push your code to it.
    ```bash
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git branch -M main
    git push -u origin main
    ```
3.  **Deploy with Netlify**:
    -   Sign up or log in to [Netlify](https://app.netlify.com/).
    -   Click **"Add new site"** > **"Import an existing project"**.
    -   Connect to GitHub and authorize Netlify.
    -   Select your Storapedia repository.
    -   The build settings can be left as default for this project. Click **"Deploy site"**.

Netlify will automatically deploy your site and give you a live URL. Any changes you push to the `main` branch on GitHub will be automatically re-deployed.
