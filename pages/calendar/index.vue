<template>
  <v-app class="app-wrapper">
    <Header :isLogin="true" />
    <Calendar />
    <Footer />
  </v-app>
</template>

<script>
import Calendar from "~/components/Calendar.vue";
import { hoge } from "~/plugins/firebase";

export default {
  components: { Calendar },
  name: "calendar",
  async asyncData({ $axios }) {
    /*
    await hoge().then((result) => {
      console.log("hoge" + JSON.stringify(result.data.data));
    });
    const forecast = await $axios.$get(
      "http://192.168.3.6:3000/api/getForecast",
      {
        params: {
          lat: 34.68639,
          lon: 135.52,
        },
      }
    );

    const date = new Date();
    const today = await $axios.$get("http://192.168.3.6:3000/api/formatDate", {
      params: {
        date: date,
      },
    });

    return {
      forecast,
      today,
    };
    */
  },
};
</script>
