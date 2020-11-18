import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios' // import axios

Vue.prototype.$axios = axios; // prototype에 axios 추가


Vue.config.productionTip = false
Vue.use(vuetify);

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
