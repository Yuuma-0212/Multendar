import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebase } from "~/plugins/firebase.js";
import { setFcmToken } from "~/plugins/firebase-firestore.js";
import getSwReg from "~/plugins/service-worker-register.js";
import axios from "axios";

let messaging = null;

export default () => {
  firebase().then(() => {
    messaging = getMessaging();
  });
};

export const reqNotificationPermission = async () => {
  if (!isSupported()) {
    console.log("browser not supported");
    throw new Error("Browser not supported"); // ブラウザが対応していなければエラーが発生するため
  }

  const swReg = await getSwReg();
  //const messaging = getMessaging();
  const token = await Notification.requestPermission()
    .then(async (permission) => {
      if (permission === "granted") {
        const getTokenOptions = {
          vapidKey: process.env.PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: swReg,
        };

        return await getToken(messaging, getTokenOptions)
          .then(async (currentToken) => {
            if (currentToken) {
              console.log("currentToken", currentToken);
              await setFcmToken(currentToken);
              return currentToken;
            } else {
              // Show permission request UI
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          })
          .catch((error) => {
            console.log("An error occurred while retrieving token. ", error);
            throw new Error(error);
          });
      }
    })
    .catch((error) => {
      throw new Error(error);
    });

    console.log("token", token);
    return token;
};
