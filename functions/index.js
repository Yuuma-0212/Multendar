//import functions from "firebase-functions";
//import admin from "firebase-admin";
//import { getFirestore } from "firebase-admin/firestore";
//import serviceAccount from "./weather-schedule-66b14-firebase-adminsdk-03da8-cd09df0bd8.json";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

if (!admin.apps.length) {
    const serviceAccount = require("./weather-schedule-66b14-firebase-adminsdk-03da8-cd09df0bd8.json");
    admin.initializeApp({
        projectId: "weather-schedule-66b14",
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://weather-schedule-66b14-default-rtdb.firebaseio.com"
    });
}

const db = getFirestore();

exports.getEvents = functions.https.onCall(async (data, context) => {
    const eventsSnap = await db.collection("users").doc(data.uid).get();
    return eventsSnap;
});