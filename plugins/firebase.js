import { initializeApp, getApp, getApps } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

export let auth = null;
export let functions = null;
export let db = null;

export default ({ req }) => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  }

  if (getApps().length) return;

  initializeApp(firebaseConfig);

  auth = getAuth();
  functions = getFunctions(getApp(), "asia-northeast1");
  db = getFirestore();

  // テスト環境用
  if ((process.client && window.location.hostname === "localhost")) {
    console.log("Firebase Emulatorを起動中");

    connectAuthEmulator(auth, "http://192.168.3.19:9099");
    connectFunctionsEmulator(functions, '192.168.3.19', 5001);
    connectFirestoreEmulator(db, '192.168.3.19', 8080);
  }
}

export const initMessaging = () => {
  return getMessaging();
}