import { config } from "dotenv";
config();

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - multendar',
    title: 'multendar',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      //{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/common.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/firebase-auth.js',
    '~/plugins/firebase-firestore.js',
    '~/plugins/router.js',
    '~/plugins/areas.js',
    '~/plugins/gmap-vue.js',
    '~/plugins/fontawesome.js',
    {
      src: '~/plugins/service-worker-register.js',
      mode: 'client'
    },
    {
      src: '~/plugins/firebase-fcm.js',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-toastification.js',
      mode: 'client'
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-fontawesome',
    '@nuxtjs/style-resources',
    'vue-swatches/nuxt',
    'cookie-universal-nuxt',
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    //baseURL: process.env.BROWSER_BASE_URL,
    baseURL: process.env.BASE_URL
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers')
        }
      }
    },
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
        googleapis: 'empty',
        child_process: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    }
  },

  serverMiddleware: ['~/api'],

  pwa: {
    icon: {
      fileName: "icon_pwa.jpg"
    },
    meta: {
      mobileApp: true,
      mobileAppIOS: true,
      appleStatusBarStyle: "black"
    },
    manifest: {
      name: "Multendar",
      lang: "ja",
      short_name: "Multendar",
      title: "Multendar",
      "og:title": "Multendar",
      description: "Multendarは予定場所・１週間の天気・気温がまとめて確認できるスケジュールWebアプリです！",
      "og:description": "Multendarは予定場所・１週間の天気・気温がまとめて確認できるスケジュールWebアプリです！",
      theme_color: "#163956",
      background_color: "#163956",
      icons: [
        {
          src: "~/static/site_icon.jpg",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workbox: {
      dev: true,
      clientsClaim: true,
      skipWaiting: true,
      importScripts: [
        "firebase-messaging-sw.js"
      ]
    }
  }
}
