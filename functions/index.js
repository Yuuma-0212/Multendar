const functions = require("firebase-functions");
const admin = require("firebase-admin");
//const { getFirestore } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  const serviceAccount = require("./weather-schedule-66b14-firebase-adminsdk-03da8-ddad982d54.json");

  admin.initializeApp({
    projectId: "weather-schedule-66b14",
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://weather-schedule-66b14-default-rtdb.firebaseio.com",
  });
}

const region = "asia-northeast1";
const db = admin.firestore();
const collUsers = "users";

exports.helloWorld = functions.region(region).https.onCall(async (data) => {
  return "hello world";
});

exports.getEvents = functions.region(region).https.onCall(async (data) => {
  const uid = data;
  const events = await db.collection(collUsers).doc(uid).get().then((userSnap) => {
    const isUserExists = userSnap.exists;
    if (isUserExists) {
      return userSnap.data().events;
    }
  }).catch((error) => {
    throw new Error(error);
  });

  return events;
});

exports.sendMessage = functions.region(region).https.onCall(async (data) => {
  const fcmToken = data.fcmToken;
  const title = "Weather Scheduler";
  const body = `${data.notificationTime}分後にスケジュール${data.title}があります`;
  const webPushLink = "http://localhost:3000/calendar";
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
    webpush: {
      fcmOptions: {
        link: webPushLink,
      },
    },
  };

  await admin.messaging().send(message);
});
