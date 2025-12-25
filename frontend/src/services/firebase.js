import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRAtZ8nkOQDUK9Jn5yhRb_zJYkqAt8Jdg",
  authDomain: "binnect-c2d51.firebaseapp.com",
  projectId: "binnect-c2d51",
  storageBucket: "binnect-c2d51.firebasestorage.app",
  messagingSenderId: "565804303482",
  appId: "1:565804303482:web:0c49aef8723ada3ba4e7c3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// ADD 'export' HERE so the LandingPage can find it
export const provider = new GoogleAuthProvider(); 

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; 
  } catch (error) {
    console.error("Login Error:", error);
    throw error; // Throw so the LandingPage can catch it
  }
};