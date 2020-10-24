<template>
    <div class="header">
          <img src="../assets/note_logo.png"/>
          <span class="noteTitle" @click="reload()"><p>STICKY NOTE</p></span>
        <div class="search-container" @keyup.enter="search">
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
    },
    reload(){
      window.location.reload();
    }
  }, 

  components: {
  // SearchBar: SearchBar,
  }
};
</script>
<style scoped>
  .noteTitle :hover{
    cursor:pointer;
    font-weight:bold;
  }
  @font-face{
    font-family:"SCDream3";
    src:url("../assets/font/SCDream3.otf");
}
p{
    font-family: "SCDream3";
}
</style>