import Vue from 'vue'
import Vuex from 'vuex'

import p2admin from './modules/p2admin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    p2admin
  }
})
