//import { config } from "dotenv";
//const env = config();
//const { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, PUBLIC_VAPID_KEY } = env;

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - weather_scheduler',
    title: 'weather_scheduler',
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
    //'~/plugins/vuex-persistedstate.js',
    '~/plugins/router.js',
    '~/plugins/areas.js',
    '~/plugins/gmap-vue.js',
    '~/plugins/fontawesome.js',
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
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3000',
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
    }
  },

  /*
  env: {
    API_KEY: process.env.API_KEY | process.env.A_API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN | process.env.A_AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID | process.env.A_PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET | process.env.A_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID | process.env.A_MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID | process.env.A_APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID | process.env.A_MEASUREMENT_ID,
    PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY | process.env.A_PUBLIC_VAPID_KEY,
    MAPS_API_KEY: process.env.MAPS_API_KEY | process.env.A_MAPS_API_KEY
  },
  */

  serverMiddleware: ['~/api'],
}
