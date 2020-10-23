import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { store } from './store'
import { VueMasonryPlugin } from "vue-masonry";


Vue.config.productionTip = false
Vue.use(VueMasonryPlugin);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
