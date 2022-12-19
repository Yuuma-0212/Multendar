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
import { getFcmToken } from "~/plugins/firebase-firestore.js";

export default {
  name: "DefaultLayout",
  components: { Header, Footer }
};
</script>
