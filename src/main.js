import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Multiselect from 'vue-multiselect'
import Print from 'vue-print-nb'
import VueTippy from "vue-tippy";
import VueCurrencyInput from 'vue-currency-input'

Vue.use(VueCurrencyInput)

Vue.use(VueTippy);

Vue.config.productionTip = false

Vue.component('multiselect', Multiselect)

Vue.use(Print)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
