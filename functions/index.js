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
  const date = new Date();
  const dateToday = date.getDate();
  const fcmToken = data.fcmToken;
  const events = data.events;

  events.forEach(event => {
    const eventDateNumS = new Date(Number(event.start));
    const eventDateS = eventDateNumS.getDate();

    if (dateToday !== eventDateS && !event.isNotification) return;

    const notiTime = 1000 * 60 * Number(event.notificationTime); // 通知時間をミリ秒に変換
    const dateTodayMs = Date.now();
    const pushTime = eventDateNumS - dateTodayMs - notiTime;

    if (pushTime <= 0) return; // 予定の時間が現在の時間より前ならセットしない

    const title = "Weather Scheduler";
    const body = `${event.notificationTime}分後にスケジュール${event.name}があります`;
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
      }
    };

    setTimeout(() => {
      console.log("sendMessage");
      admin.messaging().send(message);
    }, pushTime);
  });
});
