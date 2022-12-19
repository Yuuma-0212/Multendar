import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebase } from "~/plugins/firebase.js";
import { setFcmToken } from "~/plugins/firebase-firestore.js";
import axios from "axios";

export default () => {
    firebase().then(async () => {
        if (!isSupported()) {
            console.log("browser not supported");
            return; // ブラウザが対応していなければエラーが発生するため
        }

        const messaging = getMessaging();
        Notification.requestPermission().then(async (permission) => {
            if (permission === "granted") {
                await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getVapidKey").then(async (res) => {
                    await getToken(messaging, { vapidKey: res.data }).then((currentToken) => {
                        if (currentToken) {
                            console.log("currentToken", currentToken);
                            setFcmToken(currentToken);
                        } else {
                            // Show permission request UI
                            console.log('No registration token available. Request permission to generate one.');
                            // ...
                        }
                    }).catch((error) => {
                        console.log('An error occurred while retrieving token. ', error);
                    })
                });
            }
        })
    });
}