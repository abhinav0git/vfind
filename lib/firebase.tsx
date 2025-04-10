import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

console.log("firebase config fired");
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
// const firebaseConfig =
// {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyAP6h5gilM7-eThrYe54iUUADWlC14vvZk",
    authDomain: "vfind-c0e57.firebaseapp.com",
    projectId: "vfind-c0e57",
    storageBucket: "vfind-c0e57.firebasestorage.app",
    messagingSenderId: "853385661537",
    appId: "1:853385661537:web:ca5a34c20565b3d68d2e20",
    measurementId: "G-2QSE6LR6CN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;