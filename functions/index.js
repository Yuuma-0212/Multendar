const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore, Firestore } = require("firebase-admin/firestore");
const messaging = require("firebase-admin/messaging");
const express = require("express");
const axios = require("axios");
//const app = express();

let serviceAccount = {};

if (!admin.apps.length) {
    serviceAccount = require("./weather-schedule-66b14-firebase-adminsdk-03da8-cd09df0bd8.json");
    axios.get("https://weather-scheduler-test.azurewebsites.net/api/getFirebaseAdminServiceAccount")
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
    const uid = data;
    const events = await db.collection(collUsers).doc(uid).get().then((userSnap) => {
        const isUserExists = userSnap.exists;
        if (!isUserExists) return;
        return userSnap.data().events;
    }).catch((error) => {
        throw new Error(error);
    });

    return events;

    /*
    const uid = data;
    const eventsSnap = await db.collection(collUsers).doc(uid).get();
    return eventsSnap;
    */
});

/*
exports.setFirebaseAdminServiceAccount = functions.region(region).https.onCall(async () => {
    await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getFirebaseAdminServiceAccount")
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
*/

exports.sendMessage = functions.region(region).https.onCall(async (data) => {
    // fcmトークンを取得
    const uid = data;
    const fcmToken = await db.collection(collUsers).doc(uid).get().then((userSnap) => {
        const isUserExists = userSnap.exists;
        if (!isUserExists) return;
        return userSnap.data().fcmToken.token;
    }).catch((error) => {
        throw new Error(error);
    });
    console.log('fcmToken', fcmToken);

    const title = "testNotification";
    const body = "this is notification body";
    const message = {
        token: fcmToken,
        notification: {
            title: title,
            body: body
        }
    }

    await admin.messaging().send(message);
});

/*
app.get("/setFirebaseAdminEnv", async (req, res) => {
    await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getFirebaseAdminServiceAccount")
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
*/
