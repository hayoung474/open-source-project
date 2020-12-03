import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios' // import axios
import firebase from 'firebase'


Vue.prototype.$axios = axios; // prototype에 axios 추가


Vue.config.productionTip = false
Vue.use(vuetify);

var firebaseConfig = {
  apiKey: "AIzaSyDRi-toqDyg59-X01TVvRxCHAwGPJuXj9U",
  authDomain: "osp20-5e6fc.firebaseapp.com",
  databaseURL: "https://osp20-5e6fc.firebaseio.com",
  projectId: "osp20-5e6fc",
  storageBucket: "osp20-5e6fc.appspot.com",
  messagingSenderId: "668792858916",
  appId: "1:668792858916:web:90ff2d6b0cacf007c12bb1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
