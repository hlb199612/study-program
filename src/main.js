import Vue from 'vue'
import App from './App.vue'
// 菜单和路由设置
import router from './router'

// store
import store from '@/store/index'

import api from '@/api'

import './assets/css/reset.css'
import './assets/css/common.css'

import Dialog from './components/dialog'
import Loading from './components/loading'
import toast from './components/toast'

// 注册全局组件
import '@/components'

import './libs/plugin'
import fastClick from 'fastclick'

fastClick.attach(document.body)

Vue.prototype.$dialog = Dialog
Vue.prototype.$loading = Loading
Vue.prototype.$toast = toast
Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    // 用户登录后从数据库加载一系列的设置
    console.log('页面刷新后再次调用vuex中的load事件')
    this.$store.dispatch('p2admin/account/load')
  },
}).$mount('#app')
