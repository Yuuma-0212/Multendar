<template>
  <GmapMap
    class="gmap mb-3 mb-md-0"
    :center="{ lat: lat, lng: lng }"
    :zoom="16"
    map-type-id="terrain"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      @click="center = m.position"
    />
  </GmapMap>
</template>

<script>
export default {
  name: "Gmap",
  props: ["markers", "width", "height"],
  data: () => ({
    lat: 0,
    lng: 0,
  }),
  created() {
    if (this.markers.length <= 0) return;
    const markers = JSON.parse(JSON.stringify(this.markers));
    this.lat = markers[0].position.lat;
    this.lng = markers[0].position.lng;
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";

.gmap {
  width: 100%;
  height: 400px;

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    height: 80vh;
  }
}
</style>
