importScripts("https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.11.0/firebase-messaging.js");
importScripts("./static/sw-env.js");


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
messaging.setBackgroundMessageHandler(function (payload) {
    console.log("backgroundMessage");

    return self.registration.showNotification(payload.title, {
        body: payload.body,
    });
});
