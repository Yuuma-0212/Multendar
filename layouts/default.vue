<template>
  <v-app>
    <Header />
    <Nuxt />
    <Footer />
  </v-app>
</template>

<script>
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import {getFcmToken} from "~/plugins/firebase-firestore.js";

export default {
  name: "DefaultLayout",
  components: { Header, Footer },
  asyncData() {
    // fcmのswを登録する
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../static/firebase-messaging-sw.js")
        .then(function (registration) {
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (error) {
          console.log("Service worker registration failed, error:", error);
        });
    }
  },
  async mounted() {
    const title = "testTitle";
    const body = "hello fcm";
    await this.$axios.$get("https://weather-scheduler-test.azurewebsites.net/api/getFirebaseEnv").then(async (res) => {
      console.log("projectId", res.data);
      const firebaseConfig = res.data.PROJECT_ID;
      const fcmToken = await getFcmToken();
      console.log("fcmToken", fcmToken);
      console.log("fcmToken.data", fcmToken.data);
      const fcmSendUrl = "https://fcm.googleapis.com//v1/projects/" + firebaseConfig.PROJECT_ID + "/messages:send";
      //this.$axios.$post(fcmSendUrl)
    })
  }
};
</script>
