const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore, Firestore } = require("firebase-admin/firestore");
const express = require("express");
const axios = require("axios");
const app = express();

let serviceAccount = {};

if (!admin.apps.length) {
    if (Object.keys(serviceAccount).length === 0) {
        serviceAccount = require("./weather-schedule-66b14-firebase-adminsdk-03da8-cd09df0bd8.json");
    }

    admin.initializeApp({
        projectId: "weather-schedule-66b14",
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://weather-schedule-66b14-default-rtdb.firebaseio.com"
    });
}

const region = "asia-northeast1";
const db = getFirestore();
const collUsers = "users";

exports.getEvents = functions.region(region).https.onCall(async (data, context) => {
    const eventsSnap = await db.collection(collUsers).doc(data.uid).get();
    return eventsSnap;
});

exports.callCheckUserExists = functions.region(region).https.onCall((data, context) => {
    const isUserExists = db.collection(collUsers).doc(data).get().then((snapshot) => {
        return snapshot.exists;
    }).catch((error) => {
        throw new Error(error);
    });

    return isUserExists;
});

exports.callAddUser = functions.region(region).https.onCall((data, context) => {
    const userData = {
        name: data.name,
        email: data.email,
        idToken: data.idToken,
        timestamp: Firestore.FieldValue.serverTimestamp()
    }

    const setUser = db.collection(collUsers).doc(data.uid).set(userData).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });

    return setUser;
});

exports.callAddEvent = functions.region(region).https.onCall((data, context) => {
    const events = {
        events: Firestore.FieldValue.arrayUnion(JSON.stringify(data.event)),
        timestamp: Firestore.FieldValue.serverTimestamp()
    }

    const eventUpdate = db.collection(collUsers).doc(data.uid).update(events).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });

    return eventUpdate;
});

exports.callGetEvents = functions.region(region).https.onCall((data, context) => {
    const getEvents = db.collection(collUsers).doc(data).get().then((userSnap) => {
        const isUserExists = userSnap.exists;
        if (isUserExists) {
            return userSnap.data().events;
        }
    }).catch((error) => {
        throw new Error(error);
    });

    return getEvents;
});

app.get("/getEnv", async (req, res) => {
    await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getEnv")
        .then((res) => {
            serviceAccount = {
                type: res.data.FIREBASE_ADMIN_TYPE,
                project_id: res.data.FIREBASE_ADMIN_PROJECT_ID,
                private_key_id: res.data.FIREBASE_ADMIN_PRIVATE_KEY_ID,
                private_key: res.data.FIREBASE_ADMIN_PRIVATE_KEY,
                client_email: res.data.FIREBASE_ADMIN_CLIENT_EMAIL,
                client_id: res.data.FIREBASE_ADMIN_CLIENT_ID,
                auth_uri: res.data.FIREBASE_ADMIN_AUTH_URI,
                token_uri: res.data.FIREBASE_ADMIN_TOKEN_URI,
                auth_provider_x509_cert_url: res.data.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: res.data.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
            };
        })
        .catch((error) => {
            console.log(error);
        });
});

exports.api = functions.region(region).https.onRequest(app);
