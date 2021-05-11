import Vue from 'vue'

// 注意 有些组件使用异步加载会有影响
Vue.component('img-loading', () => import('./img-loading/index'))
Vue.component('store-poster', () => import('./store-poster/index'))
