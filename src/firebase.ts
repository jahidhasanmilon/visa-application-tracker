import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web config — this is safe to keep in client code.
// Real protection comes from Firestore security rules (see firestore.rules),
// not from hiding this object.
const firebaseConfig = {
  apiKey: 'AIzaSyAtEbV9al4A2zI0VGfGyaoMarjWwurBFj4',
  authDomain: 'tracisa-57112.firebaseapp.com',
  projectId: 'tracisa-57112',
  storageBucket: 'tracisa-57112.firebasestorage.app',
  messagingSenderId: '269167825813',
  appId: '1:269167825813:web:aa8d10c7a6e7c5c4149c9c',
  measurementId: 'G-57K1TL96YQ',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
