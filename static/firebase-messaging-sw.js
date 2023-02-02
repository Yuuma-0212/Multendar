importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-functions-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"
);
importScripts("./sw-env.js");

firebase.initializeApp(swEnv);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// 読み込まれた時点でアクティブになるようにする
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 通知を受けとると push イベントが呼び出される。
self.addEventListener(
  "push",
  function (event) {
    let message = event.data.json();
    let messageTitle = message.notification.title;
    let messageBody = message.notification.body;

    const notificationPromise = self.registration.showNotification(
      messageTitle,
      {
        body: messageBody,
      }
    );

    event.waitUntil(notificationPromise);
  },
  false
);

// WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
messaging.onBackgroundMessage(messaging, (event) => {
  console.log("backgroundMessage");

  let message = event.data.json();
  let messageTitle = message.notification.title;
  let messageBody = message.notification.body;

  return self.registration.showNotification(messageTitle,
    {
      body: messageBody,
    });
});
/*
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log("backgroundMessage");

  return self.registration.showNotification(payload.title, {
    body: payload.body + "onBackGround",
  });
});
*/

const region = "asia-northeast1";
const functions = firebase.functions();
const db = firebase.firestore();
const sendMessage = firebase
  .app()
  .functions(region)
  .httpsCallable("sendMessage");

// エミュレーターの設定(テスト環境用)
if (location.hostname === "localhost") {
  console.log("emulator");
  db.useEmulator("192.168.3.19", 8080);
  firebase.app().functions(region).useEmulator("192.168.3.19", 5001);
}

self.addEventListener("message", (event) => {
  // 通知設定
  if (event.data.payload == null) return;

  const date = new Date();
  const dateToday = date.getDate();
  const uid = event.data.payload.uid;
  const fcmToken = event.data.payload.fcmToken;
  const events = event.data.payload.events;

  events.forEach((event) => {
    const eventDateS = Number(event.start);
    const eventDate = new Date(eventDateS);
    const eventDateToday = eventDate.getDate();
    const pushData = {
      uid: uid,
      fcmToken: fcmToken,
      title: event.name,
      notificationTime: event.notificationTime,
    };

    if (dateToday !== eventDateToday && !event.isNotification) return;

    const notificationTimeMs = 1000 * 60 * Number(event.notificationTime); // ミリ秒に変換
    const dateTodayMs = Date.now();
    const pushTime = eventDateS - dateTodayMs - notificationTimeMs;

    if (pushTime <= 0) return; // 予定の時間が現在の時間より前ならセットしない

    setTimeout(() => {
      console.log("sendMessage");
      sendMessage(pushData);
    }, pushTime);
  });
});

/*
const setNotificationEvents = () => {
    firebase.initializeApp(swEnv);

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    const messaging = firebase.messaging();

    // 通知を受けとると push イベントが呼び出される。
    self.addEventListener(
        "push",
        function (event) {
            let message = event.data.json();
            console.log("event:push", message);
            let messageTitle = message.notification.title;
            let messageBody = message.notification.body;
            let tag = "cuppa";

            const notificationPromise = self.registration.showNotification(
                messageTitle,
                {
                    body: messageBody,
                    tag: tag,
                }
            );

            event.waitUntil(notificationPromise);
        },
        false
    );

    // WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
    messaging.onBackgroundMessage(messaging, (payload) => {
        console.log("backgroundMessage");

        return self.registration.showNotification(payload.title, {
            body: payload.body,
        });
    });
}
*/
