import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBCBU4Si1K7RjwoVWPLYZ-iq-_Vc-p_kg8",
    authDomain: "react-api-795a0.firebaseapp.com",
    projectId: "react-api-795a0",
    storageBucket: "react-api-795a0.firebasestorage.app",
    messagingSenderId: "554318990847",
    appId: "1:554318990847:web:b264b91ce707e7d90babca"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };