<template>
  <v-main>
    <nav class="nav">
      <ul class="nav__list">
        <li class="nav__list-item">
          <button
            class="nav__btn"
            :class="{ active: isActiveNum === '1' }"
            @click="changeActiveTab('1')"
          >
            main
          </button>
        </li>
        <li class="nav__list-item">
          <button
            class="nav__btn"
            :class="{ active: isActiveNum === '2' }"
            @click="changeActiveTab('2')"
          >
            About
          </button>
        </li>
        <li class="nav__list-item">
          <button
            class="nav__btn"
            :class="{ active: isActiveNum === '3' }"
            @click="changeActiveTab('3')"
          >
            Contact
          </button>
        </li>
      </ul>
    </nav>
    <div class="u-container">
      <ul class="tabs">
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item" v-show="isActiveNum === '1'">
            <div>
              <h2 class="section__title--two-line">
                Multendar
              </h2>
              <div v-if="cWindowW >= sectionTextToggleW">
                <p class="section__text">
                  Multendarはスケジュール・天気・目的地までのマップをこのWebアプリひとつで確認することが出来ます
                </p>
                <v-btn
                  class="section__btn"
                  color="#333333"
                  rounded
                  type="button"
                  width="180"
                  height="60"
                >
                  使ってみる
                </v-btn>
              </div>
            </div>
            <div class="section__img-outer">
              <img class="section__img" src="/img/schedule.png" />
            </div>
            <div v-if="cWindowW < sectionTextToggleW">
              <p class="section__text">
                Multendarはスケジュール・天気・目的地までのマップをこのWebアプリひとつで確認することが出来ます
              </p>
              <v-btn
                class="section__btn"
                color="#333333"
                rounded
                type="button"
                width="180"
                height="60"
              >
                使ってみる
              </v-btn>
            </div>
          </li>
        </v-scroll-x-transition>
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item" v-show="isActiveNum === '2'">
            <h2 class="section__title">About</h2>
            <div class="section__img-outer">
              <img class="section__img" src="/img/rocket.png" />
            </div>
            <p class="section__text mb-0">
              このWebアプリはプログラミング勉強の一環として作成したので全ての機能が無料でご利用頂けます
            </p>
            <p class="section__text mb-0">
              また、不具合・ご意見・ご要望などあれば問い合わせからご連絡ください
            </p>
            <p class="section__text">
              できる範囲ではありますが対応していきます
            </p>
          </li>
        </v-scroll-x-transition>
        <v-scroll-x-transition :hide-on-leave="true">
          <li class="tabs__item" v-show="isActiveNum === '3'">
            <Contact />
          </li>
        </v-scroll-x-transition>
      </ul>
    </div>
  </v-main>
</template>

<script>
import Contact from "~/components/Contact.vue";

export default {
  components: { Contact },
  name: "top",
  data: () => ({
    sectionTextToggleW: 1200,
    cWindowW: 0,
    valid: false,
    isActiveNum: "1",
  }),
  mounted() {
    if (process.client) {
      this.cWindowW = window.innerWidth;
      window.addEventListener("resize", () => {
        this.cWindowW = window.innerWidth;
      });
    }
  },
  methods: {
    changeActiveTab(num) {
      this.isActiveNum = num;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";

.nav__list-item {
  &:nth-child(1) {
    .nav__btn {
      &::before {
        @include navSubTitle("ホーム");
      }
    }
  }
  &:nth-child(2) {
    .nav__btn {
      &::before {
        @include navSubTitle("サイトについて");
      }
    }
  }
  &:nth-child(3) {
    .nav__btn {
      &::before {
        @include navSubTitle("お問い合わせ");
      }
    }
  }
}
</style>
