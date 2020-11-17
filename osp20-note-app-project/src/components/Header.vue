<template>
    <div class="header">
          <img :src="logoURL"/>
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
      logoURL:"",
      latitude:37.5665,
      longitude:126.9780,
      positions: [],
    };
  },
  mounted(){
    this.timeTheme();
    this.trackPosition()
    this.getJSON();
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
    },
    timeTheme(){
      var time = new Date().getHours();
      if(time>6 && time<18){
        this.logoURL = require('../assets/sun-2-256.png');
        console.log("낮");
      }
      else if(time>=18 || time<=6){
        this.logoURL = require('../assets/moon-4-256.png');
        console.log("밤");
      }
      console.log(time);
    },
    trackPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.successPosition, this.failurePosition, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        })
      } else {
        alert(`Browser doesn't support Geolocation`)
      }
    },
    
    successPosition: function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(this.latitude,this.longitude);
    },
    
    failurePosition(err) {
      alert('Error Code: ' + err.code + ' Error Message: ' + err.message)
    },
    
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