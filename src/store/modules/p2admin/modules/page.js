import { cloneDeep, uniq, get } from 'lodash'

// 判定是否需要缓存
const isKeepAlive = data => get(data, 'meta.cache', false)

export default {
  namespaced: true,
  state: {
    // 需要缓存的页面 name
    keepAlive: []
  },
  mutations: {
    /**
     * @description 增加一个页面的缓存设置
     * @param {Object} state state
     * @param {String} name name
     */
    keepAlivePush (state, name) {
      const keep = cloneDeep(state.keepAlive)
      keep.push(name)
      state.keepAlive = uniq(keep)
    },
  }
}
