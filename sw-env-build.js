import { writeFileSync } from "fs";

const path = "./static/sw-env.js";
const data = `
    export const swEnv = {
        apiKey: '${process.env.FIREBASE_API_KEY}',
        authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
        projectId: '${process.env.FIREBASE_PROJECT_ID}',
        storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
        messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
        appId: '${process.env.FIREBASE_APP_ID}',
        measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
    }
`;

writeFileSync(path, data);

const envPath = "./.env";
const envData = `
FIREBASE_API_KEY=${process.env.FIREBASE_API_KEY}',
FIREBASE_AUTH_DOMAIN='${process.env.FIREBASE_AUTH_DOMAIN}',
FIREBASE_PROJECT_ID='${process.env.FIREBASE_PROJECT_ID}',
FIREBASE_STORAGE_BUCKET='${process.env.FIREBASE_STORAGE_BUCKET}',
FIREBASE_MESSAGING_SENDER_ID='${process.env.FIREBASE_MESSAGING_SENDER_ID}',
FIREBASE_APP_ID='${process.env.FIREBASE_APP_ID}',
FIREBASE_MEASUREMENT_ID='${process.env.FIREBASE_MEASUREMENT_ID}',
MAPS_API_KEY='${process.env.MAPS_API_KEY}',
PUBLIC_VAPID_KEY='${process.env.PUBLIC_VAPID_KEY}',
BASE_URL='${process.env.BASE_URL}'
`;

writeFileSync(envPath, envData);