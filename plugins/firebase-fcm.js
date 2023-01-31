import { getToken, isSupported } from "firebase/messaging";
import { initMessaging } from "~/plugins/firebase.js";
import { setFcmToken } from "~/plugins/firebase-firestore.js";
import getSwReg from "~/plugins/service-worker-register.js";

export const reqNotificationPermission = async () => {
  if (!isSupported()) {
    console.log("browser not supported");
    throw new Error("Browser not supported"); // ブラウザが対応していなければエラーが発生するため
  }

  const swReg = await getSwReg();
  const token = await Notification.requestPermission()
    .then(async (permission) => {
      if (permission === "granted") {
        const messaging = initMessaging();
        const getTokenOptions = {
          vapidKey: process.env.PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: swReg,
        };

        return await getToken(messaging, getTokenOptions)
          .then(async (currentToken) => {
            if (currentToken) {
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
    
    return token;
};
