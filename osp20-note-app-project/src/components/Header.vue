<template>
  <div class="header">
    <img src="../assets/note_logo.png" />
    <p>STICKY NOTE</p>
    <search-bar />
  </div>
</template>

<script>
import SearchBar from "./SearchBar.vue";
export default {
  methods: {
    openEditor: function () {
      this.$emit("openEditor");
    },
  },
  components: {
    SearchBar: SearchBar,
  },
};
</script>
