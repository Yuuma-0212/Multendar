import { initializeApp, getApp } from "firebase/app"
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import axios from "axios";

let env = null;
axios.get("https://weather-scheduler-test.azurewebsites.net/api/getEnv").then((res) => {
  console.log('axios', JSON.stringify(res.data));
  env = {
    'API_KEY': res.data.API_KEY,
    'AUTH_DOMAIN': res.data.AUTH_DOMAIN,
    'PROJECT_ID': res.data.PROJECT_ID,
    'STORAGE_BUCKET': res.data.STORAGE_BUCKET,
    'MESSAGING_SENDER_ID': res.data.MESSAGING_SENDER_ID,
    'APP_ID': res.data.APP_ID,
    'MEASUREMENT_ID': res.data.MEASUREMENT_ID
  }
});

export const firebaseConfig = {
  apiKey: process.env.API_KEY | env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN | env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID | env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET | env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID | env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID | env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID | env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const functions = getFunctions(getApp());
export const db = getFirestore(app);
export const getEvents = httpsCallable(functions, "getEvents");

//connectAuthEmulator(auth, "http://localhost:9099");
//connectFunctionsEmulator(functions, 'localhost', 5001);
//connectFirestoreEmulator(db, 'localhost', 8080);