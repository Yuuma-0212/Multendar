import Vue from 'vue';
import GmapVue from 'gmap-vue';
import axios from "axios";

Vue.use(GmapVue, {
  load: {
    // [REQUIRED] This is the unique required value by Google Maps API
    key: process.env.MAPS_API_KEY,
    // [OPTIONAL] This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    libraries: 'places',

    // [OPTIONAL] If you want to set the version, you can do so:
    v: '3.49',

    // This option was added on v3.0.0 but will be removed in the next major release.
    // If you already have an script tag that loads Google Maps API and you want to use it set you callback
    // here and our callback `GoogleMapsCallback` will execute your custom callback at the end; it must attached
    // to the `window` object, is the only requirement.
    //customCallback: 'MyCustomCallback',
  },

  // [OPTIONAL] If you intend to programmatically custom event listener code
  // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  // you might need to turn this on.
  //autoBindAllEvents: false,

  // [OPTIONAL] If you want to manually install components, e.g.
  // import {GmapMarker} from 'gmap-vue/src/components/marker'
  // Vue.component('GmapMarker', GmapMarker)
  // then set installComponents to 'false'.
  // If you want to automatically install all the components this property must be set to 'true':
  //installComponents: true,

  // Load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
  //dynamicLoad: false,
})

/*
export default async () => {
  await axios.get("https://weather-scheduler-test.azurewebsites.net/api/getGmapKey").then((res) => {
    const mapsApiKey = res.data;

    Vue.use(GmapVue, {
      load: {
        // [REQUIRED] This is the unique required value by Google Maps API
        //key: mapsApiKey,
        key: process.env.MAPS_API_KEY,
        // [OPTIONAL] This is required if you use the Autocomplete plugin
        // OR: libraries: 'places,drawing'
        // OR: libraries: 'places,drawing,visualization'
        // (as you require)
        libraries: 'places',

        // [OPTIONAL] If you want to set the version, you can do so:
        v: '3.49',

        // This option was added on v3.0.0 but will be removed in the next major release.
        // If you already have an script tag that loads Google Maps API and you want to use it set you callback
        // here and our callback `GoogleMapsCallback` will execute your custom callback at the end; it must attached
        // to the `window` object, is the only requirement.
        //customCallback: 'MyCustomCallback',
      },

      // [OPTIONAL] If you intend to programmatically custom event listener code
      // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
      // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
      // you might need to turn this on.
      //autoBindAllEvents: false,

      // [OPTIONAL] If you want to manually install components, e.g.
      // import {GmapMarker} from 'gmap-vue/src/components/marker'
      // Vue.component('GmapMarker', GmapMarker)
      // then set installComponents to 'false'.
      // If you want to automatically install all the components this property must be set to 'true':
      //installComponents: true,

      // Load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
      //dynamicLoad: false,
    })
  })
}
*/