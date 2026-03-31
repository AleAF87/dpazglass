import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getDatabase, ref, get, set, remove } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

const firebaseSettings = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
    databaseURL: 'YOUR_FIREBASE_DATABASE_URL',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_APP_ID'
};

const cloudinarySettings = {
    cloudName: 'YOUR_CLOUDINARY_CLOUD_NAME',
    uploadPreset: 'YOUR_UNSIGNED_UPLOAD_PRESET',
    folder: 'dpazglass/projetos'
};

function isConfigured(settings) {
    return Object.values(settings).every((value) => value && !String(value).startsWith('YOUR_'));
}

const firebaseConfigured = isConfigured(firebaseSettings);
const cloudinaryConfigured = isConfigured(cloudinarySettings);

let app = null;
let auth = null;
let database = null;

if (firebaseConfigured) {
    app = initializeApp(firebaseSettings);
    auth = getAuth(app);
    database = getDatabase(app);
}

export {
    app,
    auth,
    cloudinaryConfigured,
    cloudinarySettings,
    database,
    firebaseConfigured,
    firebaseSettings,
    get,
    onAuthStateChanged,
    ref,
    remove,
    set,
    signInWithEmailAndPassword,
    signOut
};
