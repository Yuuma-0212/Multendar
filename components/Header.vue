<template>
  <header class="header my-2">
    <div class="header__wrapper">
      <h1 class="header__title">Multendar</h1>
      <template v-if="isLogin">
        <button class="header__btn-login" button="button" @click="logout">
          Logout
        </button>
      </template>
      <template v-else>
        <div class="d-flex justify-center flex-column">
          <button class="header__btn-login" button="button" @click="login">
            Login
          </button>
          <br>
          <button class="header__btn-login-guest" button="button" @click="loginGuest">
            ゲストログイン
          </button>
        </div>
      </template>
    </div>
  </header>
</template>
<script>
import { login, loginGuest, logout } from "~/plugins/firebase-auth.js";

// ログイン中にインストールして起動するとトップ画面なのにヘッダーのログインがログアウトになっている
// 致命的なバグでもないので一旦放置
export default {
  name: "Header",
  data: () => ({
    isLogin: false
  }),
  created() {
    this.isLogin = this.$cookies.get("isLogin");
  },
  methods: {
    login() {
      login()
        .then((user) => {
          this.isLogin = true;
          this.$cookies.set("isLogin", true);
          this.$cookies.set("uid", user.uid);
          this.$cookies.set("idToken", user.idToken);
          this.$router.push({ path: "/calendar" });
          this.$toast.success("ログインしました。ようこそ！", {
            position: "top-right",
          });
        })
        .catch((error) => {
          this.$toast.error("ログインに失敗しました: " + error, {
            position: "top-right",
          });
        });
    },
    loginGuest() {
      loginGuest()
        .then(() => {
          this.isLogin = true;
          this.$cookies.set("isLogin", true);
          this.$cookies.set("uid", "guest");
          this.$router.push({ path: "/calendar" });
          this.$toast.success("ログインしました。ようこそ！", {
            position: "top-right",
          });
        })
        .catch((error) => {
          this.$toast.error("ログインに失敗しました: " + error, {
            position: "top-right",
          });
        });
    },
    logout() {
      logout()
        .then(() => {
          this.isLogin = false;
          this.$cookies.removeAll(); // cookie削除
          this.$toast.success("ログアウトしました", {
            position: "top-right",
          });
          this.$router.push("/");
        })
        .catch((error) => {
          this.$toast.error("ログアウトに失敗しました: " + error, {
            position: "top-right",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
@import "@/assets/scss/variables.scss";

.header {
  max-width: $container-max-width;
  margin: 0 30px;
  color: #fff;
  line-height: 1;
  transition: $res-transition;
  transition-timing-function: $res-transition-timing;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 7px 5px 5px;
  }

  &__title {
    width: 150px;
    font-size: 1.6rem;
    font-weight: lighter;
    font-family: "Shrikhand";
  }

  &__btn-login {
    position: relative;
    font-size: 1.2rem;
    font-weight: lighter;
    font-family: "Shrikhand";
  }

  &__btn-login-guest {
    font-size: 0.6rem;
    margin-top: -8px;
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    margin: 0 60px;

    &__title {
      width: auto;
      //margin-top: 20px;

      &--sub {
        font-size: 1em;
      }
    }
  }

  @media (min-width: $container-bp) {
    width: 1100px;
    margin: 0 auto;
  }
}
</style>
