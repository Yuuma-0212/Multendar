import { initializeApp, getApp } from "firebase/app"
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import axios from "axios";

axios.get("http://localhost:3000/api/getEnv").then((res) => {
  console.log('axios', JSON.stringify(res.data));
});

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const functions = getFunctions(getApp());
export const db = getFirestore(app);
export const getEvents = httpsCallable(functions, "getEvents");

//connectAuthEmulator(auth, "http://localhost:9099");
//connectFunctionsEmulator(functions, 'localhost', 5001);
//connectFirestoreEmulator(db, 'localhost', 8080);