const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
//const { getFirestore } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  const serviceAccount = require("./multendar-fa6e5-firebase-adminsdk-3xmw9-ac6842cf3f.json");

  admin.initializeApp({
    projectId: functions.config().service_account.project_id,
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().firestore.database_url,
  });
}

const region = "asia-northeast1";
const db = admin.firestore();
const collUsers = "users";
const gmail = {
  user: functions.config().gmail.email,
  clientId: functions.config().gmail.client_id,
  clientSecret: functions.config().gmail.client_secret,
  refreshToken: functions.config().gmail.refresh_token
}

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

    const title = "Multendar";
    const body = `${event.notificationTime}分後にスケジュール${event.name}があります`;
    // url.local or url.base
    const webPushLink = functions.config().url.local + "/calendar";
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

/*
const generator = () => {
  const g = xoauth2.createXOAuth2Generator(gmail);
  console.log("g", g);
  g.on("token", token => {
    console.log('New token for %s: %s', token.user, token.accessToken);
  });
  return g;
}

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    xoauth2: generator()
  }
})

const formatEmailText = data => {
  return `お問い合わせ内容
  メールアドレス:
  ${data.email}

  お問い合わせの種類:
  ${data.contactType}

  お問い合わせの内容:
  ${data.contactText}
  `;
};
*/

exports.sendMail = functions.region(region).https.onCall(async (data) => {
  const siteEmail = functions.config().gmail.email;
  const options = {
    service: "Gmail",
    secure: true,
    auth: {
      user: siteEmail,
      pass: functions.config().gmail.pass
    }
  }
  const text = `
  お問い合わせ内容

  メールアドレス
  ${data.email}

  お問い合わせの種類
  ${data.contactType}

  その他内容
  ${data.typeOtherContent}

  内容
  ${data.contactText}
  `;
  const mail = {
    from: siteEmail,
    to: siteEmail,
    subject: "【Multender】お問い合わせ",
    text: text
  }

  console.log("mailContents: ", mail);

  // メール送信
  try {
    const transport = nodemailer.createTransport(options);
    await transport.sendMail(mail).then(value => {
      console.log("send: ", value);
    });
  } catch (err) {
    console.log("Email sending error!!: ", err);
  }
});
