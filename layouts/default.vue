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
import firebase from "~/plugins/firebase.js";

export default {
  name: "DefaultLayout",
  components: { Header, Footer },
  mounted() {
    console.log(firebase());
  }
};
</script>
