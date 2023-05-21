<template>
  <div class="u-container d-flex justify-center flex-column">
    <div class="error-page__text-container">
      <h1 class="error-page__title" v-if="error.statusCode === 404">
        <div class="error-page__img-error-outer">
          <img class="error-page__img-error" src="/img/page_not_found.png" alt="404">
        </div>
        {{ pageNotFound }}
      </h1>
      <h1 class="error-page__title" v-else>
        <div class="error-page__img-error-outer">
          <img class="error-page__img-error" src="/img/error.png">
        </div>
        {{ otherError }}
      </h1>

      <NuxtLink class="error-page__home-text d-flex justify-center mt-1" to="/">
        <v-icon class="error-page__home-icon">mdi-home</v-icon> Back
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
@import "~/assets/scss/variables.scss";

.error-page {
  &__title {
    font-family: "RocknRollOne";
    font-size: 30px;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      font-size: 45px;
    }
  }
  
  &__text-container {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 170px;
    color: $text-color-primary;
  }

  &__img-error-outer {
    max-width: 380px;
    min-width: 200px;
    width: 20vw;
    height: auto;
    margin: 0 auto;
  }

  &__img-error {
    width: 100%;
  }

  &__home-text {
    font-family: "RocknRollOne";
    font-size: 18px;
    color: $text-color-primary !important;
  }

  &__home-icon {
    color: $text-color-primary !important;
  }
}
</style>
