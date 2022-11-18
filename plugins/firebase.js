import { initializeApp, getApp } from "firebase/app"
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import axios from "axios";

axios.get("https://weather-scheduler-test.azurewebsites.net/api/test").then((res) => {
  console.log('axios', JSON.stringify(res));
});

export const firebaseConfig = {
  apiKey: process.env.A_API_KEY,
  authDomain: process.env.A_AUTH_DOMAIN,
  projectId: process.env.A_PROJECT_ID,
  storageBucket: process.env.A_STORAGE_BUCKET,
  messagingSenderId: process.env.A_MESSAGING_SENDER_ID,
  appId: process.env.A_APP_ID,
  measurementId: process.env.A_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const functions = getFunctions(getApp());
export const db = getFirestore(app);
export const getEvents = httpsCallable(functions, "getEvents");

//connectAuthEmulator(auth, "http://localhost:9099");
//connectFunctionsEmulator(functions, 'localhost', 5001);
//connectFirestoreEmulator(db, 'localhost', 8080);