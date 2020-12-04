<template>
    <div class="header" v-bind:style="themeColor">
          <!-- <img :src="logoURL"/> -->
          <v-icon :title="temp" x-large style="color:white">{{weatherIcon}}</v-icon>
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
        <button @click="google" class="google-btn">
          <img style="width:35px; height:35px;" src="../assets/google-logo.png"/>
        </button>
    </div>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase'
export default {
  data() {
    return {
      searchText: "",
      logoURL:"",
      latitude:37.5665,
      longitude:126.9780,
      positions: [],
      weatherIcon:"mdi-note-outline",
      weatherInfo:"날씨 정보가 없습니다",
      themeColor:{
        background: 'linear-gradient(90deg, rgba(25,30,105,1) 0%, rgba(188,109,137,1) 100%)'
      },
      weather:"",
      time:"",
      temp:"",
    };
  },
  async mounted(){
    
    await this.trackPosition();
    // await this.getWeather();

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
    getTime(){
      var time = new Date().getHours();
      if(time>6 && time<18){
        return "day"
      }
      else if(time>=18 || time<=6){
        return "night"
      }
    },
    async trackPosition() {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(await this.successPosition, this.failurePosition, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        })
      } else {
        alert(`Browser doesn't support Geolocation`)
      }
    },
    getWeather(){
      var apiKey = "e23cd2868a5a387d7407f52b3e0536ea"
      var url = "https://api.openweathermap.org/data/2.5/weather?lat="+this.latitude+"&lon="+this.longitude+"&appid="+apiKey;

      axios
        .get(url)
        .then((res) => {
          if(res.status ===200){
            console.log(res);
            this.weather = res.data.weather[0].description;
            this.time=this.getTime();
            this.temp = (res.data.main.temp - 273.15).toFixed(1)+"°C";
            this.themeSet();
          }
        })
        .catch((err) => {
          console.log("errrrr",err);
        });
    },
    successPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.getWeather();

    },
    
    failurePosition(err) {
      // alert('Error Code: ' + err.code + ' Error Message: ' + err.message)
      console.log(err)
      return;
    },
    themeSet(){
      if(this.time =="day"){
        if(this.weather==="clear sky"){
          this.weatherIcon = "mdi-weather-sunny"
          this.themeColor.background = 'linear-gradient(90deg, rgba(250,217,119,1) 0%, rgba(129,210,241,1) 91%)';
        }
        if(this.weather==="few clouds"){
          this.weatherIcon="mdi-weather-partly-cloudy";
          this.themeColor.background = 'linear-gradient(90deg, rgba(237,237,237,1) 0%, rgba(149,161,166,1) 92%)';
        }
        if(this.weather==="rain" || this.weather==="light rain"){
          this.weatherIcon="mdi-weather-rainy"
          this.themeColor.background = 'linear-gradient(90deg, rgba(228,228,228,1) 0%, rgba(101,122,130,1) 92%)';
        }
      }
      if(this.weather==="fog"){
        this.weatherIcon = "mdi-weather-fog"
        this.themeColor.background = 'linear-gradient(90deg, rgba(231,231,231,1) 31%, rgba(168,168,168,1) 100%)';

      }
      if(this.weather==="snow"){
        this.weatherIcon="mdi-weather-snowy-heavy"
        this.themeColor.background = 'linear-gradient(90deg, rgba(222,223,228,1) 0%, rgba(173,203,227,1) 100%)';
      }
      if(this.weather==="scattered clouds" || this.weather ==="broken clouds" || this.weather==="overcast clouds"){
        this.weatherIcon="mdi-weather-cloudy";
        this.themeColor.background = 'linear-gradient(90deg, rgba(237,237,237,1) 0%, rgba(149,161,166,1) 92%)';
      }
      if(this.weather==="shower rain"){
        this.weatherIcon="mdi-weather-pouring"
        this.themeColor.background = 'linear-gradient(90deg, rgba(228,228,228,1) 0%, rgba(101,122,130,1) 92%)';
      }

      if(this.time == "night"){
        this.themeColor.background = 'linear-gradient(90deg, rgba(0,6,83,1) 0%, rgba(5,23,36,1) 100%)';
        if(this.weather==="clear sky"){
          this.weatherIcon = "mdi-weather-night"
        }
        if(this.weather==="few clouds"){
          this.weatherIcon="mdi-weather-night-partly-cloudy";
        }
        if(this.weather==="rain" || this.weather==="light rain"){
          this.weatherIcon="mdi-weather-rainy"
        }
      }
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