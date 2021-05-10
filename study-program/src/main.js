import Vue from 'vue'
import App from './App.vue'

// 菜单和路由设置
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
