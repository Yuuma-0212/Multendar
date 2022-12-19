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
import { sendNotification } from "~/plugins/firebase-fcm.js";

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
  mounted() {
    const title = "testTitle";
    const body = "hello fcm";
    sendNotification(title, body);
  }
};
</script>
