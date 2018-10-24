import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import wysiwyg from 'vue-wysiwyg'
import 'vue-wysiwyg/dist/vueWysiwyg.css'

Vue.use(wysiwyg, {
  forcePlainTextOnPaste: true,
  maxHeight: '500px'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
