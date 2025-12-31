// Firebase Configuration for Global Pulse News
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEgRtWj6VwKq7jLUbtCcuvsuVxB-1sm-g",
    authDomain: "global-pulse-news-4a2af.firebaseapp.com",
    projectId: "global-pulse-news-4a2af",
    storageBucket: "global-pulse-news-4a2af.firebasestorage.app",
    messagingSenderId: "550157839518",
    appId: "1:550157839518:web:bb0c90c4b03a2995c3df8f",
    measurementId: "G-L8YWLHEYHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
export { analytics };

// Auth Functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Save user to Firestore
        await saveUserToFirestore(user);

        return { success: true, user };
    } catch (error: any) {
        console.error('Google Sign-In Error:', error);
        return { success: false, error: error.message };
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Save user data to Firestore
export const saveUserToFirestore = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // New user - create document
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
    } else {
        // Existing user - update last login
        await setDoc(userRef, {
            lastLogin: new Date().toISOString()
        }, { merge: true });
    }
};

// Auth State Observer
export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export default app;
