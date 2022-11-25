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

export default {
  name: "DefaultLayout",
  components: { Header, Footer },
  async asyncData({axios}) {
    console.log("asyncData", process.env.FIREBASE_API_KEY);
    //await axios.$get("/getEnv");
  }
};
</script>
