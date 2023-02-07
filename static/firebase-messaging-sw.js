importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");
importScripts("./sw-env.js");

firebase.initializeApp(swEnv);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// 通知を受けとると push イベントが呼び出される。
self.addEventListener("push", function (event) {
  console.log("pushMessage", event);
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
/*
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 読み込まれた時点でアクティブになるようにする
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
*/
