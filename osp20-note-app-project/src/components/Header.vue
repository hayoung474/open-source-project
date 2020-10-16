<template>
    <div class="header">
          <img src="../assets/note_logo.png"/>
          <p >STICKY NOTE</p>
        <div class="search-container">
            <input
                type="text"
                v-model="searchText"
                name="search"
                placeholder="Search..."
                class="search-input"/>
            <a class="search-btn" @click="search">
                <i class="fas fa-search"></i>
            </a>
        </div>
    </div>
</template>

<script>
// import SearchBar from "./SearchBar.vue";
export default {
  data() {
    return {
      searchText: "",
    };
  },
  methods: {
    search(){
      this.$emit('search',this.searchText);
      this.searchText="";
    },
    reset(){
      this.$emit('reset');
    }
  }, 

  components: {
  // SearchBar: SearchBar,
  }
};
</script>