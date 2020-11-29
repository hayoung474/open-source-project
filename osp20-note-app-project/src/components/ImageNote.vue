<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      :src="note.imgsrc"
    >
    </v-img>

    <v-card-subtitle class="pb-0">
      {{note.title}}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>{{note.text}}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    props: {
        note: Object,
    },

}
</script>

<style>

</style>