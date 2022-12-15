import { initializeApp, getApp, getApps } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import axios from "axios";

export const firebase = async () => {
  await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getFirebaseEnv").then((res) => {
    const firebaseConfig = {
      apiKey: res.data.API_KEY,
      authDomain: res.data.AUTH_DOMAIN,
      projectId: res.data.PROJECT_ID,
      storageBucket: res.data.STORAGE_BUCKET,
      messagingSenderId: res.data.MESSAGING_SENDER_ID,
      appId: res.data.APP_ID,
      measurementId: res.data.MEASUREMENT_ID
    }

    initializeApp(firebaseConfig);
  });
}


/*
export const firebase = async () => {
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig);

    const auth = getAuth();
    const functions = getFunctions(getApp(), "asia-northeast1");
    const firestore = getFirestore();

    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }
}
*/