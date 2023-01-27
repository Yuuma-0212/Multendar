<template>
    <GmapAutocomplete @place_changed="setPlace" :select-first-on-enter="true">
      <template v-slot:default="slotProps">
        <v-text-field
          id="iptLocation"
          class="text-body-2"
          clearable
          :dense="true"
          outlined
          ref="input"
          v-on:listeners="slotProps.listeners"
          v-on:attrs="slotProps.attrs"
        >
        </v-text-field>
      </template>
    </GmapAutocomplete>
</template>

<script>
export default {
  name: "GmapAc",
  methods: {
    setPlace(place) {
      this.$emit("updateEventData", place);
    },
  },
};
</script>
