<template>
  <v-app class="app-wrapper">
    <Header :isLogin="false" />
    <Top />
    <Footer />
  </v-app>
</template>

<script>
import Top from "~/components/Top.vue";

export default {
  components: { Top },
  name: "IndexPage",
};
</script>

<style lang="scss" scoped>
</style>
