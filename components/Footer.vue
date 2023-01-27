<template>
  <v-footer class="footer">
    <p class="footer__text">copylight @abcd_1234</p>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
.footer {
  &__text {
    width: 100%;
    margin: 0;
    padding: 10px 0;
    text-align: center;
    font-size: .8rem;
    font-family: "RocknRollOne";
    color: #fff;
  }
}
</style>
