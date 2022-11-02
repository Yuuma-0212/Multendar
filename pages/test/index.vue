<template>
  <div>
    <GmapMap
      :center="{ lat: lat, lng: lng }"
      :zoom="16"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        @click="center = m.position"
      />
    </GmapMap>
    <GmapAutocomplete
      @place_changed="setPlace"
      :select-first-on-enter="true"
    >
      <template v-slot:default="slotProps">
        <v-text-field
          class="text-body-2"
          :dense="true"
          outlined
          ref="input"
          v-on:listeners="slotProps.listeners"
          v-on:attrs="slotProps.attrs"
        >
        </v-text-field>
      </template>
    </GmapAutocomplete>
    <v-btn @click="foo">hello world</v-btn>
  </div>
</template>

<script>
export default {
  name: "Gmap",
  data: () => ({
    lat: null,
    lng: null,
    markers: [
      {
        position: {
          lat: 34.68639,
          lng: 135.52,
        },
      },
    ],
    place: null,
  }),
  methods: {
    setPlace(place) {
      this.place = place;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      this.markers.push({
        position: {
          lat: this.lat,
          lng: this.lng,
        },
      });
      this.markers.shift();
    },
    foo() {
      console.log(this.place);
    },
  },
};
</script>

<style lang="scss" scoped>
.foo {
  width: 300px;
}
</style>
